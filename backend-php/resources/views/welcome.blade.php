<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>NEESH - The OS for Indie Print</title>
    <meta name="description" content="NEESH - The OS for Indie Print. A platform for independent publishers and retailers to manage and distribute magazines.">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <!-- Styles -->
    <style>
        .application-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        .application-buttons a {
            background-color: #000;
            color: #fff;
            padding: 12px 30px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }
        .application-buttons a:hover {
            background-color: #333;
        }
        .login-link {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10;
        }
        .login-link a {
            color: #000;
            text-decoration: none;
            font-weight: 600;
        }
    </style>

</head>

<body class="antialiased">
    <div>
        <div class="start-logo-and-text-conatainer">
            <div class="login-link">
                @if (Route::has('login'))
                    @auth
                    <a href="{{ url('/dashboard') }}">Dashboard</a>
                    @else
                    <a href="{{ url('/login') }}">Log in</a>
                    @endauth
                @endif
            </div>

            <div class="start-logo-center">
                <img src="{{asset('assets/image/Logo A1.png')}}" alt="NEESH Logo">
            </div>
            <div class="start-text">
                <h1>The OS for Indie Print</h1>
            </div>
            <div class="start-button">
                @auth
                <div class="application-buttons">
                    <a href="{{ url('/dashboard') }}">Go to Dashboard</a>
                </div>
                @else
                <div class="application-buttons">
                    <a href="{{ route('register.publisher') }}">Apply as Publisher</a>
                    <a href="{{ route('register.retailer') }}">Apply as Retailer</a>
                </div>
                <p style="text-align: center; margin-top: 20px; color: #666;">
                    Already have an account? <a href="{{ url('/login') }}" style="color: #000; text-decoration: underline;">Log in</a>
                </p>
                @endauth
            </div>
        </div>
    </div>
    <script src="{{asset('assets/js/start.js')}}"></script>

</body>

</html>