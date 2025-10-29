<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Magazine;
use App\Models\RetailerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            $validated = $request->validate([
                'amount' => 'required|numeric|min:1',
                'items' => 'required|array',
                'shipping_address' => 'required|array',
                'billing_address' => 'required|array',
            ]);

            Stripe::setApiKey(config('services.stripe.secret'));

            $amountInCents = intval($validated['amount'] * 100);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'usd',
                'metadata' => [
                    'retailer_id' => auth()->user()->id,
                    'items_count' => count($validated['items']),
                ]
            ]);

            return response()->json([
                'success' => true,
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
            ]);
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
            $validated = $request->validate([
                'payment_intent_id' => 'required|string',
                'items' => 'required|array',
                'shipping_address' => 'required|array',
                'billing_address' => 'required|array',
                'subtotal' => 'required|numeric',
                'shipping_cost' => 'required|numeric',
                'total' => 'required|numeric',
            ]);

            $user = auth()->user();
            $retailerProfile = RetailerProfile::where('user_id', $user->id)->firstOrFail();

            // Group items by publisher
            $itemsByPublisher = [];
            foreach ($validated['items'] as $item) {
                $magazine = Magazine::find($item['id']);
                if (!$magazine) continue;

                if (!isset($itemsByPublisher[$magazine->publisher_id])) {
                    $itemsByPublisher[$magazine->publisher_id] = [];
                }

                $itemsByPublisher[$magazine->publisher_id][] = [
                    'magazine_id' => $magazine->id,
                    'quantity' => $item['qty'],
                    'unit_price' => $magazine->wholesale_price,
                ];
            }

            // Create orders for each publisher
            $orders = [];
            $totalCommission = 0;

            foreach ($itemsByPublisher as $publisherId => $items) {
                $subtotal = 0;
                foreach ($items as $item) {
                    $subtotal += $item['unit_price'] * $item['quantity'];
                }

                // Calculate commission (10% of subtotal)
                $commission = $subtotal * 0.10;
                $totalCommission += $commission;

                $order = Order::create([
                    'retailer_id' => $retailerProfile->id,
                    'publisher_id' => $publisherId,
                    'status' => 'submitted',
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
                    'status' => 'succeeded',
                ]);

                $orders[] = $order;
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'orders' => $orders,
                'redirect' => route('checkout.success', ['order_id' => $orders[0]->id ?? null])
            ]);
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
