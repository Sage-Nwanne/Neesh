@extends('layouts.app')

@section('content')
<style>
    .checkout-logo-link {
        display: inline-block;
        margin-bottom: 20px;
    }
    .checkout-logo-link img {
        max-width: 150px;
        height: auto;
    }
</style>

<div class="checkout-container">
    <div style="padding: 20px 0;">
        <a href="{{ \App\Helpers\RouteHelper::getDashboardRoute() }}" class="checkout-logo-link">
            <img src="{{ asset('assets/image/Logo A1.png') }}" alt="NEESH Logo">
        </a>
    </div>
    <div class="checkout-header">
        <h1>Checkout</h1>
        <p class="breadcrumb">Explore > Cart > <span class="active">Checkout</span></p>
    </div>

    <div class="checkout-content">
        <!-- Left Side: Checkout Form -->
        <div class="checkout-form-section">
            <!-- Step Indicator -->
            <div class="step-indicator">
                <div class="step active" data-step="1">
                    <span class="step-number">1</span>
                    <span class="step-label">Shipping</span>
                </div>
                <div class="step" data-step="2">
                    <span class="step-number">2</span>
                    <span class="step-label">Billing</span>
                </div>
                <div class="step" data-step="3">
                    <span class="step-number">3</span>
                    <span class="step-label">Payment</span>
                </div>
                <div class="step" data-step="4">
                    <span class="step-number">4</span>
                    <span class="step-label">Review</span>
                </div>
            </div>

            <!-- Step 1: Shipping Address -->
            <div class="checkout-step active" id="step-1">
                <h2>Shipping Address</h2>
                <form id="shippingForm" class="address-form">
                    <div class="form-group">
                        <label for="shipping_name">Full Name</label>
                        <input type="text" id="shipping_name" name="shipping_name" required>
                    </div>
                    <div class="form-group">
                        <label for="shipping_email">Email</label>
                        <input type="email" id="shipping_email" name="shipping_email" required>
                    </div>
                    <div class="form-group">
                        <label for="shipping_phone">Phone</label>
                        <input type="tel" id="shipping_phone" name="shipping_phone" placeholder="10-20 digits" required>
                    </div>
                    <div class="form-group">
                        <label for="shipping_country">Country</label>
                        <select id="shipping_country" name="shipping_country" required onchange="updateShippingFields()">
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="shipping_line1">Street Address</label>
                        <input type="text" id="shipping_line1" name="shipping_line1" required>
                    </div>
                    <div class="form-group">
                        <label for="shipping_line2">Street Address 2 (Optional)</label>
                        <input type="text" id="shipping_line2" name="shipping_line2">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="shipping_city">City</label>
                            <input type="text" id="shipping_city" name="shipping_city" required>
                        </div>
                        <div class="form-group">
                            <label for="shipping_state" id="shipping_state_label">State</label>
                            <input type="text" id="shipping_state" name="shipping_state" placeholder="e.g., CA, NY">
                        </div>
                        <div class="form-group">
                            <label for="shipping_postal_code" id="shipping_postal_label">ZIP Code</label>
                            <input type="text" id="shipping_postal_code" name="shipping_postal_code" placeholder="e.g., 12345">
                        </div>
                    </div>
                    <button type="button" class="btn-next" onclick="nextStep(2)">Continue to Billing</button>
                </form>
            </div>

            <!-- Step 2: Billing Address -->
            <div class="checkout-step" id="step-2">
                <h2>Billing Address</h2>
                <div class="checkbox-group">
                    <input type="checkbox" id="billing_same_as_shipping" name="billing_same_as_shipping" checked onchange="toggleBillingForm()">
                    <label for="billing_same_as_shipping">Same as shipping address</label>
                </div>
                <form id="billingForm" class="address-form" style="display: none;">
                    <div class="form-group">
                        <label for="billing_country">Country</label>
                        <select id="billing_country" name="billing_country" onchange="updateBillingFields()">
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="billing_line1">Street Address</label>
                        <input type="text" id="billing_line1" name="billing_line1">
                    </div>
                    <div class="form-group">
                        <label for="billing_line2">Street Address 2 (Optional)</label>
                        <input type="text" id="billing_line2" name="billing_line2">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="billing_city">City</label>
                            <input type="text" id="billing_city" name="billing_city">
                        </div>
                        <div class="form-group">
                            <label for="billing_state" id="billing_state_label">State</label>
                            <input type="text" id="billing_state" name="billing_state" placeholder="e.g., CA, NY">
                        </div>
                        <div class="form-group">
                            <label for="billing_postal_code" id="billing_postal_label">ZIP Code</label>
                            <input type="text" id="billing_postal_code" name="billing_postal_code" placeholder="e.g., 12345">
                        </div>
                    </div>
                </form>
                <div class="button-group">
                    <button type="button" class="btn-back" onclick="prevStep(1)">Back</button>
                    <button type="button" class="btn-next" onclick="nextStep(3)">Continue to Payment</button>
                </div>
            </div>

            <!-- Step 3: Payment -->
            <div class="checkout-step" id="step-3">
                <h2>Payment Information</h2>
                <div id="card-element" class="card-element"></div>
                <div id="card-errors" class="error-message"></div>

                <!-- Cloudflare Turnstile Bot Protection -->
                <div style="margin: 20px 0;">
                    <div class="cf-turnstile" data-sitekey="{{ config('turnstile.site_key') }}" data-theme="light"></div>
                    <div id="turnstile-error" class="error-message" style="display: none;"></div>
                </div>

                <div class="button-group">
                    <button type="button" class="btn-back" onclick="prevStep(2)">Back</button>
                    <button type="button" class="btn-next" id="paymentBtn" onclick="processPayment()">Review Order</button>
                </div>
            </div>

            <!-- Step 4: Review -->
            <div class="checkout-step" id="step-4">
                <h2>Review Your Order</h2>
                <div id="reviewContent" class="review-content">
                    <!-- Populated by JavaScript -->
                </div>
                <div class="button-group">
                    <button type="button" class="btn-back" onclick="prevStep(3)">Back</button>
                    <button type="button" class="btn-submit" id="submitBtn" onclick="submitOrder()">Place Order</button>
                </div>
            </div>
        </div>

        <!-- Right Side: Order Summary -->
        <div class="order-summary-section">
            <div class="order-summary">
                <h3>Order Summary</h3>
                <div id="cartSummary" class="cart-summary">
                    <!-- Populated by JavaScript -->
                </div>
                <div class="summary-totals">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span id="summarySubtotal">$0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span id="summaryShipping">$3.60</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span id="summaryTotal">$0.00</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.checkout-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Manrope', sans-serif;
}

