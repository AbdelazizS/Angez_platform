<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreelancerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'skills',
        'languages',
        'hourly_rate',
        'location',
        'website',
        'social_links',
        'certifications',
        'education',
        'availability_status',
        'response_time',
        'is_available',
        'portfolio',
        'success_rate',
        'completed_orders',
        'total_earnings',
        'average_rating',
        'total_reviews',
        'is_verified',
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'social_links' => 'array',
        'certifications' => 'array',
        'portfolio' => 'array',
        'hourly_rate' => 'decimal:2',
        'success_rate' => 'decimal:2',
        'average_rating' => 'decimal:2',
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
     * Get reviews for this freelancer
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'freelancer_id', 'user_id');
    }

    /**
     * Get the average rating for this freelancer
     */
    public function getAverageRatingAttribute()
    {
        $reviews = $this->reviews;
        return $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;
    }

    /**
     * Get the total number of reviews for this freelancer
     */
    public function getTotalReviewsAttribute()
    {
        return $this->reviews()->count();
    }

    /**
     * Get availability status options
     */
    public static function getAvailabilityStatuses()
    {
        return [
            'available' => 'Available for Work',
            'busy' => 'Busy with Projects',
            'unavailable' => 'Not Available',
        ];
    }

    /**
     * Get response time options
     */
    public static function getResponseTimes()
    {
        return [
            '1 hour' => '1 hour',
            '2 hours' => '2 hours',
            '4 hours' => '4 hours',
            '8 hours' => '8 hours',
            '24 hours' => '24 hours',
            '48 hours' => '48 hours',
        ];
    }

    /**
     * Get common skills
     */
    public static function getCommonSkills()
    {
        return [
            'Web Development' => [
                'HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'PHP', 'Laravel', 'Python', 'Django', 'Ruby on Rails', 'WordPress'
            ],
            'Mobile Development' => [
                'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Swift', 'Kotlin', 'Xamarin'
            ],
            'Design' => [
                'UI/UX Design', 'Graphic Design', 'Logo Design', 'Web Design', 'Illustration', '3D Design', 'Motion Graphics'
            ],
            'Digital Marketing' => [
                'SEO', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC', 'Google Ads', 'Facebook Ads'
            ],
            'Content Writing' => [
                'Copywriting', 'Technical Writing', 'Blog Writing', 'SEO Writing', 'Translation', 'Editing', 'Proofreading'
            ],
            'Video & Animation' => [
                'Video Editing', 'Animation', 'Motion Graphics', '3D Animation', 'Video Production', 'After Effects'
            ],
            'Business' => [
                'Virtual Assistant', 'Data Entry', 'Bookkeeping', 'Project Management', 'Business Analysis', 'Consulting'
            ],
        ];
    }

    /**
     * Get common languages
     */
    public static function getCommonLanguages()
    {
        return [
            'Arabic', 'English', 'French', 'Spanish', 'German', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Portuguese', 'Italian', 'Dutch'
        ];
    }

    /**
     * Update freelancer statistics including ratings
     */
    public function updateStatistics()
    {
        $completedOrders = \App\Models\Order::where('freelancer_id', $this->user_id)
            ->where('status', 'completed')
            ->count();
        
        $totalEarnings = \App\Models\Order::where('freelancer_id', $this->user_id)
            ->where('status', 'completed')
            ->sum('total_amount');
        
        // Calculate real average rating and total reviews
        $reviews = $this->reviews;
        $averageRating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;
        $totalReviews = $reviews->count();
        
        $this->update([
            'completed_orders' => $completedOrders,
            // 'total_earnings' => $totalEarnings,
            'average_rating' => $averageRating,
            'total_reviews' => $totalReviews,
        ]);
        
        return $this;
    }
} 