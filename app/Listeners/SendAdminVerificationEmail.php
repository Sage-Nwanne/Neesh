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

        // Admin email (change this to your admin’s email)
        $adminEmail = "hi@neesh.art";

        // Send mail to admin with user details
        Mail::to($adminEmail)->send(new VerifyNewUser($user));
    }
}
