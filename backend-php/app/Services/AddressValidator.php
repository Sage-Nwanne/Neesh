<?php

namespace App\Services;

class AddressValidator
{
    /**
     * Validate address format based on country
     */
    public static function validate(array $address): array
    {
        $errors = [];
        $country = $address['country'] ?? 'US';

        // Validate required fields
        if (empty($address['line1'])) {
            $errors[] = 'Street address is required';
        }
        if (empty($address['city'])) {
            $errors[] = 'City is required';
        }
        if (empty($address['postal_code'])) {
            $errors[] = 'Postal code is required';
        }

        // Country-specific validation
        switch ($country) {
            case 'US':
                $errors = array_merge($errors, self::validateUSAddress($address));
                break;
            case 'UK':
                $errors = array_merge($errors, self::validateUKAddress($address));
                break;
            case 'CA':
                $errors = array_merge($errors, self::validateCAAddress($address));
                break;
        }

        return $errors;
    }

    /**
     * Validate US address format
     */
    private static function validateUSAddress(array $address): array
    {
        $errors = [];

        // State validation
        $validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        $state = strtoupper($address['state_province'] ?? '');
        if (!in_array($state, $validStates)) {
            $errors[] = 'Invalid US state';
        }

        // ZIP code validation (5 or 9 digits)
        if (!preg_match('/^\d{5}(-\d{4})?$/', $address['postal_code'])) {
            $errors[] = 'Invalid US ZIP code format';
        }

        return $errors;
    }

    /**
     * Validate UK address format
     */
    private static function validateUKAddress(array $address): array
    {
        $errors = [];

        // UK postcode validation (simplified)
        if (!preg_match('/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i', str_replace(' ', '', $address['postal_code']))) {
            $errors[] = 'Invalid UK postcode format';
        }

        return $errors;
    }

    /**
     * Validate Canadian address format
     */
    private static function validateCAAddress(array $address): array
    {
        $errors = [];

        // Province validation
        $validProvinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
        $province = strtoupper($address['state_province'] ?? '');
        if (!in_array($province, $validProvinces)) {
            $errors[] = 'Invalid Canadian province';
        }

        // Postal code validation (A1A 1A1 format)
        if (!preg_match('/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i', str_replace(' ', '', $address['postal_code']))) {
            $errors[] = 'Invalid Canadian postal code format';
        }

        return $errors;
    }

    /**
     * Format address for storage
     */
    public static function format(array $address): array
    {
        return [
            'country' => $address['country'] ?? 'US',
            'line1' => trim($address['line1'] ?? ''),
            'line2' => trim($address['line2'] ?? '') ?: null,
            'city' => trim($address['city'] ?? ''),
            'state_province' => strtoupper(trim($address['state_province'] ?? '')),
            'postal_code' => trim($address['postal_code'] ?? ''),
        ];
    }
}
