<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutValidationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('retailer');
    }

    public function rules(): array
    {
        return [
            // Shipping Address
            'shipping_name' => 'required|string|max:100',
            'shipping_email' => 'required|email|max:255',
            'shipping_phone' => 'required|regex:/^[\d\s\-\+\(\)]{10,20}$/',
            'shipping_country' => 'required|string|in:US,UK,CA',
            'shipping_line1' => 'required|string|max:255',
            'shipping_line2' => 'nullable|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'required_if:shipping_country,US,CA|string|max:50',
            'shipping_postal_code' => 'required|string|max:20',

            // Billing Address
            'billing_same_as_shipping' => 'boolean',
            'billing_name' => 'required_if:billing_same_as_shipping,false|string|max:100',
            'billing_email' => 'required_if:billing_same_as_shipping,false|email|max:255',
            'billing_phone' => 'required_if:billing_same_as_shipping,false|regex:/^[\d\s\-\+\(\)]{10,20}$/',
            'billing_country' => 'required_if:billing_same_as_shipping,false|string|in:US,UK,CA',
            'billing_line1' => 'required_if:billing_same_as_shipping,false|string|max:255',
            'billing_line2' => 'nullable|string|max:255',
            'billing_city' => 'required_if:billing_same_as_shipping,false|string|max:100',
            'billing_state' => 'required_if:billing_same_as_shipping,false,billing_country,US,CA|string|max:50',
            'billing_postal_code' => 'required_if:billing_same_as_shipping,false|string|max:20',

            // Order Items
            'items' => 'required|array|min:1',
            'items.*.magazine_id' => 'required|integer|exists:magazines,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',

            // Payment
            'payment_method_id' => 'required|string',
            'subtotal' => 'required|numeric|min:0.01',
            'shipping_cost' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0.01',
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_phone.regex' => 'Please enter a valid phone number',
            'billing_phone.regex' => 'Please enter a valid phone number',
            'shipping_country.in' => 'Shipping country must be US, UK, or CA',
            'billing_country.in' => 'Billing country must be US, UK, or CA',
            'items.required' => 'Please add at least one item to your order',
            'items.*.magazine_id.exists' => 'One or more magazines are no longer available',
        ];
    }

    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // If billing same as shipping, copy shipping to billing
        if ($this->input('billing_same_as_shipping')) {
            $validated['billing_name'] = $validated['shipping_name'];
            $validated['billing_email'] = $validated['shipping_email'];
            $validated['billing_phone'] = $validated['shipping_phone'];
            $validated['billing_country'] = $validated['shipping_country'];
            $validated['billing_line1'] = $validated['shipping_line1'];
            $validated['billing_line2'] = $validated['shipping_line2'];
            $validated['billing_city'] = $validated['shipping_city'];
            $validated['billing_state'] = $validated['shipping_state'];
            $validated['billing_postal_code'] = $validated['shipping_postal_code'];
        }

        return $validated;
    }
}
