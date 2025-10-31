<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Payment;
use App\Models\WebhookEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessStripeWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $webhookEvent;
    protected $maxRetries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(WebhookEvent $webhookEvent)
    {
        $this->webhookEvent = $webhookEvent;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Check if already processed
            if ($this->webhookEvent->status === 'processed') {
                Log::info('Webhook already processed: ' . $this->webhookEvent->event_id);
                return;
            }

            // Process based on event type
            match ($this->webhookEvent->type) {
                'payment_intent.succeeded' => $this->handlePaymentIntentSucceeded(),
                'payment_intent.payment_failed' => $this->handlePaymentIntentFailed(),
                'charge.refunded' => $this->handleChargeRefunded(),
                'charge.dispute.created' => $this->handleDisputeCreated(),
                default => $this->webhookEvent->update(['status' => 'ignored']),
            };

            $this->webhookEvent->markAsProcessed();
            Log::info('Webhook processed successfully: ' . $this->webhookEvent->event_id);
        } catch (\Exception $e) {
            Log::error('Webhook processing error: ' . $e->getMessage(), [
                'event_id' => $this->webhookEvent->event_id,
                'retry_count' => $this->webhookEvent->retry_count,
            ]);

            // Retry logic
            if ($this->webhookEvent->retry_count < $this->maxRetries) {
                $this->webhookEvent->incrementRetry();
                $this->release(60); // Retry after 60 seconds
            } else {
                $this->webhookEvent->markAsFailed($e->getMessage());
            }
        }
    }

    /**
     * Handle payment_intent.succeeded event
     */
    private function handlePaymentIntentSucceeded(): void
    {
        $payload = $this->webhookEvent->payload;
        $paymentIntentId = $payload['id'] ?? null;

        if (!$paymentIntentId) {
            throw new \Exception('Missing payment intent ID in webhook payload');
        }

        // Find payment record
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for intent: {$paymentIntentId}");
        }

        // Update payment status
        $payment->update(['status' => 'succeeded']);

        // Update order status
        $order = $payment->order;
        if ($order && $order->status === 'pending') {
            $order->update(['status' => 'confirmed']);
        }

        Log::info('Payment succeeded: ' . $paymentIntentId, ['order_id' => $order?->id]);
    }

    /**
     * Handle payment_intent.payment_failed event
     */
    private function handlePaymentIntentFailed(): void
    {
        $payload = $this->webhookEvent->payload;
        $paymentIntentId = $payload['id'] ?? null;

        if (!$paymentIntentId) {
            throw new \Exception('Missing payment intent ID in webhook payload');
        }

        // Find payment record
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for intent: {$paymentIntentId}");
        }

        // Update payment status
        $payment->update(['status' => 'failed']);

        // Update order status
        $order = $payment->order;
        if ($order && $order->status === 'pending') {
            $order->update(['status' => 'payment_failed']);
        }

        Log::info('Payment failed: ' . $paymentIntentId, ['order_id' => $order?->id]);
    }

    /**
     * Handle charge.refunded event
     */
    private function handleChargeRefunded(): void
    {
        $payload = $this->webhookEvent->payload;
        $paymentIntentId = $payload['payment_intent'] ?? null;

        if (!$paymentIntentId) {
            throw new \Exception('Missing payment intent ID in refund payload');
        }

        // Find payment record
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->first();
        if (!$payment) {
            throw new \Exception("Payment not found for intent: {$paymentIntentId}");
        }

        // Update payment status
        $payment->update(['status' => 'refunded']);

        // Update order status
        $order = $payment->order;
        if ($order) {
            $order->update(['status' => 'refunded']);
        }

        Log::info('Payment refunded: ' . $paymentIntentId, ['order_id' => $order?->id]);
    }

    /**
     * Handle charge.dispute.created event
     */
    private function handleDisputeCreated(): void
    {
        $payload = $this->webhookEvent->payload;
        $chargeId = $payload['charge'] ?? null;

        if (!$chargeId) {
            throw new \Exception('Missing charge ID in dispute payload');
        }

        // Find payment record by charge ID
        $payment = Payment::where('stripe_charge_id', $chargeId)->first();
        if (!$payment) {
            Log::warning('Payment not found for charge: ' . $chargeId);
            return;
        }

        // Update order status
        $order = $payment->order;
        if ($order) {
            $order->update(['status' => 'disputed']);
        }

        Log::info('Dispute created: ' . $chargeId, ['order_id' => $order?->id]);
    }
}
