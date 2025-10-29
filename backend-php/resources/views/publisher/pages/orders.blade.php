<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders - NEESH Publisher</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
</head>
<body>
    @include('layouts.publisherheader')
<div class="orders-container">
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

        .orders-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .page-header {
            margin-bottom: 30px;
        }

        .page-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #753bbd;
        }

        .stat-card.secondary {
            border-left-color: #10b981;
        }

        .stat-card.tertiary {
            border-left-color: #f59e0b;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
        }

        .controls-section {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .control-group {
            flex: 1;
            min-width: 200px;
        }

        .control-group label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            margin-bottom: 6px;
            text-transform: uppercase;
        }

        .control-group input,
        .control-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-family: 'Manrope', sans-serif;
            font-size: 14px;
        }

        .control-group input:focus,
        .control-group select:focus {
            outline: none;
            border-color: #753bbd;
            box-shadow: 0 0 0 3px rgba(117, 59, 189, 0.1);
        }

        .orders-table {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #f8f9fa;
            border-bottom: 2px solid #eee;
        }

        th {
            padding: 16px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 16px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }

        tbody tr:hover {
            background: #f8f9fa;
        }

        .order-id {
            font-weight: 600;
            color: #753bbd;
            cursor: pointer;
        }

        .order-id:hover {
            text-decoration: underline;
        }

        .retailer-name {
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

        .payment-status {
            font-size: 12px;
            font-weight: 600;
        }

        .payment-pending {
            color: #f59e0b;
        }

        .payment-succeeded {
            color: #10b981;
        }

        .payment-failed {
            color: #ef4444;
        }

        .order-amount {
            font-weight: 700;
            color: #1a1a1a;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .empty-state-text {
            font-size: 16px;
            margin-bottom: 8px;
        }

        @media (max-width: 768px) {
            .orders-container {
                padding: 20px 15px;
            }

            .page-header h1 {
                font-size: 24px;
            }

            .controls-section {
                flex-direction: column;
            }

            .control-group {
                min-width: 100%;
            }

            table {
                font-size: 12px;
            }

            th, td {
                padding: 12px;
            }
        }
    </style>

    <div class="page-header">
        <a href="{{ route('publisher.dashboard') }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
            <span>Back to Dashboard</span>
        </a>
        <h1>Order Management</h1>
    </div>

    <!-- Statistics -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">{{ $totalOrders }}</div>
        </div>
        <div class="stat-card secondary">
            <div class="stat-label">Pending Orders</div>
            <div class="stat-value">{{ $pendingOrders }}</div>
        </div>
        <div class="stat-card tertiary">
            <div class="stat-label">Completed Orders</div>
            <div class="stat-value">{{ $completedOrders }}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">${{ number_format($totalRevenue, 2) }}</div>
        </div>
    </div>

    <!-- Filters & Controls -->
    <div class="controls-section">
        <div class="control-group">
            <label>Search Order</label>
            <input type="text" id="searchInput" placeholder="Order ID or retailer name...">
        </div>
        <div class="control-group">
            <label>Status</label>
            <select id="statusFilter">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
            </select>
        </div>
        <div class="control-group">
            <label>Payment Status</label>
            <select id="paymentFilter">
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
            </select>
        </div>
    </div>

    <!-- Orders Table -->
    <div class="orders-table">
        @if($orders->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Retailer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orders as $order)
                        <tr>
                            <td>
                                <a href="{{ route('publisher.orders.detail', $order->id) }}" class="order-id">
                                    #{{ $order->external_order_id ?? $order->id }}
                                </a>
                            </td>
                            <td class="retailer-name">{{ $order->retailer->store_name ?? 'N/A' }}</td>
                            <td>{{ $order->items->count() }} item(s)</td>
                            <td class="order-amount">${{ number_format($order->subtotal, 2) }}</td>
                            <td>
                                <span class="status-badge status-{{ $order->status }}">
                                    {{ ucfirst($order->status) }}
                                </span>
                            </td>
                            <td>
                                <span class="payment-status payment-{{ $order->payment->status ?? 'pending' }}">
                                    {{ ucfirst($order->payment->status ?? 'pending') }}
                                </span>
                            </td>
                            <td>{{ $order->created_at->format('M d, Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="empty-state">
                <div class="empty-state-icon">📬</div>
                <div class="empty-state-text">No orders found</div>
            </div>
        @endif
    </div>
</div>

<script>
    // Filter functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        const params = new URLSearchParams(window.location.search);
        params.set('search', this.value);
        window.location.href = '{{ route("publisher.orders") }}?' + params.toString();
    });

    document.getElementById('statusFilter').addEventListener('change', function() {
        const params = new URLSearchParams(window.location.search);
        if (this.value) {
            params.set('status', this.value);
        } else {
            params.delete('status');
        }
        window.location.href = '{{ route("publisher.orders") }}?' + params.toString();
    });

    document.getElementById('paymentFilter').addEventListener('change', function() {
        const params = new URLSearchParams(window.location.search);
        if (this.value) {
            params.set('payment_status', this.value);
        } else {
            params.delete('payment_status');
        }
        window.location.href = '{{ route("publisher.orders") }}?' + params.toString();
    });
</script>
</body>
</html>