<?php


namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewOrderNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $client;
    public $service;
    public $freelancer;

    public function __construct(Order $order)
    {
        $this->order = $order;
        $this->client = $order->client; // Assuming `client()` relation
        $this->service = $order->service;
        $this->freelancer = $this->service->user;
    }

    public function build()
    {
        return $this->subject('📥 New Order Received for Your Service')
                    ->markdown('emails.orders.new');
    }
}

