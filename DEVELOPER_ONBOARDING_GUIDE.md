# Developer Onboarding Guide - NEESH Platform

**Date:** November 4, 2025  
**Status:** Critical Access & Credentials Setup

---

## 🎯 Quick Start (5 Minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Neesh-react-front-end.git
cd Neesh-react-front-end
```

### 2. Request Credentials
Contact your team lead for:
- ✅ `.env` file (frontend)
- ✅ `backend-php/.env` file (backend)
- ✅ Production server SSH key
- ✅ Stripe test API keys
- ✅ Resend API key
- ✅ Shopify API credentials

### 3. Set Up Environment Files
```bash
# Frontend
cp .env.example .env

# Backend
cd backend-php
cp .env.example .env
```

### 4. Install Dependencies
```bash
# Frontend
npm install

# Backend
composer install
```

### 5. Start Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend-php
php artisan serve
```

---

## 🌳 Branch Structure

### Current Branches

```
main (production)
├── integrate-backend (current development)
├── backend-php (backend-only branch)
├── Laptop (personal branch)
└── laptop (personal branch)
```

### Branch Naming Convention

**Format:** `<type>/<feature-name>`

**Types:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Production hotfixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `test/` - Testing

**Examples:**
```
feature/shopify-integration
bugfix/checkout-validation
hotfix/stripe-webhook-error
refactor/address-validator
docs/api-documentation
test/payment-processing
```

### Branch Workflow

```
main (production)
  ↑
  └─ integrate-backend (staging/development)
      ├─ feature/shopify-product-sync
      ├─ feature/shopify-order-sync
      ├─ bugfix/commission-calculation
      └─ refactor/payment-service
```

### Creating a New Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## 🔐 Credentials & Environment Files

### ⚠️ CRITICAL: Never Commit Credentials

**Files that MUST be in .gitignore:**
```
.env
.env.backup
.env.production
.env.local
auth.json
*.key
*.pem
```

**Current .gitignore Status:** ✅ Properly configured

### Environment Files Structure

#### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=neeshapp2025
```

#### Backend `backend-php/.env`
```
APP_NAME=NEESH
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=neesh_dev
DB_USERNAME=root
DB_PASSWORD=

STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

RESEND_API_KEY=re_...

MAIL_MAILER=resend
MAIL_FROM_ADDRESS=noreply@neesh.art
MAIL_FROM_NAME=NEESH

SHOPIFY_API_KEY=...
SHOPIFY_API_PASSWORD=...
SHOPIFY_SHOP_NAME=...
```

### Getting Credentials

**Step 1: Contact Team Lead**
- Request access to credentials vault
- Provide your GitHub username
- Sign NDA if required

**Step 2: Receive Credentials**
- Team lead sends encrypted credentials
- Or provides access to credentials manager (1Password, Vault, etc.)

**Step 3: Set Up Locally**
```bash
# Create .env from template
cp .env.example .env

# Add credentials from team lead
nano .env  # or use your editor

# Verify it's in .gitignore
cat .gitignore | grep ".env"
```

**Step 4: Verify Setup**
```bash
# Frontend
npm run dev  # Should start without errors

# Backend
cd backend-php
php artisan tinker  # Should connect to database
```

---

## 🔑 API Keys & Services

### Stripe (Payment Processing)

**Test Keys (Development):**
```
STRIPE_PUBLIC_KEY=pk_test_51RxKK0PVuxHtOyNZML2RIZTdF09gQCELJgErEYVUGa1wrvPuQCUCm1KmSjGFvr3pVXmlJp17fXWHqwTXAlHj7Ib600YOpTomI1
STRIPE_SECRET_KEY=sk_test_51RxKK0PVuxHtOyNZNs6aGdv2KPXQuhqESY9TXvY5jr8XvRJFjvawqHQGbMmvAReltjb59t1hlHzsDI1Eb2UWsyZy00eWTqNF72
```

**Test Cards:**
```
4242 4242 4242 4242 (Success)
4000 0000 0000 0002 (Decline)
3782 822463 10005 (Amex)
```

### Resend (Email Service)

**API Key Format:** `re_...`

**Test Email:** Use any email address in development

### Shopify (E-commerce Platform)

**Credentials Needed:**
- API Key
- API Password
- Shop Name
- Access Token

**Test Store:** Use Shopify development store

### Firebase (Frontend Hosting)

**Project ID:** `neeshapp2025`

**Credentials:** Firebase config object in `.env`

---

## 🖥️ Production Server Access

### Server Details

```
Host: 143.198.9.13
User: root
Password: Neeshis@dminServ3r
OS: Linux
Database: MySQL
```

### SSH Access

```bash
# Connect to server
ssh root@143.198.9.13

