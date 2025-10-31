# Phase 1 Quick Reference Card

## 🎯 What's Been Done

### Database Layer ✅
```
addresses → stores shipping/billing addresses
payment_attempts → tracks all payment attempts with risk levels
webhook_events → logs all Stripe webhook events
user_security_metrics → tracks velocity metrics
```

### Services ✅
```
CheckoutValidationRequest → validates all checkout fields
AddressValidator → validates addresses (US, UK, CA)
RateLimiter → enforces rate limits (10/min user, 30/hr IP)
FraudDetection → analyzes risk, velocity checks, geo-filtering
WebhookController → handles Stripe webhooks
```

## 🔄 What's Next

### 1. Update CheckoutController
**File**: `app/Http/Controllers/CheckoutController.php`

**Changes**:
- Add imports for services
- Update `createPaymentIntent()` to use validation & fraud detection
- Update `processOrder()` to store addresses
- Add rate limiting checks

**Time**: 2-3 hours
**Guide**: See `PHASE_1_INTEGRATION_GUIDE.md`

### 2. Update Order Model
**File**: `app/Models/Order.php`

**Add to fillable**:
```php
'shipping_address_id',
'billing_address_id',
```

**Add relationships**:
```php
public function shippingAddress() { return $this->belongsTo(Address::class, 'shipping_address_id'); }
public function billingAddress() { return $this->belongsTo(Address::class, 'billing_address_id'); }
```

### 3. Create Migration
**File**: `database/migrations/YYYY_MM_DD_HHMMSS_add_addresses_to_orders_table.php`

```php
Schema::table('orders', function (Blueprint $table) {
    $table->foreignId('shipping_address_id')->nullable()->constrained('addresses')->onDelete('set null');
    $table->foreignId('billing_address_id')->nullable()->constrained('addresses')->onDelete('set null');
});
```

### 4. Update Checkout Form
**File**: `resources/views/retailer/checkout.blade.php`

**Add**:
- Country selection dropdown
- State/Province field (conditional)
- Postal code field with format validation

### 5. Add Turnstile
**File**: `resources/views/retailer/checkout.blade.php`

```html
<div class="cf-turnstile" data-sitekey="{{ config('services.cloudflare.turnstile_key') }}"></div>
```

### 6. Run Tests
```bash
php artisan test
```

### 7. Deploy
```bash
# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear
php artisan config:cache
```

## 📊 Key Numbers

| Metric | Value |
|--------|-------|
| Checkout attempts per minute (per user) | 10 |
| Checkout attempts per hour (per IP) | 30 |
| Global requests per minute (per IP) | 120 |
| Max order value (flags for review) | $5,000 |
| Max orders per hour (per user) | 5 |
| Max card changes per hour (per user) | 3 |
| Max failed payments per hour (per user) | 3 |

## 🔐 Security Features

- ✅ Rate limiting (per user & IP)
- ✅ Fraud detection (velocity, geo-filtering, value threshold)
- ✅ Address validation (international)
- ✅ Idempotency keys (Stripe)
- ✅ Webhook signature verification
- ✅ Replay protection
- ✅ No card data storage

## 📁 File Locations

### Models
```
app/Models/Address.php
app/Models/PaymentAttempt.php
app/Models/WebhookEvent.php
app/Models/UserSecurityMetric.php
```

### Services
```
app/Services/AddressValidator.php
app/Services/RateLimiter.php
app/Services/FraudDetection.php
app/Http/Requests/CheckoutValidationRequest.php
```

### Controllers
```
app/Http/Controllers/WebhookController.php
app/Http/Controllers/CheckoutController.php (needs update)
```

### Routes
```
routes/web.php (webhook route added)
```

### Migrations
```
database/migrations/2025_10_29_232258_create_addresses_table.php
database/migrations/2025_10_29_232258_create_payment_attempts_table.php
database/migrations/2025_10_29_232258_create_webhook_events_table.php
database/migrations/2025_10_29_232258_create_user_security_metrics_table.php
```

## 🧪 Testing Checklist

- [ ] Address validation (US, UK, CA)
- [ ] Rate limiting (10/min per user)
- [ ] Fraud detection (velocity checks)
- [ ] Order value threshold ($5k)
- [ ] Webhook signature verification
- [ ] Webhook idempotency
- [ ] Payment success flow
- [ ] Payment failure flow
- [ ] Refund handling
- [ ] Dispute handling

## 🚀 Deployment Steps

1. **Backup database**
   ```bash
   mysqldump -u root -p neeshapp_db > backup.sql
   ```

2. **Run migrations**
   ```bash
   php artisan migrate
   ```

3. **Clear cache**
   ```bash
   php artisan cache:clear
   php artisan config:cache
   ```

4. **Verify webhook**
   - Go to Stripe Dashboard
   - Check webhook endpoint status
   - Send test event

5. **Test checkout flow**
   - Create test order
   - Verify payment attempt recorded
   - Check webhook processing

## 📞 Troubleshooting

**Rate limit exceeded?**
- Check `RateLimiter::getRemainingAttempts($userId)`
- Check `RateLimiter::getSecondsUntilReset($userId)`

**Address validation failing?**
- Check country code (US, UK, CA)
- Check postal code format
- Check state/province code

**Webhook not processing?**
- Verify webhook secret in `.env`
- Check webhook logs in `webhook_events` table
- Verify Stripe dashboard webhook status

**Payment attempt not recorded?**
- Check `payment_attempts` table
- Verify `PaymentAttempt::create()` is called
- Check for validation errors

## 📚 Documentation

- `PHASE_1_IMPLEMENTATION_SUMMARY.md` - Overview
- `PHASE_1_INTEGRATION_GUIDE.md` - Step-by-step guide
- `PHASE_1_COMPLETION_STATUS.md` - Status & checklist
- `PHASE_1_QUICK_REFERENCE.md` - This file

## ⏱️ Estimated Timeline

| Task | Time |
|------|------|
| Update CheckoutController | 2-3 hrs |
| Update Order Model | 30 min |
| Create Migration | 30 min |
| Update Checkout Form | 1-2 hrs |
| Add Turnstile | 30 min |
| Write Tests | 2-3 hrs |
| Deploy | 1 hr |
| **Total** | **8-11 hrs** |

## 🎯 Success Criteria

✅ All services integrated
✅ Rate limiting enforced
✅ Fraud detection active
✅ Addresses stored in database
✅ Webhooks processing correctly
✅ All tests passing
✅ Deployed to production
✅ End-to-end flow working

