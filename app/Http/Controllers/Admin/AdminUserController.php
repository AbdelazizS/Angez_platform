<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\DB;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'role', 'status', 'trashed']);
        
        $users = User::with(['roles'])
        ->filter($filters)
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'roles' => ['admin', 'client', 'freelancer'], // Available roles
            'stats' => [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
                'inactive' => User::where('is_active', false)->count(),
                'admins' => User::whereHas('roles', fn($q) => $q->where('role', 'admin'))->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => ['admin'],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:admin,client,freelancer',
            'is_active' => 'boolean',
        ]);
    
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'is_active' => $request->is_active ?? true,
            ]);
    
            // Add the single role and set it as primary
            $user->addRole($request->role, true);
        });
    
        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }
    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['roles', 'clientProfile', 'freelancerProfile', 'wallet']);
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'activity' => $user->activities()->latest()->limit(10)->get(),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $user->load('roles');
        
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => ['admin', 'client', 'freelancer'],
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array',
            'roles.*' => 'in:admin,client,freelancer',
            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'is_active' => $request->is_active,
                ...($request->password ? ['password' => Hash::make($request->password)] : []),
            ]);

            // Sync roles
            $currentRoles = $user->roles->pluck('role')->toArray();
            $newRoles = $request->roles;
            
            // Remove roles that are not in the new list
            foreach (array_diff($currentRoles, $newRoles) as $roleToRemove) {
                $user->removeRole($roleToRemove);
            }
            
            // Add new roles
            foreach (array_diff($newRoles, $currentRoles) as $roleToAdd) {
                $user->addRole($roleToAdd);
            }
            
            // Set primary role if changed
            if ($request->primary_role && !$user->hasRole($request->primary_role)) {
                $user->setPrimaryRole($request->primary_role);
            }
        });

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * Make the user an admin.
     */
    public function makeAdmin(User $user)
    {
        $user->addRole('admin');
        
        return back()->with('success', 'User is now an admin.');
    }

    /**
     * Remove admin role from the user.
     */
    public function removeAdmin(User $user)
    {
        $user->removeRole('admin');
        
        return back()->with('success', 'Admin role removed from user.');
    }

    /**
     * Activate the user.
     */
    public function activate(User $user)
    {
        $user->update(['is_active' => true]);
        
        return back()->with('success', 'User activated successfully.');
    }

    /**
     * Deactivate the user.
     */
    public function deactivate(User $user)
    {
        $user->update(['is_active' => false]);
        
        return back()->with('success', 'User deactivated successfully.');
    }

    /**
     * Bulk action for users.
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        $action = $request->action;
        $ids = $request->ids;

        switch ($action) {
            case 'activate':
                User::whereIn('id', $ids)->update(['is_active' => true]);
                break;
            case 'deactivate':
                User::whereIn('id', $ids)->update(['is_active' => false]);
                break;
            case 'delete':
                User::whereIn('id', $ids)->delete();
                break;
        }

        return back()->with('success', 'Bulk action completed successfully.');
    }
}