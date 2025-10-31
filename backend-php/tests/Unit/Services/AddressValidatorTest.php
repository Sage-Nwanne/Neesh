<?php

namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use App\Services\AddressValidator;

class AddressValidatorTest extends TestCase
{
    // US Address Validation Tests
    public function test_valid_us_address(): void
    {
        $address = [
            'country' => 'US',
            'line1' => '123 Main St',
            'city' => 'New York',
            'state_province' => 'NY',
            'postal_code' => '10001',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertEmpty($errors);
    }

    public function test_valid_us_address_with_extended_zip(): void
    {
        $address = [
            'country' => 'US',
            'line1' => '123 Main St',
            'city' => 'New York',
            'state_province' => 'NY',
            'postal_code' => '10001-1234',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertEmpty($errors);
    }

    public function test_invalid_us_state_code(): void
    {
        $address = [
            'country' => 'US',
            'line1' => '123 Main St',
            'city' => 'New York',
            'state_province' => 'XX',
            'postal_code' => '10001',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('state', strtolower(implode(' ', $errors)));
    }

    public function test_invalid_us_zip_code(): void
    {
        $address = [
            'country' => 'US',
            'line1' => '123 Main St',
            'city' => 'New York',
            'state_province' => 'NY',
            'postal_code' => '1234',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('zip', strtolower(implode(' ', $errors)));
    }

    // UK Address Validation Tests
    public function test_valid_uk_address(): void
    {
        $address = [
            'country' => 'UK',
            'line1' => '10 Downing Street',
            'city' => 'London',
            'postal_code' => 'SW1A 1AA',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertEmpty($errors);
    }

    public function test_valid_uk_address_without_space(): void
    {
        $address = [
            'country' => 'UK',
            'line1' => '10 Downing Street',
            'city' => 'London',
            'postal_code' => 'SW1A1AA',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertEmpty($errors);
    }

    public function test_invalid_uk_postcode(): void
    {
        $address = [
            'country' => 'UK',
            'line1' => '10 Downing Street',
            'city' => 'London',
            'postal_code' => 'INVALID',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('postcode', strtolower(implode(' ', $errors)));
    }

    // Canada Address Validation Tests
    public function test_valid_ca_address(): void
    {
        $address = [
            'country' => 'CA',
            'line1' => '24 Sussex Drive',
            'city' => 'Ottawa',
            'state_province' => 'ON',
            'postal_code' => 'K1A 0A1',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertEmpty($errors);
    }

    public function test_valid_ca_address_without_space(): void
    {
        $address = [
            'country' => 'CA',
            'line1' => '24 Sussex Drive',
            'city' => 'Ottawa',
            'state_province' => 'ON',
            'postal_code' => 'K1A0A1',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertEmpty($errors);
    }

    public function test_invalid_ca_province(): void
    {
        $address = [
            'country' => 'CA',
            'line1' => '24 Sussex Drive',
            'city' => 'Ottawa',
            'state_province' => 'XX',
            'postal_code' => 'K1A 0A1',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('province', strtolower(implode(' ', $errors)));
    }

    public function test_invalid_ca_postal_code(): void
    {
        $address = [
            'country' => 'CA',
            'line1' => '24 Sussex Drive',
            'city' => 'Ottawa',
            'state_province' => 'ON',
            'postal_code' => 'INVALID',
        ];

        $errors = AddressValidator::validate($address);
        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('postal', strtolower(implode(' ', $errors)));
    }

    // Format Tests
    public function test_format_address_uppercases_state(): void
    {
        $address = [
            'country' => 'US',
            'line1' => '123 Main St',
            'city' => 'New York',
            'state_province' => 'ny',
            'postal_code' => '10001',
        ];

        $formatted = AddressValidator::format($address);
        $this->assertEquals('NY', $formatted['state_province']);
    }

    public function test_format_address_trims_whitespace(): void
    {
        $address = [
            'country' => 'US',
            'line1' => '  123 Main St  ',
            'city' => '  New York  ',
            'state_province' => '  NY  ',
            'postal_code' => '  10001  ',
        ];

        $formatted = AddressValidator::format($address);
        $this->assertEquals('123 Main St', $formatted['line1']);
        $this->assertEquals('New York', $formatted['city']);
        $this->assertEquals('NY', $formatted['state_province']);
        $this->assertEquals('10001', $formatted['postal_code']);
    }
}
