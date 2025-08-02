<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email:rfc',
                'max:255',
                'unique:users,email',
            ],
            'phone' => 'nullable|string|max:20',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
            'role' => 'required|in:client,freelancer',
            'terms' => 'required|accepted',
        ];
    }

    public function messages()
    {
        $locale = app()->getLocale();
        
        if ($locale === 'ar') {
            return [
                'name.required' => 'الاسم الكامل مطلوب',
                'name.max' => 'يجب أن يكون الاسم أقل من 255 حرف',
                'email.required' => 'البريد الإلكتروني مطلوب',
                'email.email' => 'يرجى إدخال بريد إلكتروني صحيح',
                'email.unique' => 'هذا البريد الإلكتروني مسجل بالفعل',
                'email.max' => 'يجب أن يكون البريد الإلكتروني أقل من 255 حرف',
                'phone.max' => 'يجب أن يكون رقم الهاتف أقل من 20 حرف',
                'password.required' => 'كلمة المرور مطلوبة',
                'password.confirmed' => 'كلمات المرور غير متطابقة',
                'password.min' => 'يجب أن تكون كلمة المرور على الأقل 8 أحرف',
                'password.mixed' => 'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة',
                'password.letters' => 'يجب أن تحتوي كلمة المرور على أحرف',
                'password.numbers' => 'يجب أن تحتوي كلمة المرور على أرقام',
                'password.symbols' => 'يجب أن تحتوي كلمة المرور على رمز واحد على الأقل',
                'password.uncompromised' => 'تم اختراق هذه كلمة المرور. يرجى اختيار كلمة مرور مختلفة',
                'role.required' => 'يرجى اختيار دورك',
                'role.in' => 'يرجى اختيار دور صحيح',
                'terms.accepted' => 'يجب عليك الموافقة على الشروط والأحكام',
            ];
        }
        
        return [
            'name.required' => 'Full name is required',
            'name.max' => 'Name must be less than 255 characters',
            'email.required' => 'Email address is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already registered',
            'email.max' => 'Email must be less than 255 characters',
            'phone.max' => 'Phone number must be less than 20 characters',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Passwords do not match',
            'password.min' => 'Password must be at least 8 characters',
            'password.mixed' => 'Password must contain both uppercase and lowercase letters',
            'password.letters' => 'Password must contain letters',
            'password.numbers' => 'Password must contain numbers',
            'password.symbols' => 'Password must contain at least one symbol',
            'password.uncompromised' => 'This password has been compromised. Please choose a different one',
            'role.required' => 'Please select your role',
            'role.in' => 'Please select a valid role',
            'terms.accepted' => 'You must accept the terms and conditions',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'email' => strtolower(trim($this->email)),
        ]);
    }
} 