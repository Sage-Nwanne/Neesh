# Login Provisioning API Documentation

## Overview

The login provisioning system provides automated credential generation and delivery for NEESH user approvals. This document covers the service API, configuration, and integration points.

---

## AuthProvisioning Service API

**Location:** `app/Services/AuthProvisioning.php`

### Public Methods

#### `provisionUser(User $user, string $role = 'user'): array`

Generates login credentials for a user and returns provisioning data.

**Parameters:**
- `$user` (User): The user model instance
- `$role` (string): User role for context (publisher, retailer, etc.)

**Returns:**
```php
// Magic link mode:
[
    'loginLink' => 'https://app.neesh.art/auth/magic-link?token=xyz&email=...',
    'authMode' => 'magic'
]

// Password mode:
[
    'tempCreds' => [
        'email' => 'user@example.com',
        'password' => 'Temp123!@#'
    ],
    'authMode' => 'password'
]
```

**Example:**
```php
$provisioning = app(AuthProvisioning::class);
$data = $provisioning->provisionUser($user, 'publisher');

if ($data['authMode'] === 'magic') {
    $link = $data['loginLink'];
} else {
    $email = $data['tempCreds']['email'];
    $password = $data['tempCreds']['password'];
}
```

**Throws:**
- `Exception` - If credential generation fails

---

#### `getAuthMode(): string`

Returns the current authentication mode.

**Returns:**
```php
'magic'     // or 'password'
```

**Example:**
```php
$mode = $provisioning->getAuthMode();
if ($mode === 'magic') {
    // Use magic link flow
} else {
    // Use password flow
}
```

---

#### `getDashboardUrl(): string`

Returns the configured dashboard URL.

**Returns:**
```php
'https://app.neesh.art'
```

**Example:**
```php
$url = $provisioning->getDashboardUrl();
$loginUrl = $url . '/login';
```

---

## ApplicationApproved Mail Class API

**Location:** `app/Mail/ApplicationApproved.php`

### Constructor

```php
public function __construct(
    User $user,
    string $role,
    ?string $loginLink = null,
    ?array $tempCreds = null,
    string $authMode = 'password',
    string $dashboardUrl = 'https://app.neesh.art'
)
```

**Parameters:**
- `$user` (User): User model instance
- `$role` (string): User's role (publisher, retailer)
- `$loginLink` (string|null): Magic link URL
- `$tempCreds` (array|null): Temporary credentials array
- `$authMode` (string): 'magic' or 'password'
- `$dashboardUrl` (string): Frontend dashboard URL

**Example:**
```php
$mail = new ApplicationApproved(
    $user,
    'publisher',
    'https://app.neesh.art/auth/magic-link?token=xyz...',
    null,  // No temp credentials in magic mode
    'magic',
    'https://app.neesh.art'
);

Mail::to($user->email)->send($mail);
```

---

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `$user` | User | User model instance |
| `$role` | string | User's role |
| `$loginLink` | string\|null | Magic link for password-less login |
| `$tempCreds` | array\|null | Temporary credentials {email, password} |
| `$authMode` | string | 'magic' or 'password' |
| `$dashboardUrl` | string | Frontend URL |

---

### Methods

#### `build(): \Illuminate\Mail\Message`

Builds the mail message. Called by Mail facade automatically.

**Returns:** Mailable instance

**Example:**
```php
$mail = new ApplicationApproved($user, $role, ...);
// build() is called automatically when sending:
Mail::to($user->email)->send($mail);
```

---

## Configuration API

**Location:** `config/auth-provisioning.php`

### Configuration Keys

#### `mode`
```php
'mode' => 'password'  // or 'magic'
```
- **Type:** string
- **Default:** 'password'
- **Env:** `AUTH_PROVISIONING_MODE`

#### `dashboard_url`
```php
'dashboard_url' => 'https://app.neesh.art'
```
- **Type:** string
- **Default:** From `DASHBOARD_URL` env or `APP_FRONTEND_URL`
- **Env:** `DASHBOARD_URL`, `APP_FRONTEND_URL`

#### `password`
```php
'password' => [
    'length' => 12,
    'include_special_chars' => true,
]
```
- **length** (int): Password length (default: 12)
- **include_special_chars** (bool): Include special characters (default: true)

#### `magic_link`
```php
'magic_link' => [
    'expiry_hours' => 72,
    'token_length' => 32,
]
```
- **expiry_hours** (int): Hours until link expires (default: 72 / 3 days)
- **token_length** (int): Token string length (default: 32)

