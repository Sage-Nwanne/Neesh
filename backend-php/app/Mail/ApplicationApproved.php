<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationApproved extends Mailable
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
        
        return $this->markdown('emails.application-approved')
            ->subject("Your {$roleLabel} Application Approved - NEESH")
            ->with([
                'user' => $this->user,
                'role' => $this->role,
                'roleLabel' => $roleLabel
            ]);
    }
}

