<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PublisherProfile;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class TestPublisherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates a test publisher application for email provisioning testing
     */
    public function run(): void
    {
        // Ensure Publisher role exists
        $publisherRole = Role::firstOrCreate(['name' => 'publisher']);

        // Create test user (pending verification - as if they just registered)
        $testUser = User::firstOrCreate(
            ['email' => 'swagnwanne7@gmail.com'],
            [
                'name' => 'Test Publisher',
                'password' => Hash::make('temporary123'), // Will be replaced on approval
                'email_verified_at' => null, // Not verified yet
            ]
        );

        // Assign publisher role
        if (!$testUser->hasRole('publisher')) {
            $testUser->assignRole($publisherRole);
        }

        // Create publisher profile
        PublisherProfile::firstOrCreate(
            ['user_id' => $testUser->id],
            [
                'company_name' => 'Test Publication Inc.',
                'payout_email' => 'swagnwanne7@gmail.com',
            ]
        );

        echo "\n✅ Test publisher created!\n";
        echo "   Email: swagnwanne7@gmail.com\n";
        echo "   Status: Pending approval\n";
        echo "   Role: Publisher\n";
        echo "\n📋 Next steps:\n";
        echo "   1. Go to admin dashboard\n";
        echo "   2. Navigate to Users list\n";
        echo "   3. Find 'Test Publisher' with email: swagnwanne7@gmail.com\n";
        echo "   4. Click 'Approve' button\n";
        echo "   5. Check mailpit (http://localhost:8025) for approval email\n";
        echo "   6. Email should contain login credentials\n";
        echo "   7. Test login with provided credentials\n\n";
    }
}
