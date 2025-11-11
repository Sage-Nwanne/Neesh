<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\PublisherProfile;
use App\Models\RetailerProfile;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class CreateTestUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:create-users {--publisher-email=swagnwanne7@gmail.com} {--retailer-email=testretailer@example.com}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test users for email provisioning testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Creating test users for provisioning testing...\n');

        try {
            // Ensure roles exist
            $publisherRole = Role::firstOrCreate(['name' => 'publisher']);
            $retailerRole = Role::firstOrCreate(['name' => 'retailer']);

            $publisherEmail = $this->option('publisher-email');
            $retailerEmail = $this->option('retailer-email');

            // Create test publisher
            $this->createPublisher($publisherEmail, $publisherRole);

            // Create test retailer
            $this->createRetailer($retailerEmail, $retailerRole);

            $this->info("\n✅ Test users created successfully!\n");
            $this->showInstructions($publisherEmail, $retailerEmail);

        } catch (\Exception $e) {
            $this->error('❌ Error creating test users: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function createPublisher($email, $role)
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Test Publisher',
                'password' => Hash::make('temporary123'),
                'email_verified_at' => null,
            ]
        );

        if (!$user->hasRole('publisher')) {
            $user->assignRole($role);
        }

        PublisherProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'company_name' => 'Test Publication Inc.',
                'payout_email' => $email,
            ]
        );

        $this->line("   ✅ Publisher created:");
        $this->line("      Email: <info>{$email}</info>");
        $this->line("      Status: Pending approval");
        $this->line("      Role: Publisher");
    }

    private function createRetailer($email, $role)
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Test Retailer',
                'password' => Hash::make('temporary123'),
                'email_verified_at' => null,
            ]
        );

        if (!$user->hasRole('retailer')) {
            $user->assignRole($role);
        }

        RetailerProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'business_name' => 'Test Retail Store',
                'address' => '123 Test Street, Test City, TC 12345',
            ]
        );

        $this->line("   ✅ Retailer created:");
        $this->line("      Email: <info>{$email}</info>");
        $this->line("      Status: Pending approval");
        $this->line("      Role: Retailer");
    }

    private function showInstructions($publisherEmail, $retailerEmail)
    {
        $this->info("\n📋 NEXT STEPS TO TEST EMAIL PROVISIONING:\n");

        $this->line("1️⃣  Start your Laravel server (if not running):");
        $this->line("   <fg=blue>php artisan serve</>");

        $this->line("\n2️⃣  Open admin dashboard:");
        $this->line("   <fg=blue>http://localhost:8000/admin/dashboard</>");

        $this->line("\n3️⃣  Navigate to Users:");
        $this->line("   Click 'Users' in the sidebar");

        $this->line("\n4️⃣  Find and approve test user:");
        $this->line("   - Look for <info>{$publisherEmail}</info> (Publisher)");
        $this->line("   - Click the 'Approve' button");

        $this->line("\n5️⃣  Check mailpit for approval email:");
        $this->line("   <fg=blue>http://localhost:8025</>");
        $this->line("   You should see an email with:");
        $this->line("   - Subject: 'Your Publisher Application Approved 🎉 - NEESH'");
        $this->line("   - Login credentials in the email");

        $this->line("\n6️⃣  Test login:");
        $this->line("   - Go to login page: <fg=blue>http://localhost:8000/login</>");
        $this->line("   - Use email from the provisioning email");
        $this->line("   - Use temporary password from the provisioning email");
        $this->line("   - You should be logged in! ✅");

        $this->line("\n7️⃣  Verify provisioning worked:");
        $this->line("   - You should land on the Publisher dashboard");
        $this->line("   - You may be prompted to change your password");
        $this->line("   - This is normal - sign out and log back in with new password");

        $this->info("\n🎯 SUCCESS INDICATORS:\n");
        $this->line("   ✅ Email received in mailpit");
        $this->line("   ✅ Email contains login credentials");
        $this->line("   ✅ Can log in with provided credentials");
        $this->line("   ✅ Correct dashboard loads based on role");

        $this->info("\n💡 TIPS:\n");
        $this->line("   • Check mailpit at <fg=blue>http://localhost:8025</> for all emails");
        $this->line("   • Admin credentials: admin@neesh.com / admin123");
        $this->line("   • Check Laravel logs for any errors: <fg=blue>tail -f storage/logs/laravel.log</>");
    }
}
