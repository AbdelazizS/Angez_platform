<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Service;
use App\Models\Order;
use App\Models\Review;
use App\Models\Portfolio;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FreelancerPublicProfileController extends Controller
{
    public function show($id)
    {
        $freelancer = User::with('freelancerProfile')->where('id', $id)->whereHas('freelancerProfile')->firstOrFail();

        // Get services with additional data
        $services = Service::where('user_id', $freelancer->id)
            ->withCount(['orders as total_orders'])
            ->get();

        // Get reviews with client information (handle if Review model doesn't exist)
        $reviews = [];
        if (class_exists(Review::class)) {
            $reviews = Review::with('client')
                ->where('freelancer_id', $freelancer->id)
                ->latest()
                ->take(10)
                ->get();
        }

        // Get portfolio items (handle if Portfolio model doesn't exist)
        $portfolio = [];
        if (class_exists(Portfolio::class)) {
            $portfolio = Portfolio::where('user_id', $freelancer->id)
                ->latest()
                ->take(6)
                ->get();
        }

        // Calculate earnings and statistics
        $earnings = $this->calculateEarnings($freelancer->id);
        $stats = $this->calculateStats($freelancer->id);

        // Get recent orders for portfolio
        $recentOrders = Order::where('freelancer_id', $freelancer->id)
            ->with(['client', 'service'])
            ->where('status', 'completed')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Freelancers/Show', [
            'freelancer' => [
                'id' => $freelancer->id,
                'name' => $freelancer->name,
                'email' => $freelancer->email,
                'title' => $freelancer->freelancerProfile->title ?? '',
                'avatar' => $freelancer->avatar,
                'location' => $freelancer->freelancerProfile->location ?? '',
                'rating' => $freelancer->freelancerProfile->average_rating ?? 0,
                'totalReviews' => $freelancer->freelancerProfile->total_reviews ?? 0,
                'completedOrders' => $stats['completedOrders'], // Use real-time calculation
                'responseTime' => $freelancer->freelancerProfile->response_time ?? '',
                'memberSince' => $freelancer->created_at->format('Y'),
                'verificationStatus' => $freelancer->freelancerProfile->is_verified ? 'verified' : 'unverified',
                'bio' => $freelancer->freelancerProfile->bio ?? '',
                'skills' => $freelancer->freelancerProfile->skills ?? [],
                'languages' => $freelancer->freelancerProfile->languages ?? [],
                'education' => $freelancer->freelancerProfile->education ?? '',
                'website' => $freelancer->freelancerProfile->website ?? '',
                'hourlyRate' => $freelancer->freelancerProfile->hourly_rate ?? 0,
                'availabilityStatus' => $freelancer->freelancerProfile->availability_status ?? 'available',
                'successRate' => $stats['successRate'],
                'onTimeDelivery' => $stats['onTimeDelivery'],
                'repeatClients' => $stats['repeatClients'],
            ],
            'services' => $services,
            'reviews' => $reviews,
            'portfolio' => $portfolio,
            'earnings' => $earnings,
            'recentOrders' => $recentOrders,
            'stats' => $stats,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    private function calculateEarnings($freelancerId)
    {
        $currentMonth = now()->format('Y-m');
        $lastMonth = now()->subMonth()->format('Y-m');

        $earnings = [
            'total' => Order::where('freelancer_id', $freelancerId)
                ->where('status', 'completed')
                ->sum('total_amount'),
            'thisMonth' => Order::where('freelancer_id', $freelancerId)
                ->where('status', 'completed')
                ->whereYear('completed_at', now()->year)
                ->whereMonth('completed_at', now()->month)
                ->sum('total_amount'),
            'lastMonth' => Order::where('freelancer_id', $freelancerId)
                ->where('status', 'completed')
                ->whereYear('completed_at', now()->subMonth()->year)
                ->whereMonth('completed_at', now()->subMonth()->month)
                ->sum('total_amount'),
        ];

        return $earnings;
    }

    private function calculateStats($freelancerId)
    {
        $totalOrders = Order::where('freelancer_id', $freelancerId)->count();
        $completedOrders = Order::where('freelancer_id', $freelancerId)
            ->where('status', 'completed')
            ->count();
        
        // Check if delivered_on_time column exists
        $onTimeOrders = 0;
        try {
            $onTimeOrders = Order::where('freelancer_id', $freelancerId)
                ->where('status', 'completed')
                ->where('delivered_on_time', true)
                ->count();
        } catch (\Exception $e) {
            // If column doesn't exist, assume all completed orders were on time
            $onTimeOrders = $completedOrders;
        }

        $uniqueClients = Order::where('freelancer_id', $freelancerId)
            ->distinct('client_id')
            ->count('client_id');

        $repeatClients = Order::where('freelancer_id', $freelancerId)
            ->select('client_id')
            ->groupBy('client_id')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        return [
            'successRate' => $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100) : 0,
            'onTimeDelivery' => $completedOrders > 0 ? round(($onTimeOrders / $completedOrders) * 100) : 0,
            'repeatClients' => $uniqueClients > 0 ? round(($repeatClients / $uniqueClients) * 100) : 0,
            'totalOrders' => $totalOrders,
            'completedOrders' => $completedOrders,
            'uniqueClients' => $uniqueClients,
        ];
    }
} 