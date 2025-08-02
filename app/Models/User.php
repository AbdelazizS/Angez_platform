<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar',
        'password',
        'is_active',
        'profile_completed',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'profile_completed' => 'boolean',
    ];

    /**
     * Get the user's roles
     */
    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Get the user's primary role
     */
    public function primaryRole()
    {
        return $this->hasOne(UserRole::class)->where('is_primary', true);
    }

    /**
     * Get the user's client profile
     */
    public function clientProfile()
    {
        return $this->hasOne(ClientProfile::class);
    }

    /**
     * Get the user's freelancer profile
     */
    public function freelancerProfile()
    {
        return $this->hasOne(FreelancerProfile::class);
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        return $this->roles()->where('role', $role)->exists();
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole($roles)
    {
        return $this->roles()->whereIn('role', (array) $roles)->exists();
    }

    /**
     * Check if user has all of the given roles
     */
    public function hasAllRoles($roles)
    {
        return $this->roles()->whereIn('role', (array) $roles)->count() === count((array) $roles);
    }

    /**
     * Get user's roles as array
     */
    public function getRolesAttribute()
    {
        return $this->roles()->pluck('role')->toArray();
    }

    /**
     * Get user's primary role
     */
    public function getPrimaryRoleAttribute()
    {
        return $this->primaryRole()->value('role');
    }

    /**
     * Check if user is a client
     */
    public function isClient()
    {
        return $this->hasRole('client');
    }

    /**
     * Check if user is a freelancer
     */
    public function isFreelancer()
    {
        return $this->hasRole('freelancer');
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Add a role to the user
     */
    public function addRole($role, $isPrimary = false)
    {
        if ($isPrimary) {
            // Remove primary from other roles
            $this->roles()->update(['is_primary' => false]);
        }

        return $this->roles()->create([
            'role' => $role,
            'is_primary' => $isPrimary,
        ]);
    }

    /**
     * Remove a role from the user
     */
    public function removeRole($role)
    {
        return $this->roles()->where('role', $role)->delete();
    }

    /**
     * Set primary role
     */
    public function setPrimaryRole($role)
    {
        // Remove primary from all roles
        $this->roles()->update(['is_primary' => false]);
        
        // Set the specified role as primary
        return $this->roles()->where('role', $role)->update(['is_primary' => true]);
    }

    /**
     * Check if user profile is complete
     */
    public function isProfileComplete()
    {
        return $this->profile_completed;
    }

    /**
     * Get the user's wallet
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Get the user's payout requests
     */
    public function payoutRequests()
    {
        return $this->hasMany(PayoutRequest::class);
    }

    /**
     * Get the user's wallet transactions
     */
    public function walletTransactions()
    {
        return $this->hasManyThrough(WalletTransaction::class, Wallet::class);
    }

    /**
     * Create wallet for user if it doesn't exist
     */
    public function createWalletIfNotExists()
    {
        if (!$this->wallet) {
            return $this->wallet()->create([
                'balance' => 0,
                'is_locked' => false,
            ]);
        }
        return $this->wallet;
    }

    public function clientReviews()
    {
        return $this->hasMany(Review::class, 'client_id');
    }

    public function freelancerReviews()
    {
        return $this->hasMany(Review::class, 'freelancer_id');
    }

    // In User model
public function scopeFilter($query, array $filters)
{
    $query->when($filters['search'] ?? null, function ($query, $search) {
        $query->where(function ($query) use ($search) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%')
                ->orWhere('phone', 'like', '%'.$search.'%');
        });
    })->when($filters['role'] ?? null, function ($query, $role) {
        $query->whereHas('roles', function ($query) use ($role) {
            $query->where('role', $role);
        });
    })->when($filters['status'] ?? null, function ($query, $status) {
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
    })->when($filters['trashed'] ?? null, function ($query, $trashed) {
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }
    });
}

}
