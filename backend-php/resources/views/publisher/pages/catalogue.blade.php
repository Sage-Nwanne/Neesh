<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catalogue - NEESH Publisher</title>
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
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .catalogue-card {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
            text-decoration: none;
            color: #222;
        }
        .catalogue-card:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
        }
        .catalogue-card-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            background: #f5f5f5;
        }
        .catalogue-card-content {
            padding: 20px;
        }
        .catalogue-card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            font-family: 'Manrope', sans-serif;
        }
        .catalogue-card-meta {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
            font-family: 'Manrope', sans-serif;
        }
        .catalogue-card-price {
            font-size: 16px;
            font-weight: 700;
            color: #753bbd;
            font-family: 'Manrope', sans-serif;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .empty-state h2 {
            font-size: 24px;
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .empty-state p {
            color: #666;
            margin-bottom: 20px;
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
        }
        .btn-primary:hover {
            background: #5a2d8a;
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
            <h1>Your Catalogue</h1>
            <p>Manage and view all your published magazines in one place</p>
        </div>

        <div class="catalogue-grid">
            @forelse(Auth::user()->publisherProfile->magazines ?? [] as $magazine)
                <a href="{{ route('magazines.show', $magazine->id) }}" class="catalogue-card">
                    @if ($magazine->images->first())
                        <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}" alt="{{ $magazine->title_name }}" class="catalogue-card-image">
                    @else
                        <img src="{{ asset('assets/image/placeholder.png') }}" alt="No Image" class="catalogue-card-image">
                    @endif
                    <div class="catalogue-card-content">
                        <h3 class="catalogue-card-title">{{ $magazine->title_name }}</h3>
                        <p class="catalogue-card-meta">{{ $magazine->issue_identifier ?? 'Single Issue' }}</p>
                        <p class="catalogue-card-price">${{ number_format($magazine->msrp, 2) }}</p>
                    </div>
                </a>
            @empty
                <div style="grid-column: 1 / -1;">
                    <div class="empty-state">
                        <h2>No Magazines Yet</h2>
                        <p>You haven't published any magazines yet. Start by uploading your first title!</p>
                        <a href="{{ route('publisher.magazines.create') }}" class="btn-primary">Upload Magazine</a>
                    </div>
                </div>
            @endforelse
        </div>
    </div>
</body>
</html>

