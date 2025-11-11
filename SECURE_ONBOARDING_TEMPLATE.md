# Secure Onboarding Template (Without Credentials)

**Date:** November 4, 2025  
**Status:** Ready to Use - Fill in Your Details

---

## 📋 CREDENTIALS NEEDED (Request via 1Password)

### Database Credentials
**What to request:**
- [ ] Database host/URL
- [ ] Database name
- [ ] Database username
- [ ] Database password
- [ ] Database port (usually 3306 for MySQL)

**Where to store:**
- Store in `.env` file locally (NEVER commit to git)
- Store in 1Password vault
- Share via 1Password with team members

**How to verify:**
```bash
# After setting up .env, test connection
php artisan tinker
# Then: DB::connection()->getPdo();
```

---

### Stripe Credentials
**What to request:**
- [ ] Stripe API key (publishable)
- [ ] Stripe API key (secret)
- [ ] Stripe Connect account ID
- [ ] Stripe webhook signing secret

**Where to find:**
- Stripe Dashboard → Developers → API Keys
- Stripe Dashboard → Connect → Account

**Where to store:**
- Store in `.env` file locally
- Store in 1Password vault
- NEVER commit to git

**How to verify:**
```bash
# After setting up .env, test connection
php artisan tinker
# Then: Stripe\Stripe::setApiKey(config('services.stripe.secret'));
```

---

### Resend Credentials
**What to request:**
- [ ] Resend API key

**Where to find:**
- Resend Dashboard → API Keys

**Where to store:**
- Store in `.env` file locally
- Store in 1Password vault
- NEVER commit to git

**How to verify:**
```bash
# After setting up .env, test connection
php artisan tinker
# Then: Resend::emails()->send(['to' => 'test@example.com', ...]);
```

---

### Shopify Credentials
**What to request:**
- [ ] Shopify store name
- [ ] Shopify API key
- [ ] Shopify API secret
- [ ] Shopify access token

**Where to find:**
- Shopify Admin → Settings → Apps and integrations → Develop apps

**Where to store:**
- Store in `.env` file locally
- Store in 1Password vault
- NEVER commit to git

**How to verify:**
```bash
# After setting up .env, test connection
php artisan tinker
# Then: $client = new Shopify\Client(...);
```

---

## 🗂️ .ENV FILE TEMPLATE

**Create this file locally: `backend-php/.env`**

```env
# Database
DB_CONNECTION=mysql
DB_HOST=_______________  # Request from team
DB_PORT=3306
DB_DATABASE=_______________  # Request from team
DB_USERNAME=_______________  # Request from team
DB_PASSWORD=_______________  # Request from team

# Stripe
STRIPE_PUBLIC_KEY=_______________  # Request from team
STRIPE_SECRET_KEY=_______________  # Request from team
STRIPE_CONNECT_ACCOUNT_ID=_______________  # Request from team

# Resend
RESEND_API_KEY=_______________  # Request from team

# Shopify
SHOPIFY_API_KEY=_______________  # Request from team
SHOPIFY_API_SECRET=_______________  # Request from team
SHOPIFY_ACCESS_TOKEN=_______________  # Request from team
SHOPIFY_STORE_NAME=_______________  # Request from team

# Other
APP_NAME=NEESH
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
```

**IMPORTANT:**
- ❌ NEVER commit this file to git
- ❌ NEVER share this file in chat/email
- ✅ Request credentials via 1Password
- ✅ Store locally only
- ✅ Add to .gitignore (already done)

---

## 🚀 DEPLOYMENT PROCESS

**Current deployment method:**
- [ ] SCP (Secure Copy)
- [ ] Git push
- [ ] Docker
- [ ] Other: _______________

**Deployment steps (fill in your process):**

1. **Prepare changes**
   ```bash
   # Step 1: _______________
   # Step 2: _______________
   # Step 3: _______________
   ```

2. **Deploy to production**
   ```bash
   # Step 1: _______________
   # Step 2: _______________
   # Step 3: _______________
   ```

3. **Restart services**
   ```bash
   # Step 1: _______________
   # Step 2: _______________
   # Step 3: _______________
   ```

4. **Verify deployment**
   ```bash
   # Step 1: _______________
   # Step 2: _______________
   # Step 3: _______________
   ```

---

## 📁 CODE LOCATION ON SERVER

**Production server:**
- Host: `143.198.9.13`
- Username: `root`
- Code path: _______________
- Web root: _______________
- Database: _______________

**How to access:**
```bash
ssh root@143.198.9.13
# Then navigate to: _______________
```

---

## 🔄 RESTART SERVICES

**After deploying changes, run:**

```bash
# Step 1: _______________
# Step 2: _______________
# Step 3: _______________
```

**Verify services are running:**
```bash
# Check: _______________
# Check: _______________
# Check: _______________
```

---

## ⏰ SCHEDULED TASKS

**Cron jobs running:**
- [ ] Yes - List them below
- [ ] No
- [ ] Not sure

**If yes, what are they?**
1. _______________
2. _______________
3. _______________

**Where are they configured?**
- File: _______________
- Command: _______________

---

## 🪝 SHOPIFY WEBHOOKS

**Webhooks configured:**
- [ ] Yes - List them below
- [ ] No
- [ ] Not sure

**If yes, which ones?**
1. Event: _______________ → Endpoint: _______________
2. Event: _______________ → Endpoint: _______________
3. Event: _______________ → Endpoint: _______________

**Where are they configured?**
- Shopify Admin → Settings → Notifications → Webhooks

---

## ⚠️ KNOWN ISSUES

**Currently broken or in-progress:**
1. _______________
2. _______________
3. _______________

**Workarounds:**
1. _______________
2. _______________
3. _______________

---

## 🔧 FRAGILE/TRICKY CODE

**Parts of code that need careful handling:**
1. _______________
2. _______________
3. _______________

**Why they're tricky:**
1. _______________
2. _______________
3. _______________

**How to modify safely:**
1. _______________
2. _______________
3. _______________

---

## 📚 DOCUMENTATION NEEDED

**Create Loom videos for:**
- [ ] How to run site locally
- [ ] How to deploy changes
- [ ] How to troubleshoot issues
- [ ] How to handle emergencies

**What to include in each video:**
1. _______________
2. _______________
3. _______________

---

## ✅ NEXT STEPS

1. **Request credentials via 1Password**
   - Contact: _______________
   - Process: _______________

2. **Fill in this template**
   - Database info
   - Deployment process
   - Server locations
   - Known issues

3. **Create documentation**
   - Local setup guide
   - Deployment guide
   - Troubleshooting guide
   - Emergency procedures

4. **Record Loom videos**
   - Local setup walkthrough
   - Deployment walkthrough
   - Troubleshooting walkthrough

---

## 🔐 SECURITY CHECKLIST

- [ ] .env file created locally (NOT in git)
- [ ] Credentials requested via 1Password
- [ ] Credentials stored securely
- [ ] .gitignore includes .env
- [ ] No credentials in code
- [ ] No credentials in documentation
- [ ] No credentials in videos
- [ ] Credential rotation schedule set
- [ ] Team trained on security
- [ ] Access audit completed

---

**Status:** Template ready to fill in  
**Security:** Maximum protection  
**Next:** Fill in your details and request credentials securely

**Let me know what you need help with! 🚀**

