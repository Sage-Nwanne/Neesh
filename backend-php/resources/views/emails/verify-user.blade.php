@component('mail::message')
# New User Registration

A new {{ ucfirst($user->roles->pluck('name')->first()) }} has registered and needs admin verification.

**Name:** {{ $user->name }}  
**Email:** {{ $user->email }}

@component('mail::button', ['url' => $verificationUrl])
View & Verify User
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
