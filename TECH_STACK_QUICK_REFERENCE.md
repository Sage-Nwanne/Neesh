# NEESH Tech Stack - Quick Reference

**Date:** November 4, 2025

---

## 🎯 Current Tech Stack (One Page)

### Frontend
```
React + TypeScript
├── Tailwind CSS (styling)
├── Alpine.js (lightweight JS)
├── Axios (HTTP client)
├── Vite (build tool)
├── Chart.js (analytics)
└── 50+ Components, 15+ Pages
```

### Backend
```
Laravel 10.10 (PHP 8.1+)
├── Eloquent ORM (database)
├── Blade Templates (views)
├── Laravel Sanctum (auth)
├── 23 Models
├── 12 Controllers
└── 30+ Migrations
```

### Database
```
MySQL
├── 30+ Tables
├── Foreign Keys
├── Indexes
└── Relational Data
```

### Services
```
Stripe (Payment Processing)
├── Payment Intent
├── 3D Secure
├── Webhooks
└── Stripe Connect

Resend (Email)
├── Transactional Emails
├── Approval/Rejection
└── Order Notifications

Spatie (Permissions)
├── Admin Role
├── Publisher Role
└── Retailer Role
```

### Infrastructure
```
Production Server: 143.198.9.13
├── Linux OS
├── Apache/Nginx
├── PHP-FPM
└── MySQL Database

Deployment
├── SCP (secure copy)
├── Firebase Hosting (frontend)
└── Manual deployment (backend)
```

---

## 🆕 Option 2: New Tools (Shopify Pivot)

### Shopify Platform
```
Shopify Store (shop.neesh.art)
├── Product Catalog
├── Shopping Cart
├── Checkout (pre-built)
├── Order Management
└── Inventory Management
```

### Shopify Integration
```
Shopify Admin API
├── Product Management
├── Order Management
├── Inventory Sync
└── Webhook Events

Shopify Webhooks
├── Product Events
├── Order Events
├── Inventory Events
└── Payment Events
```

### Laravel Integration Services
```
ShopifyProductSyncService
├── Sync magazines to Shopify
├── Update inventory
└── Manage pricing

ShopifyOrderSyncService
├── Sync orders from Shopify
├── Calculate commissions
└── Track earnings

CommissionService
├── Calculate 10% commission
├── Track publisher earnings
└── Schedule payouts

PayoutService
├── Create payouts
├── Stripe Connect transfers
└── Payment tracking
```

### New Database Tables
```
shopify_products
├── shopify_product_id
├── magazine_id
└── sync_status

shopify_orders
├── shopify_order_id
├── order_id
└── sync_status

publisher_earnings
├── publisher_id
├── amount
├── order_id
└── status

shopify_webhooks
├── event_id
├── type
├── payload
└── processed_at
```

---

## 📊 Stack Comparison

| Component | Current | Option 2 |
|-----------|---------|----------|
| **Frontend** | React + Tailwind | React + Tailwind ✅ |
| **Backend** | Laravel + MySQL | Laravel + MySQL ✅ |
| **Checkout** | Custom Laravel | Shopify ✨ |
| **Payments** | Stripe (custom) | Stripe (via Shopify) ✨ |
| **Shipping** | Custom | Shopify ✨ |
| **Email** | Resend | Resend ✅ |
| **Complexity** | High | Lower ✨ |
| **Dev Hours** | 215 | 75 |

---

## 🔄 Data Flow

### Current (Custom Checkout)
```
React Frontend
    ↓
Laravel Checkout Controller
    ↓
Stripe Payment Intent
    ↓
Stripe Webhook
    ↓
Laravel Order Processing
    ↓
MySQL Database
```

### Option 2 (Shopify)
```
React Frontend
    ↓
Shopify Store
    ↓
Shopify Checkout
    ↓
Stripe Payment (via Shopify)
    ↓
Shopify Webhook
    ↓
Laravel Order Sync Service
    ↓
MySQL Database
```

