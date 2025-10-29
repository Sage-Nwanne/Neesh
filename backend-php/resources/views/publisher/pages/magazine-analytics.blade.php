<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $magazine->title_name }} - Analytics</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .analytics-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .analytics-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            gap: 20px;
        }
        .analytics-header-left {
            display: flex;
            gap: 20px;
            align-items: center;
            flex: 1;
        }
        .analytics-header-image {
            width: 120px;
            height: 160px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }
        .analytics-header-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .analytics-header-info h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            font-family: 'Manrope', sans-serif;
        }
        .analytics-header-info p {
            font-size: 14px;
            color: #666;
            margin: 4px 0;
        }
        .analytics-actions {
            display: flex;
            gap: 10px;
        }
        .btn-bookmark, .btn-back {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            font-family: 'Manrope', sans-serif;
            transition: all 0.3s ease;
        }
        .btn-back {
            background: #f0f0f0;
            color: #333;
        }
        .btn-back:hover {
            background: #e0e0e0;
        }
        .btn-bookmark {
            background: #753bbd;
            color: white;
        }
        .btn-bookmark:hover {
            background: #5f2fa3;
        }
        .btn-bookmark.bookmarked {
            background: #10b981;
        }
        .btn-contact {
            background: #3b82f6;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            font-family: 'Manrope', sans-serif;
            transition: all 0.3s ease;
        }
        .btn-contact:hover {
            background: #2563eb;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .analytics-card {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 20px;
        }
        .analytics-card-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            font-family: 'Manrope', sans-serif;
        }
        .analytics-card-value {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
            font-family: 'Manrope', sans-serif;
        }
        .analytics-card-meta {
            font-size: 13px;
            color: #666;
            font-family: 'Manrope', sans-serif;
        }
        .analytics-card-meta.positive {
            color: #10b981;
        }
        .analytics-card-meta.negative {
            color: #ef4444;
        }
        .pricing-section {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 40px;
        }
        .pricing-section h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            font-family: 'Manrope', sans-serif;
        }
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .pricing-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 6px;
        }
        .pricing-item-label {
            font-size: 14px;
            color: #666;
            font-family: 'Manrope', sans-serif;
        }
        .pricing-item-value {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            font-family: 'Manrope', sans-serif;
        }
        .chart-section {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 40px;
        }
        .chart-section h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            font-family: 'Manrope', sans-serif;
        }
        .time-period-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .time-period-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-family: 'Manrope', sans-serif;
            transition: all 0.3s ease;
        }
        .time-period-btn.active {
            background: #753bbd;
            color: white;
            border-color: #753bbd;
        }
        .time-period-btn:hover {
            border-color: #753bbd;
        }
        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
        }
        .breadcrumb a {
            color: #753bbd;
            text-decoration: none;
            cursor: pointer;
        }
        .breadcrumb a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    @include('publisher.sidemenu')

    <div class="analytics-container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a onclick="history.back()">← Back</a>
            <span>/</span>
            <span>{{ $magazine->title_name }}</span>
            <span>/</span>
            <span>Analytics</span>
        </div>

        <!-- Header -->
        <div class="analytics-header">
            <div class="analytics-header-left">
                <div class="analytics-header-image">
                    @if ($magazine->images->first())
                        <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}" alt="{{ $magazine->title_name }}" onerror="this.src='{{ asset('magazine-placeholder.png') }}'">
                    @else
                        <img src="{{ asset('magazine-placeholder.png') }}" alt="No Image">
                    @endif
                </div>
                <div class="analytics-header-info">
                    <h1>{{ $magazine->title_name }}</h1>
                    <p><strong>Issue:</strong> {{ $magazine->issue_identifier ?? 'Single Issue' }}</p>
                    <p><strong>Type:</strong> {{ ucfirst($magazine->type) }}</p>
                    <p><strong>Genre:</strong> {{ $magazine->genre ?? 'N/A' }}</p>
                </div>
            </div>
            <div class="analytics-actions">
                <button class="btn-back" onclick="history.back()">← Back</button>
                <button class="btn-bookmark" id="bookmarkBtn" data-magazine-id="{{ $magazine->id }}">🔖 Bookmark</button>
                <button class="btn-contact" id="contactBtn">📞 Contact Retailer</button>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="analytics-card-label">Units Sold</div>
                <div class="analytics-card-value">{{ $unitsSold }}</div>
                <div class="analytics-card-meta">of {{ $totalPrinted }} printed</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-label">Current Stock</div>
                <div class="analytics-card-value">{{ $currentStock }}</div>
                <div class="analytics-card-meta">{{ round(($currentStock / $totalPrinted) * 100) }}% remaining</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-label">Units Returned</div>
                <div class="analytics-card-value">{{ $unitsReturned }}</div>
                <div class="analytics-card-meta">Return rate: {{ $unitsSold > 0 ? round(($unitsReturned / $unitsSold) * 100, 1) : 0 }}%</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-label">Growth</div>
                <div class="analytics-card-value">{{ $growthPercentage }}%</div>
                <div class="analytics-card-meta {{ $growthPercentage >= 0 ? 'positive' : 'negative' }}">
                    {{ $growthPercentage >= 0 ? '↑' : '↓' }} vs last period
                </div>
            </div>
        </div>

        <!-- Pricing Information -->
        <div class="pricing-section">
            <h3>Pricing Information</h3>
            <div class="pricing-grid">
                <div class="pricing-item">
                    <span class="pricing-item-label">Wholesale Price (WSP)</span>
                    <span class="pricing-item-value">${{ number_format($magazine->wholesale_price, 2) }}</span>
                </div>
                <div class="pricing-item">
                    <span class="pricing-item-label">MSRP</span>
                    <span class="pricing-item-value">${{ number_format($magazine->msrp, 2) }}</span>
                </div>
                <div class="pricing-item">
                    <span class="pricing-item-label">Your Margin</span>
                    <span class="pricing-item-value">${{ number_format($margin, 2) }}</span>
                </div>
                <div class="pricing-item">
                    <span class="pricing-item-label">Margin %</span>
                    <span class="pricing-item-value">{{ round($marginPercentage, 1) }}%</span>
                </div>
            </div>
        </div>

        <!-- Sales Chart -->
        <div class="chart-section">
            <h3>Sales Performance</h3>
            <div class="time-period-buttons">
                <button class="time-period-btn active" data-period="daily">D</button>
                <button class="time-period-btn" data-period="weekly">W</button>
                <button class="time-period-btn" data-period="monthly">M</button>
                <button class="time-period-btn" data-period="quarterly">Q</button>
                <button class="time-period-btn" data-period="yearly">Y</button>
                <button class="time-period-btn" data-period="all">ALL</button>
            </div>
            <canvas id="salesChart" style="max-height: 300px;"></canvas>
        </div>
    </div>

    <script>
        // Initialize chart
        const ctx = document.getElementById('salesChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Units Sold',
                    data: [{{ $unitsSold }}, 0, 0, 0],
                    borderColor: '#753bbd',
                    backgroundColor: 'rgba(117, 59, 189, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#753bbd',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { family: "'Manrope', sans-serif" }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { family: "'Manrope', sans-serif" }
                        }
                    },
                    x: {
                        ticks: {
                            font: { family: "'Manrope', sans-serif" }
                        }
                    }
                }
            }
        });

        // Time period button handlers
        document.querySelectorAll('.time-period-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.time-period-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // TODO: Update chart data based on selected period
            });
        });

        // Bookmark functionality
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        const magazineId = bookmarkBtn.dataset.magazineId;

        // Check if bookmarked on page load
        fetch(`{{ route('bookmarks.check', '') }}/${magazineId}`)
            .then(response => response.json())
            .then(data => {
                if (data.isBookmarked) {
                    bookmarkBtn.classList.add('bookmarked');
                    bookmarkBtn.textContent = '✓ Bookmarked';
                }
            })
            .catch(error => console.error('Error checking bookmark:', error));

        bookmarkBtn.addEventListener('click', function() {
            fetch(`{{ route('bookmarks.toggle', '') }}/${magazineId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.isBookmarked) {
                    bookmarkBtn.classList.add('bookmarked');
                    bookmarkBtn.textContent = '✓ Bookmarked';
                } else {
                    bookmarkBtn.classList.remove('bookmarked');
                    bookmarkBtn.textContent = '🔖 Bookmark';
                }
            })
            .catch(error => console.error('Error toggling bookmark:', error));
        });

        // Contact Retailer functionality
        const contactBtn = document.getElementById('contactBtn');
        contactBtn.addEventListener('click', function() {
            // TODO: Implement contact retailer modal/form
            alert('Contact Retailer feature coming soon!');
        });
    </script>
</body>
</html>

