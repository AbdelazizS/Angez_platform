# Email Notification System for Anjez Platform

This document outlines the comprehensive email notification system implemented for the Anjez platform. All emails are queued for better performance and user experience.

## 📧 Email Classes Created

### 1. NewOrderNotificationMail
**Purpose**: Notifies freelancers and admins when a new order is placed
- **To Freelancer**: Congratulations message with order details
- **To Admin**: Payment verification required notification

**Usage**:
```php
// Send to freelancer
Mail::to($order->freelancer->email)
    ->queue(new NewOrderNotificationMail($order, 'freelancer'));

// Send to admin
Mail::to(config('mail.admin_email'))
    ->queue(new NewOrderNotificationMail($order, 'admin'));
```

### 2. OrderStatusUpdatedMail
**Purpose**: Notifies clients when their order status changes
- **Triggers**: Payment verified, in progress, review, delivered, completed, cancelled, revision requested

**Usage**:
```php
$previousStatus = $order->getOriginal('status');
Mail::to($order->client->email)
    ->queue(new OrderStatusUpdatedMail($order, $previousStatus));
```

### 3. OrderDeliveredMail
**Purpose**: Notifies clients when their order is delivered
- **Includes**: Delivery message from freelancer, review request

**Usage**:
```php
Mail::to($order->client->email)
    ->queue(new OrderDeliveredMail($order, $deliveryMessage));
```

### 4. NewOrderMessageMail
**Purpose**: Notifies the other party when a new message is sent in order chat
- **To Client**: When freelancer sends message
- **To Freelancer**: When client sends message

**Usage**:
```php
$recipient = $message->sender_id === $order->client_id 
    ? $order->freelancer 
    : $order->client;

Mail::to($recipient->email)
    ->queue(new NewOrderMessageMail($order, $message, $sender));
```

### 5. FreelancerReviewReceivedMail
**Purpose**: Notifies freelancers when they receive a new review
- **Includes**: Rating, comment, order details

**Usage**:
```php
Mail::to($review->freelancer->email)
    ->queue(new FreelancerReviewReceivedMail($review));
```

### 6. ServiceStatusMail
**Purpose**: Notifies freelancers when their service is approved/rejected
- **Includes**: Approval status, rejection reason (if applicable)

**Usage**:
```php
// For approval
Mail::to($service->user->email)
    ->queue(new ServiceStatusMail($service, 'approved'));

// For rejection
Mail::to($service->user->email)
    ->queue(new ServiceStatusMail($service, 'rejected', $rejectionReason));
```

### 7. PayoutProcessedMail
**Purpose**: Notifies freelancers when their payout is processed
- **Includes**: Amount, transaction details, next steps

**Usage**:
```php
Mail::to($payoutRequest->user->email)
    ->queue(new PayoutProcessedMail($payoutRequest));
```

### 8. ContactFormMail
**Purpose**: Notifies admins when contact form is submitted
- **Includes**: Contact details, message content

**Usage**:
```php
Mail::to(config('mail.admin_email'))
    ->queue(new ContactFormMail($contactData));
```

### 9. NewServiceSubmissionMail
**Purpose**: Notifies admins when a new service is submitted
- **Includes**: Service details, freelancer information

**Usage**:
```php
Mail::to(config('mail.admin_email'))
    ->queue(new NewServiceSubmissionMail($service));
```

## 📁 Email Templates Structure

```
resources/views/emails/
├── orders/
│   ├── new-freelancer.blade.php
│   ├── new-admin.blade.php
│   ├── status-updated.blade.php
│   ├── delivered.blade.php
│   └── new-message.blade.php
├── reviews/
│   └── freelancer-received.blade.php
├── services/
│   ├── status-update.blade.php
│   └── new-submission.blade.php
├── payouts/
│   └── processed.blade.php
└── contact/
    └── new-submission.blade.php
```

## 🚀 Implementation Guide

### 1. Order Creation
When a client places an order:

```php
// In OrderController or wherever orders are created
public function store(Request $request)
{
    $order = Order::create($request->validated());
    
    // Send notification to freelancer
    Mail::to($order->freelancer->email)
        ->queue(new NewOrderNotificationMail($order, 'freelancer'));
    
    // Send notification to admin for payment verification
    Mail::to(config('mail.admin_email'))
        ->queue(new NewOrderNotificationMail($order, 'admin'));
    
    return redirect()->route('orders.confirmation', $order);
}
```

### 2. Order Status Updates
When order status changes:

```php
// In OrderController or admin panel
public function updateStatus(Order $order, Request $request)
{
    $previousStatus = $order->status;
    $order->update(['status' => $request->status]);
    
    // Send status update notification to client
    Mail::to($order->client->email)
        ->queue(new OrderStatusUpdatedMail($order, $previousStatus));
    
    return back()->with('success', 'Order status updated');
}
```

### 3. Order Delivery
When freelancer delivers order:

