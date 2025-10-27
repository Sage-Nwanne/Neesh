<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $role;
    public $reason;

    public function __construct(User $user, $role, $reason = null)
    {
        $this->user = $user;
        $this->role = $role;
        $this->reason = $reason;
    }

    public function build()
    {
        $roleLabel = ucfirst($this->role);
        
        return $this->markdown('emails.application-rejected')
            ->subject("Your {$roleLabel} Application Status - NEESH")
            ->with([
                'user' => $this->user,
                'role' => $this->role,
                'roleLabel' => $roleLabel,
                'reason' => $this->reason
            ]);
    }
}

