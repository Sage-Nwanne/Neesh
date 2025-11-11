# Login Credential Provisioning for NEESH

## Overview

This system automatically provisions login credentials for users when their accounts are approved. It supports two modes:

1. **Magic Links** (Recommended) - Password-less login via email link
2. **Temporary Passwords** - Traditional password-based login

## Architecture

### Components

```
AuthProvisioning Service (app/Services/AuthProvisioning.php)
├── provisionUser() - Main entry point
├── provisionMagicLink() - Generate magic login link
├── provisionTempPassword() - Generate temporary password
└── generateSecurePassword() - Utility function

ApplicationApproved Mail (app/Mail/ApplicationApproved.php)
└── Receives credentials and passes to template

Email Template (resources/views/emails/application-approved.blade.php)
└── Displays credentials/link to user

AdminController (app/Http/Controllers/AdminController.php)
└── approveUser() - Orchestrates the approval workflow
```

### Data Flow

```
Admin clicks "Approve" in Dashboard
         ↓
AdminController::approveUser()
         ↓
AuthProvisioning::provisionUser()
         ↓
         ├─→ Magic Mode: Generate magic link token
         └─→ Password Mode: Generate temp password & hash it
         ↓
ApplicationApproved Mail (with credentials)
         ↓
User receives email with login details
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Authentication provisioning mode: 'magic' or 'password'
AUTH_PROVISIONING_MODE=password

# Dashboard/app URL for login links
DASHBOARD_URL=https://app.neesh.art

# Frontend app URL (fallback if DASHBOARD_URL not set)
APP_FRONTEND_URL=https://app.neesh.art
```

### Configuration File

Edit `config/auth-provisioning.php` to customize:

```php
// Choose authentication mode
'mode' => env('AUTH_PROVISIONING_MODE', 'password'),

// Dashboard URL for login links
'dashboard_url' => env('DASHBOARD_URL', 'https://app.neesh.art'),

// Temporary password settings
'password' => [
    'length' => 12,
    'include_special_chars' => true,
],

// Magic link settings
'magic_link' => [
    'expiry_hours' => 24,
    'token_length' => 32,
],
```

## Implementation Details

### Mode: Temporary Password

When `AUTH_PROVISIONING_MODE=password`:

1. Service generates a random 12-character password with special characters
2. Password is hashed and saved to user record
3. User receives email with **unhashed** temporary password
4. User must change password on first login

**Pros:**
- Familiar login experience
- Works with existing password reset flows
- No additional frontend changes needed

**Cons:**
- Password sent via email (security concern)
- User must remember to change password
- Less seamless UX

### Mode: Magic Link

When `AUTH_PROVISIONING_MODE=magic`:

1. Service generates a unique token
2. Token is stored in `password_reset_tokens` table
3. Magic link is created with token: `/auth/magic-link?token=XXX&email=user@example.com`
4. User clicks link in email to log in automatically
5. Frontend must handle magic link validation

**Pros:**
- Password-less login
- Better security (no password in email)
- Seamless UX
- Works like password reset flow
- 72-hour expiration gives users plenty of time

**Cons:**
- Requires frontend implementation
- Link expires after 72 hours
- Token stored separately

## Usage

### Basic Usage (in Controller or Command)

```php
use App\Services\AuthProvisioning;
use App\Models\User;
use App\Mail\ApplicationApproved;
use Illuminate\Support\Facades\Mail;

class ApprovalController extends Controller
{
    public function approve(User $user)
    {
        $provisioning = app(AuthProvisioning::class);
        
        // Provision credentials
        $credentials = $provisioning->provisionUser($user, 'publisher');
        
        // Send email
        Mail::to($user->email)->send(
            new ApplicationApproved(
                $user,
                'publisher',
                $credentials['loginLink'] ?? null,
                $credentials['tempCreds'] ?? null,
                $credentials['authMode'],
                $provisioning->getDashboardUrl()
            )
        );
    }
}
```

### Current Implementation

The `AdminController::approveUser()` method automatically handles this:

```php
public function approveUser($id)
{
    $user = User::findOrFail($id);
    
    // ... verification logic ...
    
    // Provision login credentials
    $provisioningData = $this->authProvisioning->provisionUser($user, $role);
    
    // Send email with credentials
    Mail::to($user->email)->send(
        new ApplicationApproved(
            $user,
            $role,
            $provisioningData['loginLink'] ?? null,
            $provisioningData['tempCreds'] ?? null,
            $provisioningData['authMode'],
            $this->authProvisioning->getDashboardUrl()
        )
    );
}
```

## Email Template

The Blade template `resources/views/emails/application-approved.blade.php` intelligently displays:

**For Magic Link Mode:**
- Single "Access Your Dashboard" button with magic link
- Note about 24-hour expiration
- Password reset instructions

**For Password Mode:**
- Panel showing email and temporary password
- Warnings about security
- "Sign In" button to dashboard

**Both Modes Include:**
- Role-specific next steps
- Contact information
- Professional branding

