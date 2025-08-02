<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function view(User $user, Service $service)
    {
        return $user->id === $service->user_id;
    }

    public function update(User $user, Service $service)
    {
        return $user->id === $service->user_id;
    }

    public function delete(User $user, Service $service)
    {
        return $user->id === $service->user_id;
    }
} 