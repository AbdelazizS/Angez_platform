<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            $user = $request->user();
            if ($user) {
                if ($user->hasRole('client')) {
                    return redirect()->route('client.dashboard')->with('error', 'You do not have permission to access this page.');
                } elseif ($user->hasRole('freelancer')) {
                    return redirect()->route('freelancers.dashboard')->with('error', 'You do not have permission to access this page.');
                } elseif ($user->hasRole('admin')) {
                    return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
                }
            }
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
} 