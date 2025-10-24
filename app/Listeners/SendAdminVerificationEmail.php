<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\VerifyNewUser;

class SendAdminVerificationEmail
{
    public function handle(Registered $event)
    {
        $user = $event->user;
        $adminEmail = env('ADMIN_EMAIL');

        // Only send email if ADMIN_EMAIL is configured
        if (empty($adminEmail)) {
            Log::warning('ADMIN_EMAIL is not configured. Skipping admin verification email for user: ' . $user->email);
            return;
        }

        // Send admin to user details page
        $verificationUrl = route('admin.users.view', $user->id);

        try {
            Mail::to($adminEmail)->send(new VerifyNewUser($user, $verificationUrl));
        } catch (\Exception $e) {
            Log::error('Failed to send admin verification email: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'admin_email' => $adminEmail,
            ]);
        }
    }
}
