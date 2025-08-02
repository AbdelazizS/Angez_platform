<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentProof extends Model
{
    use HasFactory;

    protected $fillable = [
        'payout_request_id',
        'admin_id',
        'screenshot_path',
        'reference_number',
        'payment_date',
        'notes'
    ];

    protected $casts = [
        'payment_date' => 'datetime',
    ];

    public function payoutRequest()
    {
        return $this->belongsTo(PayoutRequest::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
