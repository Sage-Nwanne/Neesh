@extends('layouts.app')

@section('content')
<div class="transfers-container">
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

        .transfers-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .page-header {
            margin-bottom: 40px;
        }

        .page-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
        }

        .page-header p {
            font-size: 16px;
            color: #666;
        }

        .balance-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .balance-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #753bbd;
        }

        .balance-card.secondary {
            border-left-color: #10b981;
        }

        .balance-card.tertiary {
            border-left-color: #f59e0b;
        }

        .balance-card-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .balance-card-amount {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
        }

        .transfer-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            margin-bottom: 40px;
        }

        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: 'Manrope', sans-serif;
            font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #753bbd;
            box-shadow: 0 0 0 3px rgba(117, 59, 189, 0.1);
        }

        .transfer-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .transfer-option {
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .transfer-option:hover {
            border-color: #753bbd;
            background: rgba(117, 59, 189, 0.05);
        }

        .transfer-option input[type="radio"] {
            margin-right: 10px;
        }

        .transfer-option.selected {
            border-color: #753bbd;
            background: rgba(117, 59, 189, 0.1);
        }

        .btn-transfer {
            background: #753bbd;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }

        .btn-transfer:hover {
            background: #5f2fa3;
        }

        .btn-transfer:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .transfers-list {
            margin-top: 30px;
        }

        .transfer-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #eee;
            transition: background 0.3s ease;
        }

        .transfer-item:hover {
            background: #f8f9fa;
        }

        .transfer-info {
            flex: 1;
        }

        .transfer-date {
            font-size: 14px;
            color: #666;
            margin-bottom: 4px;
        }

        .transfer-type {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .transfer-amount {
            font-size: 18px;
            font-weight: 700;
            color: #10b981;
        }

        .transfer-status {
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

        .status-processing {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-completed {
            background: #dcfce7;
            color: #166534;
        }

        .status-failed {
            background: #fee2e2;
            color: #991b1b;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
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
            .transfers-container {
                padding: 20px 15px;
            }

            .page-header h1 {
                font-size: 24px;
            }

            .balance-cards {
                grid-template-columns: 1fr;
            }

            .transfer-options {
                grid-template-columns: 1fr;
            }

            .transfer-item {
                flex-direction: column;
                align-items: flex-start;
            }

            .transfer-amount {
                margin-top: 10px;
            }
        }
    </style>

    <div class="page-header">
        <h1>💰 Transfer Funds</h1>
        <p>Manage your earnings and request transfers to your bank account</p>
    </div>

    <!-- Balance Cards -->
    <div class="balance-cards">
        <div class="balance-card">
            <div class="balance-card-label">Available Balance</div>
            <div class="balance-card-amount">${{ number_format($availableBalance, 2) }}</div>
        </div>
        <div class="balance-card secondary">
            <div class="balance-card-label">Total Earnings</div>
            <div class="balance-card-amount">${{ number_format($totalEarnings, 2) }}</div>
        </div>
        <div class="balance-card tertiary">
            <div class="balance-card-label">Total Transferred</div>
            <div class="balance-card-amount">${{ number_format($totalTransferred, 2) }}</div>
        </div>
    </div>

    <!-- Transfer Form -->
    <div class="transfer-section">
        <h2 class="section-title">📤 Request Transfer</h2>

        <form id="transferForm">
            @csrf

            <div class="form-group">
                <label for="amount">Transfer Amount</label>
                <input type="number" id="amount" name="amount" placeholder="Enter amount" step="0.01" min="1" max="{{ $availableBalance }}" required>
                <small style="color: #666; margin-top: 4px; display: block;">Available: ${{ number_format($availableBalance, 2) }}</small>
            </div>

            <div class="form-group">
                <label>Transfer Type</label>
                <div class="transfer-options">
                    <label class="transfer-option">
                        <input type="radio" name="type" value="instant" required>
                        <div>
                            <strong>Instant Transfer</strong>
                            <div style="font-size: 12px; color: #666;">Arrives in 1-2 hours (Fee: 1%)</div>
                        </div>
                    </label>
                    <label class="transfer-option">
                        <input type="radio" name="type" value="standard" checked required>
                        <div>
                            <strong>Standard Transfer</strong>
                            <div style="font-size: 12px; color: #666;">Arrives in 1-2 business days (Free)</div>
                        </div>
                    </label>
                </div>
            </div>

            <button type="submit" class="btn-transfer">Request Transfer</button>
        </form>
    </div>

    <!-- Recent Transfers -->
    <div class="transfer-section">
        <h2 class="section-title">📋 Recent Transfers</h2>

        @if($transfers->count() > 0)
            <div class="transfers-list">
                @foreach($transfers as $transfer)
                    <div class="transfer-item">
                        <div class="transfer-info">
                            <div class="transfer-date">{{ $transfer->created_at->format('M d, Y • H:i A') }}</div>
                            <div class="transfer-type">{{ ucfirst($transfer->type) }} Transfer</div>
                        </div>
                        <div class="transfer-amount">${{ number_format($transfer->amount, 2) }}</div>
                        <span class="transfer-status status-{{ $transfer->status }}">{{ ucfirst($transfer->status) }}</span>
                    </div>
                @endforeach
            </div>

            {{ $transfers->links() }}
        @else
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No transfers yet</div>
                <div class="empty-state-subtext">Your transfer history will appear here</div>
            </div>
        @endif
    </div>
</div>

<script>
    // Transfer form submission
    document.getElementById('transferForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const type = document.querySelector('input[name="type"]:checked').value;

        try {
            const response = await fetch('{{ route("publisher.transfers.store") }}', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, type })
            });

            const data = await response.json();

            if (data.success) {
                alert('Transfer request submitted successfully!');
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit transfer request');
        }
    });

    // Transfer option selection
    document.querySelectorAll('.transfer-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.transfer-option').forEach(opt => opt.classList.remove('selected'));
            this.closest('.transfer-option').classList.add('selected');
        });
    });

    // Set initial selected state
    document.querySelector('.transfer-option input[type="radio"]:checked').closest('.transfer-option').classList.add('selected');
</script>
@endsection

