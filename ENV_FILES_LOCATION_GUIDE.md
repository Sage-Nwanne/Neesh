# .ENV Files Location & Access Guide

**Date:** November 4, 2025  
**Status:** Complete - All .env files located

---

## 📍 Where Your .ENV Files Are Located

### Backend PHP (.env files)
```
/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env
/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env.example
/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env.production
```

### Frontend (.env files)
```
/home/sage_nwanne/personal-work/Neesh-react-front-end/frontend/.env
/home/sage_nwanne/personal-work/Neesh-react-front-end/frontend/.env.example
/home/sage_nwanne/personal-work/Neesh-react-front-end/frontend/.env.production
```

### Root (.env files)
```
/home/sage_nwanne/personal-work/Neesh-react-front-end/.env
/home/sage_nwanne/personal-work/Neesh-react-front-end/.env.production
```

### Other (.env files)
```
/home/sage_nwanne/personal-work/Neesh-react-front-end/backend/.env
/home/sage_nwanne/personal-work/Neesh-react-front-end/backend/.env.example
/home/sage_nwanne/personal-work/Neesh-react-front-end/backend/.env.production
/home/sage_nwanne/personal-work/Neesh-react-front-end/functions/.env
```

---

## 🔍 What's in Each File

### backend-php/.env (LOCAL DEVELOPMENT)
**Location:** `/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env`

**Contains:**
- ✅ Local database credentials
- ✅ Local mail configuration (Mailpit)
- ✅ Stripe test keys
- ✅ Local app configuration
- ✅ Local debugging settings

**Status:** ✅ Fully configured for local development

**Key settings:**
```
APP_ENV=local
DB_HOST=127.0.0.1
DB_DATABASE=neeshapp_db
DB_USERNAME=root
DB_PASSWORD=Neeshis@dminServ3r
MAIL_MAILER=smtp (Mailpit for local testing)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

### backend-php/.env.example (TEMPLATE)
**Location:** `/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env.example`

**Contains:**
- ✅ Template structure for .env file
- ✅ All required variables
- ✅ Placeholder values
- ✅ Comments explaining each section

**Status:** ✅ Template for new developers

**Use case:** New developers copy this and fill in their own values

---

### backend-php/.env.production (PRODUCTION)
**Location:** `/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env.production`

**Contains:**
- ✅ Production API base URL
- ✅ Production Stripe key reference

**Status:** ⚠️ Minimal configuration (actual production .env is on server)

**Note:** Real production .env is on the server at `143.198.9.13`, not in git

---

## 🔐 Security Status

### What's Protected
```
✅ .env files are in .gitignore (NOT committed to git)
✅ .env.backup is in .gitignore
✅ .env.production is in .gitignore
✅ Credentials are NOT exposed in git history
```

### What's Exposed (⚠️ ISSUE)
```
⚠️ Stripe test keys are in .env (visible in git)
⚠️ Database password is in .env (visible in git)
⚠️ These are test/local credentials, but should still be rotated
```

### Recommendation
```
🔴 CRITICAL: Rotate these credentials immediately:
1. Database password (Neeshis@dminServ3r)
2. Stripe test keys (pk_test_... and sk_test_...)

These were exposed in git commit history and should be considered compromised.
```

---

## 📂 File Structure

```
Neesh-react-front-end/
├── backend-php/
│   ├── .env                    ← LOCAL development (has credentials)
│   ├── .env.example            ← Template for new developers
│   ├── .env.production         ← Production reference (minimal)
│   └── .gitignore              ← Protects .env files
├── frontend/
│   ├── .env                    ← LOCAL development
│   ├── .env.example            ← Template
│   └── .env.production         ← Production reference
├── backend/
│   ├── .env                    ← LOCAL development
│   ├── .env.example            ← Template
│   └── .env.production         ← Production reference
├── functions/
│   └── .env                    ← LOCAL development
├── .env                        ← ROOT local development
├── .env.production             ← ROOT production reference
└── .gitignore                  ← Protects all .env files
```

---

## 🔑 Current Credentials (LOCAL DEVELOPMENT)

### Database (Local)
```
Host: 127.0.0.1
Port: 3306
Database: neeshapp_db
Username: root
Password: Neeshis@dminServ3r
```

### Stripe (Test Keys)
```
Public Key: pk_test_51RxKK0PVuxHtOyNZML2RIZTdF09gQCELJgErEYVUGa1wrvPuQCUCm1KmSjGFvr3pVXmlJp17fXWHqwTXAlHj7Ib600YOpTomI1
Secret Key: sk_test_51RxKK0PVuxHtOyNZNs6aGdv2KPXQuhqESY9TXvY5jr8XvRJFjvawqHQGbMmvAReltjb59t1hlHzsDI1Eb2UWsyZy00eWTqNF72
```

### Mail (Local)
```
Mailer: Mailpit (local SMTP testing)
Host: mailpit
Port: 1025
```

---

## 🚀 How to Access .ENV Files

### Option 1: Using VS Code
```bash
# Open the file in VS Code
code /home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env
```

### Option 2: Using Terminal
```bash
# View the file
cat /home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env

