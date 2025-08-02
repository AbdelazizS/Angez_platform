<?php

namespace App\Http\Controllers;

use App\Mail\OrderStatusUpdatedMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class FreelancerOrderController extends Controller
{
    // List all orders for the logged-in freelancer, with filters
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Order::with(['service', 'client'])
            ->where('freelancer_id', $user->id);

        // Optional filters
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }
        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $orders = $query->latest()->paginate(15);

        // Calculate stats for completed orders only
        $allOrders = Order::where('freelancer_id', $user->id)->get();
        $completedOrders = $allOrders->where('status', 'completed');
        
        $stats = [
            'totalOrders' => $allOrders->count(),
            'completedOrders' => $completedOrders->count(),
            'inProgressOrders' => $allOrders->where('status', 'in_progress')->count(),
            'reviewOrders' => $allOrders->where('status', 'review')->count(),
            'pendingOrders' => $allOrders->where('status', 'pending')->count(),
            'totalEarnings' => $completedOrders->sum('total_amount'),
            'thisMonthEarnings' => $completedOrders->where('created_at', '>=', Carbon::now()->startOfMonth())->sum('total_amount'),
            'lastMonthEarnings' => $completedOrders->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
                ->where('created_at', '<', Carbon::now()->startOfMonth())->sum('total_amount'),
        ];

        // Calculate earnings growth
        if ($stats['lastMonthEarnings'] > 0) {
            $stats['earningsGrowth'] = round((($stats['thisMonthEarnings'] - $stats['lastMonthEarnings']) / $stats['lastMonthEarnings']) * 100, 1);
        } elseif ($stats['thisMonthEarnings'] > 0) {
            $stats['earningsGrowth'] = 100; // New earnings this month
        } else {
            $stats['earningsGrowth'] = 0;
        }

        return Inertia::render('Freelancers/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'from_date', 'to_date']),
            'stats' => $stats,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    // Show details for a specific order
    public function show($orderId)
    {
        $user = Auth::user();
        $order = Order::with(['service', 'client'])
            ->where('freelancer_id', $user->id)
            ->findOrFail($orderId);

        return Inertia::render('Freelancers/Orders/Show', [
            'order' => $order,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    // Allow freelancer to deliver work (in_progress -> review)
    public function deliverWork(Request $request, $orderId)
    {
        $user = Auth::user();
        $order = Order::where('freelancer_id', $user->id)->findOrFail($orderId);
        
        if ($order->status !== 'in_progress') {
            $locale = app()->getLocale();
            $errorMessage = $locale === 'ar' 
                ? 'يمكنك تسليم العمل فقط عندما يكون الطلب قيد التنفيذ.' 
                : 'You can only deliver work when the order is in progress.';
                
            return back()->withErrors(['status' => $errorMessage]);
        }
        
        $order->status = 'review';

        Mail::to($order->client->email)
        ->queue(new OrderStatusUpdatedMail($order, 'client'));
        
        $order->save();
        
        $locale = app()->getLocale();
        $successMessage = $locale === 'ar' 
            ? 'تم تسليم العمل بنجاح.' 
            : 'Work delivered successfully.';
            
        return back()->with('success', $successMessage);
    }

    // Allow freelancer to update status with allowed transitions only
    public function updateStatus(Request $request, $orderId)
    {
        $user = Auth::user();
        $order = Order::where('freelancer_id', $user->id)->findOrFail($orderId);
        
        $request->validate([
            'status' => 'required|in:in_progress,review',
        ]);
        
        $current = $order->status;
        $target = $request->status;
        $allowed = false;

        // Notify client
        Mail::to($order->client->email)
        ->queue(new OrderStatusUpdatedMail($order, 'client'));
        
        // Allow payment_verified -> in_progress, in_progress -> review, review -> in_progress
        if ($current === 'payment_verified' && $target === 'in_progress') {
            $allowed = true;
        } elseif ($current === 'in_progress' && $target === 'review') {
            $allowed = true;
        } elseif ($current === 'review' && $target === 'in_progress') {
            $allowed = true;
        }
        
        if (!$allowed) {
            $locale = app()->getLocale();
            $errorMessage = $locale === 'ar' 
                ? 'انتقال حالة غير صالح.' 
                : 'Invalid status transition.';
                
            return back()->withErrors(['status' => $errorMessage]);
        }
        
        $order->status = $target;
        $order->save();
        
        $locale = app()->getLocale();
        $successMessage = $locale === 'ar' 
            ? 'تم تحديث حالة الطلب بنجاح.' 
            : 'Order status updated successfully.';
            
        return back()->with('success', $successMessage);
    }
} 