<?php

namespace App\Http\Controllers;

use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class StripePayoutController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Get Stripe onboarding link for publisher
     */
    public function getOnboardingLink(Request $request)
    {
        try {
            $user = Auth::user();
            
            $refreshUrl = route('publisher.stripe.onboarding');
            $returnUrl = route('publisher.dashboard');

            $accountLink = $this->stripeService->getAccountLink(
                $user,
                $refreshUrl,
                $returnUrl
            );

            return response()->json([
                'success' => true,
                'url' => $accountLink->url,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get onboarding link', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get onboarding link: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create a payout for publisher
     */
    public function createPayout(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'currency' => 'nullable|string|size:3',
            ]);

            $user = Auth::user();
            $currency = $validated['currency'] ?? 'usd';
            $amount = $validated['amount'];

            $payout = $this->stripeService->createPayout($user, $amount, $currency);

            return response()->json([
                'success' => true,
                'message' => 'Payout created successfully',
                'payout_id' => $payout->id,
                'amount' => $payout->amount / 100,
                'status' => $payout->status,
            ]);
        } catch (\Exception $e) {
            Log::error('Payout creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Payout creation failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * List payouts for publisher
     */
    public function listPayouts(Request $request)
    {
        try {
            $user = Auth::user();
            $limit = $request->query('limit', 10);

            $payouts = $this->stripeService->listPayouts($user, $limit);

            $formattedPayouts = array_map(function ($payout) {
                return [
                    'id' => $payout->id,
                    'amount' => $payout->amount / 100,
                    'currency' => $payout->currency,
                    'status' => $payout->status,
                    'created' => $payout->created,
                    'arrival_date' => $payout->arrival_date,
                ];
            }, $payouts);

            return response()->json([
                'success' => true,
                'payouts' => $formattedPayouts,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to list payouts', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to list payouts: ' . $e->getMessage(),
            ], 400);
        }
    }
}

