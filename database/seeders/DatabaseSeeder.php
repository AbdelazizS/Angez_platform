<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\Order;
use App\Models\UserRole;
use App\Models\FreelancerProfile;
use App\Models\ClientProfile;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        /**
         * The following code seeds the database with three admin users.
         * For each admin, it checks if a user with the given email exists.
         * If not, it creates the user with the specified name, email, password, and sets them as active with a completed profile.
         * Then, it assigns the 'admin' role to each user (the second parameter 'true' may indicate it's the primary role).
         */


        $admins = [
            [
                'name' => 'Admin',
                'email' => 'admin@angez.com',
                'password' => bcrypt('AnjezAdmin2024!'),
            ],
            [
                'name' => 'Sales Ali',
                'email' => 'sales_ali@angez.com',
                'password' => bcrypt('AnjezSalesAli2024!'),
            ],
            [
                'name' => 'Sales Omnia',
                'email' => 'sales_omnia@angez.com',
                'password' => bcrypt('AnjezSalesOmnia2024!'),
            ],
        ];
        foreach ($admins as $adminData) {
            $admin = User::firstOrCreate(
                ['email' => $adminData['email']],
                [
                    'name' => $adminData['name'],
                    'password' => $adminData['password'],
                    'is_active' => true,
                    'profile_completed' => true,
                ]
            );
            // Assign the 'admin' role to the user. The second argument (true) may set it as the primary role.
            $admin->addRole('admin', true);
        }
    }
}
