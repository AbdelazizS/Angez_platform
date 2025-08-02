<?php

namespace App\Console\Commands;

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
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:emails {email} {--type=all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test all email notifications by sending them to a specified email address';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $testEmail = $this->argument('email');
        $type = $this->option('type');
        
        $this->info("Testing email notifications for: {$testEmail}");
        
        // Get sample data
        $sampleData = $this->getSampleData();
        
        if (!$sampleData) {
            $this->error('No sample data found. Please create some orders, services, etc. first.');
            return 1;
        }
        
        $emailsToTest = $this->getEmailsToTest($type);
        
        foreach ($emailsToTest as $emailType => $callback) {
            $this->info("Testing {$emailType}...");
            
            try {
                $callback($testEmail, $sampleData);
                $this->info("✓ {$emailType} sent successfully");
            } catch (\Exception $e) {
                $this->error("✗ {$emailType} failed: " . $e->getMessage());
            }
        }
        
        $this->info("\nEmail testing completed!");
        return 0;
    }
    
    /**
     * Get sample data for testing
     */
    private function getSampleData()
    {
        $order = Order::with(['client', 'freelancer', 'service'])->first();
        $service = Service::with('user')->first();
        $review = Review::with(['client', 'freelancer', 'order'])->first();
        $payoutRequest = PayoutRequest::with('user')->first();
        $message = Message::with(['sender', 'order'])->first();
        
        if (!$order) {
            $this->error('No orders found. Please create an order first.');
            return null;
        }
        
        if (!$service) {
            $this->error('No services found. Please create a service first.');
            return null;
        }
        
        return [
            'order' => $order,
            'service' => $service,
            'review' => $review,
            'payoutRequest' => $payoutRequest,
            'message' => $message,
        ];
    }
    
    /**
     * Get emails to test based on type
     */
    private function getEmailsToTest($type)
    {
        $allEmails = [
            'New Order Notification (Freelancer)' => function($email, $data) {
                Mail::to($email)->send(new NewOrderNotificationMail($data['order'], 'freelancer'));
            },
            'New Order Notification (Admin)' => function($email, $data) {
                Mail::to($email)->send(new NewOrderNotificationMail($data['order'], 'admin'));
            },
            'Order Status Updated' => function($email, $data) {
                Mail::to($email)->send(new OrderStatusUpdatedMail($data['order']));
            },
            'Order Delivered' => function($email, $data) {
                Mail::to($email)->send(new OrderDeliveredMail($data['order'], 'Sample delivery message'));
            },
            'New Order Message' => function($email, $data) {
                if ($data['message']) {
                    Mail::to($email)->send(new NewOrderMessageMail($data['message']->order, $data['message'], $data['message']->sender));
                }
            },
            'Review Received' => function($email, $data) {
                if ($data['review']) {
                    Mail::to($email)->send(new FreelancerReviewReceivedMail($data['review']));
                }
            },
            'Service Approved' => function($email, $data) {
                Mail::to($email)->send(new ServiceStatusMail($data['service'], 'approved'));
            },
            'Service Rejected' => function($email, $data) {
                Mail::to($email)->send(new ServiceStatusMail($data['service'], 'rejected', 'Sample rejection reason'));
            },
            'Payout Processed' => function($email, $data) {
                if ($data['payoutRequest']) {
                    Mail::to($email)->send(new PayoutProcessedMail($data['payoutRequest']));
                }
            },
            'Contact Form Submission' => function($email, $data) {
                $contactData = [
                    'name' => 'Test User',
                    'email' => 'test@example.com',
                    'subject' => 'Test Contact Form',
                    'message' => 'This is a test message from the contact form.',
                ];
                Mail::to($email)->send(new ContactFormMail($contactData));
            },
            'New Service Submission' => function($email, $data) {
                Mail::to($email)->send(new NewServiceSubmissionMail($data['service']));
            },
        ];
        
        if ($type === 'all') {
            return $allEmails;
        }
        
        // Return specific email type if provided
        if (isset($allEmails[$type])) {
            return [$type => $allEmails[$type]];
        }
        
        $this->error("Invalid email type: {$type}");
        $this->info("Available types: " . implode(', ', array_keys($allEmails)));
        return [];
    }
} 