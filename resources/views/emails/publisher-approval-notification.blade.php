@component('mail::message')
# Your Publisher Account is Approved! 🎉

Hello {{ $user->name }},

Great news! Your publisher application has been approved and your account is now active on Neesh.

## You're All Set!

Your publisher dashboard is now available and ready to use. You can start managing your magazines, track sales, and connect with retailers.

@component('mail::button', ['url' => $dashboardUrl])
Access Your Dashboard
@endcomponent

## What You Can Do Now

- Upload and manage your magazine listings
- View retailer orders and inquiries
- Track your sales and analytics
- Manage your publisher profile and settings

## Need Help?

If you have any questions or need assistance getting started, our support team is here to help. Just reply to this email or visit our help center.

Welcome to the Neesh community!

Thanks,  
**The Neesh Team**
@endcomponent

