<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Payout Processed</title>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); padding: 2rem;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <span style="{{ $statusDetails['color'] }}; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem;">
                    {{ $statusDetails['badge'] }} {{ $statusDetails['title'] }}
                </span>
            </div>

            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem;">
                @if($payoutRequest->status === 'payout_paid')
                    Your payout has been processed successfully!
                @else
                    Your payout request has been reviewed
                @endif
            </h1>

            <!-- Summary Card -->
            <div style="background-color: #f8fafc; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                <h2 style="color: #334155; font-size: 1.125rem; font-weight: 600; margin: 0 0 1rem 0;">Transaction Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0.5rem 0; color: #64748b;">Request ID</td>
                        <td style="padding: 0.5rem 0; color: #334155; font-weight: 500; text-align: right;">#{{ $payoutRequest->id }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem 0; color: #64748b;">Amount</td>
                        <td style="padding: 0.5rem 0; color: #334155; font-weight: 500; text-align: right;">{{ number_format($payoutRequest->amount, 0, '.', ',') }} SDG</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem 0; color: #64748b;">Status</td>
                        <td style="padding: 0.5rem 0; color: #334155; font-weight: 500; text-align: right;">
                            <span style="color: {{ $payoutRequest->status === 'payout_paid' ? '#059669' : '#dc2626' }};">
                                {{ ucfirst(str_replace('_', ' ', $payoutRequest->status)) }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem 0; color: #64748b;">Processed Date</td>
                        <td style="padding: 0.5rem 0; color: #334155; font-weight: 500; text-align: right;">{{ $payoutRequest->processed_at->format('M j, Y \a\t g:i A') }}</td>
                    </tr>
                </table>
            </div>

            <!-- Status Specific Content -->
            @if($payoutRequest->status === 'payout_paid')
            <!-- Approved Content -->
            <div style="background-color: #ecfdf5; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid #10b981;">
                <div style="display: flex; gap: 0.75rem;">
                    <div style="flex-shrink: 0;">
                        <span style="background-color: #10b981; color: white; border-radius: 9999px; width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">✓</span>
                    </div>
                    <div>
                        <h3 style="color: #065f46; font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem 0;">Payment Successful</h3>
                        <p style="color: #065f46; margin: 0;">The amount has been transferred to your bank account as per your request.</p>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #334155; font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem 0;">Payment Details</h3>
                <p style="color: #475569; margin: 0 0 1rem 0;">Here are the details of your payment transfer:</p>
                <div style="background-color: #f8fafc; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                    <p style="color: #334155; font-weight: 500; margin: 0 0 0.5rem 0;">Bank Account Details:</p>
                    <p style="color: #475569; margin: 0; white-space: pre-line;">{{ $payoutRequest->bank_account_details }}</p>
                </div>
                @if($payoutRequest->paymentProof)
                <p style="color: #475569; margin: 0 0 0.5rem 0;">Reference Number: <span style="color: #334155; font-weight: 500;">{{ $payoutRequest->paymentProof->reference_number }}</span></p>
                @endif
            </div>
            @else
            <!-- Rejected Content -->
            <div style="background-color: #fef2f2; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid #dc2626;">
                <div style="display: flex; gap: 0.75rem;">
                    <div style="flex-shrink: 0;">
                        <span style="background-color: #dc2626; color: white; border-radius: 9999px; width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">!</span>
                    </div>
                    <div>
                        <h3 style="color: #991b1b; font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem 0;">Payout Rejected</h3>
                        <p style="color: #991b1b; margin: 0 0 0.5rem 0;">{{ $payoutRequest->admin_notes }}</p>
                        <p style="color: #991b1b; margin: 0;">The requested amount has been returned to your wallet balance.</p>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #334155; font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem 0;">Next Steps</h3>
                <ol style="color: #475569; margin: 0; padding-left: 1.25rem;">
                    <li style="margin-bottom: 0.5rem;">Review the rejection reason above</li>
                    <li style="margin-bottom: 0.5rem;">Check your wallet balance - the amount has been returned</li>
                    <li style="margin-bottom: 0.5rem;">You may submit a new payout request after addressing the issues</li>
                </ol>
            </div>
            @endif

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <a href="{{ route('user.payouts.show', $payoutRequest->id) }}" style="background-color: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 500; display: inline-block;">
                    View Payout Details
                </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 1.5rem; text-align: center;">
                <p style="color: #64748b; font-size: 0.875rem; margin: 0 0 0.5rem 0;">If you have any questions, please contact our support team.</p>
                <p style="color: #64748b; font-size: 0.875rem; margin: 0;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>