<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreFreelancerServiceRequest;
use App\Http\Requests\UpdateFreelancerServiceRequest;
use App\Models\Review;
use Illuminate\Database\QueryException;
use Inertia\Inertia;

class FreelancerServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('user_id', Auth::id())
            ->withCount('orders') // This adds orders_count to each service
            ->get()
            ->map(function ($service) {
                // Use the relationship method with parentheses to get the collection
                $reviews = Review::where('freelancer_id', $service->user_id)->get(); // Gets every review in the database

                $allReviews = $reviews;

                $rating = $allReviews->count() > 0 ? round($allReviews->avg('rating'), 2) : null;
                $reviewsCount = $allReviews->count();

                $serviceArray = $service->toArray();
                $serviceArray['rating'] = $rating;
                $serviceArray['reviews_count'] = $reviewsCount;
                $serviceArray['orders_count'] = $service->orders_count; // <-- Add this


                return $serviceArray;
            });

        return Inertia::render('Freelancers/Services', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return Inertia::render('Freelancers/ServiceCreate');
    }

    public function store(StoreFreelancerServiceRequest $request)
    {
        $data = $request->validated();
        $data['is_active'] = false; // 👈 القيمة الافتراضية
        $data['user_id'] = Auth::id();
        $service = Service::create($data);
        return redirect()->route('freelancer.services.index')->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        $this->authorize('update', $service);
        return Inertia::render('Freelancers/ServiceEdit', [
            'service' => $service,
        ]);
    }

    public function update(UpdateFreelancerServiceRequest $request, Service $service)
    {
        $this->authorize('update', $service);
        $service->update($request->validated());
        return redirect()->route('freelancer.services.index')->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $this->authorize('delete', $service);

        try {
            $service->delete();

            $locale = app()->getLocale();
            $successMessage = $locale === 'ar'
                ? 'تم حذف الخدمة بنجاح!'
                : 'Service deleted successfully.';

            return redirect()->route('freelancer.services.index')->with('success', $successMessage);
        } catch (QueryException $e) {
            // Check if it's a foreign key constraint violation
            if ($e->getCode() == 23000 && str_contains($e->getMessage(), 'wallet_transactions')) {
                $locale = app()->getLocale();
                $errorMessage = $locale === 'ar'
                    ? 'لا يمكن حذف الخدمة لأنها مرتبطة بطلبات مدفوعة. يرجى إلغاء الطلبات أولاً.'
                    : 'Cannot delete service because it has associated paid orders. Please cancel the orders first.';

                return back()->withErrors(['delete_error' => $errorMessage]);
            }

            // Generic error for other database issues
            $locale = app()->getLocale();
            $errorMessage = $locale === 'ar'
                ? 'حدث خطأ أثناء حذف الخدمة. يرجى المحاولة مرة أخرى.'
                : 'An error occurred while deleting the service. Please try again.';

            return back()->withErrors(['delete_error' => $errorMessage]);
        }
    }
}
