<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyNewUser;

class SendAdminVerificationEmail
{
    public function handle(Registered $event)
    {
        $user = $event->user;
        $adminEmail = env('ADMIN_EMAIL');

        // Send admin to user details page
        $verificationUrl = route('admin.users.view', $user->id);

        Mail::to($adminEmail)->send(new VerifyNewUser($user, $verificationUrl));
    }
}
