<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     */
    public function messages(): array
    {
        $locale = app()->getLocale();
        
        if ($locale === 'ar') {
            return [
                'email.required' => 'البريد الإلكتروني مطلوب',
                'email.email' => 'يرجى إدخال بريد إلكتروني صحيح',
                'email.string' => 'البريد الإلكتروني يجب أن يكون نص',
                'password.required' => 'كلمة المرور مطلوبة',
                'password.string' => 'كلمة المرور يجب أن تكون نص',
            ];
        }
        
        return [
            'email.required' => 'Email address is required',
            'email.email' => 'Please enter a valid email address',
            'email.string' => 'Email must be a string',
            'password.required' => 'Password is required',
            'password.string' => 'Password must be a string',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            $errorMessage = app()->getLocale() === 'ar' 
                ? 'بيانات الاعتماد هذه لا تتطابق مع سجلاتنا.'
                : 'These credentials do not match our records.';

            throw ValidationException::withMessages([
                'email' => $errorMessage,
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        $errorMessage = app()->getLocale() === 'ar'
            ? "محاولات تسجيل دخول كثيرة جداً. يرجى المحاولة مرة أخرى خلال {$seconds} ثانية."
            : "Too many login attempts. Please try again in {$seconds} seconds.";

        throw ValidationException::withMessages([
            'email' => $errorMessage,
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
