<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Neesh</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <!-- Styles -->

</head>

<body class="antialiased">
    <div >
      

        <div class="start-logo-and-text-conatainer">
            <div class="start-logo-center">
                <img src="{{asset('assets/image/Logo A1.png')}}" alt="Logo Image">

            </div>
            <div class="start-text">
                <h1>The OS for Indie Print</h1>
            </div>
            <div class="start-button">
                @if (Route::has('login'))
                <div class="sm:fixed sm:top-0 sm:right-0 p-6 text-right z-10">
                    @auth
                    <a href="{{ url('/dashboard') }}">Dashboard</a>
                    @else
                <a href="{{ url('/start') }}">Get Started</a>
                    @endauth
                </div>
                @endif
            </div>
        </div>
    </div>
    <script src="{{asset('assets/js/start.js')}}"></script>

</body>

</html>