<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            background: #f5f7fa;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .verify-wrapper {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .verify-card {
            border-radius: 15px;
            overflow: hidden;
        }
        .verify-card h3 {
            font-weight: 600;
        }
        .verify-footer {
            margin-top: 20px;
            font-size: 0.85rem;
            color: #6c757d;
        }
    </style>
</head>
<body>

<div class="verify-wrapper">
    <div class="col-md-7 col-lg-6">
        <div class="card shadow-lg border-0 verify-card">
            <div class="card-body p-5 text-center">
                <h3 class="card-title mb-3 text-dark">
                    Verify Your Account
                </h3>

                <p class="text-muted">
                    Thanks for signing up to Neesh! Your request has been sent to the admin.
                </p>
                <p class="fw-semibold">
                    Once the admin verifies your account, you will receive an email notification and then you can continue.
                </p>

                <!-- Success alert (show conditionally in blade) -->
                @if (session('status') == 'verification-link-sent')
                    <div class="alert alert-success mt-3">
                        The admin has been notified. Please wait until your account is approved.
                    </div>
                @endif

                <div class="d-flex justify-content-center mt-4">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="btn btn-outline-danger px-4">
                            <i class="bi bi-box-arrow-right me-2"></i>
                            Log Out
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div class="text-center verify-footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
