<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'role',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Get the user that owns the role
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get primary roles
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope to get non-primary roles
     */
    public function scopeSecondary($query)
    {
        return $query->where('is_primary', false);
    }
} 