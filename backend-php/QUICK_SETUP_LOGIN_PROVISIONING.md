# Quick Setup: Login Credential Provisioning

## What This Does

When you approve a user in the admin dashboard, they automatically receive login credentials via email. Choose between:
- **Magic Links** (recommended): Password-less click-to-login
- **Temporary Passwords**: Traditional email+password login

## Setup (5 minutes)

### 1. Update `.env`

```bash
# Choose one mode:
AUTH_PROVISIONING_MODE=password          # or "magic"
DASHBOARD_URL=https://app.neesh.art
```

### 2. Files Created

✅ `app/Services/AuthProvisioning.php` - Credential generation  
✅ `config/auth-provisioning.php` - Configuration  
✅ `app/Mail/ApplicationApproved.php` - Updated with credentials  
✅ `resources/views/emails/application-approved.blade.php` - Enhanced template  
✅ `app/Http/Controllers/AdminController.php` - Updated approval flow  

### 3. Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
```

## Test It

1. Go to admin dashboard
2. Find a pending user
3. Click "Approve"
4. Check your mail driver's output
5. User should receive email with login details

## Email Preview

**Subject:** "Your Publisher Application Approved 🎉 - NEESH"

**Contains:**
- Welcome message
- Login credentials (magic link OR temporary password)
- Role-specific next steps
- Support contact info

## Using Magic Links (Advanced)

If you set `AUTH_PROVISIONING_MODE=magic`:

Your **frontend** needs to handle `/auth/magic-link?token=XXX&email=user@example.com`

Example React component:
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MagicLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (token && email) {
      fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('auth_token', data.token);
          navigate('/dashboard');
        }
      });
    }
  }, []);

  return <div>Logging you in...</div>;
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not sending | Check `MAIL_DRIVER` in `.env`, verify SMTP credentials |
| Wrong credentials in email | Clear cache: `php artisan config:clear` |
| Magic link not working | Verify frontend handler exists at `/auth/magic-link` |
| Password not working | Check user record: `User::find($id)->password` |

## Configuration Options

Edit `config/auth-provisioning.php`:

```php
'mode' => 'password',                    // 'password' or 'magic'
'dashboard_url' => 'https://app.neesh.art',
'password' => ['length' => 12],          // Temp password length
'magic_link' => ['expiry_hours' => 24],  // Link expiration
```

## Security Notes

- ✅ Passwords are hashed before storage
- ✅ Magic links expire after 24 hours
- ⚠️ Temporary passwords sent in email (inherent risk - have users change immediately)
- ✅ All credentials generated server-side

## Next Steps

1. ✅ Configure `.env`
2. ✅ Test approval flow
3. ✅ If using magic: Implement frontend handler
4. ✅ Monitor email delivery
5. ⭐ Done! Users now get instant login access

## Full Documentation

See `LOGIN_PROVISIONING_GUIDE.md` for detailed implementation info.
