<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'about',
        'location',
        'website',
        'budget_preference',
        'preferences',
        'is_verified',
    ];

    protected $casts = [
        'preferences' => 'array',
        'is_verified' => 'boolean',
    ];

    /**
     * Get the user that owns the profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get budget preference options
     */
    public static function getBudgetPreferences()
    {
        return [
            'low' => 'Low Budget (Under 50,000 SDG)',
            'medium' => 'Medium Budget (50,000 - 200,000 SDG)',
            'high' => 'High Budget (200,000 - 500,000 SDG)',
            'enterprise' => 'Enterprise (500,000+ SDG)',
        ];
    }

    /**
     * Get industry options
     */
    public static function getIndustries()
    {
        return [
            'technology' => 'Technology',
            'healthcare' => 'Healthcare',
            'finance' => 'Finance & Banking',
            'education' => 'Education',
            'retail' => 'Retail & E-commerce',
            'manufacturing' => 'Manufacturing',
            'real_estate' => 'Real Estate',
            'marketing' => 'Marketing & Advertising',
            'consulting' => 'Consulting',
            'non_profit' => 'Non-Profit',
            'government' => 'Government',
            'other' => 'Other',
        ];
    }
} 