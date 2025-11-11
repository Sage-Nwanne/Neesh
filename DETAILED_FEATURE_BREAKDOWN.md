# NEESH Marketplace - Detailed Feature Breakdown

## PART 1: CORE PLATFORM FEATURES

### 1. User Authentication & Authorization

#### Authentication System
- Email/password login with secure hashing
- Email verification workflow
- Password reset functionality
- Session management
- CSRF protection
- Rate limiting on login attempts

#### Role-Based Access Control
- **Admin Role** - Full platform access, user management, approvals
- **Publisher Role** - Magazine management, sales analytics, payouts
- **Retailer Role** - Catalog browsing, checkout, order management
- **Guest Role** - Public website access, application forms

#### User Registration Workflows
- **Publisher Registration** (Multi-step)
  - Business information collection
  - Publication history
  - Payment method setup
  - Email verification
  - Admin approval workflow

- **Retailer Registration** (Multi-step)
  - Store information collection
  - Business details
  - Target customer profile
  - Magazine preferences
  - Email verification
  - Admin approval workflow

---

### 2. Publisher Features

#### Magazine Management
- **Create Magazine** - Add new titles with comprehensive metadata
- **Edit Magazine** - Update title details, pricing, inventory
- **Archive Magazine** - Hide titles from catalog without deletion
- **Unarchive Magazine** - Restore archived titles
- **Image Management** - Upload, reorder, delete cover images
- **Metadata Fields**
  - Title name, issue identifier
  - Genre, type (single/series)
  - Wholesale price (WSP), MSRP
  - Page count, dimensions
  - Stock levels, total printed
  - Description, promotional text
  - Return policy, fulfillment method
  - Retailer fit tags

#### Sales Analytics Dashboard
- **Financial Overview**
  - Account balance display
  - Total sales tracking
  - Sales volume metrics
  - Growth percentage indicators

- **Sales Chart**
  - Interactive Chart.js visualization
  - Time period filtering (Daily, Weekly, Monthly, Quarterly, YTD, Yearly, All)
  - Sales trend analysis
  - Revenue tracking

- **My Titles Section**
  - Published magazines list
  - Stock level display (100/100 format)
  - Sales progress bars
  - Quick access to analytics

- **Latest Orders Table**
  - Order ID, retailer name, total amount
  - Order timestamp
  - Volume ordered
  - Order type (Order/Return)
  - Fulfillment status with color coding

#### Order Management
- View all orders received from retailers
- Filter by status, date, retailer
- Track fulfillment status
- View commission calculations
- Generate payout reports

#### Financial Management
- **Transfer System**
  - View available balance
  - Select transfer amount
  - Choose transfer type (Instant/Standard)
  - Stripe Connect integration
  - Transfer history tracking

- **Transaction History**
  - All financial activity log
  - Organized by date
  - Expandable date sections
  - Total transferred/received amounts
  - Payment and payout tracking

#### Profile Management
- Publisher profile customization
- Social media integration
- Portfolio display
- Account settings
- Security settings

---

### 3. Retailer Features

#### Catalog Browsing
- **Explore Page** - Personalized magazine recommendations
- **Catalog Page** - Browse all published magazines
- **Search Functionality** - Search by title, publisher, genre
- **Filtering** - Filter by genre, type, publisher
- **Sorting** - Sort by newest, oldest, title, price
- **View Toggle** - Grid and list view options

#### Magazine Listing Details
- Magazine cover image with placeholder fallback
- Title name and issue identifier
- Publisher information
- Genre and type
- Pricing (WSP, MSRP)
- Stock availability
- Description and promotional text
- Bookmark button
- Share functionality

#### Bookmarking System
- Save favorite magazines
- View all bookmarks
- Remove bookmarks
- Persistent bookmark storage
- Visual bookmark status indicator

#### Share Functionality
- Web Share API support
- Fallback modal with shareable link
- Copy-to-clipboard functionality
- Social media sharing (Facebook, Twitter, LinkedIn)
- Beautiful share modal UI

#### Checkout System (Multi-Step)
1. **Shipping Step**
   - Country selection (US, UK, Canada)
   - Address line 1 & 2
   - City, state/province, postal code
   - Dynamic field labels based on country
   - Postal code format validation

2. **Billing Step**
   - Optional separate billing address
   - Same address as shipping option
   - Address validation

3. **Payment Step**
   - Stripe payment form
   - Card details entry
   - Cloudflare Turnstile bot protection
   - Payment processing

4. **Review Step**
   - Order summary
   - Item details and pricing
   - Commission breakdown
   - Shipping address confirmation
   - Final confirmation button

#### Order Management
- View all orders
- Order status tracking
- Order details and items
- Shipment tracking information
- Returns management

#### Account Management
- Profile information
- Security settings
- Notification preferences
- Billing information
- Payment methods
- Logout functionality

#### Help & Support
- Help Center with searchable articles
- FAQ page with collapsible sections
- Contact support functionality
- Payment & Shipping information page

---

### 4. Admin Features

#### User Management Dashboard
- View all users with roles
- Filter by verification status (Verified/Pending)
- Filter by verification date
- Search by email
- View user details
- Verify users
- Revoke user accounts

#### Application Review Workflow
- **Pending Applications**
  - Publisher applications
  - Retailer applications
  - Application details display
  - Applicant information

