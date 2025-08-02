<?php

namespace App\Mail;

use App\Models\Service;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $service;
    public $status;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct(Service $service, $status, $reason = null)
    {
        $this->service = $service;
        $this->status = $status;
        $this->reason = $reason;

       
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->status === 'approved' 
            ? '✅ Your Service Has Been Approved'
            : '❌ Service Submission Requires Changes';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.services.status-update',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
} 