# Login Provisioning Architecture

## System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEESH Backend Flow                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Admin Dashboard │
└────────┬─────────┘
         │
         │ Click "Approve"
         ▼
┌───────────────────────────────────┐
│   AdminController::approveUser()   │
│  (app/Http/Controllers/)          │
├───────────────────────────────────┤
│ • Verify user exists              │
│ • Mark email_verified_at          │
│ • Get user role                   │
│ • Inject AuthProvisioning         │
└────────┬────────────────────────────┘
         │
         │ Call provisioning service
         ▼
┌───────────────────────────────────┐
│  AuthProvisioning Service         │
│ (app/Services/)                   │
├───────────────────────────────────┤
│ • Load configuration              │
│ • Determine auth mode             │
│ • Generate credentials            │
└──┬──────────────────────┬─────────┘
   │                      │
   ├─ Magic Mode ────┐    ├─ Password Mode ────┐
   │                 ▼    │                    ▼
   │            Generate  │              Generate
   │            Token     │              Password
   │            Store in  │              Hash &
   │            DB        │              Store
   │                      │
   └─ Return Provisioning Data ─────────────┬───┘
                                            │
                                            ▼
                        ┌──────────────────────────────┐
                        │ ApplicationApproved Mailable  │
                        │ (app/Mail/)                  │
                        ├──────────────────────────────┤
                        │ • Receive credentials        │
                        │ • Set auth mode              │
                        │ • Build email                │
                        └──────────┬───────────────────┘
                                   │
                                   │ Render template
                                   ▼
                        ┌──────────────────────────────┐
                        │ Email Template (Blade)       │
                        │ (resources/views/emails/)    │
                        ├──────────────────────────────┤
                        │ • Format credentials         │
                        │ • Display magic link OR      │
                        │   temporary password         │
                        │ • Add next steps guidance    │
                        └──────────┬───────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────────┐
                        │   Mail Driver                │
                        │   (SMTP/API)                 │
                        └──────────┬───────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────────┐
                        │   User's Email               │
                        │   (✉️ Inbox)                  │
                        └──────────┬───────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────────┐
                        │   User Logs In               │
                        │   (Magic Link OR Password)   │
                        └──────────────────────────────┘
```

## Data Structures

### AuthProvisioning Output

**Magic Link Mode:**
```json
{
  "loginLink": "https://app.neesh.art/auth/magic-link?token=abc123xyz&email=user@example.com",
  "authMode": "magic"
}
```

**Password Mode:**
```json
{
  "tempCreds": {
    "email": "user@example.com",
    "password": "Temp123!@#"
  },
  "authMode": "password"
}
```

### Mail Data Structure

```php
$mail = new ApplicationApproved(
    user: User,                    // User model
    role: "publisher",             // Role name
    loginLink: "...",              // Magic link (or null)
    tempCreds: [...],              // Temp credentials (or null)
    authMode: "magic",             // "magic" or "password"
    dashboardUrl: "https://..."    // Frontend URL
);
```

## Database Integration

```
┌─────────────────┐         ┌──────────────────────┐
│   users table   │         │ password_reset_...   │
├─────────────────┤         │ _tokens table        │
│ id              │         ├──────────────────────┤
│ email           │         │ email                │
│ password ◄──────┼─────┐   │ token (hashed)       │
│ created_at      │     │   │ created_at           │
│ email_verified_ │     │   │                      │
│ _at ◄───────┐   │     │   │ (Magic links)        │
│ ...         │   │     │   │ (Token expires:      │
└─────────────┘   │     │   │  24 hours)           │
                  │     │   └──────────────────────┘
                  │     │
                  │     ▲
        Password  │     │ Magic link
        hashing   │     │ token
                  │     │ storage
                  │     │
        ┌─────────┴─────┴──────────┐
        │  AuthProvisioning Service │
        └──────────────────────────┘
```

## Configuration Flow

```
┌──────────────┐
│  .env file   │
├──────────────┤
│ AUTH_PROV... │
│ DASHBOARD... │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│ config/auth-provisioning.php │
├─────────────────────────────┤
│ [mode]                      │
│ [dashboard_url]             │
│ [password settings]         │
│ [magic_link settings]       │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ AuthProvisioning Service     │
│ (Reads in __construct)       │
├──────────────────────────────┤
│ Uses mode & URLs to          │
│ provision credentials        │
└──────────────────────────────┘
```

## Email Template Logic

```
                      ┌─ Is authMode === 'magic' AND has loginLink?
                      │
                      ├─ YES ──→ Display magic link button
                      │          Show link expiration (24h)
                      │          Suggest password change
                      │
                      └─ NO ──→ Display temp credentials panel
                                Show email & temp password
                                Warn about security
                                Show login button
