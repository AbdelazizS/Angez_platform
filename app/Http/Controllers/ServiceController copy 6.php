<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\FreelancerProfile;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        // Handle search functionality if query parameters are present
        if ($request->hasAny(['query', 'category', 'subcategory', 'priceRange', 'deliveryTime', 'rating', 'sortBy'])) {
            return $this->search($request);
        }

        // Default index behavior when no search parameters
        $services = Service::with(['user.freelancerProfile', 'reviews'])
            ->where('is_active', true)
            ->orderBy('orders', 'desc')
            ->orderBy('is_featured', 'desc')
            ->orderBy('is_popular', 'desc')
            ->get()
            ->map(function ($service) {
                return $this->formatServiceResult($service);
            });

        // Extract unique categories and subcategories
        $categories = Service::select('category', 'category_ar')
            ->where('is_active', true)
            ->distinct()
            ->get()
            ->flatMap(fn($s) => [$s->category, $s->category_ar])
            ->filter()
            ->unique()
            ->values();

        $subcategories = Service::select('subcategory', 'subcategory_ar')
            ->where('is_active', true)
            ->distinct()
            ->get()
            ->flatMap(fn($s) => [$s->subcategory, $s->subcategory_ar])
            ->filter()
            ->unique()
            ->values();

        // Define filter options
        $filters = [
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

        return Inertia::render('Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'subcategories' => $subcategories,
            'filters' => $filters,
            'auth' => [
                'user' => auth()->user(),
            ]
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query', '');
        $language = $request->input('language', app()->getLocale());
        $category = $request->input('category', 'all');
        $subcategory = $request->input('subcategory', 'all');
        $priceRange = $request->input('priceRange', 'any');
        $deliveryTime = $request->input('deliveryTime', 'any');
        $rating = $request->input('rating', 'any');
        $sortBy = $request->input('sortBy', 'relevance');
        $page = $request->input('page', 1);
        $perPage = 12;

        // Normalize Arabic query for better matching
        if ($language === 'ar') {
            $query = $this->normalizeArabic($query);
        }

        // Split query into terms
        $terms = array_filter(preg_split('/\s+/', $query), 'strlen');
        
        $servicesQuery = Service::query()
            ->with(['user.freelancerProfile', 'reviews'])
            ->select([
                'services.*',
                DB::raw($this->buildRelevanceScoreSQL($terms, $language)),
            ])
            ->where('is_active', true);

        // Apply filters
        if ($category !== 'all') {
            $servicesQuery->where(function($q) use ($category, $language) {
                $q->where('category', $category)
                  ->orWhere('category_ar', $category);
            });
        }

        if ($subcategory !== 'all') {
            $servicesQuery->where(function($q) use ($subcategory, $language) {
                $q->where('subcategory', $subcategory)
                  ->orWhere('subcategory_ar', $subcategory);
            });
        }

        if ($priceRange !== 'any') {
            $servicesQuery->where(function($q) use ($priceRange) {
                [$min, $max] = explode('-', $priceRange);
                $q->where('price', '>=', $min);
                if ($max !== '+') {
                    $q->where('price', '<=', $max);
                }
            });
        }

        if ($deliveryTime !== 'any') {
            $servicesQuery->where(function($q) use ($deliveryTime) {
                [$min, $max] = explode('-', $deliveryTime);
                $q->where(function($innerQ) use ($min, $max) {
                    $innerQ->whereRaw("CAST(SUBSTRING_INDEX(delivery_time, ' ', 1) AS UNSIGNED) >= ?", [$min]);
                    if ($max !== '+') {
                        $innerQ->whereRaw("CAST(SUBSTRING_INDEX(delivery_time, ' ', 1) AS UNSIGNED) <= ?", [$max]);
                    }
                })->orWhere(function($innerQ) use ($min, $max) {
                    $innerQ->whereRaw("CAST(SUBSTRING_INDEX(delivery_time_ar, ' ', 1) AS UNSIGNED) >= ?", [$min]);
                    if ($max !== '+') {
                        $innerQ->whereRaw("CAST(SUBSTRING_INDEX(delivery_time_ar, ' ', 1) AS UNSIGNED) <= ?", [$max]);
                    }
                });
            });
        }

        if ($rating !== 'any') {
            $servicesQuery->whereHas('user.freelancerProfile', function($q) use ($rating) {
                $q->where('average_rating', '>=', $rating);
            });
        }

        // Only calculate relevance if there's a search query
        if (!empty($query)) {
            $servicesQuery->having('relevance_score', '>', 0);
        }

        // Apply sorting
        switch ($sortBy) {
            case 'price-low':
                $servicesQuery->orderBy('price', 'asc');
                break;
            case 'price-high':
                $servicesQuery->orderBy('price', 'desc');
                break;
            case 'rating':
                $servicesQuery->orderByDesc(
                    DB::raw('(SELECT AVG(r.rating) FROM reviews r JOIN orders o ON r.order_id = o.id WHERE o.service_id = services.id)')
                );
                break;
            case 'orders':
                $servicesQuery->orderBy('orders', 'desc');
                break;
            case 'delivery':
                $servicesQuery->orderByRaw(
                    "CAST(SUBSTRING_INDEX(delivery_time, ' ', 1) AS UNSIGNED) ASC"
                );
                break;
            case 'relevance':
            default:
                if (!empty($query)) {
                    $servicesQuery->orderBy('relevance_score', 'desc');
                } else {
                    // Default sort when no query
                    $servicesQuery->orderBy('orders', 'desc')
                                 ->orderBy('is_featured', 'desc')
                                 ->orderBy('is_popular', 'desc');
                }
                break;
        }

        // Get paginated results
        $services = $servicesQuery->paginate($perPage, ['*'], 'page', $page);

        // Extract unique categories and subcategories for filters
        $categories = Service::select('category', 'category_ar')
            ->where('is_active', true)
            ->distinct()
            ->get()
            ->flatMap(fn($s) => [$s->category, $s->category_ar])
            ->filter()
            ->unique()
            ->values();

        $subcategories = Service::select('subcategory', 'subcategory_ar')
            ->where('is_active', true)
            ->distinct()
            ->get()
            ->flatMap(fn($s) => [$s->subcategory, $s->subcategory_ar])
            ->filter()
            ->unique()
            ->values();

        // Format results
        $formattedServices = $services->map(function ($service) {
            return $this->formatServiceResult($service);
        });

        return Inertia::render('Services/Index', [
            'services' => $formattedServices,
            'filters' => [
                'query' => $query,
                'category' => $category,
                'subcategory' => $subcategory,
                'priceRange' => $priceRange,
                'deliveryTime' => $deliveryTime,
                'rating' => $rating,
                'sortBy' => $sortBy,
            ],
            'categories' => $categories,
            'subcategories' => $subcategories,
            'pagination' => [
                'currentPage' => $services->currentPage(),
                'lastPage' => $services->lastPage(),
                'perPage' => $services->perPage(),
                'total' => $services->total(),
            ],
            'auth' => [
                'user' => auth()->user(),
            ]
        ]);
    }

    public function show($id)
    {
        $service = Service::with(['user.freelancerProfile', 'reviews.client'])->findOrFail($id);

        // Format service data
        $serviceData = $this->formatServiceResult($service, true);

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

        // Update service data with calculated metrics
        $serviceData['freelancer']['successRate'] = "{$successRate}%";
        $serviceData['freelancer']['onTimeDelivery'] = "{$onTimeDelivery}%";
        $serviceData['freelancer']['repeatClients'] = "{$repeatClientsPercent}%";

        // Get related services
        $relatedServices = Service::with(['user.freelancerProfile'])
            ->where('user_id', $service->user_id)
            ->where('id', '!=', $service->id)
            ->where('is_active', true)
            ->limit(6)
            ->get()
            ->map(function ($relatedService) {
                return $this->formatServiceResult($relatedService);
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

    protected function formatServiceResult($service, $detailed = false)
    {
        $freelancer = $service->user->freelancerProfile ?? null;
        $reviewsAvg = $service->reviews->avg('rating') ?? $freelancer->average_rating ?? 0;
        $reviewsCount = $service->reviews->count() ?? $freelancer->total_reviews ?? 0;
        
        $baseData = [
            'id' => $service->id,
            'title' => $service->title,
            'title_ar' => $service->title_ar,
            'description' => $service->description,
            'description_ar' => $service->description_ar,
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
            'views' => $service->views,
            'orders' => $service->orders,
            'is_popular' => $service->is_popular,
            'is_featured' => $service->is_featured,
            'created_at' => $service->created_at,
            'rating' => $reviewsAvg,
            'review_count' => $reviewsCount,
            'freelancer' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'avatar' => $service->user->avatar,
                'title' => $freelancer->title ?? null,
                'rating' => $freelancer->average_rating ?? 0,
                'total_reviews' => $freelancer->total_reviews ?? 0,
                'completed_orders' => $freelancer->completed_orders ?? 0,
                'response_time' => $freelancer->response_time ?? null,
                'success_rate' => $freelancer->success_rate ?? null,
                'is_verified' => $freelancer->is_verified ?? false,
                'skills' => $freelancer->skills ?? [],
            ],
        ];

        if ($detailed) {
            $additionalData = [
                'detailed_description' => $service->detailed_description,
                'detailed_description_ar' => $service->detailed_description_ar,
                'gallery' => $service->gallery,
                'features' => $service->features ?? [],
                'features_ar' => $service->features_ar ?? [],
                'dynamic_sections' => $service->dynamic_sections ?? [],
                'packages' => $service->packages ?? [],
                'packages_ar' => $service->packages_ar ?? [],
                'faq' => $service->faq ?? [],
                'faq_ar' => $service->faq_ar ?? [],
                'updated_at' => $service->updated_at,
                'freelancer' => array_merge($baseData['freelancer'], [
                    'location' => $freelancer->location ?? 'Khartoum, Sudan',
                    'memberSince' => $service->user->created_at->format('Y'),
                    'verificationStatus' => $freelancer->is_verified ? 'verified' : 'unverified',
                    'bio' => $freelancer->bio ?? '',
                    'languages' => $freelancer->languages ?? ['Arabic', 'English'],
                    'education' => $freelancer->education ?? '',
                    'certifications' => $freelancer->certifications ?? [],
                    'email' => $service->user->email,
                    'phone' => $service->user->phone,
                    'website' => $freelancer->website ?? '',
                    'linkedin' => $freelancer->social_links['linkedin'] ?? '',
                    'twitter' => $freelancer->social_links['twitter'] ?? '',
                    'instagram' => $freelancer->social_links['instagram'] ?? '',
                    'facebook' => $freelancer->social_links['facebook'] ?? '',
                ]),
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
                }) ?? []
            ];

            return array_merge($baseData, $additionalData);
        }

        return $baseData;
    }

    protected function buildRelevanceScoreSQL(array $terms, string $language): string
    {
        if (empty($terms)) {
            return '0 AS relevance_score';
        }

        $scoreParts = [];
        
        // Text match scoring
        foreach ($terms as $term) {
            $term = addslashes($term);
            
            // Title matches (highest weight)
            $scoreParts[] = "IF(services.title LIKE '%{$term}%', 40, 0)";
            $scoreParts[] = "IF(services.title_ar LIKE '%{$term}%', 40, 0)";
            
            // Description matches
            $scoreParts[] = "IF(services.description LIKE '%{$term}%', 20, 0)";
            $scoreParts[] = "IF(services.description_ar LIKE '%{$term}%', 20, 0)";
            
            // Tags/features matches
            $scoreParts[] = "IF(JSON_CONTAINS(services.tags, '\"$term\"'), 25, 0)";
            $scoreParts[] = "IF(JSON_CONTAINS(services.tags_ar, '\"$term\"'), 25, 0)";
            $scoreParts[] = "IF(JSON_CONTAINS(services.features, '\"$term\"'), 15, 0)";
            $scoreParts[] = "IF(JSON_CONTAINS(services.features_ar, '\"$term\"'), 15, 0)";
            
            // Detailed description (lower weight)
            $scoreParts[] = "IF(services.detailed_description LIKE '%{$term}%', 10, 0)";
            $scoreParts[] = "IF(services.detailed_description_ar LIKE '%{$term}%', 10, 0)";
            
            // Freelancer skills and bio
            $scoreParts[] = "IF(EXISTS (
                SELECT 1 FROM freelancer_profiles fp 
                WHERE fp.user_id = services.user_id 
                AND (
                    fp.bio LIKE '%{$term}%' OR 
                    fp.bio_ar LIKE '%{$term}%' OR 
                    JSON_CONTAINS(fp.skills, '\"$term\"')
                )
            ), 15, 0)";
        }
        
        // Bilingual bonus (extra points for services with both languages)
        $scoreParts[] = "IF(services.title IS NOT NULL AND services.title_ar IS NOT NULL, 15, 0)";
        
        // Popularity/featured boosts
        $scoreParts[] = "IF(services.is_popular = 1, 30, 0)";
        $scoreParts[] = "IF(services.is_featured = 1, 25, 0)";
        
        // Order volume boost (logarithmic scale to prevent domination)
        $scoreParts[] = "LEAST(LOG(IFNULL(services.orders, 1) * 8, 40)";
        
        // Rating boost (service and freelancer)
        $scoreParts[] = "(SELECT IFNULL(AVG(r.rating), 0) * 10 FROM reviews r 
                        JOIN orders o ON r.order_id = o.id 
                        WHERE o.service_id = services.id)";
        
        // Freelancer rating and success metrics
        $scoreParts[] = "(SELECT fp.average_rating * 5 FROM freelancer_profiles fp 
                         WHERE fp.user_id = services.user_id)";
        $scoreParts[] = "(SELECT fp.success_rate * 0.8 FROM freelancer_profiles fp 
                         WHERE fp.user_id = services.user_id)";
        
        return implode(' + ', $scoreParts) . ' AS relevance_score';
    }

    protected function normalizeArabic(string $text): string
    {
        $replacements = [
            'أ' => 'ا', 'إ' => 'ا', 'آ' => 'ا', 'ة' => 'ه',
            'ى' => 'ي', 'ؤ' => 'ء', 'ئ' => 'ء', 'ٱ' => 'ا',
            // Normalize different forms of letters
            'ك' => 'ک', 'ڪ' => 'ک', 'ګ' => 'ک', // Persian/Arabic kaf
            'ی' => 'ي', // Persian yeh to Arabic yeh
        ];
        
        return strtr($text, $replacements);
    }
}