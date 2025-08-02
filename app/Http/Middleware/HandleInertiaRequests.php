<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => function (Request $request) {
                    if (!$request->user()) {
                        return null;
                    }

                    return $request->user()->loadMissing([
                        'primaryRole',
                        'clientProfile',
                        'freelancerProfile'
                    ])->only([
                        'id',
                        'name',
                        'email',
                        'phone',
                        'avatar',
                        'is_active',
                        // 'profile_completed',
                        'primaryRole',
                        'clientProfile',
                        'freelancerProfile'
                    ]);
                },
            ],
        ];
    }
}
