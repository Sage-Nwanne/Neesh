<?php

namespace Tests\Feature\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\WebhookEvent;
use App\Models\Order;
use App\Models\User;
use Stripe\Event;

class WebhookControllerTest extends TestCase
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

    public function test_webhook_endpoint_exists(): void
    {
        $response = $this->postJson('/webhooks/stripe', []);
        // Should not be 404
        $this->assertNotEquals(404, $response->status());
    }

    public function test_webhook_stores_event(): void
    {
        $payload = [
            'id' => 'evt_test_123',
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_123',
                    'status' => 'succeeded',
                ]
            ]
        ];

        // Mock Stripe signature verification
        $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'test_signature'
        ]);

        // Event should be stored (even if signature fails)
        $this->assertDatabaseHas('webhook_events', [
            'event_id' => 'evt_test_123',
            'type' => 'payment_intent.succeeded',
        ]);
    }

    public function test_webhook_prevents_duplicate_processing(): void
    {
        $eventId = 'evt_test_123';

        // Create first webhook event
        WebhookEvent::create([
            'event_id' => $eventId,
            'type' => 'payment_intent.succeeded',
            'payload' => ['test' => 'data'],
            'received_at' => now(),
            'status' => 'processed',
        ]);

        $payload = [
            'id' => $eventId,
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_123',
                    'status' => 'succeeded',
                ]
            ]
        ];

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'test_signature'
        ]);

        // Should return 200 (idempotent)
        $this->assertEquals(200, $response->status());
    }

    public function test_webhook_event_marked_as_pending(): void
    {
        $payload = [
            'id' => 'evt_test_456',
            'type' => 'payment_intent.payment_failed',
            'data' => [
                'object' => [
                    'id' => 'pi_test_456',
                    'status' => 'requires_payment_method',
                ]
            ]
        ];

        $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'test_signature'
        ]);

        $this->assertDatabaseHas('webhook_events', [
            'event_id' => 'evt_test_456',
            'status' => 'pending',
        ]);
    }

    public function test_webhook_stores_payload(): void
    {
        $payload = [
            'id' => 'evt_test_789',
            'type' => 'charge.refunded',
            'data' => [
                'object' => [
                    'id' => 'ch_test_789',
                    'amount_refunded' => 10000,
                ]
            ]
        ];

        $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'test_signature'
        ]);

        $event = WebhookEvent::where('event_id', 'evt_test_789')->first();
        $this->assertNotNull($event);
        $this->assertIsArray($event->payload);
        $this->assertEquals('charge.refunded', $event->payload['type']);
    }

    public function test_webhook_handles_multiple_event_types(): void
    {
        $eventTypes = [
            'payment_intent.succeeded',
            'payment_intent.payment_failed',
            'charge.refunded',
            'charge.dispute.created',
        ];

        foreach ($eventTypes as $index => $type) {
            $payload = [
                'id' => 'evt_test_' . $index,
                'type' => $type,
                'data' => ['object' => ['id' => 'test_' . $index]]
            ];

            $this->postJson('/webhooks/stripe', $payload, [
                'Stripe-Signature' => 'test_signature'
            ]);
        }

        $this->assertDatabaseCount('webhook_events', count($eventTypes));
    }

    public function test_webhook_received_at_timestamp(): void
    {
        $payload = [
            'id' => 'evt_test_timestamp',
            'type' => 'payment_intent.succeeded',
            'data' => ['object' => ['id' => 'pi_test']]
        ];

        $before = now();
        $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'test_signature'
        ]);
        $after = now();

        $event = WebhookEvent::where('event_id', 'evt_test_timestamp')->first();
        $this->assertNotNull($event->received_at);
        $this->assertTrue($event->received_at->between($before, $after));
    }

    public function test_webhook_retry_count_initialized(): void
    {
        $payload = [
            'id' => 'evt_test_retry',
            'type' => 'payment_intent.succeeded',
            'data' => ['object' => ['id' => 'pi_test']]
        ];

        $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'test_signature'
        ]);

        $event = WebhookEvent::where('event_id', 'evt_test_retry')->first();
        $this->assertEquals(0, $event->retry_count);
    }
}
