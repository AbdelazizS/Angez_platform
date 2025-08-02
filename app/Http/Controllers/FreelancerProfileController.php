<?php

namespace App\Http\Controllers;

use App\Models\FreelancerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FreelancerProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        
        // Get or create freelancer profile
        $freelancerProfile = FreelancerProfile::where('user_id', $user->id)->first();
        
        if (!$freelancerProfile) {
            // Create a basic profile if it doesn't exist
            $freelancerProfile = FreelancerProfile::create([
                'user_id' => $user->id,
                'title' => '',
                'bio' => '',
                'location' => '',
                'website' => '',
                'skills' => [],
                'languages' => [],
                'education' => '',
                'certifications' => [],
                // 'is_available' => true,
                'response_time' => '24 hours',
                'portfolio' => []
            ]);
        }

        // Format data for the frontend
        $freelancer = [
            'id' => $freelancerProfile->id,
            'name' => $user->name,
            'title' => $freelancerProfile->title,
            'avatar' => $user->profile_photo_url,
            'location' => $freelancerProfile->location,
            'email' => $user->email,
            'phone' => $user->phone,
            'website' => $freelancerProfile->website,
            'bio' => $freelancerProfile->bio,
            'skills' => $freelancerProfile->skills ?? [],
            'languages' => $freelancerProfile->languages ?? [],
            'education' => $freelancerProfile->education,
            'certifications' => $freelancerProfile->certifications ?? [],
            'availability_status' => $freelancerProfile->is_available,
            'responseTime' => $freelancerProfile->response_time,
            'portfolio' => $freelancerProfile->portfolio ?? []
        ];

        return Inertia::render('Freelancers/Edit', [
            'freelancer' => $freelancer,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $freelancerProfile = FreelancerProfile::where('user_id', $user->id)->firstOrFail();

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'skills' => 'nullable|array',
            'languages' => 'nullable|array',
            'education' => 'nullable|string|max:500',
            'certifications' => 'nullable|array',
            'isAvailable' => 'boolean',
            'responseTime' => 'nullable|string|max:50',
            'portfolio' => 'nullable|array'
        ]);

        // Update user name, email, and phone
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone']
        ]);

        // Update freelancer profile
        $freelancerProfile->update([
            'title' => $validated['title'],
            'bio' => $validated['bio'],
            'location' => $validated['location'],
            'website' => $validated['website'],
            'skills' => $validated['skills'] ?? [],
            'languages' => $validated['languages'] ?? [],
            'education' => $validated['education'],
            'certifications' => $validated['certifications'] ?? [],
            'availability_status' => $validated['isAvailable'],
            'response_time' => $validated['responseTime'],
            'portfolio' => $validated['portfolio'] ?? []
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
} 