```php
public function deliver(Order $order, Request $request)
{
    $order->markDelivered();
    
    // Send delivery notification to client
    Mail::to($order->client->email)
        ->queue(new OrderDeliveredMail($order, $request->delivery_message));
    
    return back()->with('success', 'Order delivered successfully');
}
```

### 4. New Messages
When messages are sent in order chat:

```php
public function storeMessage(Request $request, Order $order)
{
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
    
    return response()->json(['message' => 'Message sent']);
}
```

### 5. Reviews
When client submits review:

```php
public function storeReview(Request $request, Order $order)
{
    $review = $order->reviews()->create([
        'client_id' => auth()->id(),
        'freelancer_id' => $order->freelancer_id,
        'rating' => $request->rating,
        'comment' => $request->comment,
    ]);
    
    // Send notification to freelancer
    Mail::to($order->freelancer->email)
        ->queue(new FreelancerReviewReceivedMail($review));
    
    return back()->with('success', 'Review submitted successfully');
}
```

### 6. Service Approval/Rejection
When admin reviews service:

```php
public function updateServiceStatus(Service $service, Request $request)
{
    $service->update(['is_active' => $request->status === 'approved']);
    
    // Send notification to freelancer
    Mail::to($service->user->email)
        ->queue(new ServiceStatusMail($service, $request->status, $request->reason));
    
    return back()->with('success', 'Service status updated');
}
```

### 7. Payout Processing
When admin processes payout:

```php
public function processPayout(PayoutRequest $payoutRequest)
{
    $payoutRequest->update([
        'status' => 'processed',
        'processed_at' => now(),
    ]);
    
    // Send notification to freelancer
    Mail::to($payoutRequest->user->email)
        ->queue(new PayoutProcessedMail($payoutRequest));
    
    return back()->with('success', 'Payout processed successfully');
}
```

### 8. Contact Form
When contact form is submitted:

```php
public function submitContact(Request $request)
{
    $contactData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'subject' => 'required|string|max:255',
        'message' => 'required|string',
    ]);
    
    // Send notification to admin
    Mail::to(config('mail.admin_email'))
        ->queue(new ContactFormMail($contactData));
    
    return back()->with('success', 'Message sent successfully');
}
```

### 9. New Service Submission
When freelancer creates service:

```php
public function storeService(Request $request)
{
    $service = auth()->user()->services()->create($request->validated());
    
    // Send notification to admin
    Mail::to(config('mail.admin_email'))
        ->queue(new NewServiceSubmissionMail($service));
    
    return redirect()->route('freelancer.services.index')
        ->with('success', 'Service submitted for review');
}
```

## ⚙️ Configuration

### 1. Admin Email Configuration
Add admin email to your `.env` file:
```
ADMIN_EMAIL=admin@yourdomain.com
```

And in `config/mail.php`:
```php
'admin_email' => env('ADMIN_EMAIL', 'admin@yourdomain.com'),
```

### 2. Queue Configuration
Make sure your queue is configured properly in `.env`:
```
QUEUE_CONNECTION=database
```

### 3. Mail Configuration
Configure your mail settings in `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

## 🔧 Queue Processing

Run the queue worker to process emails:
```bash
php artisan queue:work
```

For production, use supervisor to keep the queue worker running:
```bash
# Install supervisor
sudo apt-get install supervisor

# Create configuration file
sudo nano /etc/supervisor/conf.d/laravel-worker.conf
```

Add this configuration:
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
```

## 📊 Email Flow Summary

1. **Client places order** → Freelancer + Admin notified
2. **Admin verifies payment** → Client notified of status change
3. **Freelancer updates status** → Client notified
4. **Freelancer delivers order** → Client notified with review request
5. **Client sends message** → Freelancer notified
6. **Freelancer sends message** → Client notified
7. **Client leaves review** → Freelancer notified
8. **Admin approves/rejects service** → Freelancer notified
9. **Admin processes payout** → Freelancer notified
10. **Contact form submitted** → Admin notified
11. **New service submitted** → Admin notified

## 🎨 Email Design Features

- **Responsive Design**: All emails work on mobile and desktop
- **Brand Consistency**: Uses platform colors and styling
- **Clear CTAs**: Action buttons for easy navigation
- **Status Badges**: Color-coded status indicators
- **Professional Layout**: Clean, modern design
- **RTL Support**: Ready for Arabic language support

## 🔍 Testing

Test emails in development:
```php
// In your controller or command
Mail::to('test@example.com')->send(new NewOrderNotificationMail($order, 'freelancer'));
```

Use Laravel's mail preview for testing:
```bash
php artisan vendor:publish --tag=laravel-mail
```

Then visit `/mail-preview` in your browser to see all email templates.

## 📝 Notes

- All emails implement `ShouldQueue` for better performance
- Emails include proper error handling and fallbacks
- Templates use Laravel's mail components for consistency
- All emails are mobile-responsive
- Support for both English and Arabic content
- Proper unsubscribe and footer information included 