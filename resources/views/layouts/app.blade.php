<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="Neesh - The OS for Indie Print. A platform for independent publishers and retailers to connect and grow.">
    <meta name="keywords" content="indie print, magazine, publisher, retailer, publishing platform">
    <meta name="author" content="Neesh">

    <title>@yield('title', config('app.name', 'Neesh'))</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/image/Logo A1.png') }}">
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/image/Logo A1.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/custom.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/cheekout.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/publisherregister.css') }}">

    <!-- Page-specific styles -->
    @stack('styles')

    <!-- Scripts -->
    <script src="{{ asset('assets/js/product-page.js') }}" defer></script>
    <script src="{{ asset('assets/js/menu.js') }}" defer></script>
    <script src="{{ asset('assets/js/cheekout.js') }}" defer></script>
    <script src="{{ asset('assets/js/custom.js') }}" defer></script>

    @stack('scripts')
</head>

<body class="font-sans antialiased">
    <div class="min-h-screen bg-gray-100">

        @hasrole('admin')
            @include('layouts.admin_header')
        @endhasrole
        @hasrole('publisher')
            @include('layouts.publisher_header')
        @endhasrole
        @hasrole('retailer')
            @include('layouts.header')
        @endhasrole

        <main>
            @yield('content')
        </main>
    </div>
</body>

</html>