```

## Request/Response Flow

### Admin Approval Request
```
POST /admin/users/{id}/approve

Request Flow:
1. Route triggers AdminController::approveUser($id)
2. Find user by ID
3. Verify user exists
4. Mark email_verified_at = now()
5. Get user role
6. Inject AuthProvisioning via DI
7. Call provisioning service
8. Build email with credentials
9. Send email via Mail facade
10. Redirect with success message

Response:
- Redirect to user detail page
- Flash success/error message
```

## Error Handling

```
                    ┌─ Try provision user
                    │
    AdminController │
          │         │
          ▼         │
    approveUser() ◄─┤
                    │
                    │  Catch Exception
                    │
                    └─ Log error
                    ├─ Redirect with error message
                    └─ User still marked verified
                    └─ Admin informed of email failure
```

## Mode Comparison

```
┌──────────────────────────────────────────────┐
│           Magic Link vs Password             │
├──────────────────────────────────────────────┤

### Magic Link Mode
├─ Token Generation ─→ Random 32-char string
├─ Storage ─→ password_reset_tokens table
├─ Hashing ─→ SHA256
├─ Email Content ─→ Single button link
├─ User Experience ─→ Click link → Auto login
├─ Security ─→ Link expires in 72 hours (3 days)
├─ Frontend Changes ─→ Yes, needs handler
└─ Complexity ─→ Medium

PASSWORD MODE
├─ Password Generation ─→ Random 12-char (alphanumeric + special)
├─ Storage ─→ users.password column
├─ Hashing ─→ Bcrypt
├─ Email Content ─→ Credentials panel + button
├─ User Experience ─→ Copy credentials → Manual login
├─ Security ─→ User must change immediately
├─ Frontend Changes ─→ No
└─ Complexity ─→ Simple
```

## Deployment Checklist

```
┌─ Environment Setup
│  ├─ Update .env with AUTH_PROVISIONING_MODE
│  ├─ Update .env with DASHBOARD_URL
│  └─ php artisan config:clear
│
├─ Database
│  ├─ password_reset_tokens table exists
│  └─ users.password column exists
│
├─ Email Configuration
│  ├─ MAIL_DRIVER configured
│  ├─ MAIL_FROM_ADDRESS set
│  └─ SMTP credentials valid
│
├─ Code Deployment
│  ├─ Push app/Services/AuthProvisioning.php
│  ├─ Push config/auth-provisioning.php
│  ├─ Push updated Mail class
│  ├─ Push updated email template
│  ├─ Push updated AdminController
│  └─ php artisan optimize
│
├─ Testing
│  ├─ Test approval flow
│  ├─ Verify email sends
│  ├─ Check credentials in email
│  └─ Test user login with credentials
│
└─ Monitoring
   ├─ Watch storage/logs/laravel.log
   ├─ Check email delivery
   └─ Monitor approval success rate
```

## Extension Points

```
AuthProvisioning Service
     │
     ├─ Override provisionUser()
     │   └─ Custom credential logic
     │
     ├─ Override generateSecurePassword()
     │   └─ Custom password format
     │
     └─ Add new method: regenerateCredentials()
         └─ Allow resending credentials

ApplicationApproved Mail
     │
     └─ Add new parameter: $resendAttempt
         └─ Show "Resent" in email

Email Template
     │
     ├─ Add credential expiration info
     ├─ Add FAQ section
     ├─ Add support contact form
     └─ Add branding customization
```

## Monitoring & Debugging

```
Logs Location: storage/logs/laravel.log

Key Events to Monitor:
├─ [Info] User approved
├─ [Info] Credentials provisioned (mode: magic/password)
├─ [Info] Email sent to user@example.com
├─ [Error] Failed to provision credentials
├─ [Error] Failed to send approval email
└─ [Debug] Full error stack trace

Mail Testing:
├─ Log driver: See in logs
├─ File driver: See in storage/logs/
├─ Testing driver: In Memory
├─ Mailtrap: Third-party service
└─ Real SMTP: Production email

Verification:
├─ Check users table: password updated?
├─ Check password_reset_tokens: token stored?
├─ Check email received: credentials correct?
└─ Test login: credentials working?
```

---

This architecture supports both authentication modes while remaining flexible for future enhancements.
