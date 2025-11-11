@component('mail::message')
# Your {{ $roleLabel }} Application Approved 🎉

Hello {{ $user->name }},

Congratulations! Your {{ strtolower($roleLabel) }} application has been approved.

Your NEESH account is now active and ready to use. Below are your login details:

@if($authMode === 'magic' && $loginLink)
{{-- Magic Link Mode --}}
@component('mail::button', ['url' => $loginLink])
Access Your Dashboard
@endcomponent

This magic link will expire in 3 days (72 hours). You can safely reset your password after logging in.

@else
{{-- Password Mode --}}
@component('mail::panel')
**Email:** {{ $tempCreds['email'] ?? $user->email }}  
**Temporary Password:** `{{ $tempCreds['password'] ?? 'N/A' }}`
@endcomponent

**Important:** 
- Please change your password immediately after first login for security
- Do not share this temporary password with anyone
- If you didn't request this, please contact support immediately

@component('mail::button', ['url' => $dashboardUrl . '/login'])
Sign In to Your Account
@endcomponent

@endif

## Next Steps for {{ $roleLabel }}s

@if(strtolower($roleLabel) === 'publisher')
1. **Complete Your Profile** - Add company details, banking info, and tax documents
2. **Upload Your Titles** - Start listing your magazines with wholesale pricing
3. **Set Terms** - Define your discount tiers and minimum order quantities
4. **Monitor Sales** - Track orders, returns, and payouts in real-time

@else
1. **Browse Magazines** - Explore our curated selection matched to your store
2. **Place a Trial Order** - Start with a small order to test the process
3. **Manage Preferences** - Set your store location, product preferences, and delivery address
4. **Automate Reorders** - Set up recurring orders for your best sellers
@endif

## Support

If you have any questions or encounter any issues, our support team is here to help:
- **Email:** support@neesh.art
- **Response Time:** Within 24 hours

We're excited to have you on NEESH!

Thanks,  
The NEESH Team
@endcomponent

