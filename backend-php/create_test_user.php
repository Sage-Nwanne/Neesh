<?php

// Load Laravel environment
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\PublisherProfile;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

try {
    echo "\n🔄 Creating test user...\n\n";

    // Ensure Publisher role exists
    $publisherRole = Role::firstOrCreate(['name' => 'publisher']);
    echo "✅ Publisher role ensured\n";

    // Create test user
    $testUser = User::firstOrCreate(
        ['email' => 'swagnwanne7@gmail.com'],
        [
            'name' => 'Test Publisher',
            'password' => Hash::make('temporary123'),
            'email_verified_at' => null,
        ]
    );
    echo "✅ Test user created/verified\n";

    // Assign publisher role
    if (!$testUser->hasRole('publisher')) {
        $testUser->assignRole($publisherRole);
    }
    echo "✅ Publisher role assigned\n";

    // Create publisher profile
    PublisherProfile::firstOrCreate(
        ['user_id' => $testUser->id],
        [
            'company_name' => 'Test Publication Inc.',
            'payout_email' => 'swagnwanne7@gmail.com',
        ]
    );
    echo "✅ Publisher profile created\n";

    echo "\n" . str_repeat("=", 60) . "\n";
    echo "✅ TEST USER CREATED SUCCESSFULLY!\n";
    echo str_repeat("=", 60) . "\n\n";

    echo "📋 USER DETAILS:\n";
    echo "   Email: swagnwanne7@gmail.com\n";
    echo "   Status: PENDING APPROVAL\n";
    echo "   Role: Publisher\n";
    echo "   Company: Test Publication Inc.\n";

    echo "\n📍 NEXT STEPS:\n\n";
    echo "1. Open your browser and go to:\n";
    echo "   👉 http://127.0.0.1:8000/admin/dashboard\n\n";

    echo "2. Login with admin credentials:\n";
    echo "   Email: admin@neesh.com\n";
    echo "   Password: admin123\n\n";

    echo "3. Navigate to 'Users' in the admin dashboard\n\n";

    echo "4. Find 'Test Publisher' (swagnwanne7@gmail.com) in the list\n\n";

    echo "5. Click the 'Approve' button next to the user\n\n";

    echo "6. You should see a success message:\n";
    echo "   'User approved successfully! Approval email with login details sent.'\n\n";

    echo "7. Check mailpit for the approval email:\n";
    echo "   👉 http://localhost:8025\n\n";

    echo "8. The email will contain:\n";
    echo "   ✓ Approval message\n";
    echo "   ✓ Temporary password (12 random characters)\n";
    echo "   ✓ Link to sign in\n";
    echo "   ✓ Next steps for the publisher\n\n";

    echo "9. Go to login page:\n";
    echo "   👉 http://127.0.0.1:8000/login\n\n";

    echo "10. Enter the credentials from the email:\n";
    echo "    Email: swagnwanne7@gmail.com\n";
    echo "    Password: (from the provisioning email)\n\n";

    echo "11. You should be logged in and see the Publisher dashboard! 🎉\n\n";

    echo str_repeat("=", 60) . "\n";
    echo "✅ READY TO TEST EMAIL PROVISIONING\n";
    echo str_repeat("=", 60) . "\n\n";

} catch (\Exception $e) {
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
