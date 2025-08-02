<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PayoutRequest;
use App\Models\User;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\PayoutProcessedMail;
use App\Mail\OrderStatusUpdatedMail;


class AdminPaymentController extends Controller
{
    /**
     * Display a listing of payments with advanced filtering and management
     */
    public function index(Request $request)
    {
        $query = Order::with(['service', 'client', 'freelancer'])
            ->withCount(['messages', 'reviews']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('transaction_ref', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($clientQuery) use ($search) {
                        $clientQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('freelancer', function ($freelancerQuery) use ($search) {
                        $freelancerQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('service', function ($serviceQuery) use ($search) {
                        $serviceQuery->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by payment status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by order status
        if ($request->filled('order_status')) {
            $query->where('status', $request->order_status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by amount range
        if ($request->filled('amount_min')) {
            $query->where('total_amount', '>=', $request->amount_min * 100); // Convert to cents
        }
        if ($request->filled('amount_max')) {
            $query->where('total_amount', '<=', $request->amount_max * 100); // Convert to cents
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'order_number':
                $query->orderBy('order_number', $sortOrder);
                break;
            case 'total_amount':
                $query->orderBy('total_amount', $sortOrder);
                break;
            case 'payment_status':
                $query->orderBy('payment_status', $sortOrder);
                break;
            case 'status':
                $query->orderBy('status', $sortOrder);
                break;
            case 'created_at':
                $query->orderBy('created_at', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $orders = $query->paginate($perPage)->withQueryString();

        // Append payment proof URL to each order
        $orders->getCollection()->transform(function ($order) {
            $order->append('payment_proof_url');
            return $order;
        });

        // Get comprehensive statistics
        $stats = $this->getPaymentStatistics();

        // Get filter options
        $filterOptions = $this->getFilterOptions();

        return Inertia::render('Admin/Payments/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'payment_status' => $request->payment_status,
                'order_status' => $request->order_status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'amount_min' => $request->amount_min,
                'amount_max' => $request->amount_max,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Approve payment and update order status
     */
    public function approve(Request $request, Order $order)
    {
        try {
            // Validate order can be approved
            if ($order->payment_status === 'verified') {
                return back()->withErrors(['error' => 'Payment is already verified.']);
            }

            if ($order->status === 'cancelled') {
                return back()->withErrors(['error' => 'Cannot approve payment for cancelled order.']);
            }

            if ($order->status === 'completed') {
                return back()->withErrors(['error' => 'Cannot approve payment for completed order.']);
            }

            // dd($order->freelancer->email ,$order->client->email );


            // Notify freelancer
            Mail::to($order->freelancer->email)
                ->queue(new OrderStatusUpdatedMail($order, 'freelancer'));

            // Notify client
            Mail::to($order->client->email)
                ->queue(new OrderStatusUpdatedMail($order, 'client'));


            // Update order status
            $order->markPaymentVerified();

            // Log the action (using Laravel's built-in logging)
            Log::info('Payment approved by admin', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'admin_id' => Auth::id(),
                'admin_name' => Auth::user()->name ?? 'Unknown',
                'action' => 'payment_approved'
            ]);

            return back()->with('success', 'Payment approved successfully. Order is now in progress.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to approve payment. Please try again.']);
        }
    }

    /**
     * Reject payment and cancel order
     */
    public function reject(Request $request, Order $order)
    {
        try {
            // Validate order can be rejected
            if ($order->status === 'cancelled') {
                return back()->withErrors(['error' => 'Order is already cancelled.']);
            }

            if ($order->status === 'completed') {
                return back()->withErrors(['error' => 'Cannot reject payment for completed order.']);
            }

            if ($order->payment_status === 'verified') {
                return back()->withErrors(['error' => 'Cannot reject already verified payment.']);
            }

            // Update order status
            $order->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            // In your reject method, modify the email sending part:
            $order->load(['service', 'freelancer', 'client']);

            // Notify freelancer
            Mail::to($order->freelancer->email)
                ->queue(new OrderStatusUpdatedMail($order, 'freelancer'));

            // Notify client
            Mail::to($order->client->email)
                ->queue(new OrderStatusUpdatedMail($order, 'client'));

            // Log the action (using Laravel's built-in logging)
            Log::info('Payment rejected by admin', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'admin_id' => Auth::id(),
                'admin_name' => Auth::user()->name ?? 'Unknown',
                'action' => 'payment_rejected'
            ]);

            return back()->with('success', 'Payment rejected and order cancelled successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to reject payment. Please try again.']);
        }
    }

    /**
     * Bulk approve payments
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        $orders = Order::whereIn('id', $request->order_ids)
            ->where('payment_status', '!=', 'verified')
            ->where('status', '!=', 'cancelled');

        $approvedCount = 0;
        $errors = [];

        foreach ($orders->get() as $order) {
            try {
                $order->markPaymentVerified();
                $approvedCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to approve order #{$order->order_number}";
            }
        }

        $message = "Successfully approved {$approvedCount} payments.";
        if (!empty($errors)) {
            $message .= " Errors: " . implode(', ', $errors);
        }

        return back()->with('success', $message);
    }

    /**
     * Bulk reject payments
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        $orders = Order::whereIn('id', $request->order_ids)
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'completed');

        $rejectedCount = 0;
        $errors = [];

        foreach ($orders->get() as $order) {
            try {
                $order->update([
                    'payment_status' => 'failed',
                    'status' => 'cancelled',
                    'cancelled_at' => now(),
                ]);
                $rejectedCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to reject order #{$order->order_number}";
            }
        }

        $message = "Successfully rejected {$rejectedCount} payments.";
        if (!empty($errors)) {
            $message .= " Errors: " . implode(', ', $errors);
        }

        return back()->with('success', $message);
    }

    /**
     * Get payment statistics
     */
    private function getPaymentStatistics()
    {
        $now = Carbon::now();
        $startOfMonth = $now->startOfMonth();
        $startOfWeek = $now->startOfWeek();

        return [
            'total_orders' => Order::count(),
            'pending_payments' => Order::where('payment_status', 'pending')->count(),
            'verified_payments' => Order::where('payment_status', 'verified')->count(),
            'failed_payments' => Order::where('payment_status', 'failed')->count(),
            'total_revenue' => Order::where('payment_status', 'verified')->sum('total_amount'),
            'monthly_revenue' => Order::where('payment_status', 'verified')
                ->whereMonth('created_at', $now->month)
                ->sum('total_amount'),
            'weekly_revenue' => Order::where('payment_status', 'verified')
                ->whereBetween('created_at', [$startOfWeek, $now])
                ->sum('total_amount'),
            'pending_amount' => Order::where('payment_status', 'pending')->sum('total_amount'),
            'completed_orders' => Order::where('status', 'completed')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'avg_order_value' => Order::where('payment_status', 'verified')->avg('total_amount'),
        ];
    }

    /**
     * Get filter options for the frontend
     */
    private function getFilterOptions()
    {
        return [
            'payment_statuses' => [
                'pending' => 'Pending',
                'verified' => 'Verified',
                'failed' => 'Failed',
            ],
            'order_statuses' => [
                'pending' => 'Pending',
                'payment_verified' => 'Payment Verified',
                'in_progress' => 'In Progress',
                'review' => 'In Review',
                'completed' => 'Completed',
                'cancelled' => 'Cancelled',
                'delivered' => 'Delivered',
                'revision_requested' => 'Revision Requested',
            ],
        ];
    }

    /**
     * Export payments data
     */
    public function export(Request $request)
    {
        $query = Order::with(['service', 'client', 'freelancer']);

        // Apply filters
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->get();

        // Generate CSV
        $filename = 'payments_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'Order Number',
                'Client',
                'Freelancer',
                'Service',
                'Amount',
                'Payment Status',
                'Order Status',
                'Created Date',
                'Payment Verified Date',
            ]);

            // CSV data
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->order_number,
                    $order->client->name ?? 'N/A',
                    $order->freelancer->name ?? 'N/A',
                    $order->service->title ?? 'N/A',
                    $order->total_amount / 100, // Convert from cents
                    $order->payment_status,
                    $order->status,
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->payment_verified_at?->format('Y-m-d H:i:s') ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function processPayout(Request $request, $payoutRequestId)
    {
        $payoutRequest = PayoutRequest::findOrFail($payoutRequestId);
        $payoutRequest->update([
            'status' => 'processed',
            'processed_at' => now(),
        ]);
        // Notify freelancer
        Mail::to($payoutRequest->user->email)->queue(new PayoutProcessedMail($payoutRequest));
        return back()->with('success', 'Payout processed successfully');
    }
}
