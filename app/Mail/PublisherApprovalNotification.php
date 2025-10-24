<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PublisherApprovalNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $dashboardUrl;

    public function __construct(User $user, $dashboardUrl)
    {
        $this->user = $user;
        $this->dashboardUrl = $dashboardUrl;
    }

    public function build()
    {
        return $this->markdown('emails.publisher-approval-notification')
            ->subject("Your Neesh Publisher Account is Approved!")
            ->with([
                'user' => $this->user,
                'dashboardUrl' => $this->dashboardUrl,
            ]);
    }
}

