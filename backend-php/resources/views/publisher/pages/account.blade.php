<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account - NEESH Publisher</title>
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
        .account-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .account-card {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .account-card h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            font-family: 'Manrope', sans-serif;
        }
        .account-field {
            margin-bottom: 20px;
        }
        .account-field label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            margin-bottom: 6px;
            text-transform: uppercase;
            font-family: 'Manrope', sans-serif;
        }
        .account-field p {
            font-size: 16px;
            color: #333;
            font-family: 'Manrope', sans-serif;
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
        .btn-danger {
            display: inline-block;
            background: #dc3545;
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
        .btn-danger:hover {
            background: #c82333;
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
            <h1>Account Settings</h1>
            <p>Manage your publisher account and preferences</p>
        </div>

        <div class="account-grid">
            <div class="account-card">
                <h3>👤 Profile Information</h3>
                <div class="account-field">
                    <label>Name</label>
                    <p>{{ $user->name }}</p>
                </div>
                <div class="account-field">
                    <label>Email</label>
                    <p>{{ $user->email }}</p>
                </div>
                <button class="btn-primary" onclick="alert('Edit profile feature coming soon!')">Edit Profile</button>
            </div>

            <div class="account-card">
                <h3>🔐 Security</h3>
                <div class="account-field">
                    <label>Password</label>
                    <p>••••••••</p>
                </div>
                <button class="btn-primary" onclick="alert('Change password feature coming soon!')">Change Password</button>
            </div>

            <div class="account-card">
                <h3>🔔 Notifications</h3>
                <div class="account-field">
                    <label>Email Notifications</label>
                    <p>Enabled</p>
                </div>
                <button class="btn-primary" onclick="alert('Notification settings coming soon!')">Manage Notifications</button>
            </div>

            <div class="account-card">
                <h3>📋 Billing</h3>
                <div class="account-field">
                    <label>Subscription Status</label>
                    <p>Active</p>
                </div>
                <button class="btn-primary" onclick="alert('Billing management coming soon!')">Manage Billing</button>
            </div>

            <div class="account-card">
                <h3>🎨 Profile Settings</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Customize your publisher profile, branding, and social media links.</p>
                <a href="{{ route('profile.publisher-settings') }}" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center;">Manage Profile Settings</a>
            </div>

            <div class="account-card">
                <h3>📦 Archived Titles</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">View and manage your archived magazine titles.</p>
                <a href="{{ route('publisher.archived-titles') }}" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center;">View Archived Titles</a>
            </div>

            <div class="account-card">
                <h3>🗑️ Danger Zone</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Permanently delete your account and all associated data.</p>
                <button class="btn-danger" onclick="alert('Account deletion feature coming soon!')">Delete Account</button>
            </div>

            <div class="account-card">
                <h3>🚪 Session</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Sign out from your account.</p>
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit" class="btn-danger">Logout</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>

