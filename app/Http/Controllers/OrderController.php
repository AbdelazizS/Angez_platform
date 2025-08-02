<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderNotificationMail;
use App\Mail\OrderStatusUpdatedMail;
use App\Mail\OrderDeliveredMail;
use App\Mail\FreelancerReviewReceivedMail;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;

use Inertia\Inertia;

class OrderController extends Controller
{
    public function create($serviceId)
    {
        $service = Service::with('user')->findOrFail($serviceId);
        $selectedPackage = request('package');
        $currentLang = app()->getLocale();
        $serviceContent = $this->getServiceContent($service, $currentLang);
        $hasPackages = is_array($serviceContent['packages']) && count($serviceContent['packages']) > 0;
        $packageToSelect = null;
        if ($hasPackages) {
            if ($selectedPackage) {
                $packageToSelect = collect($serviceContent['packages'])->firstWhere('name', $selectedPackage);
            }
            if (!$packageToSelect) {
                $packageToSelect = collect($serviceContent['packages'])->firstWhere('isPopular', true)
                    ?? collect($serviceContent['packages'])->first();
            }
        }
        $frontendService = [
            'id' => $service->id,
            'title' => $serviceContent['title'],
            'description' => $serviceContent['description'],
            'packages' => $serviceContent['packages'],
            'freelancer' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'location' => $service->user->freelancerProfile->location ?? 'Location not specified',
                'rating' => $service->user->freelancerProfile->average_rating ?? 0,
                'totalReviews' => $service->user->freelancerProfile->total_reviews ?? 0,
            ]
        ];
        if (!$hasPackages) {
            $frontendService['price'] = $service->price;
            $frontendService['delivery_time'] = $service->delivery_time;
            $frontendService['revisions'] = $service->revisions;
            $frontendService['features'] = $service->features ?? [];
        }
        return Inertia::render('Services/Order', [
            'service' => $frontendService,
            'selectedPackage' => $packageToSelect,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function store(Request $request, $serviceId)
    {
        $service = Service::with('user')->findOrFail($serviceId);
        $hasPackages = is_array($service->packages) && count($service->packages) > 0;
        if ($hasPackages) {
            $request->validate([
                'package_name' => 'required|string',
                'package_price' => 'required|integer|min:1',
                'requirements' => 'nullable|array',
                'requirements.*' => 'string|max:500',
                'additional_notes' => 'nullable|string|max:1000',
            ]);
            $serviceFee = 0; // No service fee
            $totalAmount = $request->package_price;
            $packageName = $request->package_name;
            $packagePrice = $request->package_price;
            $dueDays = $this->getDeliveryDays($packageName, $service);
        } else {
            $request->validate([
                'requirements' => 'nullable|array',
                'requirements.*' => 'string|max:500',
                'additional_notes' => 'nullable|string|max:1000',
            ]);
            $packageName = 'Standard';
            $packagePrice = $service->price;
            $serviceFee = 0; // No service fee
            $totalAmount = $packagePrice;
            $dueDays = $service->delivery_time ?? 3;
        }
        $order = Order::create([
            'service_id' => $service->id,
            'client_id' => auth()->id(),
            'freelancer_id' => $service->user_id,
            'package_name' => $packageName,
            'package_price' => $packagePrice,
            'service_fee' => $serviceFee,
            'total_amount' => $totalAmount,
            'requirements' => $request->requirements,
            'additional_notes' => $request->additional_notes,
            'payment_method' => 'bank_transfer',
            'due_date' => now()->addDays((int)$dueDays),
        ]);

        // Notify freelancer
        Mail::to($order->freelancer->email)->queue(new NewOrderNotificationMail($order, 'freelancer'));
        // Notify admin
        Mail::to(config('mail.admin_email'))->queue(new NewOrderNotificationMail($order, 'admin'));

        $service->increment('orders');
        return redirect()->route('orders.confirmation', ['orderId' => $order->id]);
    }

    public function confirmation($orderId)
    {
        $order = Order::with(['service', 'freelancer', 'client'])
            ->where('client_id', auth()->id())
            ->findOrFail($orderId);

        $orderData = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'package_name' => $order->package_name,
            'package_price' => $order->package_price,
            'service_fee' => 0, // Always zero
            'total_amount' => $order->package_price, // Always equal to package price
            'requirements' => $order->requirements,
            'additional_notes' => $order->additional_notes,
            'payment_method' => $order->payment_method,
            'transaction_ref' => $order->transaction_ref,
            'payment_screenshot' => $order->payment_screenshot,
            'created_at' => $order->created_at,
            'due_date' => $order->due_date,
            'service' => [
                'id' => $order->service->id,
                'title' => $order->service->title,
                'title_ar' => $order->service->title_ar,
            ],
            'freelancer' => [
                'id' => $order->freelancer->id,
                'name' => $order->freelancer->name,
            ],
            'client' => [
                'id' => $order->client->id,
                'name' => $order->client->name,
            ]
        ];

        return Inertia::render('Orders/Confirmation', [
            'order' => $orderData,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function uploadPayment(Request $request, $orderId)
    {
        $request->validate([
            'transaction_ref' => 'required|string|max:100',
            'payment_screenshot' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $order = Order::where('client_id', auth()->id())
            ->where('id', $orderId)
            ->where('status', 'pending')
            ->findOrFail($orderId);

        // Upload payment screenshot
        $screenshotPath = $request->file('payment_screenshot')->store('payment-proofs', 'public');

        // Update order with payment details
        $order->update([
            'transaction_ref' => $request->transaction_ref,
            'payment_screenshot' => $screenshotPath,
        ]);

        return redirect()->route('orders.confirmation', ['orderId' => $order->id])
            ->with('success', 'Payment proof uploaded successfully. We will verify it within 24 hours.');
    }

    public function verifyPayment(Request $request, $orderId)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string|max:500',
        ]);

        $order = Order::findOrFail($orderId);
        
        // Check if user is admin or the freelancer
        if (!auth()->user()->hasRole('admin') && auth()->id() !== $order->freelancer_id) {
            abort(403);
        }

        if ($request->action === 'approve') {
            $order->markPaymentVerified();
            $message = 'Payment verified successfully. Order is now in progress.';
        } else {
            $order->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);
            $message = 'Payment rejected. Order has been cancelled.';
        }

        return back()->with('success', $message);
    }

    public function updateStatus(Request $request, $orderId)
    {

        $request->validate([
            'status' => 'required|in:in_progress,review,completed,cancelled',
        ]);
        

        $order = Order::findOrFail($orderId);
        $user = auth()->user();


        // Client: allow review -> in_progress (request revision)
        if ($user->hasRole('client') && $order->status === 'review' && $request->status === 'in_progress') {
            $order->status = 'in_progress';
            $order->save();
            // Optionally: add system message to chat
            return back()->with('success', 'Revision requested. Order is now in progress.');
        }

        // Freelancer/admin logic as before
        if (!$user->hasRole('admin') && $user->id !== $order->freelancer_id) {
            abort(403);
        }

        switch ($request->status) {
            case 'in_progress':
                $order->markInProgress();
                break;
            case 'review':
                $order->markInReview();
                break;
            case 'completed':
                $order->markCompleted();
                break;
            case 'cancelled':
                $order->markCancelled();
                break;
        }

        // Notify client

        Mail::to($order->client->email)
        ->queue(new OrderStatusUpdatedMail($order, 'client'));

        return back()->with('success', 'Order status updated successfully.');
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Order::with(['service', 'freelancer', 'client']);

        // Filter by user role
        if ($user->hasRole('freelancer')) {
            $query->where('freelancer_id', $user->id);
        } else {
            $query->where('client_id', $user->id);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->latest()->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status']),
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    public function show($orderId)
    {
        $user = auth()->user();
        $order = Order::with(['service', 'freelancer', 'client', 'reviews'])
            ->where(function ($query) use ($user) {
                $query->where('client_id', $user->id)
                      ->orWhere('freelancer_id', $user->id);
            })
            ->findOrFail($orderId);

        // Review logic
        $review = $order->reviews()->where('client_id', $order->client_id)->first();
        dd( $review);
        $can_review = $user->can('create', [\App\Models\Review::class, $order]);
        $waiting_review = $user->hasRole('freelancer') && !$review && $order->status === 'review' && $order->payment_status === 'verified';
        $can_chat = !in_array($order->status, ['completed', 'cancelled']) && $order->payment_status !== 'failed';

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'review' => $review,
            'can_review' => $can_review,
            'waiting_review' => $waiting_review,
            'can_chat' => $can_chat,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    public function confirmCompletion(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        // Only allow clients to confirm completion
        if (auth()->id() !== $order->client_id) {
            abort(403, 'Only the client can confirm order completion.');
        }

        // Check if order is in review status
        if ($order->status !== 'review') {
            abort(400, 'Order must be in review status to confirm completion.');
        }

        // Check if payment is verified
        if ($order->payment_status !== 'verified') {
            abort(400, 'Payment must be verified before confirming completion.');
        }

        Mail::to($order->client->email)
        ->queue(new OrderStatusUpdatedMail($order, 'freelancer'));
        
        
        Mail::to($order->client->email)
        ->queue(new OrderStatusUpdatedMail($order, 'admin'));


        // Mark client as confirmed
        $order->update(['client_confirmed' => true]);

        // Mark order as completed (this will handle wallet logic)
        $order->markCompleted();

        return back()->with('success', 'Order completed successfully. Payment has been released to the freelancer.');
    }

    public function requestRevision(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);

        $this->authorize('view', $order);

        // Only allow clients to request revision
        if (auth()->id() !== $order->client_id) {
            abort(403, 'Only the client can request revision.');
        }

        // Check if order is in review status
        if ($order->status !== 'review') {
            abort(400, 'Order must be in review status to request revision.');
        }

        // Mark order as in progress (revision requested)
        $order->markInProgress();

        return back()->with('success', 'Revision requested. Order is now in progress.');
    }

    public function deliverWork(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);


        $this->authorize('view', $order);

        // Only allow freelancers to deliver work
        if (auth()->id() !== $order->freelancer_id) {
            abort(403, 'Only the freelancer can deliver work.');
        }

        // Check if order is in progress
        if ($order->status !== 'in_progress') {
            abort(400, 'Order must be in progress to deliver work.');
        }

        // Mark order as in review
        $order->markInReview();

        // Notify client
        Mail::to($order->client->email)->queue(new OrderDeliveredMail($order, $request->delivery_message));

        return back()->with('success', 'Work delivered successfully. Waiting for client review.');
    }

    private function getDeliveryDays($packageName, $service)
    {
        $packages = $service->packages ?? [];
        if (is_array($packages) && count($packages) > 0) {
        foreach ($packages as $package) {
            if ($package['name'] === $packageName) {
                $deliveryTime = $package['deliveryTime'] ?? $package['delivery_time'] ?? $package['delivery'] ?? '3 days';
                preg_match('/(\d+)/', $deliveryTime, $matches);
                return $matches[1] ?? 3;
                }
            }
        }
        // If no packages, fallback to service delivery_time
        return $service->delivery_time ?? 3;
    }

    private function getServiceContent($service, $language = 'en')
    {
        if ($language === 'ar') {
            return [
                'title' => $service->title_ar ?? $service->title,
                'description' => $service->description_ar ?? $service->description,
                'packages' => $service->packages_ar ?? $service->packages ?? [],
            ];
        }
        
        return [
            'title' => $service->title,
            'description' => $service->description,
            'packages' => $service->packages ?? [],
        ];
    }
} 