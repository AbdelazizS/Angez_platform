<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {

        $query = Service::query()
            ->with([
                'user.freelancerProfile',
                'orders'
            ])->where('is_active', true) // 👈 فقط الخدمات المفعلة

            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('title_ar', 'like', "%{$search}%")
                        ->orWhere('description_ar', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            });

        // Apply sorting
        $query = $this->applySorting($query, $request->sortBy ?? 'popular');

        $services = $query->paginate(12)
            ->withQueryString();

        // Extract unique categories and subcategories
        $categories = $services->pluck('category')->filter()->unique()->values()->toArray();
        $subcategories = $services->pluck('subcategory')->filter()->unique()->values()->toArray();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'filters' => $this->getFilters(),
            'categories' => $categories,
            'subcategories' => $subcategories,
            'searchQuery' => $request->search ?? '',
            'selectedCategory' => $request->category ?? 'all',
            'selectedSubcategory' => $request->subcategory ?? 'all',
            'selectedPriceRange' => $request->priceRange ?? 'any',
            'selectedDeliveryTime' => $request->deliveryTime ?? 'any',
            'selectedRating' => $request->rating ?? 'any',
            'sortBy' => $request->sortBy ?? 'popular',
            'viewMode' => $request->viewMode ?? 'grid',
            'currentPage' => $request->page ?? 1,
        ]);
    }

    protected function applySorting($query, $sortBy)
    {
        switch ($sortBy) {
            case 'rating':
                return $query->orderByDesc(
                    \Illuminate\Support\Facades\DB::raw('(SELECT average_rating FROM freelancer_profiles WHERE user_id = services.user_id)')
                );
            case 'price-low':
                return $query->orderBy('price');
            case 'price-high':
                return $query->orderByDesc('price');
            case 'delivery-fast':
                return $query->orderByRaw(
                    "CAST(SUBSTRING_INDEX(delivery_time, ' ', 1) AS UNSIGNED)"
                );
            case 'popular':
            default:
                return $query->orderByDesc('orders')
                    ->orderByDesc('is_featured')
                    ->orderByDesc('is_popular');
        }
    }



    public function show($id)
    {
        $service = Service::with(['user.freelancerProfile', 'reviews.client'])->findOrFail($id);
        $serviceData = $this->formatServiceData($service, true);

        // Calculate freelancer stats
        $freelancerStats = $this->calculateFreelancerStats($service->user_id);
        $serviceData['freelancer'] = array_merge($serviceData['freelancer'], $freelancerStats);

        // Get related services
        $relatedServices = Service::where('user_id', $service->user_id)
            ->where('id', '!=', $service->id)
            ->limit(6)
            ->get()
            ->map(fn($s) => $this->formatServiceData($s));

        return Inertia::render('Services/Show', [
            'service' => $serviceData,
            'relatedServices' => $relatedServices,
        ]);
    }

    private function formatServiceData($service, $detailed = false)
    {
        $data = [
            'id' => $service->id,
            'title' => $service->title,
            'title_ar' => $service->title_ar,
            'description' => $service->description,
            'description_ar' => $service->description_ar,
            'price' => (float) $service->price,
            'delivery_time' => $service->delivery_time,
            'revisions' => $service->revisions,
            'tags' => $service->tags ?? [],
            'features' => $service->features ?? [],
            'orders' => $service->orders,
            'is_popular' => $service->is_popular,
            'is_featured' => $service->is_featured,
            'relevance_score' => $service->relevance_score ?? null,
            'freelancer' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'avatar' => $service->user->avatar ?? '/images/default-avatar.png',
                'rating' => (float) ($service->user->freelancerProfile->average_rating ?? 0),
                'totalReviews' => $service->user->freelancerProfile->total_reviews ?? 0,
            ]
        ];

        if ($detailed) {
            $detailedData = [
                'detailed_description' => $service->detailed_description,
                'detailed_description_ar' => $service->detailed_description_ar,
                'category' => $service->category,
                'subcategory' => $service->subcategory,
                'gallery' => $service->gallery ?? [],
                'packages' => $service->packages ?? [],
                'faq' => $service->faq ?? [],
                'freelancer' => array_merge($data['freelancer'], [
                    'title' => $service->user->freelancerProfile->title ?? 'Freelancer',
                    'location' => $service->user->freelancerProfile->location ?? 'Khartoum, Sudan',
                    'completedOrders' => $service->user->freelancerProfile->completed_orders ?? 0,
                    'responseTime' => $service->user->freelancerProfile->response_time ?? '2 hours',
                    'memberSince' => $service->user->created_at->format('Y'),
                    'verificationStatus' => $service->user->freelancerProfile->is_verified ? 'verified' : 'unverified',
                    'bio' => $service->user->freelancerProfile->bio ?? '',
                    'skills' => $service->user->freelancerProfile->skills ?? [],
                    'languages' => $service->user->freelancerProfile->languages ?? ['Arabic', 'English'],
                ]),
                'reviews' => $service->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => (float) $review->rating,
                        'comment' => $review->comment,
                        'created_at' => $review->created_at->format('Y-m-d'),
                        'client' => [
                            'id' => $review->client->id,
                            'name' => $review->client->name,
                            'avatar' => $review->client->avatar ?? '/images/default-avatar.png',
                        ]
                    ];
                })->toArray()
            ];

            $data = array_merge($data, $detailedData);
        }

        return $data;
    }

    private function calculateFreelancerStats($userId)
    {
        $orders = \App\Models\Order::where('freelancer_id', $userId)->get();
        $totalOrders = $orders->count();
        $completedOrders = $orders->where('status', 'completed')->count();

        // Success Rate
        $successRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100) : 0;

        // On Time Delivery
        $onTimeOrders = $orders->where('status', 'completed')
            ->filter(fn($o) => $o->completed_at && $o->due_date && $o->completed_at <= $o->due_date)
            ->count();
        $onTimeDelivery = $completedOrders > 0 ? round(($onTimeOrders / $completedOrders) * 100) : 0;

        // Repeat Clients
        $clientOrderCounts = $orders->groupBy('client_id')->map->count();
        $repeatClients = $clientOrderCounts->filter(fn($c) => $c > 1)->count();
        $totalClients = $clientOrderCounts->count();
        $repeatClientsPercent = $totalClients > 0 ? round(($repeatClients / $totalClients) * 100) : 0;

        return [
            'successRate' => "{$successRate}%",
            'onTimeDelivery' => "{$onTimeDelivery}%",
            'repeatClients' => "{$repeatClientsPercent}%"
        ];
    }

    private function getFilters()
    {
        return [
            'priceRange' => [
                ['label' => 'Any Price', 'value' => 'any'],
                ['label' => 'Under 50,000 SDG', 'value' => '0-50000'],
                ['label' => '50,000 - 100,000 SDG', 'value' => '50000-100000'],
                ['label' => '100,000 - 200,000 SDG', 'value' => '100000-200000'],
                ['label' => '200,000 - 500,000 SDG', 'value' => '200000-500000'],
                ['label' => 'Over 500,000 SDG', 'value' => '500000+']
            ],
            'deliveryTime' => [
                ['label' => 'Any Time', 'value' => 'any'],
                ['label' => '1-2 Days', 'value' => '1-2'],
                ['label' => '3-5 Days', 'value' => '3-5'],
                ['label' => '1-2 Weeks', 'value' => '7-14'],
                ['label' => '2+ Weeks', 'value' => '14+']
            ],
            'rating' => [
                ['label' => 'Any Rating', 'value' => 'any'],
                ['label' => '4.5+ Stars', 'value' => '4.5'],
                ['label' => '4.0+ Stars', 'value' => '4.0'],
                ['label' => '3.5+ Stars', 'value' => '3.5']
            ]
        ];
    }
}
