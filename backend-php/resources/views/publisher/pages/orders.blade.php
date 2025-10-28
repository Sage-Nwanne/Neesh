<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders - NEESH Publisher</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <style>
        .page-container {
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
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .page-header p {
            font-size: 16px;
            color: #666;
            font-family: 'Manrope', sans-serif;
        }
        .orders-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .orders-table thead {
            background: #f5f5f5;
            border-bottom: 2px solid #eee;
        }
        .orders-table th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-family: 'Manrope', sans-serif;
            color: #333;
        }
        .orders-table td {
            padding: 16px;
            border-bottom: 1px solid #eee;
            font-family: 'Manrope', sans-serif;
        }
        .orders-table tbody tr:hover {
            background: #f9f9f9;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .status-completed {
            background: #d4edda;
            color: #155724;
        }
        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .empty-state h2 {
            font-size: 24px;
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .empty-state p {
            color: #666;
            font-family: 'Manrope', sans-serif;
        }
    </style>
</head>
<body>
    @include('layouts.publisherheader')

    <div class="page-container">
        <div class="page-header">
            <a href="{{ route('publisher.dashboard') }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                <span>Back to Dashboard</span>
            </a>
            <h1>Orders</h1>
            <p>Track and manage all orders for your magazines</p>
        </div>

        <div class="empty-state">
            <h2>No Orders Yet</h2>
            <p>Orders from retailers will appear here once they start purchasing your magazines.</p>
            <p style="margin-top: 20px; color: #999; font-size: 14px;">This feature is coming soon with full order management capabilities.</p>
        </div>
    </div>
</body>
</html>

