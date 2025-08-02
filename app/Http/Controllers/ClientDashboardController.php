<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Message;
use App\Models\User;

class ClientDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Stats
        $activeOrders = \App\Models\Order::where('client_id', $user->id)
            ->whereIn('status', ['pending', 'payment_verified', 'in_progress', 'review'])
            ->count();
        $completedOrders = \App\Models\Order::where('client_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $totalSpent = \App\Models\Order::where('client_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_amount');

        // Order status distribution
        $statusList = ['pending', 'payment_verified', 'in_progress', 'review', 'completed', 'cancelled'];
        $orderStatusDistribution = [];
        $totalOrders = 0;
        foreach ($statusList as $status) {
            $count = \App\Models\Order::where('client_id', $user->id)->where('status', $status)->count();
            $orderStatusDistribution[$status] = $count;
            $totalOrders += $count;
        }

        // Recent activity (last 5 orders, payments, or messages)
        $recentOrders = \App\Models\Order::with(['service', 'freelancer'])
            ->where('client_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();
        $recentActivity = $recentOrders->map(function($order) {
            return [
                'type' => 'order',
                'title' => 'Order #' . $order->order_number . ' - ' . ($order->service->title ?? ''),
                'description' => 'Status: ' . ucfirst(str_replace('_', ' ', $order->status)),
                'date' => $order->created_at->toDateString(),
            ];
        });

        $stats = [
            'activeOrders' => $activeOrders,
            'completedOrders' => $completedOrders,
            'totalSpent' => $totalSpent,
            'orderStatusDistribution' => $orderStatusDistribution,
            'totalOrders' => $totalOrders,
            'recentActivity' => $recentActivity,
        ];

        // Recent Orders for dashboard table
        $recentOrdersTable = $recentOrders->map(function ($order) {
            return [
                'id' => $order->id,
                'service' => $order->service ? $order->service->title : 'N/A',
                'freelancer' => $order->freelancer ? $order->freelancer->name : 'N/A',
                'freelancer_id' => $order->freelancer ? $order->freelancer->id : null,
                'amount' => $order->total_amount,
                'status' => $order->status,
                'date' => $order->created_at ? $order->created_at->toDateString() : '',
            ];
        });

        // Instead of hardcoded quickActions, pass action keys for localization in the frontend
        $quickActions = [
            [ 'key' => 'find_services', 'href' => '/services' ],
            [ 'key' => 'my_orders', 'href' => '/client/orders' ],
            [ 'key' => 'messages', 'href' => '/chat' ],
        ];
        return Inertia::render('Clients/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentOrders' => $recentOrdersTable,
            'quickActions' => $quickActions,
        ]);
    }

    public function orders(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\Order::with(['service', 'freelancer', 'reviews.client'])
            ->where('client_id', $user->id);

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }
        if ($request->search) {
            $query->whereHas('service', function($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%');
            });
        }
        $orders = $query->orderByDesc('created_at')->get()->map(function($order) use ($user) {
            $review = $order->reviews->where('client_id', $user->id)->first();
            $can_review = $user->can('create', [\App\Models\Review::class, $order]);
            $waiting_review = !$review && $order->status === 'review' && $order->payment_status === 'verified';
            $can_chat = !in_array($order->status, ['completed', 'cancelled']) && $order->payment_status !== 'failed';
            $orderArr = $order->toArray();
            $orderArr['review'] = $review;
            $orderArr['can_review'] = $can_review;
            $orderArr['waiting_review'] = $waiting_review;
            $orderArr['can_chat'] = $can_chat;
            return $orderArr;
        });
        return Inertia::render('Clients/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'search']),
            'auth' => [ 'user' => $user ]
        ]);
    }

    public function showOrder(Request $request, $orderId)
    {
        $user = $request->user();
        $order = \App\Models\Order::with([
            'service',
            'freelancer',
            'reviews.client' // Eager load client for each review
        ])->where('client_id', $user->id)
          ->findOrFail($orderId);

        $review = $order->reviews->where('client_id', $user->id)->first();
        $can_review = $user->can('create', [\App\Models\Review::class, $order]);
        $waiting_review = !$review && $order->status === 'review' && $order->payment_status === 'verified';
        $can_chat = !in_array($order->status, ['completed', 'cancelled']) && $order->payment_status !== 'failed';
        $orderArr = $order->toArray();
        $orderArr['review'] = $review;
        $orderArr['can_review'] = $can_review;
        $orderArr['waiting_review'] = $waiting_review;
        $orderArr['can_chat'] = $can_chat;
        return Inertia::render('Clients/Orders/Show', [
            'order' => $orderArr,
            'auth' => [ 'user' => $user ]
        ]);
    }

    public function uploadPaymentProof(Request $request, $orderId)
    {
        $user = $request->user();
        $order = \App\Models\Order::where('client_id', $user->id)
            ->where('id', $orderId)
            ->where('status', 'pending')
            ->firstOrFail();

        $request->validate([
            'transaction_ref' => 'required|string|max:100',
            'payment_screenshot' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $screenshotPath = $request->file('payment_screenshot')->store('payment-proofs', 'public');

        $order->update([
            'transaction_ref' => $request->transaction_ref,
            'payment_screenshot' => $screenshotPath,
        ]);

        return redirect()->route('client.orders.show', $order->id)
            ->with('success', 'Payment proof uploaded successfully. We will verify it within 24 hours.');
    }
} 