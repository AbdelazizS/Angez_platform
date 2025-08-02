<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Payout Request</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #E0F2FE; color: #0C4A6E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    💰 New Payout Request
                </span>
            </div>

            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                New Payout Request Received
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                A freelancer has requested a payout from their earnings.
            </p>

            <!-- Payout Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Payout Information
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Freelancer:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $user->name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Email:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $user->email }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Requested Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ number_format($payoutRequest->amount) }} SDG</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Request Date:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->requested_at->format('M j, Y H:i') }}</td>
                    </tr>
                </table>
            </div>

            <!-- Bank Details Card -->
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #0C4A6E;">
                <h2 style="color: #0C4A6E; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Bank Account Details
                </h2>
                <p style="color: #0C4A6E; margin: 0; white-space: pre-line;">{{ $payoutRequest->bank_account_details }}</p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('admin.wallets') }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                    Process Payout
                </a>
            </div>

            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Please process this payout within 3-5 business days.
            </p>
        </div>
    </div>
</body>
</html>