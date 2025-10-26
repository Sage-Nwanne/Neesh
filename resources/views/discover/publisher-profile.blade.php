<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $publisher->company_name }} - NEESH</title>
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Manrope', sans-serif;
            background: #f8f9fa;
        }

        .profile-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #666;
            text-decoration: none;
            margin-bottom: 30px;
            font-weight: 600;
        }

        .back-link:hover {
            color: #333;
        }

        .profile-header {
            background: white;
            border-radius: 12px;
            padding: 40px;
            margin-bottom: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .profile-header h1 {
            font-size: 36px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .profile-header p {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }

        .profile-stats {
            display: flex;
            gap: 40px;
            margin-top: 20px;
        }

        .stat {
            display: flex;
            flex-direction: column;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #753bbd;
        }

        .stat-label {
            font-size: 14px;
            color: #999;
            margin-top: 5px;
        }

        .section-title {
            font-size: 28px;
            font-weight: 700;
            color: #333;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title::before {
            content: '';
            width: 4px;
            height: 28px;
            background: #753bbd;
            border-radius: 2px;
        }

        .magazines-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 25px;
        }

        .magazine-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .magazine-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .magazine-image {
            width: 100%;
            height: 250px;
            background: #f0f0f0;
            overflow: hidden;
        }

        .magazine-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .magazine-info {
            padding: 15px;
        }

        .magazine-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .magazine-price {
            font-size: 16px;
            font-weight: 700;
            color: #753bbd;
            margin-bottom: 10px;
        }

        .magazine-actions {
            display: flex;
            gap: 8px;
        }

        .btn-small {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-view {
            background: #753bbd;
            color: white;
        }

        .btn-view:hover {
            background: #5a2d8f;
        }

        .btn-bookmark {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
        }

        .btn-bookmark.bookmarked {
            background: #753bbd;
            color: white;
            border-color: #753bbd;
        }

        .btn-bookmark:hover {
            background: #e0e0e0;
        }

        .btn-bookmark.bookmarked:hover {
            background: #5a2d8f;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state h3 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #666;
        }

        @media (max-width: 768px) {
            .magazines-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }

            .profile-header {
                padding: 20px;
            }

            .profile-header h1 {
                font-size: 24px;
            }

            .profile-stats {
                gap: 20px;
            }

            .section-title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    @include('layouts.publisherheader')

    <div class="profile-container">
        <a href="{{ route('discover.index') }}" class="back-link">
            <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
            <span>Back to Discover</span>
        </a>

        <div class="profile-header">
            <h1>{{ $publisher->company_name }}</h1>
            <p>Explore all magazines from this publisher</p>
            
            <div class="profile-stats">
                <div class="stat">
                    <div class="stat-value">{{ $magazines->count() }}</div>
                    <div class="stat-label">Magazines Published</div>
                </div>
                <div class="stat">
                    <div class="stat-value">{{ $magazines->sum('copies_sold') }}</div>
                    <div class="stat-label">Total Copies Sold</div>
                </div>
            </div>
        </div>

        <div>
            <h2 class="section-title">Catalogue</h2>
            @if($magazines->count() > 0)
                <div class="magazines-grid">
                    @foreach($magazines as $magazine)
                        <div class="magazine-card">
                            <div class="magazine-image">
                                @if($magazine->images->count() > 0)
                                    <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}" alt="{{ $magazine->title_name }}">
                                @else
                                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #753bbd 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">
                                        No Image
                                    </div>
                                @endif
                            </div>
                            <div class="magazine-info">
                                <div class="magazine-title">{{ $magazine->title_name }}</div>
                                <div class="magazine-price">${{ number_format($magazine->msrp ?? 0, 2) }}</div>
                                <div class="magazine-actions">
                                    <button class="btn-small btn-view" data-magazine-id="{{ $magazine->id }}">View</button>
                                    <button class="btn-small btn-bookmark {{ in_array($magazine->id, $bookmarkedMagazineIds) ? 'bookmarked' : '' }}" data-magazine-id="{{ $magazine->id }}">
                                        {{ in_array($magazine->id, $bookmarkedMagazineIds) ? '✓ Bookmarked' : 'Bookmark' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="empty-state">
                    <h3>No magazines available</h3>
                    <p>This publisher hasn't published any magazines yet</p>
                </div>
            @endif
        </div>
    </div>

    <script>
        document.querySelectorAll('.btn-bookmark').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                e.preventDefault();
                const magazineId = this.dataset.magazineId;
                
                try {
                    const response = await fetch(`/bookmarks/${magazineId}/toggle`, {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        this.classList.toggle('bookmarked');
                        this.textContent = this.classList.contains('bookmarked') ? '✓ Bookmarked' : 'Bookmark';
                    }
                } catch (error) {
                    console.error('Error toggling bookmark:', error);
                }
            });
        });

        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const magazineId = this.dataset.magazineId;
                window.location.href = `/magazine/${magazineId}`;
            });
        });
    </script>
</body>
</html>

