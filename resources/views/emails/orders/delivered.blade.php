<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Order Delivered</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Success Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #F0FDF4; color: #166534; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    🚀 Order Delivered!
                </span>
            </div>
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                Your Order Has Been Delivered!
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                Great news! The freelancer has completed your order and delivered the work. Please review it carefully.
            </p>
            <!-- Order Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Order Summary
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
                        <td style="padding: 8px 0; color: #64748b;">Freelancer:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->freelancer->name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Package:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->package_name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->formatted_total_amount }}</td>
                    </tr>
                </table>
            </div>
            @if($deliveryMessage)
            <!-- Delivery Message -->
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #22c55e;">
                <h2 style="color: #166534; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Message from {{ $order->freelancer->name }}
                </h2>
                <p style="color: #166534; margin: 0;">{{ $deliveryMessage }}</p>
            </div>
            @endif
            <!-- Next Steps -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    What's Next?
                </h2>
                <ol style="color: #475569; margin: 0; padding-left: 24px;">
                    <li style="margin-bottom: 8px;">Review the delivered work carefully</li>
                    <li style="margin-bottom: 8px;">Check if it meets your requirements</li>
                    <li style="margin-bottom: 8px;">Accept the delivery if you're satisfied</li>
                    <li style="margin-bottom: 8px;">Request revisions if needed</li>
                    <li style="margin-bottom: 8px;">Leave a review for the freelancer</li>
                </ol>
            </div>
            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('client.orders.show', $order) }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-bottom: 8px;">Review Order</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('client.orders.show', $order) . '#review' }}" style="background-color: #10b981; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Leave a Review</a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                You have 7 days to review and accept the delivery. If you're not satisfied, you can request revisions.
            </p>
        </div>
    </div>
</body>
</html> 