<?php

namespace Tests\Feature\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\WebhookEvent;
use App\Models\Order;
use App\Models\User;
use App\Jobs\ProcessStripeWebhook;
use Illuminate\Support\Facades\Queue;

class ProcessStripeWebhookJobTest extends TestCase
{
    use RefreshDatabase;

    private User $retailer;
    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->retailer = User::factory()->create();
        $this->retailer->assignRole('retailer');

        $this->order = Order::factory()->create([
            'user_id' => $this->retailer->id,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);
    }

    public function test_job_can_be_dispatched(): void
    {
        Queue::fake();

        $event = WebhookEvent::create([
            'event_id' => 'evt_test_123',
            'type' => 'payment_intent.succeeded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_123',
                        'metadata' => ['order_id' => $this->order->id]
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
        ]);

        ProcessStripeWebhook::dispatch($event);

        Queue::assertPushed(ProcessStripeWebhook::class);
    }

    public function test_job_marks_event_as_processed(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_456',
            'type' => 'payment_intent.succeeded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_456',
                        'metadata' => ['order_id' => $this->order->id]
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
        ]);

        $job = new ProcessStripeWebhook($event);
        $job->handle();

        $event->refresh();
        $this->assertEquals('processed', $event->status);
    }

    public function test_job_handles_payment_intent_succeeded(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_789',
            'type' => 'payment_intent.succeeded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_789',
                        'metadata' => ['order_id' => $this->order->id]
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
        ]);

        $job = new ProcessStripeWebhook($event);
        $job->handle();

        $this->order->refresh();
        $this->assertEquals('confirmed', $this->order->status);
        $this->assertEquals('succeeded', $this->order->payment_status);
    }

    public function test_job_handles_payment_intent_failed(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_failed',
            'type' => 'payment_intent.payment_failed',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_failed',
                        'metadata' => ['order_id' => $this->order->id]
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
        ]);

        $job = new ProcessStripeWebhook($event);
        $job->handle();

        $this->order->refresh();
        $this->assertEquals('payment_failed', $this->order->status);
        $this->assertEquals('failed', $this->order->payment_status);
    }

    public function test_job_handles_charge_refunded(): void
    {
        $this->order->update(['payment_status' => 'succeeded']);

        $event = WebhookEvent::create([
            'event_id' => 'evt_test_refund',
            'type' => 'charge.refunded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'ch_test_refund',
                        'metadata' => ['order_id' => $this->order->id]
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
        ]);

        $job = new ProcessStripeWebhook($event);
        $job->handle();

        $this->order->refresh();
        $this->assertEquals('refunded', $this->order->status);
        $this->assertEquals('refunded', $this->order->payment_status);
    }

    public function test_job_handles_charge_dispute_created(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_dispute',
            'type' => 'charge.dispute.created',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'dp_test_dispute',
                        'metadata' => ['order_id' => $this->order->id]
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
        ]);

        $job = new ProcessStripeWebhook($event);
        $job->handle();

        $this->order->refresh();
        $this->assertEquals('disputed', $this->order->status);
    }

    public function test_job_increments_retry_count_on_failure(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_retry',
            'type' => 'payment_intent.succeeded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_retry',
                        'metadata' => ['order_id' => 99999] // Non-existent order
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
            'retry_count' => 0,
        ]);

        $job = new ProcessStripeWebhook($event);

        try {
            $job->handle();
        } catch (\Exception $e) {
            // Expected to fail
        }

        $event->refresh();
        $this->assertGreaterThan(0, $event->retry_count);
    }

    public function test_job_marks_event_as_failed_after_max_retries(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_max_retries',
            'type' => 'payment_intent.succeeded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_max_retries',
                        'metadata' => ['order_id' => 99999] // Non-existent order
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
            'retry_count' => 3,
        ]);

        $job = new ProcessStripeWebhook($event);

        try {
            $job->handle();
        } catch (\Exception $e) {
            // Expected to fail
        }

        $event->refresh();
        $this->assertEquals('failed', $event->status);
    }

    public function test_job_stores_error_message(): void
    {
        $event = WebhookEvent::create([
            'event_id' => 'evt_test_error',
            'type' => 'payment_intent.succeeded',
            'payload' => [
                'data' => [
                    'object' => [
                        'id' => 'pi_test_error',
                        'metadata' => ['order_id' => 99999] // Non-existent order
                    ]
                ]
            ],
            'received_at' => now(),
            'status' => 'pending',
            'retry_count' => 3,
        ]);

        $job = new ProcessStripeWebhook($event);

        try {
            $job->handle();
        } catch (\Exception $e) {
            // Expected to fail
        }

        $event->refresh();
        $this->assertNotNull($event->error);
        $this->assertNotEmpty($event->error);
    }
}
