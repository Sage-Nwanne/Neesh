@component('mail::message')
# Account Revoked

Hello {{ $user->name }},

Your {{ $roleLabel }} account on NEESH has been revoked by our admin team. This means you no longer have access to your dashboard and associated features.

If you believe this is a mistake or would like to discuss this decision, please contact our support team at support@neesh.art.

Thanks,  
The NEESH Team
@endcomponent

