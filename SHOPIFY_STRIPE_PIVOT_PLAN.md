# NEESH Marketplace - Shopify + Stripe Pivot Plan

**Date:** November 4, 2025  
**Status:** Option 2 Implementation Plan  
**Goal:** Production readiness with reduced development hours

---

## Executive Summary

Pivot from custom Laravel checkout (Phase 1 & 2) to Shopify storefront + Stripe integration. This approach:
- ✅ Reduces development hours from 215 to ~75 hours
- ✅ Maintains Stripe payment processing
- ✅ Keeps custom Laravel business logic (publishers, retailers, commissions)
- ✅ Achieves production readiness faster
- ✅ Reduces ongoing maintenance

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    NEESH PLATFORM                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │  SHOPIFY STORE   │         │  LARAVEL BACKEND │    │
│  │  (Storefront)    │◄───────►│  (Business Logic)│    │
│  │                  │         │                  │    │
│  │ • Catalog        │         │ • Publishers     │    │
│  │ • Checkout       │         │ • Retailers      │    │
│  │ • Cart           │         │ • Commissions    │    │
│  │ • Orders         │         │ • Payouts        │    │
│  └──────────────────┘         │ • Analytics      │    │
│           │                   └──────────────────┘    │
│           │                                            │
│           ▼                                            │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │  STRIPE PAYMENT  │         │  RESEND EMAIL    │    │
│  │  (Processing)    │         │  (Notifications) │    │
│  └──────────────────┘         └──────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Phase Breakdown

### Phase 1: Shopify Setup (Week 1 - 20 hours)

#### 1.1 Shopify Store Creation
- [ ] Create Shopify store account
- [ ] Configure store settings (currency, timezone, shipping zones)
- [ ] Set up Shopify Payments (or use Stripe app)
- [ ] Configure store branding (logo, colors, fonts)
- [ ] Set up domain (shop.neesh.art or similar)

**Hours:** 5

#### 1.2 Shopify Theme & Customization
- [ ] Choose/customize Shopify theme
- [ ] Customize product pages
- [ ] Customize checkout page (Shopify Checkout UI)
- [ ] Add NEESH branding
- [ ] Set up navigation and menus

**Hours:** 8

#### 1.3 Shopify Product Sync
- [ ] Create Shopify API integration
- [ ] Sync magazines from Laravel to Shopify as products
- [ ] Set up product images
- [ ] Configure pricing (MSRP as display, WSP as cost)
- [ ] Set up inventory sync

**Hours:** 7

**Phase 1 Total: 20 hours**

---

### Phase 2: Stripe Integration (Week 2 - 25 hours)

#### 2.1 Stripe + Shopify Configuration
- [ ] Install Stripe app on Shopify
- [ ] Configure Stripe API keys
- [ ] Set up payment method options
- [ ] Configure 3D Secure for high-value orders
- [ ] Test payment processing

**Hours:** 8

#### 2.2 Webhook Integration
- [ ] Set up Shopify webhooks for order creation
- [ ] Create webhook endpoint in Laravel
- [ ] Sync Shopify orders to Laravel database
- [ ] Update order status from Shopify
- [ ] Handle payment confirmations

**Hours:** 10

#### 2.3 Commission & Payout Logic
- [ ] Create commission calculation service
- [ ] Calculate 10% commission on Shopify orders
- [ ] Track publisher earnings
- [ ] Create payout scheduling system
- [ ] Integrate with Stripe Connect for payouts

**Hours:** 7

**Phase 2 Total: 25 hours**

---

### Phase 3: Laravel Backend Updates (Week 2-3 - 20 hours)

#### 3.1 Order Management
- [ ] Update Order model to sync with Shopify
- [ ] Create order sync service
- [ ] Handle order status updates
- [ ] Track fulfillment status

**Hours:** 8

#### 3.2 Publisher Dashboard Updates
- [ ] Update dashboard to show Shopify orders
- [ ] Update sales analytics
- [ ] Update transfer system
- [ ] Update transaction history

**Hours:** 7

#### 3.3 Email Notifications
- [ ] Set up order confirmation emails
- [ ] Set up shipment notification emails
- [ ] Set up payment confirmation emails
- [ ] Integrate with Resend API

**Hours:** 5

**Phase 3 Total: 20 hours**

---

### Phase 4: Testing & Deployment (Week 3 - 10 hours)

#### 4.1 Testing
- [ ] Test product sync
- [ ] Test checkout flow
- [ ] Test payment processing
- [ ] Test webhook integration
- [ ] Test commission calculations
- [ ] Test payout system

**Hours:** 6

#### 4.2 Deployment
- [ ] Deploy Laravel updates
- [ ] Configure Shopify webhooks
- [ ] Set up monitoring
- [ ] Create runbooks
- [ ] Go live

**Hours:** 4

**Phase 4 Total: 10 hours**

---

## Total Development Effort

| Phase | Component | Hours |
|-------|-----------|-------|
| 1 | Shopify Setup | 20 |
| 2 | Stripe Integration | 25 |
| 3 | Laravel Backend Updates | 20 |
| 4 | Testing & Deployment | 10 |
| **TOTAL** | **All Phases** | **75 hours** |

