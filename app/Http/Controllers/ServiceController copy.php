<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order; // Added this import for Order model

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        // Get all services with freelancer information
        $services = Service::with(['user.freelancerProfile'])
            ->get()
            ->map(function ($service) {

                return [
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
                        'onTimeDelivery' => '99%', // This will be calculated dynamically in show method
                        'repeatClients' => '85%' // This will be calculated dynamically in show method
                    ],
                    'reviews' => $service->reviews ?? []
                ];
            });


        // Extract unique categories and subcategories
        $categories = $services->pluck('category')->filter()->unique()->values()->toArray();
        $subcategories = $services->pluck('subcategory')->filter()->unique()->values()->toArray();

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
