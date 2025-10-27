@component('mail::message')
# Application Approved

Hello {{ $user->name }},

Congratulations! Your {{ $roleLabel }} application has been approved.

You can now log in to your NEESH account and start managing your profile.

@component('mail::button', ['url' => url('/login')])
Log In to Your Account
@endcomponent

If you have any questions or need assistance, please don't hesitate to contact our support team.

Thanks,  
The NEESH Team
@endcomponent

