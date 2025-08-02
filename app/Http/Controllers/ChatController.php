<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewOrderMessageMail;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = null;
        if ($user->hasRole('client')) {
            $role = 'client';
        } elseif ($user->hasRole('freelancer')) {
            $role = 'freelancer';
        } elseif ($user->hasRole('admin')) {
            $role = 'admin';
        }
        if ($role === 'client') {
            $chats = $this->getClientChats($user);
        } elseif ($role === 'freelancer') {
            $chats = $this->getFreelancerChats($user);
        } else {
            $chats = collect();
        }
        return Inertia::render('Chat/List', [
            'chats' => $chats,
            'auth' => [
                'user' => $user ? array_merge(
                    $user->only(['id', 'name', 'email', 'avatar', 'phone', 'is_active', 'profile_completed', 'created_at', 'updated_at']),
                    ['role' => $role]
                ) : null,
            ],
        ]);
    }

    protected function getClientChats($user)
    {
        $orders = Order::with(['freelancer', 'client', 'messages' => fn($q) => $q->latest()])
            ->where('client_id', $user->id)
            ->latest('updated_at')
            ->get();
        return $orders->map(fn($order) => $this->formatChatData(collect([$order]), 'freelancer', $user, 'client'));
    }

    protected function getFreelancerChats($user)
    {
        $orders = Order::with(['client', 'freelancer', 'messages' => fn($q) => $q->latest()])
            ->where('freelancer_id', $user->id)
        ->latest('updated_at')
        ->get();
        return $orders->map(fn($order) => $this->formatChatData(collect([$order]), 'client', $user, 'freelancer'));
    }

    protected function formatChatData($orders, $counterpartType, $currentUser, $selfType)
    {
        $order = $orders->sortByDesc('updated_at')->first();
            $lastMessage = $order->messages->first();
            return [
            'order_id' => $order->id,
                'order_status' => $order->status ?? 'pending',
                'order_number' => $order->order_number,
                'client' => [
                    'id' => $order->client->id,
                    'name' => $order->client->name,
                    'avatar' => $order->client->avatar,
                'role' => 'client',
                ],
                'freelancer' => [
                    'id' => $order->freelancer->id,
                    'name' => $order->freelancer->name,
                    'avatar' => $order->freelancer->avatar,
                'role' => 'freelancer',
                ],
                'last_message' => $lastMessage ? [
                    'content' => $lastMessage->content,
                    'file_type' => $lastMessage->file_type,
                    'created_at' => $lastMessage->created_at,
                ] : null,
            'unread_count' => $order->messages
                ->where('sender_id', '!=', $currentUser->id)
                ->whereNull('read_at')
                ->count(),
        ];
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        $user = auth()->user();
        $role = null;
        if ($user && $user->hasRole('client')) {
            $role = 'client';
        } elseif ($user && $user->hasRole('freelancer')) {
            $role = 'freelancer';
        } elseif ($user && $user->hasRole('admin')) {
            $role = 'admin';
        }
        // Eager load client on reviews
        $order->load('client', 'freelancer', 'reviews.client');
        $review = $order->reviews->where('client_id', $order->client_id)->first();
        $can_review = $user && $user->can('create', [\App\Models\Review::class, $order]);
        $waiting_review = $user && $user->hasRole('freelancer') && !$review && $order->status === 'review' && $order->payment_status === 'verified';
        $can_chat = !in_array($order->status, ['completed', 'cancelled']) && $order->payment_status !== 'failed';
        $orderArr = $order->toArray();
        $orderArr['review'] = $review;
        $orderArr['can_review'] = $can_review;
        $orderArr['waiting_review'] = $waiting_review;
        $orderArr['can_chat'] = $can_chat;
        return Inertia::render('Chat/Index', [
            'order' => $orderArr,
            'messages' => $order->messages()->with('sender')->orderBy('created_at')->get(),
            'auth' => [
                'user' => $user ? array_merge(
                    $user->only(['id', 'name', 'email', 'avatar', 'phone', 'is_active', 'profile_completed', 'created_at', 'updated_at']),
                    ['role' => $role]
                ) : null,
            ],
        ]);
    }

    public function send(Request $request, Order $order)
    {
        $this->authorize('view', $order);
        
        $data = $request->validate([
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:5120',
            'file_type' => 'nullable|string|in:image,doc,final_delivery',
            'view_once' => 'boolean',
        ]);

        if (($data['file_type'] ?? null) === 'final_delivery') {
            $this->validateFinalDelivery($order);
            $data['file_path'] = $request->file('file')->store('final_deliveries', 'public');
        } elseif ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('chat_files', 'public');
        }

        $message = $order->messages()->create([
            'sender_id' => auth()->id(),
            'content' => $data['content'] ?? null,
            'file_path' => $data['file_path'] ?? null,
            'file_type' => $data['file_type'] ?? null,
            'view_once' => $data['view_once'] ?? false,
        ]);

        // Determine recipient
        $recipient = auth()->id() === $order->client_id ? $order->freelancer : $order->client;
        // Send notification
        Mail::to($recipient->email)->queue(new NewOrderMessageMail($order, $message, auth()->user()));

        return redirect()->route('chat.show', $order);
    }

    protected function validateFinalDelivery($order)
    {
        if (auth()->id() !== $order->freelancer_id || 
            $order->messages()->where('file_type', 'final_delivery')->exists()) {
            abort(403);
        }
    }

    public function markRead(Order $order)
    {
        $this->authorize('view', $order);
        
        $order->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', auth()->id())
            ->update(['read_at' => now()]);

        return redirect()->route('chat.show', $order);
    }
} 