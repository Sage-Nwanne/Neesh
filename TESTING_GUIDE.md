# Testing Guide for Publisher & Retailer Registration

## Important: Email Verification Behavior

### Critical Testing Rule: Use NEW Email Addresses for Each Test

**⚠️ IMPORTANT:** When testing the publisher or retailer registration forms, you **MUST use a different email address for each test submission**. Reusing email addresses will cause unexpected behavior.

### Why This Matters

The application uses the `email_verified_at` field to track whether a user's email has been verified by an admin:

- **`email_verified_at = NULL`** → User is pending approval (shows in admin dashboard)
- **`email_verified_at = TIMESTAMP`** → User has been approved (hidden from admin dashboard)

### What Happens When You Reuse an Email

1. **First submission** with `test@example.com` → User created with `email_verified_at = NULL`
2. **Admin approves** the application → `email_verified_at` is set to current timestamp
3. **Second submission** with the SAME email `test@example.com` → **Email already exists in database** (unique constraint violation)
4. **Result:** The new submission fails validation and doesn't appear in the admin dashboard

### Testing Workflow

#### For Each Test Submission:

1. **Use a unique email address** - Examples:
   - `test_publisher_001@gmail.com`
   - `test_publisher_002@gmail.com`
   - `test_retailer_001@gmail.com`
   - Or use timestamp-based emails: `test_pub_20251025_1@gmail.com`

2. **Submit the form** with the new email

3. **Verify in admin dashboard** at `/admin/dashboard`:
   - New submission should appear in the pending applications list
   - Email notification should be sent to the admin

4. **Approve or reject** the application

5. **For the next test**, use a different email address

### Email Verification Status

After an admin approves an application:
- The user's `email_verified_at` field is set to the approval timestamp
- The application is removed from the pending list (it's now approved)
- This is **expected behavior** - approved applications should not appear in the pending list

### Database Cleanup

If you need to clean up test data:

```sql
-- Delete a specific test user and all related data
DELETE FROM magazine_images WHERE magazine_id IN (
  SELECT id FROM magazines WHERE publisher_id IN (
    SELECT id FROM publisher_profiles WHERE user_id = [USER_ID]
  )
);
DELETE FROM magazines WHERE publisher_id IN (
  SELECT id FROM publisher_profiles WHERE user_id = [USER_ID]
);
DELETE FROM publisher_profiles WHERE user_id = [USER_ID];
DELETE FROM publisher_payment_details WHERE user_id = [USER_ID];
DELETE FROM model_has_roles WHERE model_id = [USER_ID];
DELETE FROM users WHERE id = [USER_ID];
```

### Troubleshooting

**Problem:** New submission doesn't appear in admin dashboard
- **Solution:** Check if you used an email that was already approved. Use a new email address.

**Problem:** "Email already exists" validation error
- **Solution:** You're reusing an email. Use a different email address for each test.

**Problem:** Email notification not received
- **Solution:** Check that `ADMIN_EMAIL` is configured in `.env` file on the server

### Summary

| Scenario | Email Used | Result |
|----------|-----------|--------|
| First test | `test1@gmail.com` | ✅ Shows in admin dashboard |
| Admin approves | `test1@gmail.com` | ✅ Removed from pending list |
| Second test (WRONG) | `test1@gmail.com` | ❌ Validation error, not created |
| Second test (CORRECT) | `test2@gmail.com` | ✅ Shows in admin dashboard |

