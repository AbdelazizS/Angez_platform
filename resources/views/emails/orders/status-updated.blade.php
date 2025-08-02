<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Order Status Updated</title>
</head>
@php
    // Define status colors, messages, and descriptions
        $statusColors = [
            'payment_verified' => ['bg' => '#ECFDF5', 'text' => '#065F46'],
            'in_progress' => ['bg' => '#F0F9FF', 'text' => '#0C4A6E'],
            'review' => ['bg' => '#FEF3C7', 'text' => '#92400E'],
            'delivered' => ['bg' => '#F0FDF4', 'text' => '#166534'],
            'completed' => ['bg' => '#ECFDF5', 'text' => '#065F46'],
            'cancelled' => ['bg' => '#FEF2F2', 'text' => '#991B1B'],
            'revision_requested' => ['bg' => '#FFF7ED', 'text' => '#9A3412'],
        ];
    
    // Base status messages
    $baseStatusMessages = [
            'payment_verified' => 'Payment Verified - Order Started',
            'in_progress' => 'Order In Progress',
            'review' => 'Order Under Review',
            'delivered' => 'Order Delivered',
            'completed' => 'Order Completed',
            'cancelled' => 'Order Cancelled',
            'revision_requested' => 'Revision Requested',
        ];
    
    // Recipient-specific messages
    $statusMessages = [
        'client' => $baseStatusMessages,
        'freelancer' => array_merge($baseStatusMessages, [
            'delivered' => 'You Delivered the Order',
            'completed' => 'Client Accepted Delivery',
        ]),
        'admin' => array_merge($baseStatusMessages, [
            'completed' => 'Order Completed - Verification Needed',
        ])
    ];
    
    // Recipient-specific descriptions
        $statusDescriptions = [
        'client' => [
            'payment_verified' => 'Great news! Your payment has been verified and the freelancer has started working.',
            'in_progress' => 'Your order is now in progress. The freelancer is actively working on your project.',
            'review' => 'The freelancer has completed your order! Please review the work and provide your feedback.',
            'delivered' => 'Your order has been delivered! Please review the work and provide feedback.',
            'completed' => 'Your order has been completed successfully. Thank you for using our platform!',
            'cancelled' => 'Your order has been cancelled. If you have questions, please contact support.',
            'revision_requested' => 'A revision has been requested for your order. Please review the feedback.',
        ],
        'freelancer' => [
            'payment_verified' => 'Payment verified! You can now start working on this order.',
            'in_progress' => 'You are currently working on this order.',
            'review' => 'You have submitted the work to the client. Waiting for their review and approval.',

            'delivered' => 'You have successfully delivered this order to the client.',
            'completed' => 'The client has accepted your delivery. Payment will be processed soon.',
            'cancelled' => 'This order has been cancelled.',
            'revision_requested' => 'The client has requested revisions.',
        ],
        'admin' => [
            'completed' => 'Order #'.$order->order_number.' has been marked as completed. Please verify and process any necessary payouts.',
        ]
    ];
    
    // Set colors and messages based on recipient and status
    $colors = $statusColors[$order->status] ?? ['bg' => '#F8FAFC', 'text' => '#475569'];
    $message = $statusMessages[$recipientType][$order->status] ?? 'Status Updated';
    $description = $statusDescriptions[$recipientType][$order->status] ?? 'The order status has been updated.';
    
    // Determine action button URL based on recipient
    $actionUrl = match($recipientType) {
        'client' => route('client.orders.show', $order),
        'freelancer' => route('freelancer.orders.show', $order),
        'admin' => route('admin.orders.index', $order),
        default => '#'
    };
    @endphp
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: {{ $colors['bg'] }}; color: {{ $colors['text'] }}; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    {{ $message }}
                </span>
            </div>
            
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                @if($recipientType === 'admin')
                    Order Status Update - Admin Notification
                @else
                    Your Order Status Has Been Updated
                @endif
            </h1>
            
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                {{ $description }}
            </p>
            
            <!-- Order Details Card -->
<div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
        Order Details
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Order Number:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->order_number }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Service:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->service->title }}</td>
        </tr>
        <tr>
                        <td style="padding: 8px 0; color: #64748b;">{{ $recipientType === 'freelancer' ? 'Client' : 'Freelancer' }}:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">
                            {{ $recipientType === 'freelancer' ? $order->client->name : $order->freelancer->name }}
                        </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Package:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->package_name }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #64748b;">Total Amount:</td>
            <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->formatted_total_amount }}</td>
        </tr>
                    @if($recipientType === 'admin')
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Payment Status:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">
                            {{ ucfirst($order->payment_status) }}
                        </td>
                    </tr>
                    @endif
    </table>
</div>

            <!-- Status-Specific Messages -->
            @if($order->status === 'review' && $recipientType !== 'admin')
<div style="background-color: #f0fdf4; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #22c55e;">
    <h2 style="color: #166534; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    @if($recipientType === 'client')
        🚀 Your Order Has Been Delivered!
                    @else
                        ✅ You Delivered the Order
                    @endif
    </h2>
    <p style="color: #166534; margin-bottom: 16px;">
                    @if($recipientType === 'client')
                        The freelancer has completed your order. Please review it carefully.
                    @else
                        The order has been sent to the client for review.
                    @endif
    </p>
</div>
@endif

@if($order->status === 'completed')
<div style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
    <h2 style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    @if($recipientType === 'admin')
                        💰 Payment Processing Required
                    @elseif($recipientType === 'client')
        ✅ Order Successfully Completed!
                    @else
                        🎉 Client Accepted Your Delivery!
                    @endif
    </h2>
    <p style="color: #065f46; margin-bottom: 16px;">
                    @if($recipientType === 'admin')
                        Please verify the order completion and process the freelancer's payment.
                    @elseif($recipientType === 'client')
                        Thank you for using our platform! Please consider leaving a review.
                    @else
                        The client has accepted your delivery. Payment will be processed soon.
                    @endif
    </p>
</div>
@endif

            <!-- Action Buttons -->
<div style="text-align: center; margin-bottom: 32px;">
             
                @if($recipientType === 'admin' && $order->status === 'completed')
                <a href="{{ route('admin.payments.index') }}" style="background-color: #10b981; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-left: 8px;">
                    Process Payout
                </a>
                @endif
</div>

            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                @if($recipientType === 'admin')
                    This is an automated notification. No action is required unless specified above.
                @else
                    If you have any questions about your order, please contact our support team.
@endif
            </p>
        </div>
    </div>
</body>
</html>