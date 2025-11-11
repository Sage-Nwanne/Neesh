<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\RetailerProfile;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class TestRetailerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates a test retailer application for email provisioning testing
     */
    public function run(): void
    {
        // Ensure Retailer role exists
        $retailerRole = Role::firstOrCreate(['name' => 'retailer']);

        // Create test retailer user (pending verification)
        $testUser = User::firstOrCreate(
            ['email' => 'testretailer@example.com'],
            [
                'name' => 'Test Retailer',
                'password' => Hash::make('temporary123'),
                'email_verified_at' => null,
            ]
        );

        // Assign retailer role
        if (!$testUser->hasRole('retailer')) {
            $testUser->assignRole($retailerRole);
        }

        // Create retailer profile
        RetailerProfile::firstOrCreate(
            ['user_id' => $testUser->id],
            [
                'business_name' => 'Test Retail Store',
                'address' => '123 Test Street, Test City, TC 12345',
            ]
        );

        echo "\n✅ Test retailer created!\n";
        echo "   Email: testretailer@example.com\n";
        echo "   Status: Pending approval\n";
        echo "   Role: Retailer\n\n";
    }
}
