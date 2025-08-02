<?php

namespace App\Mail;

use App\Models\PayoutRequest;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPayoutRequestMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $payoutRequest;
    public $user;

    public function __construct(PayoutRequest $payoutRequest, User $user)
    {
        $this->payoutRequest = $payoutRequest;
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '💰 New Payout Request - ' . number_format($this->payoutRequest->amount) . ' SDG',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payouts.new-request-admin',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}