## Security Considerations

### Password Mode
- ✅ Passwords are hashed before storage
- ⚠️ Passwords sent in cleartext email (inherent risk)
- ✅ Passwords should be changed immediately
- ✅ Add password history to prevent reuse

### Magic Link Mode
- ✅ Links expire after 24 hours
- ✅ Links can only be used once
- ✅ Leverages existing Laravel token infrastructure
- ⚠️ Requires secure HTTPS for frontend
- ✅ Can be regenerated if needed

### General
- ✅ All credentials generated server-side
- ✅ Never log credentials
- ✅ Use HTTPS only for all communication
- ✅ Consider rate limiting on approval endpoint
- ✅ Log approval events for audit trail

## Frontend Integration (Magic Link Mode)

If using magic links, your frontend must:

```javascript
// On page load or specific route: /auth/magic-link
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const email = params.get('email');

if (token && email) {
    // Send to backend to validate and create session
    fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Set auth token, redirect to dashboard
            localStorage.setItem('auth_token', data.token);
            window.location.href = '/dashboard';
        }
    });
}
```

Backend endpoint:
```php
Route::post('/auth/magic-link', function (Request $request) {
    $validated = $request->validate([
        'token' => 'required|string',
        'email' => 'required|email'
    ]);
    
    // Verify token exists
    $record = \DB::table('password_reset_tokens')
        ->where('email', $validated['email'])
        ->first();
    
    if (!$record || !hash_equals($record->token, hash('sha256', $validated['token']))) {
        return response()->json(['success' => false, 'error' => 'Invalid token']);
    }
    
    $user = User::where('email', $validated['email'])->firstOrFail();
    
    // Create auth session/token
    Auth::login($user);
    
    // Clean up token
    \DB::table('password_reset_tokens')
        ->where('email', $validated['email'])
        ->delete();
    
    return response()->json(['success' => true, 'token' => $user->createToken('auth')->plainTextToken]);
});
```

## Testing

### Test Approving a User

```php
// Test in tinker
php artisan tinker

$user = User::first();
$controller = app(\App\Http\Controllers\AdminController::class);
$controller->approveUser($user->id);
```

### Test Email Rendering

```php
// In test file or tinker
use App\Mail\ApplicationApproved;
use App\Models\User;

$user = User::first();
$mail = new ApplicationApproved(
    $user,
    'publisher',
    'https://app.neesh.art/auth/magic-link?token=xyz',
    null,
    'magic',
    'https://app.neesh.art'
);

// Render HTML
echo $mail->render();

// Or send to test mailbox
Mail::to('test@example.com')->send($mail);
```

## Troubleshooting

### Issue: Emails not being sent
- Check `MAIL_DRIVER` in `.env` (should be `smtp` or your provider)
- Verify `MAIL_FROM_ADDRESS` and `MAIL_FROM_NAME`
- Check Laravel logs: `storage/logs/laravel.log`

### Issue: Temporary passwords not working
- Ensure password is actually being hashed
- Check that user record updated: `User::find($id)->password`
- Try resetting password through forgot password flow

### Issue: Magic links not working
- Verify token stored in `password_reset_tokens` table
- Check that frontend is receiving token and email parameters
- Ensure token hash verification logic matches

### Issue: Wrong auth mode being used
- Check `.env` for `AUTH_PROVISIONING_MODE`
- Check `config/auth-provisioning.php` cache
- Clear config cache: `php artisan config:clear`

## Database Migrations

If you want to track credential provisioning, add columns to users table:

```php
// database/migrations/YYYY_MM_DD_HHMMSS_add_provisioning_fields_to_users.php

Schema::table('users', function (Blueprint $table) {
    $table->timestamp('password_provisioned_at')->nullable();
    $table->string('provisioning_mode')->nullable(); // 'magic' or 'password'
    $table->boolean('initial_login_complete')->default(false);
});
```

Then update service:
```php
// In AuthProvisioning::provisionTempPassword()
$user->update([
    'password_provisioned_at' => now(),
    'provisioning_mode' => 'password'
]);
```

## Related Files

- `app/Services/AuthProvisioning.php` - Core provisioning logic
- `app/Mail/ApplicationApproved.php` - Mail class
- `resources/views/emails/application-approved.blade.php` - Email template
- `app/Http/Controllers/AdminController.php` - Approval workflow
- `config/auth-provisioning.php` - Configuration
- `config/auth.php` - Authentication config

## Next Steps

1. **Set `.env` variables** (see Configuration section)
2. **Choose auth mode** (password or magic)
3. **If using magic links**, implement frontend handler
4. **Test the approval flow** in admin dashboard
5. **Monitor emails** to verify delivery

## Switching Between Modes

To switch from password to magic (or vice versa):

```bash
# Edit .env
AUTH_PROVISIONING_MODE=magic

# Clear config cache
php artisan config:clear

# Next approvals will use new mode
```

No database migrations needed - both modes use existing infrastructure.
