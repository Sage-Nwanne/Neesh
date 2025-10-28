<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Publisher Dashboard</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Manrope', sans-serif; background: #f8f9fa; }
        
        .dashboard-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        
        /* Header */
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .dashboard-header h1 { font-size: 28px; font-weight: 700; }
        .upload-btn { padding: 10px 20px; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; font-weight: 600; }
        
        /* Financial Overview */
        .financial-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .metric-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .metric-label { font-size: 14px; color: #666; margin-bottom: 8px; }
        .metric-value { font-size: 28px; font-weight: 700; color: #000; }
        .metric-subtext { font-size: 12px; color: #999; margin-top: 8px; }
        .growth-indicator { color: #10B981; font-weight: 600; }
        .transfer-btn { width: 100%; margin-top: 15px; padding: 10px; background: #000; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
        
        /* Analytics Chart */
        .analytics-section { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 40px; }
        .analytics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .analytics-header h2 { font-size: 20px; font-weight: 700; }
        .time-filters { display: flex; gap: 10px; }
        .time-filter-btn { padding: 8px 12px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; }
        .time-filter-btn.active { background: #753bbd; color: white; }
        .chart-container { position: relative; height: 300px; }
        
        /* My Titles Section */
        .titles-section { margin-bottom: 40px; }
        .titles-section h2 { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .titles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .title-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .title-card img { width: 100%; height: 250px; object-fit: cover; }
        .title-info { padding: 15px; }
        .title-name { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
        .stock-level { font-size: 12px; color: #666; margin-bottom: 10px; }
        .progress-bar { width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #753bbd 0%, #a855f7 100%); }
        
        /* Orders Table */
        .orders-section { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .orders-section h2 { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th { text-align: left; padding: 12px; border-bottom: 2px solid #e0e0e0; font-weight: 700; font-size: 12px; }
        .orders-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-received { background: #d1fae5; color: #10B981; }
        .status-pending { background: #fef3c7; color: #F59E0B; }
        .status-unfulfilled { background: #fee2e2; color: #EF4444; }
        .status-returned { background: #dbeafe; color: #3B82F6; }
        
        @media (max-width: 768px) {
            .financial-overview { grid-template-columns: 1fr; }
            .titles-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
            .orders-table { font-size: 12px; }
        }
    </style>
</head>
<body>
    @include('layouts.publisherheader')
    
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <h1>Welcome back, {{ Auth::user()->name }}</h1>
            <a href="{{ route('publisher.magazines.create') }}" class="upload-btn">Upload Magazine</a>
        </div>
        
        <!-- Financial Overview -->
        <div class="financial-overview">
            <div class="metric-card">
                <div class="metric-label">Account Balance</div>
                <div class="metric-value">${{ number_format($accountBalance, 2) }}</div>
                <button class="transfer-btn">Request Transfer</button>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Total Sales</div>
                <div class="metric-value">${{ number_format($totalSales, 2) }}</div>
                <div class="metric-subtext">
                    <span class="growth-indicator">
                        {{ $salesGrowth >= 0 ? '↗' : '↘' }} {{ abs(round($salesGrowth, 2)) }}%
                    </span>
                    vs last month
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Sales Volume</div>
                <div class="metric-value">{{ $totalVolume }}</div>
                <div class="metric-subtext">units sold</div>
            </div>
        </div>
        
        <!-- Performance Analytics -->
        <div class="analytics-section">
            <div class="analytics-header">
                <h2>Performance Analytics</h2>
                <div class="time-filters">
                    <button class="time-filter-btn active" data-period="D">D</button>
                    <button class="time-filter-btn" data-period="W">W</button>
                    <button class="time-filter-btn" data-period="M">M</button>
                    <button class="time-filter-btn" data-period="Q">Q</button>
                    <button class="time-filter-btn" data-period="YTD">YTD</button>
                    <button class="time-filter-btn" data-period="Y">Y</button>
                    <button class="time-filter-btn" data-period="ALL">ALL</button>
                </div>
            </div>
            <div class="chart-container">
                <canvas id="salesChart"></canvas>
            </div>
        </div>
        
        <!-- My Titles -->
        <div class="titles-section">
            <h2>My Titles</h2>
            <div class="titles-grid">
                @forelse($magazines as $magazine)
                    <div class="title-card">
                        @if ($magazine->images->first())
                            <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}" alt="{{ $magazine->title_name }}" onerror="this.src='{{ asset('magazine-placeholder.png') }}'">
                        @else
                            <img src="{{ asset('magazine-placeholder.png') }}" alt="No Image">
                        @endif
                        <div class="title-info">
                            <div class="title-name">{{ $magazine->title_name }}</div>
                            <div class="stock-level">{{ $magazine->stock }}/{{ $magazine->total_printed }}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: {{ ($magazine->copies_sold / max($magazine->total_printed, 1)) * 100 }}%"></div>
                            </div>
                        </div>
                    </div>
                @empty
                    <p>No magazines published yet.</p>
                @endforelse
            </div>
        </div>
        
        <!-- Latest Orders -->
        <div class="orders-section">
            <h2>Latest Orders</h2>
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Time</th>
                        <th>Volume</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($orders as $order)
                        <tr>
                            <td>#{{ $order->id }}</td>
                            <td>${{ number_format($order->subtotal, 2) }}</td>
                            <td>{{ $order->created_at->format('M d, Y') }}</td>
                            <td>{{ $order->items->sum('quantity') }} units</td>
                            <td>Order</td>
                            <td>
                                <span class="status-badge status-received">{{ ucfirst($order->status) }}</span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 20px;">No orders yet</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        // Chart.js initialization
        const ctx = document.getElementById('salesChart').getContext('2d');
        const dailyData = @json($dailySalesData);
        
        const labels = dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const data = dailyData.map(d => parseFloat(d.total));
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales',
                    data: data,
                    borderColor: '#753bbd',
                    backgroundColor: 'rgba(117, 59, 189, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#753bbd',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: function(value) { return '$' + value; } } }
                }
            }
        });
        
        // Time filter buttons
        document.querySelectorAll('.time-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.time-filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // TODO: Implement period filtering
            });
        });
    </script>
</body>
</html>

