<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $searchQuery = $request->input('query', '');
        $language = $request->input('lang', 'en');
        $page = $request->input('page', 1);
        $perPage = 12;

        // Base query with relationships
        $query = Service::with([
            'user.freelancerProfile',
            'reviews.client',
            'orders' => function($q) {
                $q->where('status', 'completed');
            }
        ]);

        // Apply search if query exists
        if (!empty($searchQuery)) {
            $query->where(function(Builder $q) use ($searchQuery, $language) {
                $this->applySearchConditions($q, $searchQuery, $language);
            });
        }

        // Apply filters from request
        $this->applyFilters($query, $request);

        // Calculate relevance score for ordering
        $services = $query->select('services.*')
            ->selectRaw($this->getRelevanceScoreSQL($searchQuery, $language))
            ->orderBy('relevance_score', 'DESC')
            ->paginate($perPage, ['*'], 'page', $page);

        // Format services data
        $formattedServices = $services->map(function ($service) use ($language) {
            return $this->formatServiceData($service, $language);
        });

        // Extract unique categories and subcategories for filters
        $categories = Service::select(
            $language === 'ar' ? 'category_ar as category' : 'category'
        )->distinct()->pluck('category')->filter()->values()->toArray();

        $subcategories = Service::select(
            $language === 'ar' ? 'subcategory_ar as subcategory' : 'subcategory'
        )->distinct()->pluck('subcategory')->filter()->values()->toArray();

        // Define filter options
        $filters = [
            'priceRange' => [
                ['label' => __('Any Price'), 'value' => 'any'],
                ['label' => __('Under 50,000 SDG'), 'value' => '0-50000'],
                ['label' => __('50,000 - 100,000 SDG'), 'value' => '50000-100000'],
                ['label' => __('100,000 - 200,000 SDG'), 'value' => '100000-200000'],
                ['label' => __('200,000 - 500,000 SDG'), 'value' => '200000-500000'],
                ['label' => __('Over 500,000 SDG'), 'value' => '500000+']
            ],
            'deliveryTime' => [
                ['label' => __('Any Time'), 'value' => 'any'],
                ['label' => __('1-2 Days'), 'value' => '1-2'],
                ['label' => __('3-5 Days'), 'value' => '3-5'],
                ['label' => __('1-2 Weeks'), 'value' => '7-14'],
                ['label' => __('2+ Weeks'), 'value' => '14+']
            ],
            'rating' => [
                ['label' => __('Any Rating'), 'value' => 'any'],
                ['label' => __('4.5+ Stars'), 'value' => '4.5'],
                ['label' => __('4.0+ Stars'), 'value' => '4.0'],
                ['label' => __('3.5+ Stars'), 'value' => '3.5']
            ]
        ];

        return Inertia::render('Services/Index', [
            'services' => $formattedServices,
            'meta' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ],
            'filters' => [
                'categories' => $categories,
                'subcategories' => $subcategories,
                'priceRange' => $filters['priceRange'],
                'deliveryTime' => $filters['deliveryTime'],
                'rating' => $filters['rating'],
            ],
            'search' => [
                'query' => $searchQuery,
                'language' => $language,
            ],
            'auth' => [
                'user' => auth()->user(),
            ]
        ]);
    }

    protected function applySearchConditions(Builder $query, string $searchQuery, string $language)
    {
        $terms = $this->prepareSearchTerms($searchQuery, $language);
        
        foreach ($terms as $term) {
            $query->where(function(Builder $q) use ($term, $language) {
                // Search in title and description fields
                $titleField = $language === 'ar' ? 'title_ar' : 'title';
                $descField = $language === 'ar' ? 'description_ar' : 'description';
                $detailedDescField = $language === 'ar' ? 'detailed_description_ar' : 'detailed_description';
                
                $q->where($titleField, 'like', "%{$term}%")
                  ->orWhere($descField, 'like', "%{$term}%")
                  ->orWhere($detailedDescField, 'like', "%{$term}%")
                  ->orWhereJsonContains('tags', $term)
                  ->orWhereJsonContains('tags_ar', $term)
                  ->orWhereJsonContains('features', $term)
                  ->orWhereJsonContains('features_ar', $term)
                  ->orWhereHas('user.freelancerProfile', function($profile) use ($term) {
                      $profile->where('bio', 'like', "%{$term}%")
                             ->orWhereJsonContains('skills', $term);
                  });
            });
        }
    }

    protected function prepareSearchTerms(string $query, string $language): array
    {
        $query = trim($query);
        $terms = preg_split('/\s+/', $query);
        
        if ($language === 'ar') {
            // Simple Arabic normalization
            $terms = array_map(function($term) {
                $term = preg_replace('/[\x{064B}-\x{065F}]/u', '', $term);
                $term = str_replace(['أ', 'إ', 'آ'], 'ا', $term);
                return $term;
            }, $terms);
        }
        
        return $terms;
    }

    protected function getRelevanceScoreSQL(string $searchQuery = '', string $language): string
    {
        if (empty($searchQuery)) {
            // When no search query, just order by popularity factors
            return "(
                (CASE WHEN is_popular = 1 THEN 20 ELSE 0 END) +
                (CASE WHEN is_featured = 1 THEN 15 ELSE 0 END) +
                (orders * 0.15) +
                (views * 0.01) +
                COALESCE((SELECT AVG(rating) * 20 FROM reviews 
                 WHERE reviews.order_id IN (SELECT id FROM orders WHERE orders.service_id = services.id), 0) +
                COALESCE((SELECT freelancer_profiles.average_rating * 20 FROM freelancer_profiles 
                 WHERE freelancer_profiles.user_id = services.user_id), 0)
            ) AS relevance_score";
        }

        $terms = $this->prepareSearchTerms($searchQuery, $language);
        $scoreParts = [];

        foreach ($terms as $term) {
            // Text match components (50% weight)
            $titleField = $language === 'ar' ? 'title_ar' : 'title';
            $descField = $language === 'ar' ? 'description_ar' : 'description';
            $detailedDescField = $language === 'ar' ? 'detailed_description_ar' : 'detailed_description';
            
            $scoreParts[] = "IF($titleField LIKE '%{$term}%', 30, 0)";
            $scoreParts[] = "IF($descField LIKE '%{$term}%', 20, 0)";
            $scoreParts[] = "IF($detailedDescField LIKE '%{$term}%', 15, 0)";
            $scoreParts[] = "IF(JSON_CONTAINS(features, '\"$term\"') OR JSON_CONTAINS(features_ar, '\"$term\"'), 10, 0)";
            $scoreParts[] = "IF(JSON_CONTAINS(tags, '\"$term\"') OR JSON_CONTAINS(tags_ar, '\"$term\"'), 10, 0)";
        }

        // Freelancer profile matches (15% weight)
        $scoreParts[] = "(SELECT IF(COUNT(*) > 0, 15, 0) FROM freelancer_profiles WHERE 
                          freelancer_profiles.user_id = services.user_id AND
                          (freelancer_profiles.bio LIKE '%{$terms[0]}%' OR 
                           JSON_CONTAINS(freelancer_profiles.skills, '\"{$terms[0]}\"'))
                         )";

        // Popularity components (30% weight)
        $scoreParts[] = "IF(is_popular = 1, 20, 0)";
        $scoreParts[] = "IF(is_featured = 1, 15, 0)";
        $scoreParts[] = "orders * 0.15";
        $scoreParts[] = "views * 0.01";
        
        // Rating components (20% weight)
        $scoreParts[] = "COALESCE((SELECT AVG(rating) * 20 FROM reviews 
                         WHERE reviews.order_id IN (SELECT id FROM orders WHERE orders.service_id = services.id), 0)";
        $scoreParts[] = "COALESCE((SELECT freelancer_profiles.average_rating * 20 FROM freelancer_profiles 
                         WHERE freelancer_profiles.user_id = services.user_id), 0)";

        // Language bonus (20% weight)
        if ($language === 'ar') {
            $scoreParts[] = "IF(title_ar IS NOT NULL OR description_ar IS NOT NULL, 20, 0)";
        } else {
            $scoreParts[] = "IF(title IS NOT NULL OR description IS NOT NULL, 20, 0)";
        }

        return implode(' + ', $scoreParts) . ' AS relevance_score';
    }

    protected function applyFilters(Builder $query, Request $request)
    {
        // Category filter
        if ($request->has('category') && $request->category !== 'all') {
            $field = $request->input('lang') === 'ar' ? 'category_ar' : 'category';
            $query->where($field, $request->category);
        }

        // Subcategory filter
        if ($request->has('subcategory') && $request->subcategory !== 'all') {
            $field = $request->input('lang') === 'ar' ? 'subcategory_ar' : 'subcategory';
            $query->where($field, $request->subcategory);
        }

        // Price range filter
        if ($request->has('priceRange') && $request->priceRange !== 'any') {
            $range = $request->priceRange;
            if (str_contains($range, '+')) {
                $min = (int) str_replace('+', '', $range);
                $query->where('price', '>=', $min);
            } else {
                [$min, $max] = explode('-', $range);
                $query->whereBetween('price', [(int)$min, (int)$max]);
            }
        }

        // Delivery time filter
        if ($request->has('deliveryTime') && $request->deliveryTime !== 'any') {
            $range = $request->deliveryTime;
            $field = $request->input('lang') === 'ar' ? 'delivery_time_ar' : 'delivery_time';
            
            if (str_contains($range, '+')) {
                $min = (int) str_replace('+', '', $range);
                $query->whereRaw("CAST(SUBSTRING_INDEX($field, ' ', 1) AS UNSIGNED) >= ?", [$min]);
            } else {
                [$min, $max] = explode('-', $range);
                $query->whereRaw("CAST(SUBSTRING_INDEX($field, ' ', 1) AS UNSIGNED) BETWEEN ? AND ?", [(int)$min, (int)$max]);
            }
        }

        // Rating filter
        if ($request->has('rating') && $request->rating !== 'any') {
            $minRating = (float) $request->rating;
            $query->whereHas('reviews', function($q) use ($minRating) {
                $q->select('service_id')
                  ->groupBy('service_id')
                  ->havingRaw('AVG(rating) >= ?', [$minRating]);
            });
        }

        // Sort by
        $sortBy = $request->input('sortBy', 'popular');
        switch ($sortBy) {
            case 'rating':
                $query->orderByDesc(
                    DB::raw('(SELECT COALESCE(AVG(rating), 0) FROM reviews 
                    WHERE reviews.order_id IN (SELECT id FROM orders WHERE orders.service_id = services.id))')
                );
                break;
            case 'price-low':
                $query->orderBy('price');
                break;
            case 'price-high':
                $query->orderByDesc('price');
                break;
            case 'delivery-fast':
                $field = $request->input('lang') === 'ar' ? 'delivery_time_ar' : 'delivery_time';
                $query->orderByRaw("CAST(SUBSTRING_INDEX($field, ' ', 1) AS UNSIGNED)");
                break;
            case 'popular':
            default:
                $query->orderByDesc('orders');
                break;
        }
    }

    protected function formatServiceData(Service $service, string $language): array
    {
        $titleField = $language === 'ar' ? 'title_ar' : 'title';
        $descField = $language === 'ar' ? 'description_ar' : 'description';
        $detailedDescField = $language === 'ar' ? 'detailed_description_ar' : 'detailed_description';
        $categoryField = $language === 'ar' ? 'category_ar' : 'category';
        $subcategoryField = $language === 'ar' ? 'subcategory_ar' : 'subcategory';
        $deliveryTimeField = $language === 'ar' ? 'delivery_time_ar' : 'delivery_time';
        
        $avgRating = $service->reviews->avg('rating') ?? 0;
        $totalReviews = $service->reviews->count();

        return [
            'id' => $service->id,
            'title' => $service->$titleField ?? $service->title,
            'title_ar' => $service->title_ar,
            'description' => $service->$descField ?? $service->description,
            'description_ar' => $service->description_ar,
            'detailed_description' => $service->$detailedDescField ?? $service->detailed_description,
            'detailed_description_ar' => $service->detailed_description_ar,
            'category' => $service->$categoryField ?? $service->category,
            'category_ar' => $service->category_ar,
            'subcategory' => $service->$subcategoryField ?? $service->subcategory,
            'subcategory_ar' => $service->subcategory_ar,
            'price' => $service->price,
            'delivery_time' => $service->$deliveryTimeField ?? $service->delivery_time,
            'delivery_time_ar' => $service->delivery_time_ar,
            'revisions' => $service->revisions,
            'tags' => $language === 'ar' && !empty($service->tags_ar) ? $service->tags_ar : ($service->tags ?? []),
            'tags_ar' => $service->tags_ar,
            'gallery' => $service->gallery,
            'features' => $language === 'ar' && !empty($service->features_ar) ? $service->features_ar : ($service->features ?? []),
            'features_ar' => $service->features_ar,
            'dynamic_sections' => $service->dynamic_sections ?? [],
            'packages' => $language === 'ar' && !empty($service->packages_ar) ? $service->packages_ar : ($service->packages ?? []),
            'packages_ar' => $service->packages_ar,
            'views' => $service->views,
            'orders' => $service->orders,
            'faq' => $language === 'ar' && !empty($service->faq_ar) ? $service->faq_ar : ($service->faq ?? []),
            'faq_ar' => $service->faq_ar,
            'is_popular' => $service->is_popular,
            'is_featured' => $service->is_featured,
            'rating' => $avgRating,
            'total_reviews' => $totalReviews,
            'created_at' => $service->created_at,
            'updated_at' => $service->updated_at,
            'freelancer' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'title' => $service->user->freelancerProfile->title ?? __('Freelancer'),
                'avatar' => $service->user->avatar,
                'location' => $service->user->freelancerProfile->location ?? __('Khartoum, Sudan'),
                'rating' => $service->user->freelancerProfile->average_rating ?? 0,
                'totalReviews' => $service->user->freelancerProfile->total_reviews ?? 0,
                'completedOrders' => $service->user->freelancerProfile->completed_orders ?? 0,
                'responseTime' => $service->user->freelancerProfile->response_time ?? __('2 hours'),
                'memberSince' => $service->user->created_at->format('Y'),
                'verificationStatus' => $service->user->freelancerProfile->is_verified ? 'verified' : 'unverified',
                'bio' => $service->user->freelancerProfile->bio ?? '',
                'skills' => $service->user->freelancerProfile->skills ?? [],
                'languages' => $service->user->freelancerProfile->languages ?? [__('Arabic'), __('English')],
                'education' => $service->user->freelancerProfile->education ?? '',
                'certifications' => $service->user->freelancerProfile->certifications ?? [],
                'email' => $service->user->email,
                'phone' => $service->user->phone,
                'website' => $service->user->freelancerProfile->website ?? '',
                'social_links' => $service->user->freelancerProfile->social_links ?? [],
                'successRate' => $service->user->freelancerProfile->success_rate ?? 0,
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
    }

    public function show($id, Request $request)
    {
        $service = Service::with([
            'user.freelancerProfile', 
            'reviews.client',
            'orders' => function($q) {
                $q->where('status', 'completed');
            }
        ])->findOrFail($id);

        $language = $request->input('lang', 'en');
        $serviceData = $this->formatServiceData($service, $language);

        // Calculate freelancer statistics
        $freelancer = $service->user;
        $orders = Order::where('freelancer_id', $freelancer->id)->get();
        $totalOrders = $orders->count();

        // Success Rate
        $completedOrders = $orders->where('status', 'completed')->count();
        $successRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100) : 0;

        // On Time Delivery
        $onTimeOrders = $orders->where('status', 'completed')
            ->filter(function ($order) {
                return $order->completed_at && $order->due_date && $order->completed_at <= $order->due_date;
            })->count();
        $onTimeDelivery = $completedOrders > 0 ? round(($onTimeOrders / $completedOrders) * 100) : 0;

        // Repeat Clients
        $clientOrderCounts = $orders->groupBy('client_id')->map->count();
        $repeatClients = $clientOrderCounts->filter(fn($count) => $count > 1)->count();
        $totalClients = $clientOrderCounts->count();
        $repeatClientsPercent = $totalClients > 0 ? round(($repeatClients / $totalClients) * 100) : 0;

        // Update service data with calculated stats
        $serviceData['freelancer']['successRate'] = $successRate;
        $serviceData['freelancer']['onTimeDelivery'] = $onTimeDelivery;
        $serviceData['freelancer']['repeatClients'] = $repeatClientsPercent;

        // Get related services (same freelancer)
        $relatedServices = Service::with(['user.freelancerProfile'])
            ->where('user_id', $service->user_id)
            ->where('id', '!=', $service->id)
            ->limit(6)
            ->get()
            ->map(fn($s) => $this->formatServiceData($s, $language));

        return Inertia::render('Services/Show', [
            'service' => $serviceData,
            'relatedServices' => $relatedServices,
            'auth' => [
                'user' => auth()->user(),
                'isFreelancer' => auth()->user() ? auth()->user()->isFreelancer() : false,
            ],
        ]);
    }
}