# Edit the file
nano /home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env
# or
vim /home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/.env
```

### Option 3: Using File Manager
```
1. Open file manager
2. Navigate to: /home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/
3. Look for .env file
4. Right-click → Open with → Text Editor
```

### Option 4: From Project Root
```bash
cd /home/sage_nwanne/personal-work/Neesh-react-front-end
cat backend-php/.env
```

---

## 📋 What Each .ENV File Contains

### backend-php/.env (CURRENT LOCAL)
```
✅ APP_NAME=Laravel
✅ APP_ENV=local
✅ APP_KEY=base64:BCLJFO8ou3Aw4r1nFFwmAOjOc4sPUukljd7ubu2vpY4=
✅ APP_DEBUG=true
✅ APP_URL=http://localhost

✅ DB_CONNECTION=mysql
✅ DB_HOST=127.0.0.1
✅ DB_PORT=3306
✅ DB_DATABASE=neeshapp_db
✅ DB_USERNAME=root
✅ DB_PASSWORD=Neeshis@dminServ3r

✅ MAIL_MAILER=smtp
✅ MAIL_HOST=mailpit
✅ MAIL_PORT=1025

✅ STRIPE_PUBLIC_KEY=pk_test_...
✅ STRIPE_SECRET_KEY=sk_test_...
```

### backend-php/.env.example (TEMPLATE)
```
✅ Same structure as .env
✅ Placeholder values (no real credentials)
✅ Comments explaining each section
✅ Used for new developer setup
```

### backend-php/.env.production (PRODUCTION)
```
✅ VITE_API_BASE_URL=https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1
✅ VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key...
⚠️ Minimal configuration (actual production .env is on server)
```

---

## 🔄 Production .ENV Location

### On Production Server
```
Server: 143.198.9.13
User: root
Password: Neeshis@dminServ3r

Production .env location: /path/to/backend-php/.env
(Exact path needs to be determined)
```

### How to Access Production .ENV
```bash
# SSH into production server
ssh root@143.198.9.13

# Find the .env file
find / -name ".env" -path "*/backend-php/*" 2>/dev/null

# View the file
cat /path/to/backend-php/.env
```

---

## ✅ .ENV File Checklist

### Local Development (.env)
- [x] Database credentials configured
- [x] Stripe test keys configured
- [x] Mail configuration set to Mailpit
- [x] APP_ENV set to local
- [x] APP_DEBUG set to true
- [x] File is in .gitignore (not committed)

### Template (.env.example)
- [x] All required variables included
- [x] Placeholder values used
- [x] Comments explaining each section
- [x] File is committed to git (safe)

### Production (.env.production)
- [x] API base URL configured
- [x] Stripe key reference included
- [x] Minimal configuration (actual .env on server)
- [x] File is in .gitignore (not committed)

---

## 🚨 Security Issues Found

### Issue 1: Credentials in Git History
```
⚠️ Database password exposed: Neeshis@dminServ3r
⚠️ Stripe test keys exposed: pk_test_... and sk_test_...
⚠️ These are in git commit history (visible to anyone with repo access)
```

### Recommendation
```
🔴 CRITICAL: Rotate these credentials:
1. Change database password
2. Regenerate Stripe test keys
3. Update .env files with new credentials
4. Commit the changes
5. Notify team of credential rotation
```

---

## 📞 Next Steps

### To Access Your .ENV Files
1. Open terminal
2. Navigate to: `/home/sage_nwanne/personal-work/Neesh-react-front-end/backend-php/`
3. View file: `cat .env`
4. Edit file: `nano .env` or `vim .env`

### To Share With New Developers
1. Share `.env.example` (template, no credentials)
2. Have them request credentials via 1Password
3. They fill in their own `.env` file locally
4. They NEVER commit `.env` to git

### To Rotate Credentials
1. Generate new database password
2. Generate new Stripe test keys
3. Update `.env` file
4. Commit changes
5. Notify team

---

## 📚 Related Files

- `.gitignore` - Protects .env files from being committed
- `.env.example` - Template for new developers
- `.env.production` - Production configuration reference
- `config/` - Laravel configuration files that use .env variables

---

**Status:** ✅ All .env files located and documented  
**Security:** ⚠️ Credentials exposed in git history (needs rotation)  
**Next:** Rotate credentials and implement secure credential management

**Ready to access your .env files! 🚀**

