<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Message in Your Order</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Message Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #F0F9FF; color: #0C4A6E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    💬 New Message Received
                </span>
            </div>
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                New Message in Your Order
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                You have received a new message from {{ $sender->name }} regarding your order.
            </p>
            <!-- Order Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Order Information
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
                        <td style="padding: 8px 0; color: #64748b;">Status:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ ucfirst(str_replace('_', ' ', $order->status)) }}</td>
                    </tr>
                </table>
            </div>
            <!-- Message Content -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Message from {{ $sender->name }}
                </h2>
                <div style="background-color: white; border-radius: 6px; padding: 16px; border-left: 4px solid #0C4A6E;">
                    <p style="color: #475569; margin: 0; white-space: pre-wrap;">{{ $message->content }}</p>
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 8px; margin-bottom: 0;">
                    Sent on {{ $message->created_at->format('F j, Y \a\t g:i A') }}
                </p>
            </div>
            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('orders.chat', $order) }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-bottom: 8px;">Reply to Message</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('orders.show', $order) }}" style="background-color: #64748b; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">View Order Details</a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Please respond to this message to keep the communication flowing smoothly.
            </p>
        </div>
    </div>
</body>
</html> 