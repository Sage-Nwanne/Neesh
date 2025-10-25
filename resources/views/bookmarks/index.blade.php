<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Your Bookmarks - NEESH</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}" defer></script>
</head>

<body>
    @include('layouts.header')

    <div class="product_heading_link">
        <a href="{{ route('dashboard') }}" class="login_new_to_nessh_back_arrow">
            <div class="back_navigation_title">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back Arrow">
            </div>
            <h2 class="my_title">Your Bookmarks</h2>
        </a>
    </div>

    <div class="page-width" style="padding: 40px 20px;">
        @if($bookmarks->isEmpty())
            <div style="text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #666; margin-bottom: 20px;">You haven't bookmarked any titles yet.</p>
                <a href="{{ route('home') }}" style="display: inline-block; padding: 12px 30px; background-color: #753bbd; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Explore Titles
                </a>
            </div>
        @else
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; margin-bottom: 40px;">
                @foreach($bookmarks as $bookmark)
                    <a href="{{ route('magazines.show', $bookmark->magazine->id) }}" class="product-card relative-product product-card-underline">
                        @if($bookmark->magazine->images->first())
                            <img src="{{ asset('storage/' . $bookmark->magazine->images->first()->image_path) }}" 
                                 alt="{{ $bookmark->magazine->title_name }}"
                                 style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">
                        @else
                            <div style="width: 100%; height: 300px; background-color: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #999;">No Image</span>
                            </div>
                        @endif
                        <div class="product_info">
                            <span class="product_vendor">{{ $bookmark->magazine->genre ?? 'Magazine' }}</span>
                            <div class="title_and_country">
                                <h3 class="product_title">{{ $bookmark->magazine->title_name }}</h3>
                                <p>{{ $bookmark->magazine->publisher->user->name ?? 'Unknown' }}</p>
                            </div>
                            <span class="product_price">${{ number_format($bookmark->magazine->msrp ?? 0, 2) }}</span>
                        </div>
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</body>

</html>