---

## Usage Examples

### Basic Usage

```php
// 1. Get provisioning service
$provisioning = app(\App\Services\AuthProvisioning::class);

// 2. Provision user
$credentials = $provisioning->provisionUser($user, 'publisher');

// 3. Send email
Mail::to($user->email)->send(
    new \App\Mail\ApplicationApproved(
        $user,
        'publisher',
        $credentials['loginLink'] ?? null,
        $credentials['tempCreds'] ?? null,
        $credentials['authMode'],
        $provisioning->getDashboardUrl()
    )
);
```

### In Controller with Dependency Injection

```php
<?php

namespace App\Http\Controllers;

use App\Services\AuthProvisioning;

class ApprovalController extends Controller
{
    public function __construct(private AuthProvisioning $provisioning)
    {}

    public function approveUser($id)
    {
        $user = User::findOrFail($id);
        
        // Provision automatically
        $creds = $this->provisioning->provisionUser($user, 'publisher');
        
        // Send email
        Mail::to($user->email)->send(
            new ApplicationApproved(
                $user,
                'publisher',
                $creds['loginLink'] ?? null,
                $creds['tempCreds'] ?? null,
                $creds['authMode'],
                $this->provisioning->getDashboardUrl()
            )
        );
    }
}
```

### In Artisan Command

```php
<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\AuthProvisioning;
use App\Mail\ApplicationApproved;
use Illuminate\Support\Facades\Mail;

class ApproveUsersCommand extends Command
{
    protected $signature = 'users:approve {user_id}';

    public function handle(AuthProvisioning $provisioning)
    {
        $user = User::findOrFail($this->argument('user_id'));
        $role = $user->roles->first()->name ?? 'user';

        $creds = $provisioning->provisionUser($user, $role);

        Mail::to($user->email)->send(
            new ApplicationApproved(
                $user,
                $role,
                $creds['loginLink'] ?? null,
                $creds['tempCreds'] ?? null,
                $creds['authMode'],
                $provisioning->getDashboardUrl()
            )
        );

        $this->info("User {$user->email} approved and notified.");
    }
}
```

### Magic Link Mode with Frontend Handler

```php
// Backend API endpoint for validating magic links
Route::post('/api/auth/magic-link', function (Request $request) {
    $validated = $request->validate([
        'token' => 'required|string',
        'email' => 'required|email'
    ]);

    $record = DB::table('password_reset_tokens')
        ->where('email', $validated['email'])
        ->first();

    if (!$record || !hash_equals($record->token, hash('sha256', $validated['token']))) {
        return response()->json(['success' => false], 401);
    }

    $user = User::where('email', $validated['email'])->firstOrFail();
    Auth::login($user);

    // Clean up token
    DB::table('password_reset_tokens')
        ->where('email', $validated['email'])
        ->delete();

    return response()->json([
        'success' => true,
        'token' => $user->createToken('auth')->plainTextToken
    ]);
});
```

---

## Error Handling

### Common Errors

#### Invalid User
```php
try {
    $provisioning->provisionUser($invalidUser, 'publisher');
} catch (ModelNotFoundException $e) {
    // User not found
    Log::error('User not found', ['error' => $e->getMessage()]);
}
```

#### Database Errors
```php
try {
    $provisioning->provisionUser($user, 'publisher');
} catch (\PDOException $e) {
    // Database error (token storage failure)
    Log::error('Database error', ['error' => $e->getMessage()]);
}
```

#### Email Sending Errors
```php
try {
    Mail::to($user->email)->send($mail);
} catch (Swift_TransportException $e) {
    // SMTP/email service error
    Log::error('Email send error', ['error' => $e->getMessage()]);
}
```

---

## Events & Hooks

### After Provisioning

Add custom logic after credentials are provisioned:

```php
// In service provider or middleware
Event::listen('user.approved', function ($user, $credentials) {
    // Log approval
    Log::info("User {$user->email} approved", ['mode' => $credentials['authMode']]);
    
    // Notify admins
    Notification::send($admins, new UserApprovedNotification($user));
    
    // Update metrics
    Cache::increment('users_approved_today');
});
```

### Before Sending Email

Modify email before sending:

```php
$mail = new ApplicationApproved($user, $role, ...);

// Hook into mail sending
Mail::listen(function (MessageSending $event) {
    $event->message->getHeaders()->addTextHeader('X-Approved-By', auth()->id());
});

Mail::to($user->email)->send($mail);
```

