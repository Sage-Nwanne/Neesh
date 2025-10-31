<?php

namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use App\Services\FraudDetection;
use Mockery;

class FraudDetectionTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_low_risk_transaction(): void
    {
        $paymentData = [
            'amount' => 100,
            'country' => 'US',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertEquals('low', $result['risk_level']);
        $this->assertFalse($result['requires_review']);
        $this->assertFalse($result['requires_3ds']);
    }

    public function test_high_value_order_requires_3ds(): void
    {
        $paymentData = [
            'amount' => 6000,
            'country' => 'US',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertIn($result['risk_level'], ['medium', 'high']);
        $this->assertTrue($result['requires_3ds']);
    }

    public function test_blocked_country_flagged(): void
    {
        $paymentData = [
            'amount' => 100,
            'country' => 'KP', // North Korea
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertEquals('high', $result['risk_level']);
        $this->assertTrue($result['requires_review']);
        $this->assertStringContainsString('Blocked country', implode(' ', $result['flags']));
    }

    public function test_iran_blocked(): void
    {
        $paymentData = [
            'amount' => 100,
            'country' => 'IR',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertEquals('high', $result['risk_level']);
        $this->assertStringContainsString('Blocked country', implode(' ', $result['flags']));
    }

    public function test_syria_blocked(): void
    {
        $paymentData = [
            'amount' => 100,
            'country' => 'SY',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertEquals('high', $result['risk_level']);
        $this->assertStringContainsString('Blocked country', implode(' ', $result['flags']));
    }

    public function test_cuba_blocked(): void
    {
        $paymentData = [
            'amount' => 100,
            'country' => 'CU',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertEquals('high', $result['risk_level']);
        $this->assertStringContainsString('Blocked country', implode(' ', $result['flags']));
    }

    public function test_allowed_countries_not_blocked(): void
    {
        $allowedCountries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR'];

        foreach ($allowedCountries as $country) {
            $paymentData = [
                'amount' => 100,
                'country' => $country,
            ];

            $result = FraudDetection::analyze(1, $paymentData);
            $this->assertStringNotContainsString('Blocked country', implode(' ', $result['flags']));
        }
    }

    public function test_is_country_blocked(): void
    {
        $this->assertTrue(FraudDetection::isCountryBlocked('KP'));
        $this->assertTrue(FraudDetection::isCountryBlocked('IR'));
        $this->assertTrue(FraudDetection::isCountryBlocked('SY'));
        $this->assertTrue(FraudDetection::isCountryBlocked('CU'));
        $this->assertFalse(FraudDetection::isCountryBlocked('US'));
        $this->assertFalse(FraudDetection::isCountryBlocked('UK'));
    }

    public function test_medium_value_order(): void
    {
        $paymentData = [
            'amount' => 3000,
            'country' => 'US',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertIn($result['risk_level'], ['low', 'medium']);
    }

    public function test_multiple_flags_increase_risk(): void
    {
        $paymentData = [
            'amount' => 6000,
            'country' => 'KP',
        ];

        $result = FraudDetection::analyze(1, $paymentData);

        $this->assertEquals('high', $result['risk_level']);
        $this->assertGreaterThan(1, count($result['flags']));
    }
}
