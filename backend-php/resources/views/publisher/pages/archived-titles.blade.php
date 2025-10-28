<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Archived Titles - NEESH</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}" defer></script>
    <style>
        .archived-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .archived-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 40px;
        }

        .archived-header a {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: #333;
            font-size: 16px;
        }

        .archived-header img {
            width: 24px;
            height: 24px;
        }

        .archived-header h1 {
            margin: 0;
            font-size: 28px;
            color: #333;
        }

        .archived-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .archived-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .archived-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .archived-card-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            background: #f0f0f0;
        }

        .archived-card-content {
            padding: 15px;
        }

        .archived-card-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin: 0 0 8px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .archived-card-issue {
            font-size: 14px;
            color: #666;
            margin: 0;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }

        .empty-state-icon {
            font-size: 48px;
            color: #ccc;
            margin-bottom: 20px;
        }

        .empty-state-text {
            font-size: 18px;
            color: #666;
            margin: 0;
        }
    </style>
</head>
<body>
    @include('layouts.header')

    <div class="archived-container">
        <div class="archived-header">
            <a href="{{ route('publisher.dashboard') }}">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back">
                <span>Back to Dashboard</span>
            </a>
            <h1>Archived Titles</h1>
        </div>

        @if($archivedMagazines->count() > 0)
            <div class="archived-grid">
                @foreach($archivedMagazines as $magazine)
                    <a href="{{ route('magazines.show', $magazine->id) }}" class="archived-card">
                        <div>
                            @if($magazine->images->first())
                                <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}" 
                                     alt="{{ $magazine->title_name }}" 
                                     class="archived-card-image"
                                     onerror="this.src='{{ asset('magazine-placeholder.png') }}'">
                            @else
                                <img src="{{ asset('magazine-placeholder.png') }}" 
                                     alt="No Image" 
                                     class="archived-card-image">
                            @endif
                        </div>
                        <div class="archived-card-content">
                            <h3 class="archived-card-title">{{ $magazine->title_name }}</h3>
                            <p class="archived-card-issue">{{ $magazine->issue_identifier ?? 'Single Issue' }}</p>
                        </div>
                    </a>
                @endforeach
            </div>
        @else
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <p class="empty-state-text">No archived titles yet. Your archived titles will appear here.</p>
            </div>
        @endif
    </div>
</body>
</html>