# Or with key
ssh -i ~/.ssh/neesh_key root@143.198.9.13

# Deploy with SCP
scp -r ./backend-php/* root@143.198.9.13:/var/www/neesh/backend-php/
```

### Database Access

```bash
# SSH into server
ssh root@143.198.9.13

# Connect to MySQL
mysql -u root -p

# Select database
USE neesh_production;

# View tables
SHOW TABLES;
```

---

## 📋 Pre-Development Checklist

- [ ] Clone repository
- [ ] Request credentials from team lead
- [ ] Create `.env` file (frontend)
- [ ] Create `backend-php/.env` file
- [ ] Install frontend dependencies: `npm install`
- [ ] Install backend dependencies: `composer install`
- [ ] Verify database connection
- [ ] Run frontend: `npm run dev`
- [ ] Run backend: `php artisan serve`
- [ ] Test Stripe integration with test card
- [ ] Test email with Resend API
- [ ] Read TECH_STACK_BREAKDOWN.md
- [ ] Read SHOPIFY_STRIPE_PIVOT_PLAN.md
- [ ] Join team Slack/Discord channel

---

## 🚀 First Task: Set Up Development Environment

### 1. Frontend Setup
```bash
cd Neesh-react-front-end
npm install
npm run dev
# Should run on http://localhost:5173
```

### 2. Backend Setup
```bash
cd backend-php
composer install
php artisan key:generate
php artisan migrate
php artisan serve
# Should run on http://localhost:8000
```

### 3. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE neesh_dev;

# Run migrations
php artisan migrate

# Seed test data (optional)
php artisan db:seed
```

### 4. Verify Integration
```bash
# Test API endpoint
curl http://localhost:8000/api/magazines

# Should return JSON response
```

---

## 📚 Documentation to Read

**Priority 1 (Read First):**
1. This file (DEVELOPER_ONBOARDING_GUIDE.md)
2. TECH_STACK_BREAKDOWN.md
3. TECH_STACK_QUICK_REFERENCE.md

**Priority 2 (Read Before Development):**
4. SHOPIFY_STRIPE_PIVOT_PLAN.md
5. SHOPIFY_IMPLEMENTATION_ROADMAP.md
6. PHASE_1_QUICK_REFERENCE.md

**Priority 3 (Reference as Needed):**
7. PRODUCTION_CHECKOUT_ROADMAP.md
8. DELEGATABLE_TASKS_GUIDE.md

---

## 🆘 Troubleshooting

### Issue: `.env` file not found
**Solution:** Copy from `.env.example`
```bash
cp .env.example .env
```

### Issue: Database connection error
**Solution:** Verify credentials in `.env`
```bash
# Check MySQL is running
mysql -u root -p

# Check database exists
SHOW DATABASES;
```

### Issue: Stripe API key error
**Solution:** Verify key format and environment
```bash
# Check .env has correct key
grep STRIPE_SECRET_KEY .env

# Verify it's not in git
git status | grep .env
```

### Issue: Port already in use
**Solution:** Use different port
```bash
# Frontend on different port
npm run dev -- --port 5174

# Backend on different port
php artisan serve --port 8001
```

---

## 📞 Getting Help

**Questions?** Contact:
- **Team Lead:** [name] - [email]
- **Backend Lead:** [name] - [email]
- **Frontend Lead:** [name] - [email]

**Slack Channel:** #neesh-development

**Documentation:** See README files in each directory

---

## ✅ Onboarding Complete

Once you've completed all steps above, you're ready to:
- ✅ Clone and run the project locally
- ✅ Access production server (if authorized)
- ✅ Make changes to frontend and backend
- ✅ Create pull requests
- ✅ Deploy to production

**Welcome to the NEESH team! 🚀**

---

**Last Updated:** November 4, 2025  
**Next Review:** When new credentials are added

