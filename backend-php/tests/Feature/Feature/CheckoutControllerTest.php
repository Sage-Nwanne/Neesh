<?php

namespace Tests\Feature\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Address;
use App\Models\Order;
use Illuminate\Support\Facades\Cache;

class CheckoutControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $retailer;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();

        // Create a retailer user
        $this->retailer = User::factory()->create();
        $this->retailer->assignRole('retailer');
    }

    public function test_checkout_page_requires_authentication(): void
    {
        $response = $this->get('/checkout');
        $response->assertRedirect('/login');
    }

    public function test_checkout_page_accessible_for_authenticated_retailer(): void
    {
        $response = $this->actingAs($this->retailer)->get('/checkout');
        $response->assertStatus(200);
    }

    public function test_create_payment_intent_with_valid_data(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'NY',
            'shipping_postal_code' => '10001',
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(200);
        $response->assertJsonStructure(['clientSecret', 'requires3DS', 'riskLevel']);
    }

    public function test_create_payment_intent_with_invalid_address(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'XX', // Invalid state
            'shipping_postal_code' => '10001',
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(422);
    }

    public function test_create_payment_intent_with_invalid_zip_code(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'NY',
            'shipping_postal_code' => '1234', // Invalid ZIP
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(422);
    }

    public function test_create_payment_intent_with_uk_address(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '10 Downing Street',
            'shipping_city' => 'London',
            'shipping_country' => 'UK',
            'shipping_postal_code' => 'SW1A 1AA',
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(200);
    }

    public function test_create_payment_intent_with_canada_address(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '24 Sussex Drive',
            'shipping_city' => 'Ottawa',
            'shipping_country' => 'CA',
            'shipping_state' => 'ON',
            'shipping_postal_code' => 'K1A 0A1',
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(200);
    }

    public function test_create_payment_intent_with_high_value_order(): void
    {
        $data = [
            'amount' => 6000,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 6000]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'NY',
            'shipping_postal_code' => '10001',
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(200);
        $response->assertJsonPath('requires3DS', true);
    }

    public function test_create_payment_intent_with_blocked_country(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'Pyongyang',
            'shipping_country' => 'KP', // North Korea
            'shipping_postal_code' => '12345',
            'billing_same_as_shipping' => true,
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/create-payment-intent', $data);

        $response->assertStatus(200);
        $response->assertJsonPath('riskLevel', 'high');
    }

    public function test_process_order_with_valid_data(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'NY',
            'shipping_postal_code' => '10001',
            'billing_same_as_shipping' => true,
            'payment_intent_id' => 'pi_test_123',
        ];

        $response = $this->actingAs($this->retailer)
            ->postJson('/checkout/process-order', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'user_id' => $this->retailer->id,
            'status' => 'pending',
        ]);
    }

    public function test_process_order_creates_addresses(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'NY',
            'shipping_postal_code' => '10001',
            'billing_same_as_shipping' => true,
            'payment_intent_id' => 'pi_test_123',
        ];

        $this->actingAs($this->retailer)
            ->postJson('/checkout/process-order', $data);

        $this->assertDatabaseHas('addresses', [
            'user_id' => $this->retailer->id,
            'type' => 'shipping',
            'country' => 'US',
            'city' => 'New York',
        ]);
    }

    public function test_process_order_with_different_billing_address(): void
    {
        $data = [
            'amount' => 100,
            'items' => [
                ['id' => 1, 'quantity' => 1, 'price' => 100]
            ],
            'shipping_line1' => '123 Main St',
            'shipping_city' => 'New York',
            'shipping_country' => 'US',
            'shipping_state' => 'NY',
            'shipping_postal_code' => '10001',
            'billing_same_as_shipping' => false,
            'billing_line1' => '456 Oak Ave',
            'billing_city' => 'Los Angeles',
            'billing_country' => 'US',
            'billing_state' => 'CA',
            'billing_postal_code' => '90001',
            'payment_intent_id' => 'pi_test_123',
        ];

        $this->actingAs($this->retailer)
            ->postJson('/checkout/process-order', $data);

        $this->assertDatabaseHas('addresses', [
            'user_id' => $this->retailer->id,
            'type' => 'billing',
            'country' => 'US',
            'city' => 'Los Angeles',
        ]);
    }
}
