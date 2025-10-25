<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure Admin role exists
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Create default admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'gem@neesh.art'], // check if already exists
            [
                'name' => 'Admin',
                'password' => Hash::make('Neeshis@dmin'),
                'email_verified_at' => now(), // mark as verified
            ]
        );

        // Assign role
        if (!$adminUser->hasRole('admin')) {
            $adminUser->assignRole($adminRole);
        }
    }
}
