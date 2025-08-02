<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Payout Processed</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Success Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #ECFDF5; color: #065F46; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    💰 Payout Processed!
                </span>
            </div>
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                Your Payout Has Been Processed!
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                Great news! Your payout request has been processed and the funds have been transferred to your account.
            </p>
            <!-- Payout Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Payout Information
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Reference ID:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->id }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ number_format($payoutRequest->amount, 0, '.', ',') }} SDG</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Payment Method:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->payment_method }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Account Details:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->bank_account_details }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Processed Date:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->processed_at ? $payoutRequest->processed_at->format('F j, Y \a\t g:i A') : 'N/A' }}</td>
                    </tr>
                </table>
            </div>
            <!-- Transaction Summary -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Transaction Summary
                </h2>
                <div style="background-color: white; border-radius: 6px; padding: 16px; border-left: 4px solid #10b981;">
                    <p style="color: #065f46; margin: 0; font-weight: 500;">
                        ✅ Payout of {{ number_format($payoutRequest->amount, 0, '.', ',') }} SDG has been successfully processed and sent to your {{ $payoutRequest->payment_method }} account.
                    </p>
                </div>
            </div>
            <!-- Next Steps -->
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #0C4A6E;">
                <h2 style="color: #0C4A6E; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    What's Next?
                </h2>
                <ol style="color: #0C4A6E; margin: 0; padding-left: 24px;">
                    <li style="margin-bottom: 8px;">Check your {{ $payoutRequest->payment_method }} account for the funds</li>
                    <li style="margin-bottom: 8px;">The transfer may take 1-3 business days to appear</li>
                    <li style="margin-bottom: 8px;">Keep providing excellent services to earn more</li>
                    <li style="margin-bottom: 8px;">Request another payout when you reach the minimum amount</li>
                </ol>
            </div>
            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('freelancer.wallet.index') }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-bottom: 8px;">View Wallet</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('freelancer.dashboard') }}" style="background-color: #64748b; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Go to Dashboard</a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                If you don't receive the funds within 3 business days, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html> 