<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>{{ $statusDetails['title'] ?? 'Payout Status Update' }}</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                @if($payoutRequest->status === 'payout_paid')
                <span style="background-color: #ECFDF5; color: #065F46; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    ✅ Payout Completed
                </span>
                @elseif($payoutRequest->status === 'rejected')
                <span style="background-color: #FEE2E2; color: #991B1B; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    ❌ Payout Rejected
                </span>
                @else
                <span style="background-color: #E0F2FE; color: #0C4A6E; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    ⏳ Payout {{ ucfirst($payoutRequest->status) }}
                </span>
                @endif
            </div>

            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                @if($payoutRequest->status === 'payout_paid')
                Your Payout Has Been Processed
                @elseif($payoutRequest->status === 'rejected')
                Payout Request Rejected
                @else
                Payout Status Update
                @endif
            </h1>

            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                Hi {{ $user->name }},
                @if($payoutRequest->status === 'payout_paid')
                your payout request has been successfully processed.
                @elseif($payoutRequest->status === 'rejected')
                your payout request has been rejected.
                @else
                here's the current status of your payout request.
                @endif
            </p>

            <!-- Payout Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Payout Details
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Request ID:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">#{{ $payoutRequest->id }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Amount:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ number_format($payoutRequest->amount, 0) }} SDG</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Request Date:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->requested_at->format('M j, Y H:i') }}</td>
                    </tr>
                    @if($payoutRequest->status === 'payout_paid')
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Processed Date:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->processed_at?->format('M j, Y H:i') ?? '—' }}</td>
                    </tr>
                    @if($payoutRequest->paymentProof)
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Reference No:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->paymentProof->reference_number ?? '—' }}</td>
                    </tr>
                    @endif
                    @endif
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Status:</td>
                        <td style="padding: 8px 0; color: @if($payoutRequest->status === 'payout_paid') #059669 @elseif($payoutRequest->status === 'rejected') #dc2626 @else #0C4A6E @endif; font-weight: 500; text-align: right;">
                            {{ strtoupper($payoutRequest->status) }}
                        </td>
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

            @if($payoutRequest->status === 'rejected' && $payoutRequest->admin_notes)
            <!-- Rejection Reason -->
            <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #dc2626;">
                <h2 style="color: #991b1b; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Rejection Reason
                </h2>
                <p style="color: #991b1b; margin: 0; white-space: pre-line;">{{ $payoutRequest->admin_notes }}</p>
            </div>
            @endif

            @if($payoutRequest->status === 'payout_paid')
            <!-- Next Steps -->
            <div style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                <h2 style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    What's Next?
                </h2>
                <p style="color: #065f46; margin: 0;">
                    The funds should appear in your bank account , depending on your bank's processing time.
                </p>
            </div>
            @endif

          

            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                If you have any questions, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>