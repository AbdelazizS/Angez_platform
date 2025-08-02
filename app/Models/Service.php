<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'title_ar',
        'description',
        'description_ar',
        'detailed_description',
        'detailed_description_ar',
        'category',
        'category_ar',
        'subcategory',
        'subcategory_ar',
        'price',
        'delivery_time',
        'delivery_time_ar',
        'revisions',
        'tags',
        'tags_ar',
        'gallery',
        'features',
        'features_ar',
        'dynamic_sections',
        'packages',
        'packages_ar',
        'views',
        'orders',
        'faq',
        'faq_ar',
        'is_popular',
        'is_featured',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->with('freelancerProfile');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, Order::class, 'service_id', 'order_id');
    }

    protected $casts = [
        'tags' => 'array',
        'tags_ar' => 'array',
        'gallery' => 'array',
        'features' => 'array',
        'features_ar' => 'array',
        'dynamic_sections' => 'array',
        'packages' => 'array',
        'packages_ar' => 'array',
        'faq' => 'array',
        'faq_ar' => 'array',
        'is_popular' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeSearchWithScoring(Builder $query, ?string $keyword): Builder
    {
        if (!$keyword || trim($keyword) === '') {
            return $query;
        }
    
        // Escape the keyword for LIKE queries
        $escapedKeyword = '%' . str_replace(' ', '%', $keyword) . '%';
        
        // Prepare the keyword for JSON searches (remove wildcards)
        $jsonSearchKeyword = trim($keyword);
    
        return $query->selectRaw('services.*, 
            (
                /* English content matches (40%) */
                (CASE WHEN title LIKE ? THEN 40 ELSE 0 END) +
                (CASE WHEN description LIKE ? THEN 20 ELSE 0 END) +
                (CASE WHEN JSON_SEARCH(tags, "one", ?) IS NOT NULL THEN 15 ELSE 0 END) +
                (CASE WHEN JSON_SEARCH(features, "one", ?) IS NOT NULL THEN 15 ELSE 0 END) +
                (CASE WHEN detailed_description LIKE ? THEN 10 ELSE 0 END) +
                
                /* Arabic content matches (20%) */
                (CASE WHEN title_ar LIKE ? THEN 20 ELSE 0 END) +
                (CASE WHEN description_ar LIKE ? THEN 10 ELSE 0 END) +
                (CASE WHEN JSON_SEARCH(tags_ar, "one", ?) IS NOT NULL THEN 5 ELSE 0 END) +
                (CASE WHEN JSON_SEARCH(features_ar, "one", ?) IS NOT NULL THEN 5 ELSE 0 END) +
                (CASE WHEN detailed_description_ar LIKE ? THEN 5 ELSE 0 END) +
                
                /* Popularity & performance (30%) */
                (CASE WHEN is_featured = 1 THEN 10 ELSE 0 END) +
                (CASE WHEN is_popular = 1 THEN 10 ELSE 0 END) +
                (orders * 0.6) +
                ((SELECT average_rating FROM freelancer_profiles WHERE user_id = services.user_id) * 5) +
                
                /* Multilingual bonus (10%) */
                (CASE WHEN title_ar IS NOT NULL AND description_ar IS NOT NULL THEN 10 ELSE 0 END)
            ) AS relevance_score',
            array_merge(
                array_fill(0, 5, $escapedKeyword), // For LIKE clauses
                array_fill(0, 5, $jsonSearchKeyword) // For JSON_SEARCH
            )
        )
        ->where(function($q) use ($escapedKeyword, $jsonSearchKeyword) {
            $q->where('title', 'LIKE', $escapedKeyword)
              ->orWhere('description', 'LIKE', $escapedKeyword)
              ->orWhere('title_ar', 'LIKE', $escapedKeyword)
              ->orWhere('description_ar', 'LIKE', $escapedKeyword)
              ->orWhere('detailed_description', 'LIKE', $escapedKeyword)
              ->orWhere('detailed_description_ar', 'LIKE', $escapedKeyword)
              ->orWhereJsonContains('tags', $jsonSearchKeyword)
              ->orWhereJsonContains('tags_ar', $jsonSearchKeyword)
              ->orWhereJsonContains('features', $jsonSearchKeyword)
              ->orWhereJsonContains('features_ar', $jsonSearchKeyword);
        })
        ->orderByDesc('relevance_score');
    }

    public function scopeWithFreelancerRating($query)
    {
        return $query->with(['user.freelancerProfile' => function($query) {
            $query->select('user_id', 'average_rating');
        }]);
    }
}