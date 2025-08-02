<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        // Base query with relationships and counts
        $query = Service::query()
            ->with([
                'user.freelancerProfile',
                'reviews.client',
                'orders' => function ($query) {
                    $query->where('status', 'completed');
                }
            ])
            ->withCount([
                'orders as completed_orders_count' => function ($query) {
                    $query->where('status', 'completed');
                },
                'reviews as reviews_count'
            ])
            ->withAvg('reviews', 'rating');

        // Search functionality

        $searchTerm = $request->input('search', null); // أو null أو '' حسب ما يناسب

        if ($request->has('search') && !empty($request->search)) {
            $isArabic = $this->isArabic($searchTerm);

            $query->where(function($q) use ($searchTerm, $isArabic) {
                // Exact matches (highest priority)
                $q->where(function($subQuery) use ($searchTerm, $isArabic) {
                    $subQuery->where('title', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('title_ar', 'LIKE', "%{$searchTerm}%");
                    
                    if ($isArabic) {
                        $subQuery->orWhere('description_ar', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('detailed_description_ar', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('tags_ar', 'LIKE', "%{$searchTerm}%");
                    } else {
                        $subQuery->orWhere('description', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('detailed_description', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('tags', 'LIKE', "%{$searchTerm}%");
                    }
                });

                // Partial matches in other fields
                $q->orWhereHas('user.freelancerProfile', function($profileQuery) use ($searchTerm) {
                    $profileQuery->where('bio', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('skills', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('title', 'LIKE', "%{$searchTerm}%");
                });

                // Search in features and packages
                $q->orWhere('features', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('features_ar', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('packages', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('packages_ar', 'LIKE', "%{$searchTerm}%");

                // If MySQL full-text search is available
                if (config('database.default') === 'mysql') {
                    $englishFields = ['title', 'description', 'detailed_description', 'tags', 'features', 'packages'];
                    $arabicFields = ['title_ar', 'description_ar', 'detailed_description_ar', 'tags_ar', 'features_ar', 'packages_ar'];
                    
                    $fields = $isArabic ? $arabicFields : $englishFields;
                    $fieldString = implode(',', $fields);
                    
                    $q->orWhereRaw("MATCH({$fieldString}) AGAINST(? IN BOOLEAN MODE)", [$searchTerm]);
                }
            });
        }

        // Calculate relevance score
        $query->selectRaw('
        services.*,
        ( 
            (CASE
                WHEN title LIKE ? THEN 100
                WHEN title_ar LIKE ? THEN 100
                WHEN description LIKE ? THEN 80
                WHEN description_ar LIKE ? THEN 80
                WHEN detailed_description LIKE ? THEN 60
                WHEN detailed_description_ar LIKE ? THEN 60
                WHEN tags LIKE ? THEN 70
                WHEN tags_ar LIKE ? THEN 70
                ELSE 0
            END) * 0.5 +
            (CASE
                WHEN is_featured THEN 100
                WHEN is_popular THEN 80
                ELSE 0
            END) * 0.3 +
         
            (
                SELECT 
                    (CASE WHEN fp.is_verified THEN 50 ELSE 0 END) + 
                    COALESCE(fp.average_rating, 0) * 10
                FROM freelancer_profiles fp
                WHERE fp.user_id = services.user_id
            ) * 0.1
        ) AS relevance_score
    ', array_fill(0, 8, "%{$searchTerm}%"));

        // Apply filters from request
        $this->applyFilters($query, $request);

        // Execute query and map results
        $services = $query->orderBy('relevance_score', 'desc')
            ->get()
            ->map(function ($service) {
                return $this->formatServiceData($service);
            });

        // Get unique categories and subcategories for filters
        $categories = Service::select('category', 'category_ar')
            ->distinct()
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category => $item->category_ar];
            })
            ->toArray();

        $subcategories = Service::select('subcategory', 'subcategory_ar')
            ->distinct()
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->subcategory => $item->subcategory_ar];
            })
            ->toArray();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'subcategories' => $subcategories,
            'filters' => $this->getFilterOptions(),
            'searchQuery' => $request->input('search', ''),
            'auth' => [
                'user' => auth()->user(),
            ]
        ]);
    }

    protected function isArabic($text)
    {
        return preg_match('/\p{Arabic}/u', $text);
    }

    protected function applyFilters($query, $request)
    {
        // Category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->where(function($q) use ($request) {
                $q->where('category', $request->category)
                  ->orWhere('category_ar', $request->category);
            });
        }

        // Subcategory filter
        if ($request->has('subcategory') && $request->subcategory !== 'all') {
            $query->where(function($q) use ($request) {
                $q->where('subcategory', $request->subcategory)
                  ->orWhere('subcategory_ar', $request->subcategory);
            });
        }

        // Price range filter
        if ($request->has('priceRange') && $request->priceRange !== 'any') {
            $range = explode('-', $request->priceRange);
            if (count($range) === 2) {
                $query->whereBetween('price', [(int)$range[0], (int)$range[1]]);
            } else {
                $query->where('price', '>=', (int)str_replace('+', '', $range[0]));
            }
        }

        // Delivery time filter
        if ($request->has('deliveryTime') && $request->deliveryTime !== 'any') {
            $range = explode('-', $request->deliveryTime);
            if (count($range) === 2) {
                $query->where(function($q) use ($range) {
                    $q->whereRaw('CAST(SUBSTRING_INDEX(delivery_time, " ", 1) AS UNSIGNED) BETWEEN ? AND ?', [(int)$range[0], (int)$range[1]])
                      ->orWhereRaw('CAST(SUBSTRING_INDEX(delivery_time_ar, " ", 1) AS UNSIGNED) BETWEEN ? AND ?', [(int)$range[0], (int)$range[1]]);
                });
            } else {
                $min = (int)str_replace('+', '', $range[0]);
                $query->where(function($q) use ($min) {
                    $q->whereRaw('CAST(SUBSTRING_INDEX(delivery_time, " ", 1) AS UNSIGNED) >= ?', [$min])
                      ->orWhereRaw('CAST(SUBSTRING_INDEX(delivery_time_ar, " ", 1) AS UNSIGNED) >= ?', [$min]);
                });
            }
        }

        // Rating filter
        if ($request->has('rating') && $request->rating !== 'any') {
            $query->whereHas('reviews', function($q) use ($request) {
                $q->select(DB::raw('AVG(rating) as avg_rating'))
                  ->having('avg_rating', '>=', (float)$request->rating);
            });
        }
    }

    protected function formatServiceData($service)
    {
        // Your existing service data formatting logic
        // ...
    }

    protected function getFilterOptions()
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


    public function show($id)
    {
        $service = Service::with(['user.freelancerProfile', 'reviews.client'])->findOrFail($id);

        // Format service data
        $serviceData = [
            'id' => $service->id,
            'title' => $service->title,
            'title_ar' => $service->title_ar,
            'description' => $service->description,
            'description_ar' => $service->description_ar,
            'detailed_description' => $service->detailed_description,
            'detailed_description_ar' => $service->detailed_description_ar,
            'category' => $service->category,
            'category_ar' => $service->category_ar,
            'subcategory' => $service->subcategory,
            'subcategory_ar' => $service->subcategory_ar,
            'price' => $service->price,
            'delivery_time' => $service->delivery_time,
            'delivery_time_ar' => $service->delivery_time_ar,
            'revisions' => $service->revisions,
            'tags' => $service->tags ?? [],
            'tags_ar' => $service->tags_ar ?? [],
            'gallery' => $service->gallery,
            'features' => $service->features ?? [],
            'features_ar' => $service->features_ar ?? [],
            'dynamic_sections' => $service->dynamic_sections ?? [],
            'packages' => $service->packages ?? [],
            'packages_ar' => $service->packages_ar ?? [],
            'views' => $service->views,
            'orders' => $service->orders,
            'faq' => $service->faq ?? [],
            'faq_ar' => $service->faq_ar ?? [],
            'is_popular' => $service->is_popular,
            'is_featured' => $service->is_featured,
            'created_at' => $service->created_at,
            'updated_at' => $service->updated_at,
            'freelancer' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'title' => $service->user->freelancerProfile->title ?? 'Freelancer',
                'avatar' => $service->user->avatar,
                'location' => $service->user->freelancerProfile->location ?? 'Khartoum, Sudan',
                'rating' => $service->user->freelancerProfile->average_rating ?? 4.5,
                'totalReviews' => $service->user->freelancerProfile->total_reviews ?? 0,
                'completedOrders' => $service->user->freelancerProfile->completed_orders ?? 0,
                'responseTime' => $service->user->freelancerProfile->response_time ?? '2 hours',
                'memberSince' => $service->user->created_at->format('Y'),
                'verificationStatus' => $service->user->freelancerProfile->is_verified ? 'verified' : 'unverified',
                'bio' => $service->user->freelancerProfile->bio ?? '',
                'skills' => $service->user->freelancerProfile->skills ?? [],
                'languages' => $service->user->freelancerProfile->languages ?? ['Arabic', 'English'],
                'education' => $service->user->freelancerProfile->education ?? '',
                'certifications' => $service->user->freelancerProfile->certifications ?? [],
                'email' => $service->user->email,
                'phone' => $service->user->phone,
                'website' => $service->user->freelancerProfile->website ?? '',
                'linkedin' => $service->user->freelancerProfile->social_links['linkedin'] ?? '',
                'twitter' => $service->user->freelancerProfile->social_links['twitter'] ?? '',
                'instagram' => $service->user->freelancerProfile->social_links['instagram'] ?? '',
                'facebook' => $service->user->freelancerProfile->social_links['facebook'] ?? '',
                'successRate' => $service->user->freelancerProfile->success_rate ? $service->user->freelancerProfile->success_rate . '%' : '98%',
                'onTimeDelivery' => '99%', // This will be calculated dynamically below
                'repeatClients' => '85%' // This will be calculated dynamically below
            ],
            'reviews' => $service->reviews->map(function($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,
                    'client' => [
                        'id' => $review->client->id,
                        'name' => $review->client->name,
                        'avatar' => $review->client->avatar,
                    ]
                ];
            })
        ];

        // Get all orders for this freelancer
        $orders = Order::where('freelancer_id', $service->user_id)->get();
        $totalOrders = $orders->count();

        // Success Rate
        $completedOrders = $orders->where('status', 'completed')->count();
        $successRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100) : 0;

        // On Time Delivery
        $onTimeOrders = $orders->where('status', 'completed')
            ->filter(function ($order) {
                return $order->completed_at && $order->due_date && $order->delivered_at <= $order->due_date;
            })->count();
        $onTimeDelivery = $completedOrders > 0 ? round(($onTimeOrders / $completedOrders) * 100) : 0;

        // Repeat Clients
        $clientOrderCounts = $orders->groupBy('user_id')->map->count();
        $repeatClients = $clientOrderCounts->filter(function ($count) {
            return $count > 1;
        })->count();
        $totalClients = $clientOrderCounts->count();
        $repeatClientsPercent = $totalClients > 0 ? round(($repeatClients / $totalClients) * 100) : 0;

        // Pass to view
        $serviceData['freelancer']['successRate'] = "{$successRate}%";
        $serviceData['freelancer']['onTimeDelivery'] = "{$onTimeDelivery}%";
        $serviceData['freelancer']['repeatClients'] = "{$repeatClientsPercent}%";

        // Get related services
        $relatedServices = Service::with(['user.freelancerProfile'])
            ->where('user_id', $service->user_id)
            ->where('id', '!=', $service->id)
            ->limit(6)
            ->get()
            ->map(function ($relatedService) {
                return [
                    'id' => $relatedService->id,
                    'title' => $relatedService->title,
                    'title_ar' => $relatedService->title_ar,
                    'description' => $relatedService->description,
                    'description_ar' => $relatedService->description_ar,
                    'category' => $relatedService->category,
                    'category_ar' => $relatedService->category_ar,
                    'subcategory' => $relatedService->subcategory,
                    'subcategory_ar' => $relatedService->subcategory_ar,
                    'price' => $relatedService->price,
                    'delivery_time' => $relatedService->delivery_time,
                    'delivery_time_ar' => $relatedService->delivery_time_ar,
                    'revisions' => $relatedService->revisions,
                    'tags' => $relatedService->tags ?? [],
                    'tags_ar' => $relatedService->tags_ar ?? [],
                    'features' => $relatedService->features ?? [],
                    'features_ar' => $relatedService->features_ar ?? [],
                    'packages' => $relatedService->packages ?? [],
                    'packages_ar' => $relatedService->packages_ar ?? [],
                    'views' => $relatedService->views,
                    'orders' => $relatedService->orders,
                    'faq' => $relatedService->faq ?? [],
                    'faq_ar' => $relatedService->faq_ar ?? [],
                    'is_popular' => $relatedService->is_popular,
                    'is_featured' => $relatedService->is_featured,
                    'created_at' => $relatedService->created_at,
                    'updated_at' => $relatedService->updated_at,
                    'freelancer' => [
                        'id' => $relatedService->user->id,
                        'name' => $relatedService->user->name,
                        'avatar' => $relatedService->user->avatar,
                        'location' => $relatedService->user->freelancerProfile->location ?? 'Khartoum, Sudan',
                        'rating' => $relatedService->user->freelancerProfile->average_rating ?? 4.5,
                        'totalReviews' => $relatedService->user->freelancerProfile->total_reviews ?? 0,
                        'completedOrders' => $relatedService->user->freelancerProfile->completed_orders ?? 0,
                        'responseTime' => $relatedService->user->freelancerProfile->response_time ?? '2 hours',
                        'memberSince' => $relatedService->user->created_at->format('Y'),
                        'verificationStatus' => $relatedService->user->freelancerProfile->is_verified ? 'verified' : 'unverified'
                    ]
                ];
            });

        $user = auth()->user();
        return Inertia::render('Services/Show', [
            'service' => $serviceData,
            'relatedServices' => $relatedServices,
            'auth' => [
                'user' => $user,
            ],
            'isFreelancer' => $user ? $user->isFreelancer() : false,
        ]);
    }
}