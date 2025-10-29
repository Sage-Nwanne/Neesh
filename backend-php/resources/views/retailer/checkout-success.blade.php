@extends('layouts.app')

@section('content')
<div class="success-container">
    <div class="success-card">
        <div class="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="#753bbd" opacity="0.1"/>
                <path d="M35 45L30 40M35 45L50 30M35 45L40 50" stroke="#753bbd" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <h1>Order Confirmed!</h1>
        <p class="success-message">Thank you for your order. We've received your purchase and will begin processing it shortly.</p>

        @if($order)
        <div class="order-details">
            <div class="detail-row">
                <span class="label">Order Number</span>
                <span class="value">{{ $order->external_order_id }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Order Date</span>
                <span class="value">{{ $order->created_at->format('M d, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Total Amount</span>
                <span class="value">${{ number_format($order->subtotal + ($order->commission_fee ?? 0), 2) }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Status</span>
                <span class="value status-badge">{{ ucfirst($order->status) }}</span>
            </div>
        </div>

        <div class="order-items">
            <h3>Order Items</h3>
            @foreach($order->items as $item)
            <div class="item-row">
                <div class="item-info">
                    <p class="item-title">{{ $item->magazine->title_name ?? 'Magazine' }}</p>
                    <p class="item-qty">Quantity: {{ $item->quantity }}</p>
                </div>
                <div class="item-price">
                    <p>${{ number_format($item->unit_price * $item->quantity, 2) }}</p>
                </div>
            </div>
            @endforeach
        </div>
        @endif

        <div class="next-steps">
            <h3>What's Next?</h3>
            <div class="steps-list">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <p class="step-title">Order Confirmation</p>
                        <p class="step-desc">Check your email for order confirmation and tracking details</p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <p class="step-title">Processing</p>
                        <p class="step-desc">Your order will be processed and prepared for shipment</p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <p class="step-title">Shipment</p>
                        <p class="step-desc">You'll receive tracking information once your order ships</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-buttons">
            <a href="{{ route('explore.index') }}" class="btn-primary">Continue Shopping</a>
            <a href="{{ route('dashboard') }}" class="btn-secondary">View My Orders</a>
        </div>
    </div>
</div>

<style>
.success-container {
    max-width: 600px;
    margin: 60px auto;
    padding: 20px;
    font-family: 'Manrope', sans-serif;
}

.success-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
}

.success-icon {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
}

.success-card h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.success-message {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.6;
}

.order-details {
    background: #f9f9f9;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    text-align: left;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-row .label {
    font-weight: 600;
    color: #666;
    font-size: 14px;
}

.detail-row .value {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 14px;
}

.status-badge {
    background: #753bbd;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    display: inline-block;
}

.order-items {
    text-align: left;
    margin-bottom: 30px;
}

.order-items h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    color: #1a1a1a;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 10px;
}

.item-info {
    flex: 1;
    text-align: left;
}

.item-title {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.item-qty {
    font-size: 13px;
    color: #999;
}

.item-price {
    font-weight: 700;
    color: #753bbd;
    font-size: 16px;
}

.next-steps {
    text-align: left;
    margin-bottom: 30px;
}

.next-steps h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    color: #1a1a1a;
}

.steps-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.step-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #753bbd;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
}

.step-content {
    text-align: left;
}

.step-title {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.step-desc {
    font-size: 13px;
    color: #999;
}

.action-buttons {
    display: flex;
    gap: 15px;
    flex-direction: column;
}

.btn-primary, .btn-secondary {
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
    text-align: center;
    font-family: 'Manrope', sans-serif;
}

.btn-primary {
    background: #753bbd;
    color: white;
}

.btn-primary:hover {
    background: #5a2d8f;
}

.btn-secondary {
    background: #f0f0f0;
    color: #1a1a1a;
}

.btn-secondary:hover {
    background: #e0e0e0;
}

@media (max-width: 600px) {
    .success-card {
        padding: 20px;
    }

    .success-card h1 {
        font-size: 24px;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style>
@endsection

