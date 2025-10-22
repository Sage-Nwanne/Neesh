<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Neesh - The OS for Indie Print. A platform for independent publishers and retailers to connect and grow.">
        <meta name="keywords" content="indie print, magazine, publisher, retailer, publishing platform">
        <meta name="author" content="Neesh">

        <title>{{ config('app.name', 'Neesh') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('assets/image/Logo A1.png') }}">
        <link rel="shortcut icon" type="image/png" href="{{ asset('assets/image/Logo A1.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased">
                        {{ $slot }}

      
    </body>
</html>
