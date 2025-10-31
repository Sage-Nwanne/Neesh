# Phase 1 Integration Guide - CheckoutController Updates

## Overview
This guide shows how to integrate the Phase 1 validation and security services into the existing CheckoutController.

## Step 1: Update CheckoutController Imports

Add these imports at the top of `app/Http/Controllers/CheckoutController.php`:

```php
use App\Http\Requests\CheckoutValidationRequest;
use App\Services\AddressValidator;
use App\Services\RateLimiter;
use App\Services\FraudDetection;
use App\Models\Address;
use App\Models\PaymentAttempt;
use Illuminate\Support\Str;
```

## Step 2: Update createPaymentIntent() Method

Replace the current method with:

```php
public function createPaymentIntent(CheckoutValidationRequest $request)
{
    try {
        $user = auth()->user();
        $ipAddress = $request->ip();

        // Check rate limit
        if (!RateLimiter::checkCheckoutLimit($user->id, $ipAddress)) {
            $remaining = RateLimiter::getRemainingAttempts($user->id);
            $resetIn = RateLimiter::getSecondsUntilReset($user->id);
            return response()->json([
                'success' => false,
                'message' => 'Too many checkout attempts. Please try again in ' . $resetIn . ' seconds.',
                'remaining' => $remaining,
            ], 429);
        }

        $validated = $request->validated();

        // Validate addresses
        $shippingErrors = AddressValidator::validate([
            'country' => $validated['shipping_country'],
            'line1' => $validated['shipping_line1'],
            'city' => $validated['shipping_city'],
            'state_province' => $validated['shipping_state'] ?? null,
            'postal_code' => $validated['shipping_postal_code'],
        ]);

        if (!empty($shippingErrors)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid shipping address: ' . implode(', ', $shippingErrors),
            ], 422);
        }

        // Analyze fraud risk
        $fraudAnalysis = FraudDetection::analyze($user->id, [
            'amount' => $validated['total'],
            'country' => $validated['shipping_country'],
        ]);

        // Generate idempotency key
        $idempotencyKey = Str::uuid()->toString();

        Stripe::setApiKey(config('services.stripe.secret'));
        $amountInCents = intval($validated['total'] * 100);

        // Create payment intent with idempotency key
        $paymentIntent = PaymentIntent::create(
            [
                'amount' => $amountInCents,
                'currency' => 'usd',
                'metadata' => [
                    'retailer_id' => $user->id,
                    'items_count' => count($validated['items']),
                    'risk_level' => $fraudAnalysis['risk_level'],
                ]
            ],
            ['idempotency_key' => $idempotencyKey]
        );

        // Record payment attempt
        PaymentAttempt::create([
            'user_id' => $user->id,
            'stripe_payment_intent_id' => $paymentIntent->id,
            'amount' => $validated['total'],
            'currency' => 'USD',
            'status' => 'pending',
            'risk_level' => $fraudAnalysis['risk_level'],
            'ip_address' => $ipAddress,
            'user_agent' => $request->userAgent(),
            'metadata' => [
                'idempotency_key' => $idempotencyKey,
                'fraud_flags' => $fraudAnalysis['flags'],
                'requires_3ds' => $fraudAnalysis['requires_3ds'],
            ],
        ]);

        // Increment rate limit counter
        RateLimiter::incrementCheckoutAttempt($user->id, $ipAddress);

        // Record fraud metric
        FraudDetection::recordMetric($user->id, 'orders_per_hour');

        return response()->json([
            'success' => true,
            'clientSecret' => $paymentIntent->client_secret,
            'paymentIntentId' => $paymentIntent->id,
            'requires3DS' => $fraudAnalysis['requires_3ds'],
            'riskLevel' => $fraudAnalysis['risk_level'],
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        Log::error('Payment intent creation error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to create payment intent.'
        ], 500);
    }
}
```

## Step 3: Update processOrder() Method

Replace the current method with:

