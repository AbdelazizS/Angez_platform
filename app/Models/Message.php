<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'order_id', 'sender_id', 'content', 'file_path', 'file_type', 'view_once', 'read_at'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }
    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
} 