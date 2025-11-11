# Developer Onboarding - Quick Start (5 Minutes)

**Date:** November 4, 2025

---

## 🚀 Quick Start Checklist

### 1. Clone Repository (2 min)
```bash
git clone https://github.com/your-org/Neesh-react-front-end.git
cd Neesh-react-front-end
```

### 2. Request Credentials (1 min)
**Email to Team Lead:**
```
Hi [Team Lead],

I need credentials to set up development:
- Frontend .env
- Backend .env
- Stripe test keys
- Resend API key
- Shopify credentials (if applicable)

GitHub: [username]
Email: [your-email]

Thanks!
```

### 3. Set Up Environment (1 min)
```bash
# Frontend
cp .env.example .env
# Paste credentials from team lead

# Backend
cd backend-php
cp .env.example .env
# Paste credentials from team lead
```

### 4. Install & Run (1 min)
```bash
# Terminal 1: Frontend
npm install
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Backend
cd backend-php
composer install
php artisan serve
# Runs on http://localhost:8000
```

---

## 🌳 Branch Structure (One Page)

```
main (Production)
  ↑ (Merge PR, 2 approvals)
  │
integrate-backend (Staging/Dev)
  ↑ (Merge PR, 1 approval)
  │
  ├─ feature/your-feature
  ├─ bugfix/your-bugfix
  ├─ refactor/your-refactor
  └─ hotfix/critical-fix
```

### Branch Types

| Type | Purpose | Merge To | Delete After |
|------|---------|----------|--------------|
| `feature/` | New features | integrate-backend | Yes |
| `bugfix/` | Bug fixes | integrate-backend | Yes |
| `refactor/` | Code improvements | integrate-backend | Yes |
| `hotfix/` | Critical fixes | main + integrate-backend | Yes |
| `docs/` | Documentation | integrate-backend | Yes |

### Creating a Feature Branch

```bash
# 1. Update integrate-backend
git checkout integrate-backend
git pull origin integrate-backend

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# ... edit files ...

# 4. Commit
git add .
git commit -m "feat: description of changes"

# 5. Push
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
# - Assign reviewers
# - Wait for approval
# - Merge

# 7. Clean up
git checkout integrate-backend
git pull origin integrate-backend
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 🔐 Credentials (Critical!)

### ⚠️ NEVER Commit Credentials

**Files that are IGNORED (good!):**
```
.env
.env.backup
.env.production
auth.json
*.key
```

### Verify Before Committing

```bash
# Check .env is ignored
git check-ignore .env
# Output: .env (if correct)

# Check status
git status
# Output: (should NOT show .env)
```

### Environment Files

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_FIREBASE_PROJECT_ID=neeshapp2025
```

**Backend `backend-php/.env`:**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=neesh_dev
DB_USERNAME=root
DB_PASSWORD=

STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
SHOPIFY_API_KEY=...
```

### Stripe Test Cards

```
4242 4242 4242 4242 (Success)
4000 0000 0000 0002 (Decline)
3782 822463 10005 (Amex)
```

---

## 📋 Commit Message Format

**Format:** `<type>(<scope>): <subject>`

**Examples:**
```
feat(shopify): implement product sync
fix(stripe): resolve webhook error
refactor(payment): simplify service
docs(api): update documentation
test(commission): add tests
```

---

## 🔄 Workflow Summary

### Daily Workflow

```bash
# Start of day
git checkout integrate-backend
git pull origin integrate-backend

# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ... edit files ...

# Commit regularly
git add .
git commit -m "feat: your changes"

# Push to remote
git push origin feature/your-feature

# Create PR when ready
# Wait for review
# Merge after approval
```

### Before Pushing

```bash
# Check for credentials
git status | grep .env
# Output: (should be empty)

# Check commit messages
git log --oneline -5

# Run tests
npm run test  # frontend
php artisan test  # backend
```

---

## 🆘 Common Issues

### Issue: `.env` not found
```bash
cp .env.example .env
```

### Issue: Database connection error
```bash
# Check MySQL is running
mysql -u root -p

# Check credentials in .env
grep DB_ backend-php/.env
```

### Issue: Port already in use
```bash
# Frontend on different port
npm run dev -- --port 5174

# Backend on different port
php artisan serve --port 8001
```

### Issue: Merge conflict
```bash
# Update your branch
git fetch origin
git rebase origin/integrate-backend

# Resolve conflicts in editor
# Then continue
git add .
git rebase --continue
git push origin feature/your-feature --force
```

---

## 📚 Documentation to Read

**Priority 1 (Read First):**
1. This file (ONBOARDING_QUICK_START.md)
2. DEVELOPER_ONBOARDING_GUIDE.md
3. GIT_BRANCH_STRATEGY.md

**Priority 2 (Read Before Development):**
4. CREDENTIALS_MANAGEMENT_GUIDE.md
5. TECH_STACK_BREAKDOWN.md
6. SHOPIFY_STRIPE_PIVOT_PLAN.md

---

## 📞 Getting Help

**Questions?** Contact:
- **Team Lead:** [name] - [email]
- **Slack:** #neesh-development
- **Documentation:** See README files

---

## ✅ Onboarding Checklist

- [ ] Cloned repository
- [ ] Requested credentials
- [ ] Created .env files
- [ ] Installed dependencies
- [ ] Frontend running on localhost:5173
- [ ] Backend running on localhost:8000
- [ ] Database connected
- [ ] Read DEVELOPER_ONBOARDING_GUIDE.md
- [ ] Read GIT_BRANCH_STRATEGY.md
- [ ] Read CREDENTIALS_MANAGEMENT_GUIDE.md
- [ ] Created first feature branch
- [ ] Ready to start development

---

## 🎯 First Task

**Create a simple feature branch:**

```bash
# 1. Create branch
git checkout -b feature/test-setup

# 2. Make a small change
echo "# Test" >> README.md

# 3. Commit
git add .
git commit -m "test: verify setup"

# 4. Push
git push origin feature/test-setup

# 5. Create PR on GitHub
# 6. Get approval
# 7. Merge
# 8. Delete branch

# 9. Verify
git checkout integrate-backend
git pull origin integrate-backend
git log --oneline -3
```

---

## 🚀 You're Ready!

You now have:
- ✅ Repository cloned
- ✅ Environment set up
- ✅ Credentials configured
- ✅ Frontend running
- ✅ Backend running
- ✅ Database connected
- ✅ Branch strategy understood
- ✅ Credentials security understood

**Welcome to the NEESH team! 🎉**

---

**Questions?** See DEVELOPER_ONBOARDING_GUIDE.md for detailed information.

**Last Updated:** November 4, 2025

