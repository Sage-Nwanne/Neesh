<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyNewUser extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
 public $verificationUrl; // ✅ declare it


    public function __construct(User $user  , $verificationUrl)
    {
        $this->user = $user;
        $this->verificationUrl = $verificationUrl;
    }

    public function build()
    {
        return $this->markdown('emails.verify-user')
            ->subject("New User Verification Needed")
            ->with([
                'user' => $this->user,
                'verificationUrl' => $this->verificationUrl
            ]);
    }
}
