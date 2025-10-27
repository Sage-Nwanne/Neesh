@component('mail::message')
# Application Received

Hello {{ $user->name }},

Thank you for submitting your {{ $roleLabel }} application to NEESH. We have received your application and our team is reviewing it.

You will receive an email notification once your application has been reviewed. This typically takes 2-3 business days.

In the meantime, if you have any questions, please don't hesitate to reach out to our team.

Thanks,  
The NEESH Team
@endcomponent

