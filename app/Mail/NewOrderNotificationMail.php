<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrderNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $order;
    public $recipientType; // 'freelancer' or 'admin'


    
    /**
     * Create a new message instance.
     */
    public function __construct(Order $order, $recipientType = 'freelancer')
    {
        \Log::info("Preparing email for order #{$order->order_number} to {$recipientType}");

        $this->order = $order;
        $this->recipientType = $recipientType;

        // dd($recipientType);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->recipientType === 'admin' 
            ? '🆕 New Order Requires Payment Verification - #' . $this->order->order_number
            : '🎉 New Order Received for Your Service!';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $template = $this->recipientType === 'admin' 
            ? 'emails.orders.new-admin'
            : 'emails.orders.new-freelancer';
    
        return new Content(
            view: $template
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
