# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for publisher and retailer applications using Resend and Supabase Edge Functions.

## 🎯 What This Sets Up

- **Automatic email notifications** when new applications are submitted
- **Publisher application emails** with full application details
- **Retailer application emails** with shop and contact information
- **Secure email delivery** using Resend API
- **Database triggers** that automatically send emails on new submissions

## 📋 Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Supabase CLI**: Install with `npm install -g supabase`
3. **Domain Verification**: Verify your sending domain in Resend (optional but recommended)

## 🚀 Step-by-Step Setup

### Step 1: Get Your Resend API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `re_`)

### Step 2: Apply RLS Policies (if not done already)

Run the RLS setup SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the content from backend/scripts/rls-setup.sql
-- This enables anonymous application submissions
```

### Step 3: Deploy Email Functions

Run the deployment script:

```bash
# From project root directory
./backend/scripts/deploy-email-functions.sh
```

Or manually deploy:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref smfzrubkyxejzkblrrjr

# Deploy functions
supabase functions deploy publisher-notify
supabase functions deploy retailer-notify
```

### Step 4: Set Environment Variables

1. Go to [Supabase Functions Settings](https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/settings/functions)
2. Add environment variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (from Step 1)

### Step 5: Set Up Database Triggers

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql)
2. Copy and paste the content from `backend/scripts/setup-email-notifications.sql`
3. Click **Run**

### Step 6: Test the Setup

Run the test script to verify everything works:

```bash
cd backend && node scripts/test-rls-policies.js
```

## 📧 Email Templates

### Publisher Application Email
- **To**: hi@neesh.art
- **Subject**: 📚 Publisher Application — [Magazine Title]
- **Content**: Full application details including magazine info, pricing, distribution, etc.

### Retailer Application Email
- **To**: hi@neesh.art  
- **Subject**: 🆕 Retailer Application [App Number] — [Shop Name]
- **Content**: Shop details, contact info, business information, etc.

## 🔧 Customization

### Change Email Recipients

Edit the functions in `supabase/functions/*/index.ts`:

```typescript
// In publisher-notify/index.ts or retailer-notify/index.ts
body: JSON.stringify({
  from: 'Neesh Applications <applications@neesh.art>',
  to: ['your-email@domain.com'], // Change this
  subject: subject,
  html: html,
}),
```

### Customize Email Templates

Modify the `html` variable in the function files to change the email layout and content.

### Add Multiple Recipients

```typescript
to: ['admin@neesh.art', 'notifications@neesh.art'],
```

## 🧪 Testing

### Test Publisher Application
```bash
# Submit a test application through the frontend form
# Check your email for the notification
```

### Test Email Function Directly
```bash
# Test the function endpoint
curl -X POST 'https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/publisher-notify' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"record": {"magazine_title": "Test Magazine", "email": "test@example.com"}}'
```

## 🔍 Troubleshooting

### Common Issues

1. **"RESEND_API_KEY not configured"**
   - Make sure you added the API key in Supabase Functions settings
   - Redeploy the functions after adding the environment variable

2. **"Function not found"**
   - Ensure functions are deployed: `supabase functions list`
   - Check function logs: `supabase functions logs publisher-notify`

3. **"Email sending failed"**
   - Verify your Resend API key is valid
   - Check if your domain is verified in Resend
   - Review function logs for detailed error messages

4. **"Trigger not firing"**
   - Verify triggers exist: Check in Supabase Dashboard > Database > Triggers
   - Ensure RLS policies allow anonymous insertions
   - Check if the http extension is enabled

### Debug Commands

```bash
# Check function logs
supabase functions logs publisher-notify --follow

# List deployed functions
supabase functions list

# Test database connection
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

## 🔒 Security Notes

- Functions use service role key for database access
- Email API key is stored securely in Supabase environment
- Triggers only fire on INSERT operations (new applications)
- RLS policies prevent unauthorized data access

## 📈 Monitoring

- Monitor email delivery in [Resend Dashboard](https://resend.com/emails)
- Check function execution in Supabase Functions logs
- Track application submissions in your admin dashboard

## 🎉 Success!

Once set up, you'll automatically receive email notifications whenever:
- A new publisher submits an application
- A new retailer submits an application
- All application details are included in the email
- Emails are delivered reliably through Resend

The system is now ready for production use!
