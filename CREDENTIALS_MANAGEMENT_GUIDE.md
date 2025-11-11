# Credentials Management Guide - NEESH Platform

**Date:** November 4, 2025  
**Status:** Critical Security Documentation

---

## ⚠️ CRITICAL: Never Commit Credentials

**This is the #1 security risk. Follow these rules strictly.**

---

## 🔐 Credentials Inventory

### Frontend Credentials

**File:** `frontend/.env` (NOT committed)

```
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=neeshapp2025
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**Who Needs:** All frontend developers

**Rotation:** Every 90 days

### Backend Credentials

**File:** `backend-php/.env` (NOT committed)

```
APP_KEY=base64:...
DB_PASSWORD=...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
SHOPIFY_API_KEY=...
SHOPIFY_API_PASSWORD=...
SHOPIFY_SHOP_NAME=...
MAIL_PASSWORD=...
```

**Who Needs:** All backend developers

**Rotation:** Every 90 days

### Production Server Credentials

**Server:** 143.198.9.13

```
SSH User: root
SSH Password: Neeshis@dminServ3r
SSH Key: ~/.ssh/neesh_key (if using key auth)
MySQL User: root
MySQL Password: [stored in vault]
```

**Who Needs:** DevOps/Senior developers only

**Rotation:** Every 180 days

### Third-Party Service Credentials

**Stripe:**
- Public Key (test): pk_test_51RxKK0PVuxHtOyNZML2RIZTdF09gQCELJgErEYVUGa1wrvPuQCUCm1KmSjGFvr3pVXmlJp17fXWHqwTXAlHj7Ib600YOpTomI1
- Secret Key (test): sk_test_51RxKK0PVuxHtOyNZNs6aGdv2KPXQuhqESY9TXvY5jr8XvRJFjvawqHQGbMmvAReltjb59t1hlHzsDI1Eb2UWsyZy00eWTqNF72
- Webhook Secret: whsec_...

**Resend:**
- API Key: re_...

**Shopify:**
- API Key: ...
- API Password: ...
- Shop Name: neesh.myshopify.com
- Access Token: ...

**Firebase:**
- Project ID: neeshapp2025
- API Key: ...
- Auth Domain: neeshapp2025.firebaseapp.com

**Who Needs:** Varies by service

**Rotation:** Every 90 days

---

## 📋 .gitignore Configuration

### Current Status: ✅ CORRECT

**Frontend `.gitignore`:**
```
.env
.env.local
.env.*.local
```

**Backend `backend-php/.gitignore`:**
```
.env
.env.backup
.env.production
auth.json
/storage/*.key
```

### Verify .gitignore

```bash
# Check if .env is ignored
git check-ignore .env
# Output: .env (if properly ignored)

# Check if credentials are in git history
git log --all --full-history -- .env
# Output: (should be empty)

# Check for accidental commits
git log --all --oneline | grep -i "key\|secret\|password"
# Output: (should be empty)
```

---

## 🚀 Setting Up Credentials for New Developer

### Step 1: Create .env Files

**Frontend:**
```bash
cd Neesh-react-front-end
cp .env.example .env
```

**Backend:**
```bash
cd backend-php
cp .env.example .env
```

### Step 2: Request Credentials

**Email to Team Lead:**
```
Subject: Credentials Request for [Developer Name]

Hi [Team Lead],

I need credentials to set up my development environment:

1. Frontend .env file
2. Backend .env file
3. Production server SSH key (if applicable)
4. Stripe test API keys
5. Resend API key
6. Shopify API credentials (if working on Shopify)
7. Firebase config

My GitHub username: [username]
My email: [email]

Thanks!
```

### Step 3: Receive Credentials

**Team Lead sends via:**
- ✅ 1Password (preferred)
- ✅ Vault
- ✅ Encrypted email
- ❌ Slack (not secure)
- ❌ Unencrypted email (not secure)

### Step 4: Add to .env Files

**Frontend `.env`:**
```bash
nano .env
# Paste credentials from team lead
# Save and exit
```

**Backend `backend-php/.env`:**
```bash
cd backend-php
nano .env
# Paste credentials from team lead
# Save and exit
```

### Step 5: Verify Setup

```bash
# Frontend
npm run dev
# Should start without errors

# Backend
cd backend-php
php artisan tinker
# Should connect to database
```

### Step 6: Verify Not Committed

```bash
# Check .env is not staged
git status | grep .env
# Output: (should be empty)

# Check .env is ignored
git check-ignore .env
# Output: .env
```

---

## 🔄 Credential Rotation Schedule

### Every 90 Days

- [ ] Stripe API keys
- [ ] Resend API key
- [ ] Shopify API credentials
- [ ] Firebase API keys
- [ ] Database passwords

### Every 180 Days

- [ ] Production server SSH password
- [ ] MySQL root password
- [ ] SSH keys

### Every 365 Days

- [ ] All credentials (full rotation)

### Rotation Process

```bash
# 1. Generate new credentials in service dashboard
# 2. Update .env files locally
# 3. Test with new credentials
# 4. Update production server
# 5. Notify team of rotation
# 6. Revoke old credentials
# 7. Document in changelog
```

---

## 🚨 Security Incidents

### If Credentials Are Exposed

**IMMEDIATE ACTIONS:**

1. **Revoke Credentials**
   ```bash
   # Stripe
   - Go to Stripe Dashboard
   - Revoke exposed API key
   - Generate new key
   
   # Resend
   - Go to Resend Dashboard
   - Revoke exposed API key
   - Generate new key
   
   # Shopify
   - Go to Shopify Admin
   - Revoke exposed access token
   - Generate new token
   ```

2. **Update .env Files**
   ```bash
   # Update all .env files with new credentials
   nano .env
   nano backend-php/.env
   ```

3. **Notify Team**
   - Send urgent message to team
   - Explain what was exposed
   - Confirm new credentials are in place

4. **Check Git History**
   ```bash
   # Search for exposed credentials
   git log --all --oneline | grep -i "key\|secret"
   
   # If found, use git-filter-branch to remove
   git filter-branch --tree-filter 'rm -f .env' HEAD
   ```

5. **Force Push (if necessary)**
   ```bash
   # Only if credentials were committed
   git push origin main --force
   ```

### If Credentials Are Committed

**CRITICAL: Follow these steps immediately**

```bash
# 1. Revoke all exposed credentials (see above)

# 2. Remove from git history
git filter-branch --tree-filter 'rm -f .env' HEAD

# 3. Force push to remote
git push origin main --force

# 4. Notify all developers
# 5. Have them re-clone the repository
# 6. Update all .env files with new credentials
```

---

## ✅ Security Checklist

### Before Committing

- [ ] No `.env` files staged
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No SSH keys in code
- [ ] No database credentials in code
- [ ] Run `git status` to verify

### Before Pushing

- [ ] All tests pass
- [ ] No credentials in commits
- [ ] No large files added
- [ ] Commit messages are clear
- [ ] Run `git log --oneline -5` to verify

### Before Deploying

- [ ] Production .env file is correct
- [ ] All credentials are rotated
- [ ] Database backups are current
- [ ] Rollback plan is ready
- [ ] Team is notified

---

## 🔍 Auditing Credentials

### Check for Exposed Credentials

```bash
# Search for common patterns
git log --all -p | grep -i "password\|secret\|key\|token"

# Search for specific patterns
git log --all -p | grep -E "sk_test_|pk_test_|re_"

# Use git-secrets tool
git secrets --scan
```

### Monitor Credentials

```bash
# Set up git hooks to prevent commits
git secrets --install
git secrets --register-aws

# Or use pre-commit hooks
pip install pre-commit
pre-commit install
```

---

## 📚 Credential Storage Best Practices

### ✅ DO

- ✅ Store credentials in `.env` files (not committed)
- ✅ Use environment variables in code
- ✅ Rotate credentials regularly
- ✅ Use strong passwords (20+ characters)
- ✅ Use unique credentials per environment
- ✅ Store backups in secure vault
- ✅ Audit credential access
- ✅ Use SSH keys for server access

### ❌ DON'T

- ❌ Commit `.env` files to git
- ❌ Hardcode credentials in code
- ❌ Share credentials via Slack/email
- ❌ Use weak passwords
- ❌ Reuse credentials across environments
- ❌ Store credentials in comments
- ❌ Share credentials with unauthorized people
- ❌ Use password authentication for servers

---

## 🛠️ Tools for Credential Management

### 1Password
- Secure credential storage
- Team sharing
- Audit logs
- Browser extension

### Vault
- Centralized secret management
- Encryption at rest
- Access control
- Audit trails

### AWS Secrets Manager
- Cloud-based secret storage
- Automatic rotation
- Encryption
- Access policies

### HashiCorp Vault
- Open-source secret management
- Dynamic secrets
- Encryption
- Audit logging

---

## 📞 Support

**Questions about credentials?**
- Contact: [Team Lead Name]
- Email: [Team Lead Email]
- Slack: #security-team

**Report security issues:**
- Email: security@neesh.art
- Do NOT post in public channels

---

## 📋 Credential Checklist for New Developer

- [ ] Requested credentials from team lead
- [ ] Received credentials securely
- [ ] Created `.env` file (frontend)
- [ ] Created `backend-php/.env` file
- [ ] Added credentials to `.env` files
- [ ] Verified `.env` is in `.gitignore`
- [ ] Tested frontend setup
- [ ] Tested backend setup
- [ ] Verified database connection
- [ ] Verified API keys work
- [ ] Read this guide completely
- [ ] Signed security agreement (if required)

---

**Status:** ✅ Ready for team use  
**Last Updated:** November 4, 2025  
**Next Review:** When new credentials are added or rotated

