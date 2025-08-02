<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderNotificationMail;
use App\Mail\OrderStatusUpdatedMail;
use App\Mail\OrderDeliveredMail;
use App\Mail\NewOrderMessageMail;
use App\Mail\FreelancerReviewReceivedMail;
use App\Mail\ServiceStatusMail;
use App\Mail\PayoutProcessedMail;
use App\Mail\ContactFormMail;
use App\Mail\NewServiceSubmissionMail;
use App\Models\Order;
use App\Models\Service;
use App\Models\Review;
use App\Models\PayoutRequest;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailNotificationController extends Controller
{
    /**
     * Example method for order creation with email notifications
     */
    public function createOrderWithNotifications(Request $request)
    {
        // Create the order (your existing logic)
        $order = Order::create($request->validated());
        
        // Send notification to freelancer
        Mail::to($order->freelancer->email)
            ->queue(new NewOrderNotificationMail($order, 'freelancer'));
        
        // Send notification to admin for payment verification
        Mail::to(config('mail.admin_email', 'admin@yourdomain.com'))
            ->queue(new NewOrderNotificationMail($order, 'admin'));
        
        return response()->json(['message' => 'Order created and notifications sent']);
    }
    
    /**
     * Example method for order status updates
     */
    public function updateOrderStatusWithNotification(Request $request, Order $order)
    {
        $previousStatus = $order->status;
        
        // Update order status (your existing logic)
        $order->update(['status' => $request->status]);
        
        // Send status update notification to client
        Mail::to($order->client->email)
            ->queue(new OrderStatusUpdatedMail($order, $previousStatus));
        
        return response()->json(['message' => 'Order status updated and notification sent']);
    }
    
    /**
     * Example method for order delivery
     */
    public function deliverOrderWithNotification(Request $request, Order $order)
    {
        // Mark order as delivered (your existing logic)
        $order->markDelivered();
        
        // Send delivery notification to client
        Mail::to($order->client->email)
            ->queue(new OrderDeliveredMail($order, $request->delivery_message));
        
        return response()->json(['message' => 'Order delivered and notification sent']);
    }
    
    /**
     * Example method for new order messages
     */
    public function sendOrderMessageWithNotification(Request $request, Order $order)
    {
        // Create the message (your existing logic)
        $message = $order->messages()->create([
            'sender_id' => auth()->id(),
            'content' => $request->content,
        ]);
        
        // Determine recipient
        $recipient = auth()->id() === $order->client_id 
            ? $order->freelancer 
            : $order->client;
        
        // Send notification
        Mail::to($recipient->email)
            ->queue(new NewOrderMessageMail($order, $message, auth()->user()));
        
        return response()->json(['message' => 'Message sent and notification delivered']);
    }
    
    /**
     * Example method for review submission
     */
    public function submitReviewWithNotification(Request $request, Order $order)
    {
        // Create the review (your existing logic)
        $review = $order->reviews()->create([
            'client_id' => auth()->id(),
            'freelancer_id' => $order->freelancer_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
        
        // Send notification to freelancer
        Mail::to($order->freelancer->email)
            ->queue(new FreelancerReviewReceivedMail($review));
        
        return response()->json(['message' => 'Review submitted and notification sent']);
    }
    
    /**
     * Example method for service approval/rejection
     */
    public function updateServiceStatusWithNotification(Request $request, Service $service)
    {
        // Update service status (your existing logic)
        $service->update(['is_active' => $request->status === 'approved']);
        
        // Send notification to freelancer
        Mail::to($service->user->email)
            ->queue(new ServiceStatusMail($service, $request->status, $request->reason));
        
        return response()->json(['message' => 'Service status updated and notification sent']);
    }
    
    /**
     * Example method for payout processing
     */
    public function processPayoutWithNotification(PayoutRequest $payoutRequest)
    {
        // Process payout (your existing logic)
        $payoutRequest->update([
            'status' => 'processed',
            'processed_at' => now(),
        ]);
        
        // Send notification to freelancer
        Mail::to($payoutRequest->user->email)
            ->queue(new PayoutProcessedMail($payoutRequest));
        
        return response()->json(['message' => 'Payout processed and notification sent']);
    }
    
    /**
     * Example method for contact form submission
     */
    public function submitContactFormWithNotification(Request $request)
    {
        $contactData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);
        
        // Send notification to admin
        Mail::to(config('mail.admin_email', 'admin@yourdomain.com'))
            ->queue(new ContactFormMail($contactData));
        
        return response()->json(['message' => 'Contact form submitted and admin notified']);
    }
    
    /**
     * Example method for new service submission
     */
    public function createServiceWithNotification(Request $request)
    {
        // Create the service (your existing logic)
        $service = auth()->user()->services()->create($request->validated());
        
        // Send notification to admin
        Mail::to(config('mail.admin_email', 'admin@yourdomain.com'))
            ->queue(new NewServiceSubmissionMail($service));
        
        return response()->json(['message' => 'Service created and admin notified']);
    }
    
    /**
     * Helper method to get admin email
     */
    private function getAdminEmail()
    {
        return config('mail.admin_email', 'admin@yourdomain.com');
    }
    
    /**
     * Helper method to send email with error handling
     */
    private function sendEmailSafely($emailClass, $recipient, $data = [])
    {
        try {
            Mail::to($recipient)->queue($emailClass);
            return true;
        } catch (\Exception $e) {
            \Log::error('Email sending failed: ' . $e->getMessage(), [
                'email_class' => get_class($emailClass),
                'recipient' => $recipient,
                'data' => $data
            ]);
            return false;
        }
    }
} 