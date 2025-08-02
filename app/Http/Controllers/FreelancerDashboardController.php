<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Service;
use App\Models\FreelancerProfile;
use App\Models\Message;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class FreelancerDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $freelancer = $user->freelancerProfile;
        
        // Get services
        $services = Service::where('user_id', $user->id)->get();
        
        // Get recent orders with relationships
        $recentOrders = Order::with(['service', 'client:id,name,email'])
            ->whereHas('service', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest('created_at')
            ->take(10)
            ->get();

        // Calculate real stats
        $allOrders = Order::with(['service', 'client', 'reviews'])
            ->whereHas('service', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->get();

        $totalEarnings = $allOrders->where('status', 'completed')->sum('total_amount');
        $thisMonthEarnings = $allOrders->where('status', 'completed')
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->sum('total_amount');
        $lastMonthEarnings = $allOrders->where('status', 'completed')
            ->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->where('created_at', '<', Carbon::now()->startOfMonth())
            ->sum('total_amount');

        // Calculate earnings growth
        if ($lastMonthEarnings > 0) {
            $earningsGrowth = round((($thisMonthEarnings - $lastMonthEarnings) / $lastMonthEarnings) * 100, 1);
        } elseif ($thisMonthEarnings > 0) {
            $earningsGrowth = 100; // If no last month data but current month has earnings, show 100% growth
        } else {
            $earningsGrowth = 0; // No earnings in either month
        }

        // Calculate average rating from reviews
        $reviews = Review::whereHas('order', function($q) use ($user) {
            $q->whereHas('service', function($sq) use ($user) {
                $sq->where('user_id', $user->id);
            });
        })->get();

        $averageRating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;
        $totalReviews = $reviews->count();

        // Calculate unique clients
        $uniqueClients = $allOrders->pluck('client_id')->unique()->count();
        
        // Calculate clients growth (compare current month vs last month)
        $thisMonthClients = $allOrders->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->pluck('client_id')->unique()->count();
        $lastMonthClients = $allOrders->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->where('created_at', '<', Carbon::now()->startOfMonth())
            ->pluck('client_id')->unique()->count();
            
        if ($lastMonthClients > 0) {
            $clientsGrowth = round((($thisMonthClients - $lastMonthClients) / $lastMonthClients) * 100, 1);
        } elseif ($thisMonthClients > 0) {
            $clientsGrowth = 100; // New clients this month
        } else {
            $clientsGrowth = 0; // No new clients
        }

        $stats = [
            'userName' => $user->name,
            'totalEarnings' => $totalEarnings,
            'earningsGrowth' => $earningsGrowth,
            'activeOrders' => $allOrders->where('status', 'in_progress')->count(),
            'pendingOrders' => $allOrders->where('status', 'in_progress')->count(),
            'totalClients' => $uniqueClients,
            'clientsGrowth' => $clientsGrowth, // Placeholder, could calculate from historical data
            'averageRating' => $averageRating,
            'totalReviews' => $totalReviews,
            // 'responseTime' => '2h', // Placeholder
            // 'successRate' => '98%', // Placeholder
            // 'onTimeDelivery' => '95%', // Placeholder
            // 'repeatClients' => '30%', // Placeholder
        ];

        // Generate recent activities from real data
        $recentActivities = $this->generateRecentActivities($user, $allOrders, $reviews);

        // Generate upcoming deadlines from active orders
        $upcomingDeadlines = $this->generateUpcomingDeadlines($allOrders->where('status', 'in_progress'));

        // Earnings data
        $earnings = [
            'thisMonth' => $thisMonthEarnings,
            'lastMonth' => $lastMonthEarnings,
            'total' => $totalEarnings,
            'transactions' => $recentOrders->map(function($order) {
                return [
                    'id' => $order->id,
                    'description' => $order->service->title ?? '',
                    'date' => $order->created_at,
                    'amount' => $order->total_amount,
                    'status' => $order->status,
                ];
            }),
        ];

        return Inertia::render('Freelancers/Dashboard', [
            'freelancer' => [
                'name' => $user->name,
                'avatar' => $freelancer->avatar ?? null,
            ],
            'services' => $services,
            'recentOrders' => $recentOrders,
            'stats' => $stats,
            'earnings' => $earnings,
            'recentActivities' => $recentActivities,
            'upcomingDeadlines' => $upcomingDeadlines,
        ]);
    }

    private function generateRecentActivities($user, $orders, $reviews)
    {
        $activities = collect();
        $locale = app()->getLocale();

        // dd( $locale);

        // Add recent orders
        $recentOrders = $orders->take(2);
        foreach ($recentOrders as $order) {
            $activities->push([
                'id' => 'order_' . $order->id,
                'type' => 'order',
                'title' => $locale === 'ar' ? 'تم استلام طلب جديد' : 'New order received',
                'description' => $order->service->title . ' ' . ($locale === 'ar' ? 'من' : 'from') . ' ' . $order->client->name,
                'time' => $order->created_at->diffForHumans(),
                'status' => $order->status,
                'data' => $order
            ]);
        }

        // Add recent reviews
        $recentReviews = $reviews->take(2);
        foreach ($recentReviews as $review) {
            $activities->push([
                'id' => 'review_' . $review->id,
                'type' => 'review',
                'title' => $locale === 'ar' ? 'مراجعة جديدة' : 'New review',
                'description' => $review->rating . '-star ' . ($locale === 'ar' ? 'مراجعة من' : 'review from') . ' ' . $review->order->client->name,
                'time' => $review->created_at->diffForHumans(),
                'status' => 'completed',
                'data' => $review
            ]);
        }

        // Add recent payments (completed orders)
        $recentPayments = $orders->where('status', 'completed')->take(2);
        foreach ($recentPayments as $order) {
            $activities->push([
                'id' => 'payment_' . $order->id,
                'type' => 'payment',
                'title' => $locale === 'ar' ? 'تم استلام دفعة' : 'Payment received',
                'description' => 'SDG ' . number_format($order->total_amount) . ' ' . ($locale === 'ar' ? 'مقابل' : 'for') . ' ' . $order->service->title,
                'time' => $order->updated_at->diffForHumans(),
                'status' => 'completed',
                'data' => $order
            ]);
        }

        // Add recent messages
        $recentMessages = Message::whereHas('order', function($q) use ($user) {
            $q->whereHas('service', function($sq) use ($user) {
                $sq->where('user_id', $user->id);
            });
        })
        ->where('sender_id', '!=', $user->id)
        ->with(['order.client', 'order.service'])
        ->latest()
        ->take(2)
        ->get();

        foreach ($recentMessages as $message) {
            $activities->push([
                'id' => 'message_' . $message->id,
                'type' => 'message',
                'title' => $locale === 'ar' ? 'رسالة جديدة' : 'New message',
                'description' => $message->order->client->name . ' ' . ($locale === 'ar' ? 'أرسل رسالة حول' : 'sent a message about') . ' ' . $message->order->service->title,
                'time' => $message->created_at->diffForHumans(),
                'status' => 'unread',
                'data' => $message
            ]);
        }

        return $activities->sortByDesc('time')->take(5)->values();
    }

    private function generateUpcomingDeadlines($activeOrders)
    {
        $deadlines = collect();
        $locale = app()->getLocale();

        foreach ($activeOrders as $order) {
            // Parse delivery time string (e.g., "24 Days", "3 days", "1 week")
            $deliveryTime = $order->service->delivery_time ?? '7 days';
            $daysToAdd = $this->parseDeliveryTime($deliveryTime);
            
            $dueDate = $order->created_at->addDays($daysToAdd);
            $daysLeft = Carbon::now()->diffInDays($dueDate, false);

            if ($daysLeft >= 0 && $daysLeft <= 7) {
                $urgency = $daysLeft <= 2 ? 'urgent' : ($daysLeft <= 4 ? 'onTrack' : 'planned');
                $color = $daysLeft <= 2 ? 'text-red-500' : ($daysLeft <= 4 ? 'text-green-500' : 'text-orange-500');
                $badgeVariant = $daysLeft <= 2 ? 'destructive' : ($daysLeft <= 4 ? 'secondary' : 'outline');

                // Localize badge text
                $badgeText = '';
                if ($urgency === 'urgent') {
                    $badgeText = $locale === 'ar' ? 'عاجل' : 'Urgent';
                } elseif ($urgency === 'onTrack') {
                    $badgeText = $locale === 'ar' ? 'على المسار' : 'On Track';
                } else {
                    $badgeText = $locale === 'ar' ? 'مخطط' : 'Planned';
                }

                // Localize days text
                $daysText = '';
                if ($daysLeft === 0) {
                    $daysText = $locale === 'ar' ? 'اليوم' : 'Today';
                } elseif ($daysLeft === 1) {
                    $daysText = $locale === 'ar' ? 'غداً' : 'Tomorrow';
                } else {
                    $daysText = $locale === 'ar' 
                        ? $daysLeft . ' أيام متبقية'
                        : $daysLeft . ' days left';
                }

                $deadlines->push([
                    'id' => $order->id,
                    'project' => $order->service->title,
                    'due' => $urgency,
                    'days' => $daysText,
                    'color' => $color,
                    'badge' => $badgeText,
                    'badgeVariant' => $badgeVariant,
                    'data' => $order
                ]);
            }
        }

        return $deadlines->sortBy('days')->take(5)->values();
    }

    private function parseDeliveryTime($deliveryTime)
    {
        // Convert to lowercase and trim
        $time = strtolower(trim($deliveryTime));
        
        // Extract number and unit
        if (preg_match('/(\d+)\s*(day|days|week|weeks|month|months)/', $time, $matches)) {
            $number = (int) $matches[1];
            $unit = $matches[2];
            
            switch ($unit) {
                case 'day':
                case 'days':
                    return $number;
                case 'week':
                case 'weeks':
                    return $number * 7;
                case 'month':
                case 'months':
                    return $number * 30;
                default:
                    return 7; // Default to 7 days
            }
        }
        
        // If no pattern matches, try to extract just the number
        if (preg_match('/(\d+)/', $time, $matches)) {
            return (int) $matches[1];
        }
        
        // Default fallback
        return 7;
    }
} 