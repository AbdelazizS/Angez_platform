<?php

namespace App\Mail;

use App\Models\PayoutRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayoutProcessedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $payoutRequest;
    public $user;
    public $statusDetails;

    /**
     * Create a new message instance.
     */
    public function __construct(PayoutRequest $payoutRequest)
    {
        $this->payoutRequest = $payoutRequest;
        $this->user = $payoutRequest->user;

        // ✅ Define statusDetails here
        $this->statusDetails = [
            'payout_paid' => [
                'title' => 'Payout Processed!',
                'badge' => '💰',
                'color' => '#ECFDF5; color: #065F46;', // success green
                'icon' => '✅'
            ],
            'rejected' => [
                'title' => 'Payout Rejected',
                'badge' => '⚠️',
                'color' => '#FEE2E2; color: #991B1B;', // error red
                'icon' => '❌'
            ]
        ];
    }

    public function envelope(): Envelope
    {
        $status = $this->payoutRequest->status;

        $amount = number_format($this->payoutRequest->amount, 0, '.', ',');

        $subject = $status === 'payout_paid'
            ? "💰 Payout Processed - {$amount} SDG"
            : "⚠️ Payout Request Rejected";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payouts.processed',
            with: [
                'payoutRequest' => $this->payoutRequest,
                'user' => $this->user,
                'statusDetails' => $this->statusDetails[$this->payoutRequest->status] ??
                    [
                        'title' => 'Payout Update',
                        'badge' => '🔔',
                        'color' => '#f3f4f6; color: #000;',
                        'icon' => 'ℹ️'
                    ]
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
