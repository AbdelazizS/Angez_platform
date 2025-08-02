<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use App\Models\ClientProfile;
use App\Models\FreelancerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Storage;

class RegisterController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterRequest $request)
    {
        Log::info('RegisterController@store payload', [
            'email' => $request->email,
            'all' => $request->all(),
        ]);
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => strtolower(trim($request->email)),
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'is_active' => true,
                'profile_completed' => $request->role === 'freelancer' ? false : true,
            ]);

            $user->addRole($request->role, true);

            if ($request->role === 'client') {
                ClientProfile::create([
                    'user_id' => $user->id,
                    'budget_preference' => 'medium',
                ]);
            } elseif ($request->role === 'freelancer') {
                FreelancerProfile::create([
                    'user_id' => $user->id,
                    'availability_status' => 'available',
                    'response_time' => '24 hours',
                ]);
            }

            DB::commit();

            // Optionally, send email verification
            // $user->sendEmailVerificationNotification();

            event(new Registered($user));
            Auth::login($user);

            if ($request->role === 'freelancer') {
                return redirect()->route('freelancer.profile.complete');
            } else {
                return redirect()->route('client.dashboard');
            }
        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollBack();
            if ($e->getCode() == 23000) {
                $errorMessage = app()->getLocale() === 'ar' 
                    ? 'هذا البريد الإلكتروني مسجل بالفعل.'
                    : 'This email is already registered.';
                return back()->withErrors(['email' => $errorMessage])->withInput();
            }
            $errorMessage = app()->getLocale() === 'ar'
                ? 'حدث خطأ في قاعدة البيانات. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.'
                : 'A database error occurred. Please try again or contact support.';
            return back()->withErrors(['general' => $errorMessage])->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            $errorMessage = app()->getLocale() === 'ar'
                ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
                : 'An unexpected error occurred. Please try again.';
            return back()->withErrors(['general' => $errorMessage])->withInput();
        }
    }

    /**
     * Display the role selection view.
     */
    public function showRoleSelection()
    {
        return Inertia::render('Auth/RoleSelection');
    }

    /**
     * Display the profile completion view.
     */
    public function showProfileCompletion()
    {
        $user = Auth::user();
        $role = $user->primaryRole;


        if ($role === 'client') {
            $data = [
                'industries' => ClientProfile::getIndustries(),
                'budgetPreferences' => ClientProfile::getBudgetPreferences(),
            ];
        } else {
            $data = [
                'skills' => FreelancerProfile::getCommonSkills(),
                'languages' => FreelancerProfile::getCommonLanguages(),
                'availabilityStatuses' => FreelancerProfile::getAvailabilityStatuses(),
                'responseTimes' => FreelancerProfile::getResponseTimes(),
            ];
        }

        return Inertia::render('Freelancers/ProfileComplete', $data + ['user' => $user]);
    }

    /**
     * Complete the user profile.
     */
    public function completeProfile(Request $request)
    {
        $user = Auth::user();
    
        $request->validate([
            'avatar' => 'nullable|image|max:2048',
            'title' => 'required|string|max:255',
            'bio' => 'required|string|max:1000',
            'skills' => 'required|string',
            'languages' => 'required|string',
            'hourly_rate' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'website' => 'nullable|string|max:255', // Changed from url validation
            'education' => 'nullable|string|max:500',
            'availability_status' => 'required|in:available,busy,unavailable',
            'response_time' => 'required|string|max:50',
        ]);
    
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = asset('storage/' . $path);
            $user->update(); // Use update() instead of save() to avoid undefined method error
        }

        $skills = json_decode($request->input('skills'), true) ?? [];
        $languages = json_decode($request->input('languages'), true) ?? [];
    
        $user->freelancerProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'title' => $request->title,
                'bio' => $request->bio,
                'skills' => $skills,
                'languages' => $languages,
                'hourly_rate' => $request->hourly_rate,
                'location' => $request->location,
                'website' => $request->website,
                'education' => $request->education,
                'availability_status' => $request->availability_status,
                'response_time' => $request->response_time,
            ]
        );

        // Mark profile as completed
        $user->profile_completed = true;
        $user->save();
    
        return redirect()->route('freelancers.dashboard')
                         ->with('success', 'Profile completed successfully!');
    }
    
}
