<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountRevoked extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $role;

    public function __construct(User $user, $role)
    {
        $this->user = $user;
        $this->role = $role;
    }

    public function build()
    {
        $roleLabel = ucfirst($this->role);
        
        return $this->markdown('emails.account-revoked')
            ->subject("Your {$roleLabel} Account Has Been Revoked - NEESH")
            ->with([
                'user' => $this->user,
                'role' => $this->role,
                'roleLabel' => $roleLabel
            ]);
    }
}