.checkout-header {
    margin-bottom: 40px;
}

.checkout-header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.breadcrumb {
    color: #666;
    font-size: 14px;
}

.breadcrumb .active {
    color: #753bbd;
    font-weight: 600;
}

.checkout-content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 40px;
}

.checkout-form-section {
    overflow: visible;
    min-width: 0;
}

.step-indicator {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 50px;
    position: relative;
    overflow: visible;
    padding: 30px 0;
    width: 100%;
}

.step-indicator::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 0;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    cursor: pointer;
    flex: 1;
    min-width: 80px;
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f0f0f0;
    border: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #999;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.step.active .step-number {
    background: #753bbd;
    color: white;
    border-color: #753bbd;
}

.step-label {
    font-size: 13px;
    color: #999;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
}

.step.active .step-label {
    color: #753bbd;
    font-weight: 600;
}

.checkout-step {
    display: none;
    animation: fadeIn 0.3s ease;
}

.checkout-step.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.checkout-step h2 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.address-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1a1a1a;
}

.form-group input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
}

.form-group input:focus {
    outline: none;
    border-color: #753bbd;
    box-shadow: 0 0 0 3px rgba(117, 59, 189, 0.1);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.checkbox-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.checkbox-group label {
    cursor: pointer;
    font-size: 14px;
}

.card-element {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;
}

.error-message {
    color: #dc3545;
    font-size: 14px;
    margin-bottom: 15px;
}

.button-group {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.btn-back, .btn-next, .btn-submit {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Manrope', sans-serif;
}

.btn-back {
    background: #f0f0f0;
    color: #1a1a1a;
}

.btn-back:hover {
    background: #e0e0e0;
}

.btn-next, .btn-submit {
    background: #753bbd;
    color: white;
}

.btn-next:hover, .btn-submit:hover {
    background: #5a2d8f;
}

.order-summary {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
    position: sticky;
    top: 20px;
}

.order-summary h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.cart-summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 10px;
    background: white;
    border-radius: 6px;
}

.cart-item-name {
    flex: 1;
    color: #1a1a1a;
    font-weight: 500;
}

.cart-item-qty {
    color: #999;
    margin: 0 10px;
}

.cart-item-price {
    color: #753bbd;
    font-weight: 600;
}

.summary-totals {
    border-top: 1px solid #ddd;
    padding-top: 15px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 10px;
    color: #666;
}

.summary-row.total {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 10px;
}

.review-content {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .checkout-content {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .order-summary {
        position: static;
    }
}
</style>

<script src="https://js.stripe.com/v3/"></script>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>
let stripe, elements, cardElement;
let currentStep = 1;

document.addEventListener('DOMContentLoaded', function() {
    initializeStripe();
    loadCartFromLocalStorage();
    setupEventListeners();
});

function initializeStripe() {
    stripe = Stripe('{{ config("services.stripe.public") }}');
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');

    cardElement.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

function setupEventListeners() {
    document.getElementById('billing_same_as_shipping').addEventListener('change', function() {
        document.getElementById('billingForm').style.display = this.checked ? 'none' : 'flex';
    });
}

function updateShippingFields() {
    const country = document.getElementById('shipping_country').value;
    const stateLabel = document.getElementById('shipping_state_label');
    const stateInput = document.getElementById('shipping_state');
    const postalLabel = document.getElementById('shipping_postal_label');
    const postalInput = document.getElementById('shipping_postal_code');

    // Update labels and placeholders based on country
    if (country === 'US') {
        stateLabel.textContent = 'State';
        stateInput.placeholder = 'e.g., CA, NY';
        stateInput.required = true;
        postalLabel.textContent = 'ZIP Code';
        postalInput.placeholder = 'e.g., 12345 or 12345-6789';
    } else if (country === 'UK') {
        stateLabel.textContent = 'County (Optional)';
        stateInput.placeholder = 'e.g., Greater London';
        stateInput.required = false;
        postalLabel.textContent = 'Postcode';
        postalInput.placeholder = 'e.g., SW1A 1AA';
    } else if (country === 'CA') {
        stateLabel.textContent = 'Province';
        stateInput.placeholder = 'e.g., ON, BC';
        stateInput.required = true;
        postalLabel.textContent = 'Postal Code';
        postalInput.placeholder = 'e.g., K1A 0B1';
    }
}

function updateBillingFields() {
    const country = document.getElementById('billing_country').value;
    const stateLabel = document.getElementById('billing_state_label');
    const stateInput = document.getElementById('billing_state');
    const postalLabel = document.getElementById('billing_postal_label');
    const postalInput = document.getElementById('billing_postal_code');

    // Update labels and placeholders based on country
    if (country === 'US') {
        stateLabel.textContent = 'State';
        stateInput.placeholder = 'e.g., CA, NY';
        stateInput.required = true;
        postalLabel.textContent = 'ZIP Code';
        postalInput.placeholder = 'e.g., 12345 or 12345-6789';
    } else if (country === 'UK') {
        stateLabel.textContent = 'County (Optional)';
        stateInput.placeholder = 'e.g., Greater London';
        stateInput.required = false;
        postalLabel.textContent = 'Postcode';
        postalInput.placeholder = 'e.g., SW1A 1AA';
    } else if (country === 'CA') {
        stateLabel.textContent = 'Province';
        stateInput.placeholder = 'e.g., ON, BC';
        stateInput.required = true;
        postalLabel.textContent = 'Postal Code';
        postalInput.placeholder = 'e.g., K1A 0B1';
    }
}

function toggleBillingForm() {
    const checkbox = document.getElementById('billing_same_as_shipping');
    const billingForm = document.getElementById('billingForm');
    billingForm.style.display = checkbox.checked ? 'none' : 'flex';
}

function loadCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('cart_v1') || '{"items":[]}');
    updateOrderSummary(cart.items);
}

function updateOrderSummary(items) {
    const cartSummary = document.getElementById('cartSummary');
    let subtotal = 0;

    cartSummary.innerHTML = '';
    items.forEach(item => {
        const itemTotal = (item.price || 0) * (item.qty || 1);
        subtotal += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <span class="cart-item-name">${item.title || 'Magazine'}</span>
            <span class="cart-item-qty">x${item.qty || 1}</span>
            <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
        `;
        cartSummary.appendChild(itemEl);
    });

    const shipping = 3.60;
    const total = subtotal + shipping;

    document.getElementById('summarySubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('summaryShipping').textContent = '$' + shipping.toFixed(2);
    document.getElementById('summaryTotal').textContent = '$' + total.toFixed(2);
}

function nextStep(step) {
    if (validateStep(currentStep)) {
        currentStep = step;
        updateStepIndicator();
        showStep(step);
    }
}

function prevStep(step) {
    currentStep = step;
    updateStepIndicator();
    showStep(step);
}

function showStep(step) {
    document.querySelectorAll('.checkout-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
}

function updateStepIndicator() {
    document.querySelectorAll('.step').forEach((el, idx) => {
        if (idx + 1 <= currentStep) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

function validateStep(step) {
    if (step === 1) {
        // Validate shipping address
        const name = document.getElementById('shipping_name').value;
        const email = document.getElementById('shipping_email').value;
        const phone = document.getElementById('shipping_phone').value;
        const country = document.getElementById('shipping_country').value;
        const line1 = document.getElementById('shipping_line1').value;
        const city = document.getElementById('shipping_city').value;
        const state = document.getElementById('shipping_state').value;
        const postal = document.getElementById('shipping_postal_code').value;

        if (!name || !email || !phone || !country || !line1 || !city || !postal) {
            alert('Please fill in all required shipping address fields');
            return false;
        }

        // Validate phone format (10-20 digits)
        const phoneRegex = /^\d{10,20}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            alert('Please enter a valid phone number (10-20 digits)');
            return false;
        }

        // Validate postal code format based on country
        if (!validatePostalCode(country, postal)) {
            return false;
        }

        // Validate state/province if required
        if ((country === 'US' || country === 'CA') && !state) {
            alert('Please enter your state/province');
            return false;
        }

        return true;
    } else if (step === 2) {
        // Validate billing address if not same as shipping
        const sameAsShipping = document.getElementById('billing_same_as_shipping').checked;
        if (sameAsShipping) {
            return true;
        }

        const country = document.getElementById('billing_country').value;
        const line1 = document.getElementById('billing_line1').value;
        const city = document.getElementById('billing_city').value;
        const state = document.getElementById('billing_state').value;
        const postal = document.getElementById('billing_postal_code').value;

        if (!country || !line1 || !city || !postal) {
            alert('Please fill in all required billing address fields');
            return false;
        }

        if (!validatePostalCode(country, postal)) {
            return false;
        }

        if ((country === 'US' || country === 'CA') && !state) {
            alert('Please enter your state/province');
            return false;
        }

        return true;
    }
    return true;
}

function validatePostalCode(country, postal) {
    const postalRegex = {
        'US': /^\d{5}(-\d{4})?$/,  // 12345 or 12345-6789
        'UK': /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,  // SW1A 1AA
        'CA': /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,  // K1A 0B1
    };

    const regex = postalRegex[country];
    if (!regex || !regex.test(postal)) {
        const examples = {
            'US': '12345 or 12345-6789',
            'UK': 'SW1A 1AA',
            'CA': 'K1A 0B1',
        };
        alert(`Invalid postal code format for ${country}. Example: ${examples[country]}`);
        return false;
    }
    return true;
}

function processPayment() {
    // Verify Turnstile token
    const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

    if (!turnstileToken) {
        document.getElementById('turnstile-error').textContent = 'Please complete the bot verification';
        document.getElementById('turnstile-error').style.display = 'block';
        return;
    }

    // Clear error message
    document.getElementById('turnstile-error').style.display = 'none';

    // Move to review step
    nextStep(4);
}

function submitOrder() {
    alert('Order submitted! This is a placeholder.');
}
</script>
@endsection

