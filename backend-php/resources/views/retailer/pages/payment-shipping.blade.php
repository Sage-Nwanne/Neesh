<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment & Shipping - NEESH Retailer</title>
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
        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .settings-card {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .settings-card h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            font-family: 'Manrope', sans-serif;
        }
        .settings-field {
            margin-bottom: 20px;
        }
        .settings-field label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-family: 'Manrope', sans-serif;
        }
        .settings-field input,
        .settings-field select,
        .settings-field textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: 'Manrope', sans-serif;
            font-size: 14px;
        }
        .settings-field input:focus,
        .settings-field select:focus,
        .settings-field textarea:focus {
            outline: none;
            border-color: #753bbd;
            box-shadow: 0 0 0 3px rgba(117, 59, 189, 0.1);
        }
        .btn-primary {
            display: inline-block;
            background: #753bbd;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.3s ease;
            font-family: 'Manrope', sans-serif;
            border: none;
            cursor: pointer;
        }
        .btn-primary:hover {
            background: #5a2d8a;
        }
        .info-box {
            background: #f0f7ff;
            border-left: 4px solid #753bbd;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .info-box p {
            font-size: 14px;
            color: #333;
            margin: 0;
            font-family: 'Manrope', sans-serif;
        }
    </style>
</head>
<body>
    @include('layouts.header')

    <div class="page-container">
        <div class="page-header">
            <a href="{{ \App\Helpers\RouteHelper::getDashboardRoute() }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                <span>Back to Dashboard</span>
            </a>
            <h1>Payment & Shipping</h1>
            <p>Manage your payment methods and shipping preferences</p>
        </div>

        <div class="settings-grid">
            <div class="settings-card">
                <h3>Payment Methods</h3>
                <div class="info-box">
                    <p>💳 Manage your saved payment methods and billing information</p>
                </div>
                <div class="settings-field">
                    <label>Default Payment Method</label>
                    <select>
                        <option>Visa ending in 4242</option>
                        <option>Mastercard ending in 5555</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="alert('Payment method management coming soon!')">Manage Payment Methods</button>
            </div>

            <div class="settings-card">
                <h3>Shipping Address</h3>
                <div class="info-box">
                    <p>📍 Set your default shipping address for orders</p>
                </div>
                @if($retailerProfile && $retailerProfile->address)
                    <div class="settings-field">
                        <label>Current Address</label>
                        <p style="padding: 10px; background: #f9f9f9; border-radius: 4px; font-size: 14px;">
                            {{ $retailerProfile->address }}<br>
                            {{ $retailerProfile->city }}, {{ $retailerProfile->state }} {{ $retailerProfile->zip }}
                        </p>
                    </div>
                @else
                    <div class="settings-field">
                        <label>No Address Set</label>
                        <p style="padding: 10px; background: #f9f9f9; border-radius: 4px; font-size: 14px; color: #999;">
                            Please add a shipping address
                        </p>
                    </div>
                @endif
                <button class="btn-primary" onclick="alert('Address management coming soon!')">Update Address</button>
            </div>

            <div class="settings-card">
                <h3>Shipping Preferences</h3>
                <div class="info-box">
                    <p>🚚 Choose your preferred shipping method</p>
                </div>
                <div class="settings-field">
                    <label>Default Shipping Method</label>
                    <select>
                        <option>Standard Shipping (5-7 business days)</option>
                        <option>Express Shipping (2-3 business days)</option>
                        <option>Overnight Shipping (1 business day)</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="alert('Shipping preferences coming soon!')">Save Preferences</button>
            </div>

            <div class="settings-card">
                <h3>Billing Information</h3>
                <div class="info-box">
                    <p>📋 Manage your billing details and invoices</p>
                </div>
                <div class="settings-field">
                    <label>Billing Name</label>
                    <input type="text" placeholder="Enter billing name" value="{{ $retailerProfile->business_name ?? '' }}" disabled>
                </div>
                <button class="btn-primary" onclick="alert('Billing management coming soon!')">View Invoices</button>
            </div>

            <div class="settings-card">
                <h3>Shipping Rates</h3>
                <div class="info-box">
                    <p>💰 View current shipping rates</p>
                </div>
                <div style="font-size: 14px; font-family: 'Manrope', sans-serif;">
                    <p><strong>Standard Shipping:</strong> $5.99 (5-7 business days)</p>
                    <p><strong>Express Shipping:</strong> $12.99 (2-3 business days)</p>
                    <p><strong>Overnight Shipping:</strong> $24.99 (1 business day)</p>
                    <p style="color: #666; margin-top: 10px; font-size: 12px;">Free shipping on orders over $100</p>
                </div>
            </div>

            <div class="settings-card">
                <h3>Order Tracking</h3>
                <div class="info-box">
                    <p>📦 Track your orders in real-time</p>
                </div>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px; font-family: 'Manrope', sans-serif;">
                    You'll receive tracking information via email once your order ships. You can also view tracking details in your Orders page.
                </p>
                <a href="{{ route('retailer.orders') }}" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center;">View My Orders</a>
            </div>
        </div>
    </div>
</body>
</html>