- **Approval Actions**
  - Approve application → Send approval email
  - Reject application → Send rejection email
  - Revoke account → Send revocation email

#### User Details View
- User profile information
- Role assignment
- Verification status
- Publisher/Retailer profile details
- Payment information
- Magazine listings (for publishers)
- Action buttons (Verify, Revoke, etc.)

#### Email Notifications
- Application approval emails
- Application rejection emails
- Account revocation emails
- Admin notification emails for new applications

---

## PART 2: TECHNICAL IMPLEMENTATION

### 5. Payment Processing

#### Stripe Integration
- Payment intent creation
- Webhook event handling
- Idempotency key support
- 3D Secure for high-risk transactions
- Commission calculation (10% on all orders)
- Payout management via Stripe Connect

#### Payment Security
- Rate limiting (10 checkout/min per user)
- Fraud detection (velocity checks, geo-filtering)
- Address validation (international)
- Webhook signature verification
- Replay protection
- No card data storage (Stripe handles)

#### Order Processing
- Order creation and persistence
- Order item tracking
- Multi-publisher order grouping
- Payment attempt logging
- Transaction history

---

### 6. Email System

#### Email Service
- Resend API integration
- Reliable email delivery
- HTML email templates
- Event-driven email triggers

#### Email Types
- Application approval
- Application rejection
- Account revocation
- Admin notifications
- Order confirmations (ready)
- Payment confirmations (ready)

---

### 7. Security Features

#### Rate Limiting
- 10 checkout attempts per minute (per user)
- 30 checkout attempts per hour (per IP)
- 120 global requests per minute (per IP)
- Automatic reset after time window

#### Fraud Detection
- Velocity checks (5 orders/hour, 3 card changes/hour)
- Geo-filtering (blocked countries: KP, IR, SY, CU)
- Order value thresholds ($5000+ requires 3D Secure)
- Risk scoring (low/medium/high)
- Suspicious pattern detection

#### Address Validation
- US: ZIP codes (5 or 9 digits), state codes (2 letters)
- UK: Postcodes (6-7 characters with space)
- Canada: Postal codes (A1A 1A1 format), province codes (2 letters)
- Format normalization (uppercase, trim whitespace)

#### Bot Protection
- Cloudflare Turnstile integration
- Bot detection on checkout page
- Token verification

---

### 8. Database Architecture

#### Core Tables
- users (authentication)
- publisher_profiles (publisher info)
- retailer_profiles (retailer info)
- magazines (title metadata)
- magazine_images (cover images)
- orders (retailer orders)
- order_items (individual items)
- payments (payment records)
- payouts (publisher payouts)

#### Security Tables
- addresses (international addresses)
- payment_attempts (payment tracking)
- user_security_metrics (velocity tracking)
- webhook_events (Stripe webhook audit trail)

#### Supporting Tables
- bookmarks (user bookmarks)
- magazine_views (analytics)
- transfers (financial transfers)
- shipments (fulfillment tracking)
- returns (return management)

---

### 9. API Endpoints

#### Authentication
- POST /login
- POST /register
- POST /logout
- POST /forgot-password
- POST /reset-password

#### Publisher
- GET /publisher/dashboard
- POST /magazines
- PUT /magazines/{id}
- DELETE /magazines/{id}
- GET /magazines/{id}/analytics
- POST /transfers
- GET /transfers

#### Retailer
- GET /retailer/dashboard
- GET /catalog
- POST /checkout/payment-intent
- POST /checkout/process-order
- GET /orders
- POST /bookmarks
- DELETE /bookmarks/{id}

#### Admin
- GET /admin/dashboard
- GET /admin/users
- POST /admin/users/{id}/approve
- POST /admin/users/{id}/reject
- POST /admin/users/{id}/revoke

#### Webhooks
- POST /webhooks/stripe

---

### 10. Testing

#### Unit Tests (30/30 PASSING)
- AddressValidator (13 tests)
- RateLimiter (7 tests)
- FraudDetection (10 tests)

#### Test Coverage
- Address validation for all regions
- Rate limiting logic
- Fraud detection scoring
- Form validation
- Payment processing
- Webhook handling

---

## PART 3: DEPLOYMENT & INFRASTRUCTURE

### 11. Production Environment

#### Server Configuration
- Host: 143.198.9.13 (DigitalOcean)
- OS: Ubuntu Linux
- Web Server: Nginx
- PHP: 8.3
- Database: MySQL 8.0
- Email: Resend API
- Payments: Stripe (Test Mode)
- Bot Protection: Cloudflare Turnstile

#### Environment Variables
- Stripe API keys (public & secret)
- Resend API key
- Database credentials
- Mail configuration
- Turnstile keys

---

### 12. Deliverables

#### Backend (Laravel)
- 23 Eloquent models
- 12 API controllers
- 4 validation/security services
- 30+ database migrations
- Stripe integration
- Email system
- Webhook processing
- 30 unit tests

#### Frontend (React)
- 15+ pages
- 50+ components
- Role-based routing
- Multi-step forms
- Interactive charts
- Responsive design
- Tailwind CSS

#### Infrastructure
- Production server
- Database setup
- Email integration
- Payment gateway
- Bot protection
- SSL/TLS security

---

**Total Development Hours:** Estimated 400+ hours  
**Status:** Phase 1 Complete, Ready for Production  
**Next Phase:** Shipping integration, inventory management, advanced analytics

