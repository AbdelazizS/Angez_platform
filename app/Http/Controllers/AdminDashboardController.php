<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use App\Models\FreelancerProfile;
use App\Models\ClientProfile;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Core Stats
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $totalOrders = Order::count();
        $totalUsers = User::count();
        $totalServices = Service::count();
        $totalFreelancers = FreelancerProfile::count();
        $totalClients = ClientProfile::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $totalWalletBalance = Wallet::sum('balance');

        // Monthly stats for charts
        $monthlyRevenue = Order::where('status', 'completed')
            ->whereYear('created_at', Carbon::now()->year)
            ->selectRaw('MONTH(created_at) as month, SUM(total_amount) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function($item) {
                return [Carbon::create()->month($item->month)->format('M') => $item->revenue];
            });

        $monthlyOrders = Order::whereYear('created_at', Carbon::now()->year)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as orders')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function($item) {
                return [Carbon::create()->month($item->month)->format('M') => $item->orders];
            });

        // Recent data
        $recentOrders = Order::with(['service', 'client', 'freelancer'])
            ->latest('created_at')
            ->take(5)
            ->get();

        $recentServices = Service::with('user')
            ->latest('created_at')
            ->take(5)
            ->get();

        $recentUsers = User::with(['freelancerProfile', 'clientProfile'])
            ->latest('created_at')
            ->take(5)
            ->get();

        // Top performing freelancers with real review data
        $topFreelancers = FreelancerProfile::with(['user', 'reviews'])
            ->get()
            ->map(function($freelancer) {
                return [
                    'id' => $freelancer->id,
                    'user_id' => $freelancer->user_id,
                    'user' => $freelancer->user,
                    'title' => $freelancer->title,
                    'average_rating' => $freelancer->average_rating, // Uses the accessor
                    'total_reviews' => $freelancer->total_reviews, // Uses the accessor
                    'bio' => $freelancer->bio,
                    'location' => $freelancer->location,
                    'hourly_rate' => $freelancer->hourly_rate,
                ];
            })
            ->filter(function($freelancer) {
                // Only include freelancers with reviews
                return $freelancer['total_reviews'] > 0;
            })
            ->sortByDesc('average_rating')
            ->take(5)
            ->values();

        // Recent wallet transactions
        $recentTransactions = WalletTransaction::with('wallet.user')
            ->latest('created_at')
            ->take(5)
            ->get();

        // Platform stats
        $platformStats = [
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'totalUsers' => $totalUsers,
            'totalServices' => $totalServices,
            'totalFreelancers' => $totalFreelancers,
            'totalClients' => $totalClients,
            'pendingOrders' => $pendingOrders,
            'completedOrders' => $completedOrders,
            'totalWalletBalance' => $totalWalletBalance,
            'averageOrderValue' => $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0,
            'completionRate' => $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 0,
        ];

        // Chart data
        $chartData = [
            'monthlyRevenue' => $monthlyRevenue,
            'monthlyOrders' => $monthlyOrders,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $platformStats,
            'chartData' => $chartData,
            'recentOrders' => $recentOrders,
            'recentServices' => $recentServices,
            'recentUsers' => $recentUsers,
            'topFreelancers' => $topFreelancers,
            'recentTransactions' => $recentTransactions,
        ]);
    }
} 