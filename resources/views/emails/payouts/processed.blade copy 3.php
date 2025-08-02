<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>{{ $statusDetails['title'] ?? 'Payout Update' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .header {
            text-align: center;
            padding-bottom: 16px;
        }
        .badge {
            display: inline-block;
            padding: 8px 16px;
            font-weight: bold;
            border-radius: 9999px;
            font-size: 14px;
        }
        .details {
            margin-top: 24px;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
        }
        .footer {
            margin-top: 32px;
            font-size: 13px;
            color: #888;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>{{ $statusDetails['badge'] ?? '💼' }} {{ $statusDetails['title'] ?? 'Payout Status' }}</h2>
            <div class="badge" style="background-color: {{ $statusDetails['color'] ?? '#f3f4f6' }}">
                {{ strtoupper($payoutRequest->status) }}
            </div>
        </div>

        <p>Hi {{ $user->name }},</p>

        @if($payoutRequest->status === 'payout_paid')
            <p>Your payout request has been successfully processed.</p>
            <ul>
                <li><strong>Amount:</strong> {{ number_format($payoutRequest->amount, 2) }} SDG</li>
                <li><strong>Account Details:</strong> {{ $payoutRequest->bank_account_details }}</li>
                <li><strong>Processed At:</strong> {{ $payoutRequest->processed_at?->format('d M Y, H:i') ?? '—' }}</li>
                @if($payoutRequest->paymentProof)
                    <li><strong>Reference No:</strong> {{ $payoutRequest->paymentProof->reference_number ?? '—' }}</li>
                    <li><strong>Payment Date:</strong> {{ $payoutRequest->paymentProof->payment_date?->format('d M Y') ?? '—' }}</li>
                @endif
            </ul>
        @elseif($payoutRequest->status === 'rejected')
            <p>Unfortunately, your payout request was <strong>rejected</strong>.</p>
            @if($payoutRequest->admin_notes)
                <p><strong>Reason:</strong> {{ $payoutRequest->admin_notes }}</p>
            @endif
        @else
            <p>Status: <strong>{{ strtoupper($payoutRequest->status) }}</strong></p>
        @endif

        <div class="details">
            <p>If you have any questions or concerns, please contact our support team.</p>
        </div>

        <div class="footer">
            &copy; {{ now()->year }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
