# Git Branch Strategy - NEESH Platform

**Date:** November 4, 2025  
**Strategy:** Git Flow with Simplified Workflow

---

## 🌳 Branch Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    MAIN (Production)                    │
│              (Stable, Production-Ready)                 │
└─────────────────────────────────────────────────────────┘
                          ↑
                    (Merge PR)
                          │
┌─────────────────────────────────────────────────────────┐
│            INTEGRATE-BACKEND (Staging/Dev)              │
│         (Development, Testing, Integration)             │
└─────────────────────────────────────────────────────────┘
                          ↑
                    (Merge PR)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │  feature/  │  │  bugfix/   │  │  refactor/ │
   │   (Dev)    │  │   (Dev)    │  │   (Dev)    │
   └────────────┘  └────────────┘  └────────────┘
```

---

## 📋 Branch Types & Purposes

### 1. **main** (Production)
- **Purpose:** Production-ready code only
- **Protection:** ✅ Requires PR review
- **Merge From:** `integrate-backend` only
- **Deployment:** Automatic to production
- **Naming:** `main`

**Rules:**
- Never commit directly
- Always merge via PR
- Requires 2 approvals
- All tests must pass
- Tagged with version numbers

### 2. **integrate-backend** (Staging/Development)
- **Purpose:** Integration and testing
- **Protection:** ✅ Requires PR review
- **Merge From:** Feature/bugfix/refactor branches
- **Deployment:** Manual to staging
- **Naming:** `integrate-backend`

**Rules:**
- Never commit directly
- Always merge via PR
- Requires 1 approval
- All tests must pass
- Synced with main regularly

### 3. **feature/** (Feature Development)
- **Purpose:** New features
- **Protection:** ❌ No protection
- **Merge To:** `integrate-backend`
- **Naming:** `feature/shopify-integration`

**Rules:**
- Create from: `integrate-backend`
- Delete after merge
- One feature per branch
- Descriptive names

**Examples:**
```
feature/shopify-product-sync
feature/shopify-order-sync
feature/commission-calculation
feature/payout-system
feature/webhook-handling
```

### 4. **bugfix/** (Bug Fixes)
- **Purpose:** Fix bugs in development
- **Protection:** ❌ No protection
- **Merge To:** `integrate-backend`
- **Naming:** `bugfix/checkout-validation`

**Rules:**
- Create from: `integrate-backend`
- Delete after merge
- Reference issue number
- Descriptive names

**Examples:**
```
bugfix/stripe-webhook-error
bugfix/commission-rounding
bugfix/email-notification-delay
bugfix/address-validation-us
```

### 5. **hotfix/** (Production Hotfixes)
- **Purpose:** Critical production fixes
- **Protection:** ❌ No protection
- **Merge To:** `main` AND `integrate-backend`
- **Naming:** `hotfix/payment-processing-down`

**Rules:**
- Create from: `main`
- Delete after merge
- Merge to both `main` and `integrate-backend`
- Requires immediate review

**Examples:**
```
hotfix/stripe-connection-error
hotfix/database-connection-pool
hotfix/email-service-down
```

### 6. **refactor/** (Code Refactoring)
- **Purpose:** Code improvements (no feature changes)
- **Protection:** ❌ No protection
- **Merge To:** `integrate-backend`
- **Naming:** `refactor/payment-service`

**Rules:**
- Create from: `integrate-backend`
- Delete after merge
- No functional changes
- Descriptive names

**Examples:**
```
refactor/payment-service
refactor/address-validator
refactor/commission-service
refactor/database-queries
```

### 7. **docs/** (Documentation)
- **Purpose:** Documentation updates
- **Protection:** ❌ No protection
- **Merge To:** `integrate-backend`
- **Naming:** `docs/api-documentation`

**Rules:**
- Create from: `integrate-backend`
- Delete after merge
- No code changes
- Descriptive names

**Examples:**
```
docs/api-documentation
docs/setup-guide
docs/deployment-process
docs/shopify-integration
```

---

## 🔄 Workflow Examples

### Creating a Feature Branch

```bash
# 1. Update integrate-backend
git checkout integrate-backend
git pull origin integrate-backend

# 2. Create feature branch
git checkout -b feature/shopify-product-sync

# 3. Make changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "feat: implement shopify product sync service"

# 5. Push to remote
git push origin feature/shopify-product-sync

# 6. Create Pull Request on GitHub
# - Title: "feat: implement shopify product sync service"
# - Description: Detailed explanation
# - Reviewers: Assign team members
# - Labels: feature, shopify

# 7. After approval and merge
git checkout integrate-backend
git pull origin integrate-backend
git branch -d feature/shopify-product-sync
git push origin --delete feature/shopify-product-sync
```

### Creating a Bugfix Branch

```bash
# 1. Update integrate-backend
git checkout integrate-backend
git pull origin integrate-backend

# 2. Create bugfix branch
git checkout -b bugfix/commission-calculation

# 3. Make changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "fix: correct commission calculation rounding"

# 5. Push to remote
git push origin bugfix/commission-calculation

