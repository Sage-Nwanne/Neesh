<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore - NEESH</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
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

        .discover-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .discover-header {
            text-align: center;
            margin-bottom: 50px;
        }

        .discover-header h1 {
            font-size: 42px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .discover-header p {
            font-size: 18px;
            color: #666;
        }

        .section {
            margin-bottom: 60px;
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
            position: relative;
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

        .magazine-publisher {
            font-size: 12px;
            color: #999;
            margin-bottom: 10px;
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

            .discover-header h1 {
                font-size: 28px;
            }

            .section-title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    @include('layouts.publisherheader')

    <div class="discover-container">
        <div class="discover-header">
            <h1>Explore Magazines</h1>
            <p>Discover thousands of magazines from publishers worldwide</p>
        </div>

        @if(Auth::check())
            <!-- Personalized Recommendations Section -->
            @if($recommendedMagazines->count() > 0)
                <div class="section">
                    <h2 class="section-title">Recommended For You</h2>
                    <div class="magazines-grid">
                        @foreach($recommendedMagazines as $magazine)
                            @include('discover.magazine-card', ['magazine' => $magazine, 'isBookmarked' => in_array($magazine->id, $bookmarkedMagazineIds)])
                        @endforeach
                    </div>
                </div>
            @endif
        @endif

        <!-- Trending Section -->
        @if($trendingMagazines->count() > 0)
            <div class="section">
                <h2 class="section-title">Trending Now</h2>
                <div class="magazines-grid">
                    @foreach($trendingMagazines as $magazine)
                        @include('discover.magazine-card', ['magazine' => $magazine, 'isBookmarked' => in_array($magazine->id, $bookmarkedMagazineIds)])
                    @endforeach
                </div>
            </div>
        @endif

        <!-- New Releases Section -->
        @if($newMagazines->count() > 0)
            <div class="section">
                <h2 class="section-title">New Releases</h2>
                <div class="magazines-grid">
                    @foreach($newMagazines as $magazine)
                        @include('discover.magazine-card', ['magazine' => $magazine, 'isBookmarked' => in_array($magazine->id, $bookmarkedMagazineIds)])
                    @endforeach
                </div>
            </div>
        @endif

        <!-- All Magazines Section -->
        <div class="section">
            <h2 class="section-title">All Magazines</h2>
            @if($allMagazines->count() > 0)
                <div class="magazines-grid">
                    @foreach($allMagazines as $magazine)
                        @include('discover.magazine-card', ['magazine' => $magazine, 'isBookmarked' => in_array($magazine->id, $bookmarkedMagazineIds)])
                    @endforeach
                </div>
            @else
                <div class="empty-state">
                    <h3>No magazines available yet</h3>
                    <p>Check back soon for new magazines from our publishers</p>
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

