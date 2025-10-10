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

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->markdown('emails.verify-user')
            ->subject("New User Verification Needed")
            ->with([
                'user' => $this->user,
                'verificationUrl' => route('admin.verify.user', $this->user->id),
            ]);
    }
}