```php
public function processOrder(CheckoutValidationRequest $request)
{
    try {
        $user = auth()->user();
        $validated = $request->validated();
        $retailerProfile = RetailerProfile::where('user_id', $user->id)->firstOrFail();

        // Validate billing address if different from shipping
        if (!$validated['billing_same_as_shipping']) {
            $billingErrors = AddressValidator::validate([
                'country' => $validated['billing_country'],
                'line1' => $validated['billing_line1'],
                'city' => $validated['billing_city'],
                'state_province' => $validated['billing_state'] ?? null,
                'postal_code' => $validated['billing_postal_code'],
            ]);

            if (!empty($billingErrors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid billing address: ' . implode(', ', $billingErrors),
                ], 422);
            }
        }

        // Store shipping address
        $shippingAddress = Address::create([
            'user_id' => $user->id,
            'type' => 'shipping',
            ...AddressValidator::format([
                'country' => $validated['shipping_country'],
                'line1' => $validated['shipping_line1'],
                'line2' => $validated['shipping_line2'],
                'city' => $validated['shipping_city'],
                'state_province' => $validated['shipping_state'],
                'postal_code' => $validated['shipping_postal_code'],
            ]),
        ]);

        // Store billing address
        $billingAddress = Address::create([
            'user_id' => $user->id,
            'type' => 'billing',
            ...AddressValidator::format([
                'country' => $validated['billing_country'],
                'line1' => $validated['billing_line1'],
                'line2' => $validated['billing_line2'],
                'city' => $validated['billing_city'],
                'state_province' => $validated['billing_state'],
                'postal_code' => $validated['billing_postal_code'],
            ]),
        ]);

        // Group items by publisher and create orders
        $itemsByPublisher = [];
        foreach ($validated['items'] as $item) {
            $magazine = Magazine::find($item['magazine_id']);
            if (!$magazine) continue;

            if (!isset($itemsByPublisher[$magazine->publisher_id])) {
                $itemsByPublisher[$magazine->publisher_id] = [];
            }

            $itemsByPublisher[$magazine->publisher_id][] = [
                'magazine_id' => $magazine->id,
                'quantity' => $item['quantity'],
                'unit_price' => $magazine->wholesale_price,
            ];
        }

        $orders = [];
        foreach ($itemsByPublisher as $publisherId => $items) {
            $subtotal = 0;
            foreach ($items as $item) {
                $subtotal += $item['unit_price'] * $item['quantity'];
            }

            $commission = $subtotal * 0.10;

            $order = Order::create([
                'retailer_id' => $retailerProfile->id,
                'publisher_id' => $publisherId,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'commission_fee' => $commission,
                'external_order_id' => 'ORD-' . time() . '-' . rand(1000, 9999),
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'magazine_id' => $item['magazine_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'return_eligible' => true,
                ]);
            }

            Payment::create([
                'order_id' => $order->id,
                'stripe_payment_intent_id' => $validated['payment_intent_id'],
                'amount' => $validated['total'],
                'currency' => 'USD',
                'status' => 'pending',
            ]);

            $orders[] = $order;
        }

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully!',
            'orders' => $orders,
            'redirect' => route('checkout.success', ['orderId' => $orders[0]->id ?? null])
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        Log::error('Order processing error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to process order.'
        ], 500);
    }
}
```

## Step 4: Update Order Model

Add these fields to the Order model's `$fillable` array:

```php
protected $fillable = [
    // ... existing fields ...
    'shipping_address_id',
    'billing_address_id',
];
```

Add these relationships:

```php
public function shippingAddress()
{
    return $this->belongsTo(Address::class, 'shipping_address_id');
}

public function billingAddress()
{
    return $this->belongsTo(Address::class, 'billing_address_id');
}
```

## Step 5: Database Migration for Orders Table

Create a migration to add address fields to orders table:

```php
Schema::table('orders', function (Blueprint $table) {
    $table->foreignId('shipping_address_id')->nullable()->constrained('addresses')->onDelete('set null');
    $table->foreignId('billing_address_id')->nullable()->constrained('addresses')->onDelete('set null');
});
```

## Testing Checklist

- [ ] Rate limiting works (10/min per user)
- [ ] Address validation works for US, UK, Canada
- [ ] Fraud detection flags high-value orders
- [ ] Payment attempts are recorded
- [ ] Addresses are stored correctly
- [ ] Webhook events are processed
- [ ] Error messages are user-friendly

## Configuration

Ensure these are set in `.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

And in `config/services.php`:

```php
'stripe' => [
    'secret' => env('STRIPE_SECRET_KEY'),
    'public' => env('STRIPE_PUBLIC_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
],
```

