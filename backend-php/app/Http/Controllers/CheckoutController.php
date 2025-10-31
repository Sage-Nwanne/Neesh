<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Magazine;
use App\Models\RetailerProfile;
use App\Models\Address;
use App\Models\PaymentAttempt;
use App\Http\Requests\CheckoutValidationRequest;
use App\Services\AddressValidator;
use App\Services\RateLimiter;
use App\Services\FraudDetection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class CheckoutController extends Controller
{
    /**
     * Show checkout page
     */
    public function index()
    {
        try {
            $user = auth()->user();
            $retailerProfile = null;

            if ($user && $user->hasRole('retailer')) {
                $retailerProfile = RetailerProfile::where('user_id', $user->id)->first();
            }

            return view('retailer.checkout', compact('retailerProfile'));
        } catch (\Exception $e) {
            Log::error('Checkout page error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load checkout page.');
        }
    }

    /**
     * Get cart items from request
     */
    public function getCart(Request $request)
    {
        try {
            $cartItems = $request->input('items', []);
            $magazines = [];

            foreach ($cartItems as $item) {
                $magazine = Magazine::find($item['id']);
                if ($magazine) {
                    $magazines[] = [
                        'id' => $magazine->id,
                        'title' => $magazine->title_name,
                        'price' => $magazine->wholesale_price,
                        'quantity' => $item['qty'],
                        'image' => $magazine->cover_image,
                        'publisher_id' => $magazine->publisher_id,
                    ];
                }
            }

            return response()->json(['success' => true, 'items' => $magazines]);
        } catch (\Exception $e) {
            Log::error('Get cart error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to get cart items.'], 500);
        }
    }

    /**
     * Create payment intent for Stripe
     */
    public function createPaymentIntent(Request $request)
    {
        try {
            $user = auth()->user();
            $ipAddress = $request->ip();

            // Check rate limit
            $rateLimiter = new RateLimiter();
            if (!$rateLimiter->checkCheckoutLimit($user->id, $ipAddress)) {
                $remaining = $rateLimiter->getRemainingAttempts($user->id);
                $resetIn = $rateLimiter->getSecondsUntilReset($user->id);
                return response()->json([
                    'success' => false,
                    'message' => 'Too many checkout attempts. Please try again in ' . $resetIn . ' seconds.',
                    'remaining' => $remaining,
                ], 429);
            }

            // Validate request
            $validated = $request->validate([
                'amount' => 'required|numeric|min:1',
                'items' => 'required|array',
                'shipping_country' => 'required|in:US,UK,CA',
                'shipping_line1' => 'required|string|max:255',
                'shipping_city' => 'required|string|max:100',
                'shipping_state' => 'required_if:shipping_country,US,CA|string|max:50',
                'shipping_postal_code' => 'required|string|max:20',
            ]);

            // Validate shipping address
            $addressValidator = new AddressValidator();
            $shippingErrors = $addressValidator->validate([
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
            $fraudDetection = new FraudDetection();
            $fraudAnalysis = $fraudDetection->analyze($user->id, [
                'amount' => $validated['amount'],
                'country' => $validated['shipping_country'],
            ]);

            // Generate idempotency key
            $idempotencyKey = Str::uuid()->toString();

            Stripe::setApiKey(config('services.stripe.secret'));
            $amountInCents = intval($validated['amount'] * 100);

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
                'amount' => $validated['amount'],
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
            $rateLimiter->incrementCheckoutAttempt($user->id, $ipAddress);

            // Record fraud metric
            $fraudDetection->recordMetric($user->id, 'orders_per_hour');

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

    /**
     * Process order after successful payment
     */
    public function processOrder(Request $request)
    {
        try {
            $user = auth()->user();

            // Validate request
            $validated = $request->validate([
                'payment_intent_id' => 'required|string',
                'items' => 'required|array',
                'shipping_country' => 'required|in:US,UK,CA',
                'shipping_line1' => 'required|string|max:255',
                'shipping_line2' => 'nullable|string|max:255',
                'shipping_city' => 'required|string|max:100',
                'shipping_state' => 'required_if:shipping_country,US,CA|string|max:50',
                'shipping_postal_code' => 'required|string|max:20',
                'billing_same_as_shipping' => 'boolean',
                'billing_country' => 'required_if:billing_same_as_shipping,false|in:US,UK,CA',
                'billing_line1' => 'required_if:billing_same_as_shipping,false|string|max:255',
                'billing_line2' => 'nullable|string|max:255',
                'billing_city' => 'required_if:billing_same_as_shipping,false|string|max:100',
                'billing_state' => 'required_if:billing_same_as_shipping,false,shipping_country,US,CA|string|max:50',
                'billing_postal_code' => 'required_if:billing_same_as_shipping,false|string|max:20',
                'subtotal' => 'required|numeric',
                'shipping_cost' => 'required|numeric',
                'total' => 'required|numeric',
            ]);

            $retailerProfile = RetailerProfile::where('user_id', $user->id)->firstOrFail();
            $addressValidator = new AddressValidator();

            // Validate shipping address
            $shippingErrors = $addressValidator->validate([
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

            // Validate billing address if different from shipping
            if (!$validated['billing_same_as_shipping']) {
                $billingErrors = $addressValidator->validate([
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
            $shippingAddressData = $addressValidator->format([
                'country' => $validated['shipping_country'],
                'line1' => $validated['shipping_line1'],
                'line2' => $validated['shipping_line2'],
                'city' => $validated['shipping_city'],
                'state_province' => $validated['shipping_state'],
                'postal_code' => $validated['shipping_postal_code'],
            ]);

            $shippingAddress = Address::create(array_merge([
                'user_id' => $user->id,
                'type' => 'shipping',
            ], $shippingAddressData));

            // Store billing address
            if ($validated['billing_same_as_shipping']) {
                $billingAddressData = $shippingAddressData;
            } else {
                $billingAddressData = $addressValidator->format([
                    'country' => $validated['billing_country'],
                    'line1' => $validated['billing_line1'],
                    'line2' => $validated['billing_line2'],
                    'city' => $validated['billing_city'],
                    'state_province' => $validated['billing_state'],
                    'postal_code' => $validated['billing_postal_code'],
                ]);
            }

            $billingAddress = Address::create(array_merge([
                'user_id' => $user->id,
                'type' => 'billing',
            ], $billingAddressData));

            // Group items by publisher
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

            // Create orders for each publisher
            $orders = [];
            $fraudDetection = new FraudDetection();

            foreach ($itemsByPublisher as $publisherId => $items) {
                $subtotal = 0;
                foreach ($items as $item) {
                    $subtotal += $item['unit_price'] * $item['quantity'];
                }

                // Calculate commission (10% of subtotal)
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

                // Create order items
                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'magazine_id' => $item['magazine_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'return_eligible' => true,
                    ]);
                }

                // Create payment record
                Payment::create([
                    'order_id' => $order->id,
                    'stripe_payment_intent_id' => $validated['payment_intent_id'],
                    'amount' => $validated['total'],
                    'currency' => 'USD',
                    'status' => 'pending',
                ]);

                $orders[] = $order;
            }

            // Record fraud metric
            $fraudDetection->recordMetric($user->id, 'orders_per_hour');

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

    /**
     * Show order success page
     */
    public function success($orderId = null)
    {
        try {
            $order = null;
            if ($orderId) {
                $order = Order::with(['items.magazine', 'payment'])->find($orderId);
            }

            return view('retailer.checkout-success', compact('order'));
        } catch (\Exception $e) {
            Log::error('Checkout success page error: ' . $e->getMessage());
            return redirect()->route('explore.index')->with('error', 'Failed to load order confirmation.');
        }
    }
}
