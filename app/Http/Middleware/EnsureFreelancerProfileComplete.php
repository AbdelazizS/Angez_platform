<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureFreelancerProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        if ($user && $user->isFreelancer() && !$user->profile_completed) {
            return redirect()->route('freelancer.profile.complete');
        }
        return $next($request);
    }
} 