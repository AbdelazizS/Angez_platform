<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();
            $request->session()->regenerate();

            // Redirect based on user role
            $user = Auth::user();
            if ($user->hasRole('freelancer')) {
                return redirect()->intended(route('freelancer.dashboard', absolute: false));
            } elseif ($user->hasRole('client')) {
                return redirect()->intended(route('client.dashboard', absolute: false));
            } else {
                return redirect()->intended(route('dashboard', absolute: false));
            }
        } catch (\Exception $e) {
            // Handle any unexpected errors
            $errorMessage = app()->getLocale() === 'ar'
                ? 'حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
                : 'An unexpected error occurred during login. Please try again.';

            return back()->withErrors(['general' => $errorMessage]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
