<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Service;
use App\Policies\ServicePolicy;
use App\Models\Order;
use App\Policies\OrderPolicy;
use App\Models\Review;
use App\Policies\ReviewPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Service::class => ServicePolicy::class,
        Order::class => OrderPolicy::class,
        Review::class => ReviewPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
} 