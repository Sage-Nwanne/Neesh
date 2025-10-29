<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentIntent;
use Stripe\Payout;
use Stripe\Account;
use Exception;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret_key'));
    }

    /**
     * Create or retrieve a Stripe customer
     */
    public function createOrGetCustomer($user)
    {
        if ($user->stripe_customer_id) {
            return Customer::retrieve($user->stripe_customer_id);
        }

        $customer = Customer::create([
            'email' => $user->email,
            'name' => $user->name,
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        $user->update(['stripe_customer_id' => $customer->id]);

        return $customer;
    }

    /**
     * Create a payment intent for retailer purchases
     */
    public function createPaymentIntent($user, $amount, $currency = 'usd', $metadata = [])
    {
        $customer = $this->createOrGetCustomer($user);

        $paymentIntent = PaymentIntent::create([
            'amount' => $amount * 100, // Convert to cents
            'currency' => $currency,
            'customer' => $customer->id,
            'metadata' => array_merge($metadata, ['user_id' => $user->id]),
        ]);

        return $paymentIntent;
    }

    /**
     * Confirm a payment intent
     */
    public function confirmPaymentIntent($paymentIntentId, $paymentMethodId)
    {
        $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
        
        return $paymentIntent->confirm([
            'payment_method' => $paymentMethodId,
        ]);
    }

    /**
     * Create a payout for publisher
     */
    public function createPayout($user, $amount, $currency = 'usd')
    {
        if (!$user->stripe_account_id) {
            throw new Exception('User does not have a connected Stripe account');
        }

        $payout = Payout::create([
            'amount' => $amount * 100, // Convert to cents
            'currency' => $currency,
            'method' => 'instant',
        ], [
            'stripe_account' => $user->stripe_account_id,
        ]);

        return $payout;
    }

    /**
     * Create a connected account for publisher
     */
    public function createConnectedAccount($user, $type = 'express')
    {
        $account = Account::create([
            'type' => $type,
            'email' => $user->email,
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        $user->update(['stripe_account_id' => $account->id]);

        return $account;
    }

    /**
     * Get account link for onboarding
     */
    public function getAccountLink($user, $refreshUrl, $returnUrl)
    {
        if (!$user->stripe_account_id) {
            $this->createConnectedAccount($user);
        }

        $accountLink = \Stripe\AccountLink::create([
            'account' => $user->stripe_account_id,
            'type' => 'account_onboarding',
            'refresh_url' => $refreshUrl,
            'return_url' => $returnUrl,
        ]);

        return $accountLink;
    }

    /**
     * Retrieve payment intent
     */
    public function getPaymentIntent($paymentIntentId)
    {
        return PaymentIntent::retrieve($paymentIntentId);
    }

    /**
     * List payouts for a connected account
     */
    public function listPayouts($user, $limit = 10)
    {
        if (!$user->stripe_account_id) {
            return [];
        }

        $payouts = Payout::all(['limit' => $limit], [
            'stripe_account' => $user->stripe_account_id,
        ]);

        return $payouts->data;
    }
}

