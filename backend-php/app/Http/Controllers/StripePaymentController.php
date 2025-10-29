<?php

namespace App\Http\Controllers;

use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class StripePaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Create a payment intent for retailer purchases
     */
    public function createPaymentIntent(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'currency' => 'nullable|string|size:3',
                'magazine_id' => 'nullable|integer',
                'quantity' => 'nullable|integer|min:1',
            ]);

            $user = Auth::user();
            $currency = $validated['currency'] ?? 'usd';
            $amount = $validated['amount'];

            $metadata = [];
            if (isset($validated['magazine_id'])) {
                $metadata['magazine_id'] = $validated['magazine_id'];
            }
            if (isset($validated['quantity'])) {
                $metadata['quantity'] = $validated['quantity'];
            }

            $paymentIntent = $this->stripeService->createPaymentIntent(
                $user,
                $amount,
                $currency,
                $metadata
            );

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Payment intent creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment intent: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Confirm a payment
     */
    public function confirmPayment(Request $request)
    {
        try {
            $validated = $request->validate([
                'payment_intent_id' => 'required|string',
                'payment_method_id' => 'required|string',
            ]);

            $paymentIntent = $this->stripeService->confirmPaymentIntent(
                $validated['payment_intent_id'],
                $validated['payment_method_id']
            );

            if ($paymentIntent->status === 'succeeded') {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful',
                    'payment_intent_id' => $paymentIntent->id,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Payment failed: ' . $paymentIntent->status,
            ], 400);
        } catch (\Exception $e) {
            Log::error('Payment confirmation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Payment confirmation failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get payment intent status
     */
    public function getPaymentStatus(Request $request)
    {
        try {
            $validated = $request->validate([
                'payment_intent_id' => 'required|string',
            ]);

            $paymentIntent = $this->stripeService->getPaymentIntent($validated['payment_intent_id']);

            return response()->json([
                'success' => true,
                'status' => $paymentIntent->status,
                'amount' => $paymentIntent->amount / 100,
                'currency' => $paymentIntent->currency,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get payment status', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment status: ' . $e->getMessage(),
            ], 400);
        }
    }
}

