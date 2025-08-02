<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Update client or freelancer profile if present
        if ($user->isClient() && $user->clientProfile) {
            $user->clientProfile->update($request->only([
                'company_name', 'industry', 'about', 'location', 'website', 'budget_preference', 'preferences', 'is_verified'
            ]));
        }
        if ($user->isFreelancer() && $user->freelancerProfile) {
            $user->freelancerProfile->update($request->only([
                'title', 'bio', 'skills', 'languages', 'hourly_rate', 'location', 'website', 'social_links', 'certifications', 'education', 'availability_status', 'response_time', 'success_rate', 'completed_orders', 'average_rating', 'total_reviews', 'is_verified'
            ]));
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
