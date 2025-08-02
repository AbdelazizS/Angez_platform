<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $order;
    public $previousStatus;
    public $newStatus;
    public $recipientType; // 'client', 'freelancer', or 'admin'

    public function __construct(Order $order, string $recipientType, $previousStatus = null)
    {
        $this->order = $order;
        $this->recipientType = $recipientType;
        $this->previousStatus = $previousStatus;
        $this->newStatus = $order->status;
    }

    public function envelope(): Envelope
    {
        $statusMessages = [
            'payment_verified' => 'Payment Verified - Order Started',
            'in_progress' => 'Order In Progress',
            'review' => 'Order Under Review',
            'delivered' => 'Order Delivered',
            'completed' => 'Order Completed',
            'cancelled' => 'Order Cancelled',
            'revision_requested' => 'Revision Requested',
        ];

        $subject = '📦 ' . ($statusMessages[$this->newStatus] ?? 'Order Status Updated') . ' - #' . $this->order->order_number;

        // Custom subject for admin
        if ($this->recipientType === 'admin') {
            $subject = '✅ Order Completed - Requires Verification #' . $this->order->order_number;
        }

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        $view = 'emails.orders.status-updated';
        
        // // Use a different template for admin if needed
        // if ($this->recipientType === 'admin') {
        //     $view = 'emails.orders.status-updated-admin';
        // }

        return new Content(
            markdown: $view,
            with: ['recipientType' => $this->recipientType]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}