---

## 🛠️ Development Tools

### Current
```
PHPUnit (testing)
Mockery (mocking)
Laravel Sail (Docker)
Laravel Tinker (REPL)
Faker (test data)
```

### Option 2 (Added)
```
Shopify CLI (local dev)
Postman (API testing)
Shopify Test Store (sandbox)
```

---

## 📦 Key Dependencies

### Backend (composer.json)
```
laravel/framework: ^10.10
stripe/stripe-php: ^18.0
resend/resend-laravel: ^0.23.0
spatie/laravel-permission: ^6.21
spatie/laravel-activitylog: ^4.10
guzzlehttp/guzzle: ^7.2
```

### Frontend (package.json)
```
tailwindcss: ^3.1.0
alpinejs: ^3.4.2
axios: ^1.6.4
vite: ^5.0.0
```

### Option 2 (New)
```
shopify/shopify-api: (to be added)
```

---

## 🚀 Deployment

### Current
```
Frontend: Firebase Hosting
Backend: DigitalOcean (143.198.9.13)
Database: MySQL on server
Deployment: SCP + manual
```

### Option 2 (Unchanged)
```
Frontend: Firebase Hosting ✅
Backend: DigitalOcean ✅
Database: MySQL on server ✅
Deployment: SCP + manual ✅
Shopify: Shopify Hosting ✨
```

---

## 📈 Performance Metrics

### Current Stack
- **Build Time:** ~30 seconds (Vite)
- **Page Load:** ~2-3 seconds
- **API Response:** ~200-500ms
- **Database Queries:** Optimized with indexes

### Option 2 (Expected)
- **Build Time:** ~30 seconds (unchanged)
- **Page Load:** ~2-3 seconds (unchanged)
- **API Response:** ~200-500ms (unchanged)
- **Shopify Sync:** ~1-5 seconds (async)

---

## 🔒 Security

### Current
```
Laravel Sanctum (API auth)
CSRF Protection
SQL Injection Prevention
XSS Protection
Rate Limiting
Fraud Detection
```

### Option 2 (Added)
```
Shopify Webhook Verification
Shopify API Key Management
Shopify Checkout Security
PCI Compliance (Shopify)
```

---

## 💰 Costs

### Current Stack
- **Development:** $10,750
- **Monthly:** $500 (maintenance)
- **Infrastructure:** Included in server

### Option 2
- **Development:** $3,750
- **Monthly:** $279-549 (Shopify $29-299 + maintenance)
- **Infrastructure:** Included in server + Shopify

**Savings:** $7,000 upfront + $250/month

---

## 🎯 What You Need to Know

### Frontend Developers
- React + TypeScript
- Tailwind CSS
- Axios for API calls
- No changes for Option 2

### Backend Developers
- Laravel 10.10
- Eloquent ORM
- Stripe integration
- New: Shopify API integration

### DevOps/Infrastructure
- Linux server management
- MySQL administration
- SCP deployment
- New: Shopify webhook configuration

### QA/Testing
- PHPUnit for backend tests
- Manual testing for frontend
- Stripe test cards
- New: Shopify test store

---

## 📚 Documentation

**Current Stack:**
- TECH_STACK_BREAKDOWN.md (detailed)
- This file (quick reference)

**Option 2:**
- SHOPIFY_STRIPE_PIVOT_PLAN.md
- SHOPIFY_IMPLEMENTATION_ROADMAP.md
- SHOPIFY_QUICK_START.md

---

## ✅ Ready to Go

You have:
- ✅ Clear current tech stack
- ✅ Clear Option 2 additions
- ✅ Comparison of both approaches
- ✅ Development tools identified
- ✅ Deployment strategy defined

**Status:** Ready to implement Option 2 🚀

---

**Questions?** Refer to TECH_STACK_BREAKDOWN.md for detailed information.