---

## Testing

### Unit Testing

```php
<?php

namespace Tests\Unit;

use App\Services\AuthProvisioning;
use App\Models\User;
use Tests\TestCase;

class AuthProvisioningTest extends TestCase
{
    public function test_provision_user_with_password_mode()
    {
        $user = User::factory()->create();
        $provisioning = app(AuthProvisioning::class);

        $result = $provisioning->provisionUser($user, 'publisher');

        $this->assertArrayHasKey('tempCreds', $result);
        $this->assertArrayHasKey('email', $result['tempCreds']);
        $this->assertArrayHasKey('password', $result['tempCreds']);
        $this->assertEquals('password', $result['authMode']);
    }

    public function test_provision_user_with_magic_mode()
    {
        config(['auth-provisioning.mode' => 'magic']);
        
        $user = User::factory()->create();
        $provisioning = app(AuthProvisioning::class);

        $result = $provisioning->provisionUser($user, 'publisher');

        $this->assertArrayHasKey('loginLink', $result);
        $this->assertStringContainsString('magic-link', $result['loginLink']);
        $this->assertEquals('magic', $result['authMode']);
    }
}
```

### Feature Testing

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Mail\ApplicationApproved;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class UserApprovalTest extends TestCase
{
    public function test_user_receives_approval_email_with_credentials()
    {
        Mail::fake();

        $user = User::factory()->create();
        
        $this->post("/admin/users/{$user->id}/approve");

        Mail::assertSent(ApplicationApproved::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }
}
```

---

## Performance Considerations

### Database Queries
- **Minimal impact:** Only reads user record, writes token if magic link
- **Indexed fields:** email in password_reset_tokens for fast lookup

### Memory Usage
- **Low:** Service is stateless
- **Token size:** ~60 bytes per user (negligible)

### Email Sending
- **Queued:** Use Mail queue for async sending
- **Batch:** Can approve multiple users without performance hit

```php
// Queue emails for later
Mail::queue(new ApplicationApproved(...));
```

---

## Security Best Practices

✅ **Use HTTPS only** - Credentials sent over encrypted connections  
✅ **Rate limit approvals** - Prevent abuse  
✅ **Log all approvals** - Audit trail  
✅ **Monitor email delivery** - Catch failures  
✅ **Enforce password changes** - After first login  
✅ **Expire magic links** - 24 hours maximum  
✅ **Hash tokens** - In database  

---

## Migration Guide

### From Manual Passwords

```php
// Old way
$user->password = bcrypt('manual-password');
$user->save();
// Send email manually with password

// New way
$provisioning = app(AuthProvisioning::class);
$creds = $provisioning->provisionUser($user, 'publisher');
// Email sent automatically with credentials
```

### From Supabase

```typescript
// Old Firebase way
const { loginLink, tempCreds } = await provisionUser(email, name);

// New Laravel way
$provisioning = app(AuthProvisioning::class);
$result = $provisioning->provisionUser($user, $role);
// Same structure, local provisioning
```

---

## Troubleshooting API

### Get current auth mode
```php
$mode = $provisioning->getAuthMode();
```

### Get dashboard URL
```php
$url = $provisioning->getDashboardUrl();
```

### Check config
```php
dd(config('auth-provisioning'));
```

### View generated credentials (DEBUG ONLY)
```php
$provisioning = app(AuthProvisioning::class);
$result = $provisioning->provisionUser($user, 'publisher');

// For password mode
dd($result['tempCreds']['password']);  // Shows unhashed password
```

---

## Release Notes

### Version 1.0 (Nov 2025)
- ✅ Initial release
- ✅ Magic link support
- ✅ Temporary password support
- ✅ Full integration with AdminController
- ✅ Complete documentation

### Future Enhancements
- [ ] Credential regeneration endpoint
- [ ] Magic link resend
- [ ] Password expiration tracking
- [ ] Two-factor authentication support
- [ ] Social login integration
- [ ] Webhook notifications

---

## Support & Questions

For implementation questions, see:
- `LOGIN_PROVISIONING_GUIDE.md` - Complete technical guide
- `QUICK_SETUP_LOGIN_PROVISIONING.md` - Quick reference
- `ARCHITECTURE_DIAGRAM.md` - System design
- `BEFORE_AFTER_COMPARISON.md` - What changed

---

**API Version:** 1.0  
**Last Updated:** November 11, 2025  
**Status:** Production Ready
