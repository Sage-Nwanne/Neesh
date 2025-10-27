@component('mail::message')
# Application Status Update

Hello {{ $user->name }},

Thank you for your interest in joining NEESH as a {{ $roleLabel }}.

After careful review of your application, we regret to inform you that we are unable to move forward at this time.

@if($reason)
**Reason:** {{ $reason }}
@endif

We encourage you to reapply in the future. If you have any questions about this decision, please feel free to contact our team.

Thanks,  
The NEESH Team
@endcomponent

