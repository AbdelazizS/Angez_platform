<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Order Received</title>
</head>

<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            {{-- Success Badge --}}
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #ECFDF5; color: #065F46; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    🎉 New Order Received!
                </span>
            </div>

            {{-- Main Content --}}
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                Congratulations! You Have a New Order
            </h1>

            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                A client has placed an order for your service. Please review the details below and start working on it.
            </p>

            {{-- Order Details Card --}}
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
                        <td style="padding: 8px 0; color: #64748b;">Package:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->package_name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->formatted_total_amount }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Due Date:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->due_date ? $order->due_date->format('F j, Y') : 'Not specified' }}</td>
                    </tr>
                </table>
            </div>

            {{-- Client Information Card --}}
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Client Information
                </h2>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Name:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->client->name }}</td>
                    </tr>
                    
                   
                </table>
            </div>

            @if($order->requirements)
            {{-- Requirements Card --}}
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Project Requirements
                </h2>

                @if(is_array($order->requirements))
                @foreach($order->requirements as $requirement)
                <div style="background-color: white; border-radius: 6px; padding: 16px; margin-bottom: 12px; border-left: 4px solid #0C4A6E;">
                    <p style="color: #475569; margin: 0;">{{ $requirement }}</p>
                </div>
                @endforeach
                @else
                <p style="color: #475569; margin: 0;">{{ $order->requirements }}</p>
                @endif
            </div>
            @endif

            @if($order->additional_notes)
            {{-- Additional Notes --}}
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Additional Notes
                </h2>
                <p style="color: #475569; margin: 0;">{{ $order->additional_notes }}</p>
            </div>
            @endif

            {{-- Action Buttons --}}
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('freelancer.orders.show', $order) }}"
                    style="display: inline-block; background-color: #0C4A6E; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                    View Order Details
                </a>
            </div>

            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Please start working on this order as soon as possible. You can communicate with the client through the order chat.
            </p>

            {{-- Footer --}}
            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 4px 0;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>

</html>