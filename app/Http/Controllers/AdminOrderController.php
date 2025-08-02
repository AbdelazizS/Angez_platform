<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    // List all orders for admin
    public function index(Request $request)
    {
        $orders = Order::with(['service', 'client', 'freelancer'])
            ->orderByDesc('created_at')
            ->paginate(20);

        // Stats for cards
        $allOrders = Order::all();
        $stats = [
            'total_orders' => $allOrders->count(),
            'completed_orders' => $allOrders->where('status', 'completed')->count(),
            'pending_orders' => $allOrders->where('status', 'pending')->count(),
            'in_progress_orders' => $allOrders->where('status', 'in_progress')->count(),
            'cancelled_orders' => $allOrders->where('status', 'cancelled')->count(),
            'total_revenue' => $allOrders->where('status', 'completed')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }
} 