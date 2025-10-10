@component('mail::message')
# New User Registration

A new user has registered and needs admin verification.

**Name:** {{ $user->name }}  
**Email:** {{ $user->email }}

@component('mail::button', ['url' => $verificationUrl])
Verify This User
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
