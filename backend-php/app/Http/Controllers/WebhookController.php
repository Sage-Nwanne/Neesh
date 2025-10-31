<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\WebhookEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class WebhookController extends Controller
{
    /**
     * Handle Stripe webhook
     */
    public function handleStripe(Request $request): Response
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (SignatureVerificationException $e) {
            return response('Webhook signature verification failed', 400);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        }

        // Check if event already processed (idempotency)
        $existingEvent = WebhookEvent::where('event_id', $event->id)->first();
        if ($existingEvent) {
            return response('Event already processed', 200);
        }

        // Store webhook event
        $webhookEvent = WebhookEvent::create([
            'event_id' => $event->id,
            'type' => $event->type,
            'payload' => $event->data->object,
            'received_at' => now(),
            'status' => 'pending',
        ]);

        // Handle different event types
        try {
            match ($event->type) {
                'payment_intent.succeeded' => $this->handlePaymentIntentSucceeded($event, $webhookEvent),
                'payment_intent.payment_failed' => $this->handlePaymentIntentFailed($event, $webhookEvent),
                'charge.refunded' => $this->handleChargeRefunded($event, $webhookEvent),
                'charge.dispute.created' => $this->handleDisputeCreated($event, $webhookEvent),
                default => $webhookEvent->update(['status' => 'ignored']),
            };

            $webhookEvent->markAsProcessed();
            return response('Webhook processed', 200);
        } catch (\Exception $e) {
            $webhookEvent->markAsFailed($e->getMessage());
            return response('Webhook processing failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle payment_intent.succeeded event
     */
    private function handlePaymentIntentSucceeded($event, WebhookEvent $webhookEvent): void
    {
        $paymentIntent = $event->data->object;
        $paymentIntentId = $paymentIntent->id;

        // Find payment record
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for intent: {$paymentIntentId}");
        }

        // Update payment status
        $payment->update([
            'status' => 'succeeded',
        ]);

        // Update order status
        $order = $payment->order;
        if ($order && $order->status === 'pending') {
            $order->update(['status' => 'confirmed']);
        }

        // Record in webhook event
        $webhookEvent->update([
            'payload' => array_merge($webhookEvent->payload, [
                'order_id' => $order?->id,
                'payment_id' => $payment->id,
            ]),
        ]);
    }

    /**
     * Handle payment_intent.payment_failed event
     */
    private function handlePaymentIntentFailed($event, WebhookEvent $webhookEvent): void
    {
        $paymentIntent = $event->data->object;
        $paymentIntentId = $paymentIntent->id;

        // Find payment record
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for intent: {$paymentIntentId}");
        }

        // Update payment status
        $payment->update([
            'status' => 'failed',
        ]);

        // Update order status
        $order = $payment->order;
        if ($order && $order->status === 'pending') {
            $order->update(['status' => 'payment_failed']);
        }

        // Record in webhook event
        $webhookEvent->update([
            'payload' => array_merge($webhookEvent->payload, [
                'order_id' => $order?->id,
                'payment_id' => $payment->id,
                'failure_reason' => $paymentIntent->last_payment_error?->message ?? 'Unknown',
            ]),
        ]);
    }

    /**
     * Handle charge.refunded event
     */
    private function handleChargeRefunded($event, WebhookEvent $webhookEvent): void
    {
        $charge = $event->data->object;
        $paymentIntentId = $charge->payment_intent;

        // Find payment record
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for intent: {$paymentIntentId}");
        }

        // Update payment status
        $payment->update([
            'status' => 'refunded',
        ]);

        // Update order status
        $order = $payment->order;
        if ($order) {
            $order->update(['status' => 'refunded']);
        }

        // Record in webhook event
        $webhookEvent->update([
            'payload' => array_merge($webhookEvent->payload, [
                'order_id' => $order?->id,
                'payment_id' => $payment->id,
                'refund_amount' => $charge->amount_refunded,
            ]),
        ]);
    }

    /**
     * Handle charge.dispute.created event
     */
    private function handleDisputeCreated($event, WebhookEvent $webhookEvent): void
    {
        $dispute = $event->data->object;
        $chargeId = $dispute->charge;

        // Find payment record by charge ID
        $payment = Payment::where('stripe_charge_id', $chargeId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for charge: {$chargeId}");
        }

        // Update order status
        $order = $payment->order;
        if ($order) {
            $order->update(['status' => 'disputed']);
        }

        // Record in webhook event
        $webhookEvent->update([
            'payload' => array_merge($webhookEvent->payload, [
                'order_id' => $order?->id,
                'payment_id' => $payment->id,
                'dispute_amount' => $dispute->amount,
                'dispute_reason' => $dispute->reason,
            ]),
        ]);
    }
}
