<?php

namespace App\Http\Controllers;

use App\Mail\ServiceStatusMail;
use App\Models\Service;
use App\Models\User;
use App\Models\FreelancerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class AdminServiceController extends Controller
{
    /**
     * Display a listing of services with admin management features
     */
    public function index(Request $request)
    {
        $query = Service::with(['user', 'orders'])
            ->withCount(['orders']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('title_ar', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('description_ar', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            switch ($request->status) {
                case 'active':
                    $query->where('is_active', true);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'featured':
                    $query->where('is_featured', true);
                    break;
                case 'popular':
                    $query->where('is_popular', true);
                    break;
            }
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by language
        if ($request->filled('language')) {
            switch ($request->language) {
                case 'arabic':
                    $query->whereNotNull('title_ar');
                    break;
                case 'english':
                    $query->whereNull('title_ar');
                    break;
                case 'both':
                    $query->whereNotNull('title_ar')->whereNotNull('title');
                    break;
            }
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'title':
                $query->orderBy('title', $sortOrder);
                break;
            case 'price':
                $query->orderBy('price', $sortOrder);
                break;
            case 'orders':
                $query->orderBy('orders_count', $sortOrder);
                break;
            case 'created_at':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'updated_at':
                $query->orderBy('updated_at', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        // $services = $query->paginate(15)->withQueryString();
        $services = $query->get();

        // Get statistics
        $stats = [
            'total_services' => Service::count(),
            'active_services' => Service::where('is_active', true)->count(),
            'featured_services' => Service::where('is_featured', true)->count(),
            'popular_services' => Service::where('is_popular', true)->count(),
            'total_orders' => DB::table('orders')->count(),
            'total_revenue' => DB::table('orders')->where('status', 'completed')->sum('total_amount'),
            'services_this_month' => Service::whereMonth('created_at', Carbon::now()->month)->count(),
            'services_this_week' => Service::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
        ];

        // Get categories for filter
        $categories = Service::distinct()->pluck('category')->filter()->values();

        // Get freelancers for filter
        $freelancers = User::whereHas('freelancerProfile')
            ->with('freelancerProfile')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $user->freelancerProfile->title ?? 'Freelancer'
                ];
            });

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'category' => $request->category,
                'language' => $request->language,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
            'categories' => $categories,
            'freelancers' => $freelancers,
        ]);
    }

    /**
     * Show the form for creating a new service
     */
    public function create()
    {
        $freelancers = User::whereHas('freelancerProfile')
            ->with('freelancerProfile')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $user->freelancerProfile->title ?? 'Freelancer'
                ];
            });

        return Inertia::render('Admin/Services/Create', [
            'freelancers' => $freelancers,
        ]);
    }

    /**
     * Store a newly created service
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_ar' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'delivery_time' => 'required|string|max:100',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'features' => 'nullable|array',
            'packages' => 'nullable|array',
            'faq' => 'nullable|array',
        ]);

        $service = Service::create($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    /**
     * Display the specified service
     */
    public function show(Service $service)
    {
        $service->load(['user.freelancerProfile', 'orders.client']);

        return Inertia::render('Admin/Services/Show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified service
     */
    public function edit(Service $service)
    {
        $service->load('user.freelancerProfile');

        $freelancers = User::whereHas('freelancerProfile')
            ->with('freelancerProfile')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'title' => $user->freelancerProfile->title ?? 'Freelancer'
                ];
            });

        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
            'freelancers' => $freelancers,
        ]);
    }

    /**
     * Update the specified service
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_ar' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'delivery_time' => 'required|string|max:100',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'features' => 'nullable|array',
            'packages' => 'nullable|array',
            'faq' => 'nullable|array',
        ]);

        $service->update($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified service
     */
    public function destroy(Service $service)
    {
        // Check if service has orders
        if ($service->orders()->count() > 0) {
            return back()->withErrors(['delete_error' => 'Cannot delete service with existing orders.']);
        }

        $service->delete();

        return back()->with('success', 'Service deleted successfully.');
    }

    /**
     * Toggle service status (active/inactive)
     */
    public function toggleStatus(Service $service)
    {
        $service->update(['is_active' => !$service->is_active]);

        // Notify freelancer
        $status = $service->is_active ? 'approved' : 'rejected';

    
        Mail::to($service->user->email)
            ->queue(new ServiceStatusMail($service, $status));

        return back()->with('success', 'Service status updated successfully.');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(Service $service)
    {
        $service->update(['is_featured' => !$service->is_featured]);

        return back()->with('success', 'Service featured status updated successfully.');
    }

    /**
     * Toggle popular status
     */
    public function togglePopular(Service $service)
    {
        $service->update(['is_popular' => !$service->is_popular]);

        return back()->with('success', 'Service popular status updated successfully.');
    }

    /**
     * Bulk actions for services
     */
    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete,feature,unfeature,popular,unpopular',
            'service_ids' => 'required|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $services = Service::whereIn('id', $validated['service_ids']);

        switch ($validated['action']) {
            case 'activate':
                $services->update(['is_active' => true]);
                $message = 'Services activated successfully.';
                break;
            case 'deactivate':
                $services->update(['is_active' => false]);
                $message = 'Services deactivated successfully.';
                break;
            case 'feature':
                $services->update(['is_featured' => true]);
                $message = 'Services marked as featured successfully.';
                break;
            case 'unfeature':
                $services->update(['is_featured' => false]);
                $message = 'Services unfeatured successfully.';
                break;
            case 'popular':
                $services->update(['is_popular' => true]);
                $message = 'Services marked as popular successfully.';
                break;
            case 'unpopular':
                $services->update(['is_popular' => false]);
                $message = 'Services removed from popular successfully.';
                break;
            case 'delete':
                // Check for orders before deletion
                $servicesWithOrders = $services->whereHas('orders')->count();
                if ($servicesWithOrders > 0) {
                    return back()->withErrors(['delete_error' => 'Some services have orders and cannot be deleted.']);
                }
                $services->delete();
                $message = 'Services deleted successfully.';
                break;
        }

        return back()->with('success', $message);
    }
}
