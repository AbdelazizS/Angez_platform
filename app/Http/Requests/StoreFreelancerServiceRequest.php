<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFreelancerServiceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_ar' => 'nullable|string',
            'detailed_description' => 'nullable|string',
            'detailed_description_ar' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'category_ar' => 'nullable|string|max:255',
            'subcategory' => 'nullable|string|max:255',
            'subcategory_ar' => 'nullable|string|max:255',
            'price' => 'required|integer|min:0',
            'delivery_time' => 'required|string|max:255',
            'delivery_time_ar' => 'nullable|string|max:255',
            'revisions' => 'nullable|integer|min:0',
            'tags' => 'nullable|array',
            'tags_ar' => 'nullable|array',
            'gallery' => 'nullable|array',
            'features' => 'nullable|array',
            'features_ar' => 'nullable|array',
            'dynamic_sections' => 'nullable|array',
            'packages' => 'nullable|array',
            'packages_ar' => 'nullable|array',
            'views' => 'nullable|integer|min:0',
            'orders' => 'nullable|integer|min:0',
            'faq' => 'nullable|array',
            'faq_ar' => 'nullable|array',
            'is_popular' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ];
    }
} 