# 6. Create Pull Request on GitHub
# - Title: "fix: correct commission calculation rounding"
# - Description: Explain the bug and fix
# - Reviewers: Assign team members
# - Labels: bugfix

# 7. After approval and merge
git checkout integrate-backend
git pull origin integrate-backend
git branch -d bugfix/commission-calculation
git push origin --delete bugfix/commission-calculation
```

### Creating a Hotfix Branch

```bash
# 1. Update main (production)
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/stripe-connection-error

# 3. Make changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "fix: resolve stripe connection timeout"

# 5. Push to remote
git push origin hotfix/stripe-connection-error

# 6. Create Pull Request to main on GitHub
# - Title: "fix: resolve stripe connection timeout"
# - Description: Explain the critical issue
# - Reviewers: Assign team members
# - Labels: hotfix, critical

# 7. After approval and merge to main
# 8. Create another PR to integrate-backend
git checkout integrate-backend
git pull origin integrate-backend
git merge main
git push origin integrate-backend

# 9. Clean up
git branch -d hotfix/stripe-connection-error
git push origin --delete hotfix/stripe-connection-error
```

---

## 📝 Commit Message Convention

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Build, dependencies, etc.

**Scopes:**
- `shopify` - Shopify integration
- `stripe` - Stripe payment
- `email` - Email service
- `auth` - Authentication
- `database` - Database
- `api` - API endpoints
- `ui` - User interface

**Examples:**
```
feat(shopify): implement product sync service
fix(stripe): resolve webhook signature verification
refactor(payment): simplify payment processing
docs(api): update API documentation
test(commission): add commission calculation tests
chore(deps): update stripe-php to v18.0
```

---

## 🔐 Branch Protection Rules

### main Branch
```
✅ Require pull request reviews before merging
   - Required approving reviews: 2
   - Dismiss stale pull request approvals: Yes
   
✅ Require status checks to pass before merging
   - Required checks: All tests must pass
   
✅ Require branches to be up to date before merging
   - Yes
   
✅ Require code reviews from code owners
   - Yes
   
✅ Restrict who can push to matching branches
   - Only admins can push
```

### integrate-backend Branch
```
✅ Require pull request reviews before merging
   - Required approving reviews: 1
   - Dismiss stale pull request approvals: Yes
   
✅ Require status checks to pass before merging
   - Required checks: All tests must pass
   
✅ Require branches to be up to date before merging
   - Yes
   
❌ Restrict who can push to matching branches
   - Allow all developers
```

---

## 📊 Current Branch Status

```
main
├── Last commit: [production version]
├── Status: ✅ Stable
└── Deployment: Production

integrate-backend
├── Last commit: phase 1
├── Status: 🔄 In Development
├── Deployment: Staging
└── Features in progress:
    ├── Shopify integration
    ├── Commission calculation
    └── Payout system

feature/shopify-product-sync
├── Status: 🔄 In Progress
└── Target: integrate-backend

feature/shopify-order-sync
├── Status: 🔄 In Progress
└── Target: integrate-backend
```

---

## 🚀 Release Process

### 1. Prepare Release
```bash
# Create release branch
git checkout -b release/v1.0.0 integrate-backend

# Update version numbers
# Update CHANGELOG.md
# Run final tests

git commit -m "chore: prepare v1.0.0 release"
git push origin release/v1.0.0
```

### 2. Create Pull Request
```
- Title: "release: v1.0.0"
- Target: main
- Description: List of features and fixes
```

### 3. Merge to main
```bash
# After approval
git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main
git push origin v1.0.0
```

### 4. Merge back to integrate-backend
```bash
git checkout integrate-backend
git pull origin integrate-backend
git merge main
git push origin integrate-backend
```

### 5. Clean up
```bash
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

---

## 📋 Checklist Before Merging

- [ ] Branch is up to date with target branch
- [ ] All tests pass locally
- [ ] All tests pass in CI/CD
- [ ] Code review approved
- [ ] No merge conflicts
- [ ] Commit messages follow convention
- [ ] Documentation updated
- [ ] No credentials in commits
- [ ] No large files added
- [ ] Ready for production (if merging to main)

---

## 🆘 Troubleshooting

### Merge Conflict
```bash
# 1. Update your branch
git fetch origin
git rebase origin/integrate-backend

# 2. Resolve conflicts in editor
# 3. Mark as resolved
git add .

# 4. Continue rebase
git rebase --continue

# 5. Force push (only on feature branches!)
git push origin feature/your-feature --force
```

### Accidental Commit to main
```bash
# 1. Create new branch from main
git checkout -b feature/fix-accidental-commit

# 2. Reset main to previous commit
git checkout main
git reset --hard HEAD~1

# 3. Force push (only if not yet pushed)
git push origin main --force
```

### Need to Update Feature Branch
```bash
# 1. Fetch latest
git fetch origin

# 2. Rebase on integrate-backend
git checkout feature/your-feature
git rebase origin/integrate-backend

# 3. Force push
git push origin feature/your-feature --force
```

---

## 📚 Resources

- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

---

**Status:** ✅ Ready for team use  
**Last Updated:** November 4, 2025  
**Next Review:** When new branches are created

