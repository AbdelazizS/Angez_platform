<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'client_id',
        'freelancer_id',
        'order_number',
        'package_name',
        'package_price',
        'service_fee',
        'total_amount',
        'requirements',
        'additional_notes',
        'transaction_ref',
        'payment_screenshot',
        'payment_status',
        'payment_method',
        'status',
        'payment_verified_at',
        'started_at',
        'due_date',
        'completed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'package_price' => 'integer',
        'service_fee' => 'integer',
        'total_amount' => 'integer',
        'payment_verified_at' => 'datetime',
        'started_at' => 'datetime',
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'requirements' => 'array', // Cast requirements as array
    ];

    // Relationships
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Boot method to auto-generate order number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . date('Y') . '-' . str_pad(static::whereYear('created_at', date('Y'))->count() + 1, 6, '0', STR_PAD_LEFT);
            }
        });
    }

    // Status helper methods
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isPaymentVerified()
    {
        return $this->status === 'payment_verified';
    }

    public function isInProgress()
    {
        return $this->status === 'in_progress';
    }

    public function isInReview()
    {
        return $this->status === 'review';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function isDelivered()
    {
        return $this->status === 'delivered';
    }

    public function isRevisionRequested()
    {
        return $this->status === 'revision_requested';
    }

    // Payment helper methods
    public function isPaymentPending()
    {
        return $this->payment_status === 'pending';
    }

    public function hasPaymentVerified()
    {
        return $this->payment_status === 'verified';
    }

    public function isPaymentFailed()
    {
        return $this->payment_status === 'failed';
    }

    // Status update methods
    public function markPaymentVerified()
    {
        $this->update([
            'payment_status' => 'verified',
            'status' => 'payment_verified',
            'payment_verified_at' => now(),
        ]);
    }

    public function markInProgress()
    {
        $this->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);
    }

    public function markInReview()
    {
        $this->update([
            'status' => 'review',
        ]);
    }

    public function markCompleted()
    {
        // Credit freelancer wallet with 80% of order amount
        $freelancer = $this->freelancer;
        if ($freelancer) {
            $wallet = $freelancer->createWalletIfNotExists();
            $amount = $this->total_amount * 0.8; // 80% of total amount
            
            $wallet->increment('balance', $amount);
            
            // Create transaction record
            \App\Models\WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',
                'amount' => $amount,
                'description' => "Payment for order #{$this->order_number}",
                'order_id' => $this->id,
            ]);

            // Update freelancer profile statistics
            $freelancerProfile = $freelancer->freelancerProfile;
            if ($freelancerProfile) {
                $completedOrders = Order::where('freelancer_id', $freelancer->id)
                    ->where('status', 'completed')
                    ->count();
                
                $totalEarnings = Order::where('freelancer_id', $freelancer->id)
                    ->where('status', 'completed')
                    ->sum('total_amount');
                
                $freelancerProfile->update([
                    'completedOrders' => $completedOrders,
                    // 'total_earnings' => $totalEarnings,
                ]);
            }
        }

        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markCancelled()
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
    }

    public function markDelivered()
    {
        $this->update([
            'status' => 'delivered',
        ]);
    }

    public function markRevisionRequested()
    {
        $this->update([
            'status' => 'revision_requested',
        ]);
    }

    // Payment proof accessor
    public function getPaymentProofUrlAttribute()
    {
        if (!$this->payment_screenshot) {
            return null;
        }
        
        // Check if it's already a full URL
        if (filter_var($this->payment_screenshot, FILTER_VALIDATE_URL)) {
            return $this->payment_screenshot;
        }
        
        // Return storage URL
        return asset('storage/' . $this->payment_screenshot);
    }

    // Format price methods
    public function getFormattedPackagePriceAttribute()
    {
        return number_format($this->package_price, 0, '.', ',') . ' SDG';
    }

    public function getFormattedServiceFeeAttribute()
    {
        return number_format($this->service_fee, 0, '.', ',') . ' SDG';
    }

    public function getFormattedTotalAmountAttribute()
    {
        return number_format($this->total_amount, 0, '.', ',') . ' SDG';
    }

    // Scopes for filtering
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPaymentStatus($query, $paymentStatus)
    {
        return $query->where('payment_status', $paymentStatus);
    }

    public function scopeForClient($query, $clientId)
    {
        return $query->where('client_id', $clientId);
    }

    public function scopeForFreelancer($query, $freelancerId)
    {
        return $query->where('freelancer_id', $freelancerId);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
