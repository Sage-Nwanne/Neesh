@extends('layouts.app')

@section('content')
<div class="order-detail-container">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Manrope', sans-serif;
            background: #f8f9fa;
        }

        .order-detail-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 30px;
            font-size: 14px;
        }

        .breadcrumb a {
            color: #753bbd;
            text-decoration: none;
            cursor: pointer;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
        }

        .page-header {
            margin-bottom: 30px;
        }

        .page-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
        }

        .order-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .info-item {
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .status-completed {
            background: #dcfce7;
            color: #166534;
        }

        .status-failed {
            background: #fee2e2;
            color: #991b1b;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .items-table thead {
            background: #f8f9fa;
            border-bottom: 2px solid #eee;
        }

        .items-table th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
        }

        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }

        .magazine-name {
            font-weight: 600;
            color: #1a1a1a;
        }

        .amount {
            font-weight: 700;
            color: #1a1a1a;
        }

        .shipment-item {
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 10px;
            border-left: 3px solid #753bbd;
        }

        .shipment-leg {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .shipment-status {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 4px;
        }

        .shipment-tracking {
            font-size: 12px;
            color: #666;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }

        .summary-row.total {
            border-bottom: none;
            border-top: 2px solid #eee;
            padding-top: 16px;
            font-weight: 700;
            font-size: 16px;
        }

        .summary-label {
            color: #666;
        }

        .summary-value {
            color: #1a1a1a;
        }

        @media (max-width: 768px) {
            .order-detail-container {
                padding: 20px 15px;
            }

            .page-header h1 {
                font-size: 22px;
            }

            .info-grid {
                grid-template-columns: 1fr;
            }

            .items-table {
                font-size: 12px;
            }

            .items-table th,
            .items-table td {
                padding: 8px;
            }
        }
    </style>

    <div class="breadcrumb">
        <a onclick="history.back()">← Back to Orders</a>
        <span>/</span>
        <span>Order #{{ $order->external_order_id ?? $order->id }}</span>
    </div>

    <div class="page-header">
        <h1>Order #{{ $order->external_order_id ?? $order->id }}</h1>
    </div>

    <!-- Order Information -->
    <div class="order-section">
        <h2 class="section-title">📋 Order Information</h2>

        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Order Date</div>
                <div class="info-value">{{ $order->created_at->format('M d, Y • H:i A') }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Order Status</div>
                <div class="info-value">
                    <span class="status-badge status-{{ $order->status }}">{{ ucfirst($order->status) }}</span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Payment Status</div>
                <div class="info-value">
                    <span class="status-badge status-{{ $order->payment->status ?? 'pending' }}">
                        {{ ucfirst($order->payment->status ?? 'pending') }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Retailer Information -->
    <div class="order-section">
        <h2 class="section-title">🏪 Retailer Information</h2>

        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Store Name</div>
                <div class="info-value">{{ $order->retailer->store_name ?? 'N/A' }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Contact</div>
                <div class="info-value">{{ $order->retailer->user->email ?? 'N/A' }}</div>
            </div>
        </div>
    </div>

    <!-- Order Items -->
    <div class="order-section">
        <h2 class="section-title">📦 Order Items</h2>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Magazine</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                    <tr>
                        <td class="magazine-name">{{ $item->magazine->title_name ?? 'N/A' }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>${{ number_format($item->unit_price, 2) }}</td>
                        <td class="amount">${{ number_format($item->quantity * $item->unit_price, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div style="margin-top: 20px;">
            <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">${{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Commission Fee</span>
                <span class="summary-value">${{ number_format($order->commission_fee, 2) }}</span>
            </div>
            <div class="summary-row total">
                <span class="summary-label">Total</span>
                <span class="summary-value">${{ number_format($order->subtotal - $order->commission_fee, 2) }}</span>
            </div>
        </div>
    </div>

    <!-- Shipments -->
    @if($order->shipments->count() > 0)
        <div class="order-section">
            <h2 class="section-title">🚚 Shipment Tracking</h2>

            @foreach($order->shipments as $shipment)
                <div class="shipment-item">
                    <div class="shipment-leg">{{ ucfirst(str_replace('_', ' ', $shipment->leg)) }}</div>
                    <div class="shipment-status">{{ ucfirst($shipment->status) }}</div>
                    @if($shipment->tracking_number)
                        <div class="shipment-tracking">
                            Tracking: {{ $shipment->tracking_number }} ({{ $shipment->carrier ?? 'N/A' }})
                        </div>
                    @endif
                    @if($shipment->shipped_at)
                        <div class="shipment-tracking">
                            Shipped: {{ $shipment->shipped_at->format('M d, Y') }}
                        </div>
                    @endif
                    @if($shipment->delivered_at)
                        <div class="shipment-tracking">
                            Delivered: {{ $shipment->delivered_at->format('M d, Y') }}
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Returns -->
    @if($order->returns->count() > 0)
        <div class="order-section">
            <h2 class="section-title">↩️ Returns</h2>

            @foreach($order->returns as $return)
                <div class="shipment-item">
                    <div class="shipment-status">Return Status: {{ ucfirst($return->status) }}</div>
                    <div class="shipment-tracking">Reason: {{ $return->reason ?? 'N/A' }}</div>
                    @if($return->tracking_number)
                        <div class="shipment-tracking">Tracking: {{ $return->tracking_number }}</div>
                    @endif
                </div>
            @endforeach
        </div>
    @endif
</div>
@endsection

