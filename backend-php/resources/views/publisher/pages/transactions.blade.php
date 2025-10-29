<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transactions - NEESH Publisher</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
</head>
<body>
    @include('layouts.publisherheader')
<div class="transactions-container">
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

        .transactions-container {
            max-width: 1000px;
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

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .summary-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #753bbd;
        }

        .summary-card.secondary {
            border-left-color: #10b981;
        }

        .summary-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .summary-amount {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
        }

        .transactions-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }

        .date-group {
            border-bottom: 1px solid #eee;
        }

        .date-header {
            background: #f8f9fa;
            padding: 12px 20px;
            font-size: 13px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .date-header:hover {
            background: #f0f1f3;
        }

        .date-header.collapsed .toggle-icon {
            transform: rotate(-90deg);
        }

        .toggle-icon {
            transition: transform 0.3s ease;
        }

        .transaction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
            transition: background 0.3s ease;
        }

        .transaction-item:hover {
            background: #f8f9fa;
        }

        .transaction-item.collapsed {
            display: none;
        }

        .transaction-info {
            flex: 1;
        }

        .transaction-type {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 4px;
        }

        .transaction-time {
            font-size: 12px;
            color: #999;
        }

        .transaction-details {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .transaction-amount {
            font-size: 16px;
            font-weight: 700;
            min-width: 100px;
            text-align: right;
        }

        .amount-positive {
            color: #10b981;
        }

        .amount-negative {
            color: #ef4444;
        }

        .transaction-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            min-width: 80px;
            text-align: center;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .status-processing {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-completed {
            background: #dcfce7;
            color: #166534;
        }

        .status-succeeded {
            background: #dcfce7;
            color: #166534;
        }

        .status-failed {
            background: #fee2e2;
            color: #991b1b;
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

        .empty-state-subtext {
            font-size: 14px;
            color: #999;
        }

        @media (max-width: 768px) {
            .transactions-container {
                padding: 20px 15px;
            }

            .page-header h1 {
                font-size: 24px;
            }

            .summary-cards {
                grid-template-columns: 1fr;
            }

            .transaction-item {
                flex-direction: column;
                align-items: flex-start;
            }

            .transaction-details {
                width: 100%;
                margin-top: 10px;
                justify-content: space-between;
            }

            .transaction-amount {
                text-align: left;
            }
        }
    </style>

    <div class="page-header">
        <a href="{{ route('publisher.dashboard') }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
            <span>Back to Dashboard</span>
        </a>
        <h1>Transaction History</h1>
        <p>View all your financial transactions and transfers</p>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
        <div class="summary-card">
            <div class="summary-label">Total Transferred</div>
            <div class="summary-amount">${{ number_format($totalTransferred, 2) }}</div>
        </div>
        <div class="summary-card secondary">
            <div class="summary-label">Total Received</div>
            <div class="summary-amount">${{ number_format($totalReceived, 2) }}</div>
        </div>
    </div>

    <!-- Transactions List -->
    <div class="transactions-section">
        <div class="section-title">📋 All Transactions</div>

        @if($groupedTransactions->count() > 0)
            @foreach($groupedTransactions as $date => $dayTransactions)
                <div class="date-group">
                    <div class="date-header" onclick="toggleDateGroup(this)">
                        <span>{{ \Carbon\Carbon::parse($date)->format('l, F j, Y') }} ({{ $dayTransactions->count() }} transaction{{ $dayTransactions->count() !== 1 ? 's' : '' }})</span>
                        <span class="toggle-icon">▼</span>
                    </div>

                    @foreach($dayTransactions as $transaction)
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <div class="transaction-type">{{ $transaction['description'] }}</div>
                                <div class="transaction-time">{{ $transaction['date']->format('h:i A') }}</div>
                            </div>
                            <div class="transaction-details">
                                <div class="transaction-amount {{ $transaction['type'] === 'transfer' ? 'amount-negative' : 'amount-positive' }}">
                                    {{ $transaction['type'] === 'transfer' ? '-' : '+' }}${{ number_format($transaction['amount'], 2) }}
                                </div>
                                <span class="transaction-status status-{{ $transaction['status'] }}">
                                    {{ ucfirst($transaction['status']) }}
                                </span>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endforeach
        @else
            <div class="empty-state">
                <div class="empty-state-icon">📬</div>
                <div class="empty-state-text">No transactions yet</div>
                <div class="empty-state-subtext">Your transaction history will appear here</div>
            </div>
        @endif
    </div>
</div>

<script>
    function toggleDateGroup(header) {
        const group = header.closest('.date-group');
        const items = group.querySelectorAll('.transaction-item');

        header.classList.toggle('collapsed');
        items.forEach(item => item.classList.toggle('collapsed'));
    }
</script>
</body>
</html>

