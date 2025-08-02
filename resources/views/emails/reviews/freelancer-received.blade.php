<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Review Received</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Review Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #FEF3C7; color: #92400E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    ⭐ New Review Received!
                </span>
            </div>
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                You've Received a New Review!
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                Congratulations! A client has left a review for your work on order #{{ $order->order_number }}.
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
                        <td style="padding: 8px 0; color: #64748b;">Client:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $review->client->name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $order->formatted_total_amount }}</td>
                    </tr>
                </table>
            </div>
            <!-- Review Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Review Details
                </h2>
                <!-- Rating Stars -->
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        @for($i = 1; $i <= 5; $i++)
                            @if($i <= $review->rating)
                                <span style="color: #fbbf24; font-size: 20px;">★</span>
                            @else
                                <span style="color: #d1d5db; font-size: 20px;">☆</span>
                            @endif
                        @endfor
                        <span style="color: #64748b; margin-left: 8px;">{{ $review->rating }}/5</span>
                    </div>
                </div>
                @if($review->comment)
                <div style="background-color: white; border-radius: 6px; padding: 16px; border-left: 4px solid #fbbf24;">
                    <p style="color: #475569; margin: 0; font-style: italic;">"{{ $review->comment }}"</p>
                </div>
                @endif
                <p style="color: #64748b; font-size: 12px; margin-top: 8px; margin-bottom: 0;">
                    Reviewed on {{ $review->created_at->format('F j, Y \a\t g:i A') }}
                </p>
            </div>
            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('freelancer.orders.show', $order) }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-bottom: 8px;">View Order Details</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('freelancer.profile.edit') }}" style="background-color: #64748b; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">View Your Profile</a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Thank you for your excellent work! Keep up the great service to maintain your positive reputation.
            </p>
        </div>
    </div>
</body>
</html> 