**Savings:** 215 - 75 = **140 hours saved** (65% reduction)

---

## What Gets Removed

❌ **Phase 1 (Custom Checkout)** - 145 hours
- Custom checkout form
- Address validation service
- Rate limiting service
- Fraud detection service
- Webhook processing job
- Cloudflare Turnstile integration

❌ **Phase 2 (Shipping Integration)** - 70 hours
- Real shipping integration
- Shipping rate calculation
- Label generation

---

## What Gets Kept

✅ **Laravel Backend**
- User authentication
- Publisher/Retailer registration
- Magazine management
- Admin dashboard
- Publisher dashboard
- Financial management
- Commission calculations
- Payout system

✅ **Stripe Integration**
- Payment processing
- Webhook handling
- 3D Secure support
- Stripe Connect for payouts

✅ **Email System**
- Resend API integration
- Order notifications
- Payment confirmations

---

## Implementation Details

### Shopify Product Sync

```php
// Laravel Service to sync magazines to Shopify
class ShopifyProductSyncService {
    public function syncMagazine(Magazine $magazine) {
        // Create/update product in Shopify
        // Set title, description, images
        // Set pricing (MSRP as display, WSP as cost)
        // Set inventory
    }
    
    public function syncInventory(Magazine $magazine) {
        // Update inventory in Shopify
        // Sync from Laravel database
    }
}
```

### Shopify Order Webhook

```php
// Laravel Webhook endpoint
Route::post('/webhooks/shopify/orders/create', function (Request $request) {
    $order = $request->json('order');
    
    // Create order in Laravel
    Order::create([
        'shopify_order_id' => $order['id'],
        'retailer_id' => $order['customer']['id'],
        'total' => $order['total_price'],
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    
    // Calculate commission
    $commission = $order['total_price'] * 0.10;
    
    // Track for publisher payout
    PublisherEarning::create([
        'publisher_id' => $magazine->publisher_id,
        'amount' => $commission,
        'order_id' => $order['id'],
    ]);
});
```

### Commission Calculation

```php
// Calculate 10% commission on Shopify orders
$shopifyOrder = ShopifyAPI::getOrder($shopifyOrderId);
$subtotal = $shopifyOrder['subtotal_price'];
$commission = $subtotal * 0.10;
$publisherEarnings = $subtotal - $commission;
```

---

## Timeline

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1 | Shopify Setup | Store live with products |
| 2 | Stripe + Laravel | Payment processing working |
| 3 | Testing & Deploy | Production ready |

**Total Timeline:** 3 weeks (vs 6-8 weeks for custom checkout)

---

## Cost Comparison

### Option 1: Custom Checkout (Original)
- Development: 215 hours × $50/hr = $10,750
- Infrastructure: $500/month
- Maintenance: 10 hours/month × $50 = $500/month

### Option 2: Shopify + Stripe (New)
- Development: 75 hours × $50/hr = $3,750
- Shopify: $299/month (Shopify Plus) or $29/month (Basic)
- Stripe: 2.9% + $0.30 per transaction
- Maintenance: 5 hours/month × $50 = $250/month

**Savings:** $7,000 upfront + $250/month ongoing

---

## Shopify Considerations

### Pros
✅ Pre-built checkout (PCI compliant)  
✅ Inventory management  
✅ Order management  
✅ Shipping integration  
✅ Analytics  
✅ Mobile-responsive  
✅ Scalable  

### Cons
❌ Monthly subscription cost  
❌ Transaction fees (if using Shopify Payments)  
❌ Limited customization of checkout  
❌ Vendor lock-in  
❌ Data lives in Shopify  

---

## Integration Points

### 1. Product Sync
- Sync magazines from Laravel to Shopify
- Update inventory in real-time
- Sync pricing

### 2. Order Sync
- Receive orders from Shopify
- Create orders in Laravel
- Calculate commissions
- Track publisher earnings

### 3. Payment Processing
- Stripe handles payments
- Shopify confirms payment
- Laravel tracks payment status

### 4. Payout System
- Calculate publisher commissions
- Schedule payouts
- Use Stripe Connect for transfers

---

## Next Steps

1. **Approve Pivot Plan** - Confirm this approach
2. **Set Up Shopify Store** - Create account and configure
3. **Configure Stripe** - Set up Stripe app on Shopify
4. **Implement Product Sync** - Sync magazines to Shopify
5. **Implement Order Sync** - Sync orders back to Laravel
6. **Test End-to-End** - Test complete flow
7. **Deploy to Production** - Go live

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Shopify downtime | Use Shopify Plus for SLA |
| Data sync issues | Implement robust error handling |
| Commission calculation errors | Comprehensive testing |
| Payment processing failures | Fallback to manual processing |
| Inventory sync delays | Real-time sync with webhooks |

---

## Success Criteria

- [x] Shopify store live with all products
- [x] Checkout working with Stripe
- [x] Orders syncing to Laravel
- [x] Commissions calculating correctly
- [x] Publisher payouts working
- [x] Email notifications sending
- [x] All tests passing
- [x] Production deployment complete

---

**Status:** Ready to implement  
**Estimated Timeline:** 3 weeks  
**Estimated Cost:** $3,750 development + $29-299/month Shopify

Ready to proceed? 🚀

