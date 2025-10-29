<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catalogue - NEESH Retailer</title>
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
        .catalogue-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }
        .catalogue-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-decoration: none;
            color: inherit;
        }
        .catalogue-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .catalogue-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            background: #f0f0f0;
        }
        .catalogue-info {
            padding: 16px;
        }
        .catalogue-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            font-family: 'Manrope', sans-serif;
        }
        .catalogue-publisher {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
            font-family: 'Manrope', sans-serif;
        }
        .catalogue-price {
            font-size: 18px;
            font-weight: 700;
            color: #753bbd;
            font-family: 'Manrope', sans-serif;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }
        .empty-state h2 {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .empty-state p {
            font-size: 16px;
            color: #666;
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
            <h1>Catalogue</h1>
            <p>Browse all available magazines</p>
        </div>

        <div class="catalogue-grid">
            @forelse($magazines ?? [] as $magazine)
                <a href="{{ route('magazines.show', $magazine->id) }}" class="catalogue-card">
                    @if ($magazine->images->first())
                        <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}"
                            alt="{{ $magazine->title_name }}" class="catalogue-image" onerror="this.src='{{ asset('magazine-placeholder.png') }}'">
                    @else
                        <img src="{{ asset('magazine-placeholder.png') }}" alt="No Image" class="catalogue-image">
                    @endif
                    <div class="catalogue-info">
                        <div class="catalogue-publisher">{{ $magazine->publisher->name ?? 'Unknown Publisher' }}</div>
                        <div class="catalogue-title">{{ $magazine->title_name }}</div>
                        <div class="catalogue-price">${{ number_format($magazine->msrp, 2) }}</div>
                    </div>
                </a>
            @empty
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h2>No Magazines Available</h2>
                    <p>Check back soon for new magazines!</p>
                </div>
            @endforelse
        </div>
    </div>
</body>
</html>

