<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages - NEESH Publisher</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
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
        .messages-container {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
            min-height: 500px;
        }
        .messages-list {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
        }
        .messages-content {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
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
        @media (max-width: 768px) {
            .messages-container {
                grid-template-columns: 1fr;
            }
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
            <h1>Messages</h1>
            <p>Communicate with retailers and manage inquiries</p>
        </div>

        <div class="empty-state">
            <h2> No Messages Yet</h2>
            <p>Messages from retailers will appear here. You'll be able to respond to inquiries about your magazines.</p>
            <p style="margin-top: 20px; color: #999; font-size: 14px;">This feature is coming soon with full messaging capabilities.</p>
        </div>
    </div>
</body>
</html>

