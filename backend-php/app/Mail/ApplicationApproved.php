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
    public $loginLink;
    public $tempCreds;
    public $authMode;
    public $dashboardUrl;

    /**
     * Create a new message instance.
     * 
     * @param User $user
     * @param string $role The user's role (publisher, retailer, etc.)
     * @param string|null $loginLink Magic link for password-less login
     * @param array|null $tempCreds Temporary credentials {email, password}
     * @param string $authMode Authentication mode (magic or password)
     * @param string $dashboardUrl URL to the dashboard/app
     */
    public function __construct(
        User $user,
        string $role,
        ?string $loginLink = null,
        ?array $tempCreds = null,
        string $authMode = 'password',
        string $dashboardUrl = 'https://app.neesh.art'
    ) {
        $this->user = $user;
        $this->role = $role;
        $this->loginLink = $loginLink;
        $this->tempCreds = $tempCreds;
        $this->authMode = $authMode;
        $this->dashboardUrl = $dashboardUrl;
    }

    public function build()
    {
        $roleLabel = ucfirst($this->role);
        
        return $this->markdown('emails.application-approved')
            ->to($this->user->email)
            ->subject("Your {$roleLabel} Application Approved 🎉 - NEESH")
            ->with([
                'user' => $this->user,
                'role' => $this->role,
                'roleLabel' => $roleLabel,
                'loginLink' => $this->loginLink,
                'tempCreds' => $this->tempCreds,
                'authMode' => $this->authMode,
                'dashboardUrl' => $this->dashboardUrl
            ]);
    }
}

