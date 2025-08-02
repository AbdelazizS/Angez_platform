<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Order Requires Payment Verification</title>
</head>

<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            {{-- Alert Badge --}}
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #FEE2E2; color: #991B1B; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    ⚠️ Payment Verification Required
                </span>
            </div>

            {{-- Main Content --}}
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                New Order Requires Payment Verification
            </h1>

            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                A new order has been placed and requires payment verification before the freelancer can start working.
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
                        <td style="padding: 8px 0; color: #64748b;">Freelancer:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->freelancer->name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Package:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->package_name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Total Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->formatted_total_amount }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Payment Method:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->payment_method ?? 'Not specified' }}</td>
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
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Email:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->client->email }}</td>
                    </tr>
                    @if(
                    $order->client->phone &&
                    $order->client->phone !== $order->client->email &&
                    !str_contains($order->client->phone, '@')
                    )
                    <tr>
                        <td>Phone:</td>
                        <td>{{ $order->client->phone }}</td>
                    </tr>
                    @endif
                </table>
            </div>


            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Please review the payment proof and verify the transaction before approving the order.
            </p>

            {{-- Action Buttons --}}
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('admin.payments.index') }}"
                    style="display: inline-block; background-color: #0C4A6E; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                    Review Order & Verify Payment
                </a>
            </div>

            
            {{-- Footer --}}
            <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 4px 0;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            </div>


        </div>

    </div>
</body>

</html>