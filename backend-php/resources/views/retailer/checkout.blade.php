@extends('layouts.app')

@section('content')
<div class="checkout-container">
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
                        <input type="tel" id="shipping_phone" name="shipping_phone" required>
                    </div>
                    <div class="form-group">
                        <label for="shipping_address">Street Address</label>
                        <input type="text" id="shipping_address" name="shipping_address" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="shipping_city">City</label>
                            <input type="text" id="shipping_city" name="shipping_city" required>
                        </div>
                        <div class="form-group">
                            <label for="shipping_state">State</label>
                            <input type="text" id="shipping_state" name="shipping_state" required>
                        </div>
                        <div class="form-group">
                            <label for="shipping_zip">ZIP Code</label>
                            <input type="text" id="shipping_zip" name="shipping_zip" required>
                        </div>
                    </div>
                    <button type="button" class="btn-next" onclick="nextStep(2)">Continue to Billing</button>
                </form>
            </div>

            <!-- Step 2: Billing Address -->
            <div class="checkout-step" id="step-2">
                <h2>Billing Address</h2>
                <div class="checkbox-group">
                    <input type="checkbox" id="same_as_shipping" checked>
                    <label for="same_as_shipping">Same as shipping address</label>
                </div>
                <form id="billingForm" class="address-form" style="display: none;">
                    <div class="form-group">
                        <label for="billing_name">Full Name</label>
                        <input type="text" id="billing_name" name="billing_name">
                    </div>
                    <div class="form-group">
                        <label for="billing_address">Street Address</label>
                        <input type="text" id="billing_address" name="billing_address">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="billing_city">City</label>
                            <input type="text" id="billing_city" name="billing_city">
                        </div>
                        <div class="form-group">
                            <label for="billing_state">State</label>
                            <input type="text" id="billing_state" name="billing_state">
                        </div>
                        <div class="form-group">
                            <label for="billing_zip">ZIP Code</label>
                            <input type="text" id="billing_zip" name="billing_zip">
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

.step-indicator {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    position: relative;
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
    margin-bottom: 8px;
    transition: all 0.3s ease;
}

.step.active .step-number {
    background: #753bbd;
    color: white;
    border-color: #753bbd;
}

.step-label {
    font-size: 12px;
    color: #999;
    font-weight: 500;
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
    document.getElementById('same_as_shipping').addEventListener('change', function() {
        document.getElementById('billingForm').style.display = this.checked ? 'none' : 'flex';
    });
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
        return document.getElementById('shipping_name').value && 
               document.getElementById('shipping_address').value;
    }
    return true;
}

function processPayment() {
    // Move to review step
    nextStep(4);
}

function submitOrder() {
    alert('Order submitted! This is a placeholder.');
}
</script>
@endsection

