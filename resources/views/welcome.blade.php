<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Neesh - The OS for Indie Print. A platform for independent publishers and retailers to connect and grow.">
    <meta name="keywords" content="indie print, magazine, publisher, retailer, publishing platform">
    <meta name="author" content="Neesh">

    <title>Neesh - The OS for Indie Print</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/image/Logo A1.png') }}">
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/image/Logo A1.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <!-- Styles -->

</head>

<body class="antialiased">
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
        @auth
            <!-- Authenticated users see dashboard link and logout button -->
            <div style="position: absolute; top: 20px; right: 20px; display: flex; gap: 10px;">
                <a href="{{ url('/dashboard') }}" style="padding: 10px 20px; background: black; color: white; text-decoration: none; border-radius: 4px;">Dashboard</a>
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit" style="padding: 10px 20px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Logout</button>
                </form>
            </div>
        @else
            <!-- Unauthenticated users see the welcome screen -->
            <div style="text-align: center; max-width: 600px;">
                <div style="margin-bottom: 40px;">
                    <img src="{{asset('assets/image/Logo A1.png')}}" alt="Neesh Logo" style="max-width: 300px; height: auto;">
                </div>

                

                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                    <a href="{{ route('register.publisher') }}" style="flex: 1; min-width: 200px; padding: 20px; background: black; color: white; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 4px; transition: background 0.3s;">
                        Apply as Publisher
                    </a>
                    <a href="{{ route('register.retailer') }}" style="flex: 1; min-width: 200px; padding: 20px; background: black; color: white; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 4px; transition: background 0.3s;">
                        Apply as Retailer
                    </a>
                </div>

                <div style="margin-top: 40px;">
                    <p style="color: #666; margin-bottom: 10px;">Already have an account?</p>
                    <a href="{{ route('login') }}" style="color: black; text-decoration: underline; font-weight: 500;">Log in</a>
                </div>
            </div>
        @endauth
    </div>
    <script src="{{asset('assets/js/start.js')}}"></script>

</body>

</html>