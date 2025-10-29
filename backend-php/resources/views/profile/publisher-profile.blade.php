@extends('layouts.app')

@section('content')
<div class="profile-container">
    <!-- Profile Header -->
    <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
            <div class="profile-avatar">
                @if($publisher->logo)
                    <img src="{{ asset('storage/' . $publisher->logo) }}" alt="{{ $publisher->company_name }}">
                @else
                    <div class="avatar-placeholder">{{ substr($publisher->company_name, 0, 1) }}</div>
                @endif
            </div>
            <div class="profile-details">
                <h1>{{ $publisher->company_name }}</h1>
                <p class="profile-type">Publisher</p>
                @if($publisher->website)
                    <a href="{{ $publisher->website }}" target="_blank" class="profile-website">{{ $publisher->website }}</a>
                @endif
            </div>
        </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
        <!-- Left Sidebar -->
        <aside class="profile-sidebar">
            <div class="sidebar-card">
                <h3>About</h3>
                <p>{{ $publisher->description ?? 'No description provided.' }}</p>
            </div>

            <div class="sidebar-card">
                <h3>Contact Information</h3>
                @if($publisher->phone)
                    <div class="contact-item">
                        <span class="label">Phone</span>
                        <span class="value">{{ $publisher->phone }}</span>
                    </div>
                @endif
                <div class="contact-item">
                    <span class="label">Email</span>
                    <span class="value">{{ $publisher->user->email }}</span>
                </div>
            </div>

            @if($publisher->social_media)
            <div class="sidebar-card">
                <h3>Follow</h3>
                <div class="social-links">
                    @php
                        $socials = is_string($publisher->social_media) ? json_decode($publisher->social_media, true) : $publisher->social_media;
                    @endphp
                    @foreach($socials as $platform => $url)
                        @if($url)
                            <a href="{{ $url }}" target="_blank" class="social-link" title="{{ ucfirst($platform) }}">
                                {{ ucfirst($platform) }}
                            </a>
                        @endif
                    @endforeach
                </div>
            </div>
            @endif
        </aside>

        <!-- Main Content -->
        <main class="profile-main">
            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">{{ $publishedCount }}</div>
                    <div class="stat-label">Published Titles</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ $totalSales }}</div>
                    <div class="stat-label">Total Sales</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ $publisher->created_at->diffInMonths(now()) }}</div>
                    <div class="stat-label">Months Active</div>
                </div>
            </div>

            <!-- Titles Section -->
            <section class="titles-section">
                <h2>Published Titles</h2>
                <div class="titles-grid">
                    @forelse($publisher->magazines->where('archived_at', null) as $magazine)
                        <div class="title-card">
                            <div class="title-image">
                                @if($magazine->cover_image)
                                    <img src="{{ asset('storage/' . $magazine->cover_image) }}" 
                                         alt="{{ $magazine->title_name }}"
                                         onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                                @else
                                    <img src="https://via.placeholder.com/200x300?text=No+Image" alt="Placeholder">
                                @endif
                            </div>
                            <div class="title-info">
                                <h3>{{ $magazine->title_name }}</h3>
                                <p class="issue">{{ $magazine->issue_identifier ?? 'Issue' }}</p>
                                <p class="price">${{ number_format($magazine->wholesale_price, 2) }}</p>
                                <a href="{{ route('magazines.show', $magazine->id) }}" class="btn-view">View Details</a>
                            </div>
                        </div>
                    @empty
                        <p class="no-titles">No published titles yet.</p>
                    @endforelse
                </div>
            </section>
        </main>
    </div>
</div>

<style>
.profile-container {
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Manrope', sans-serif;
}

.profile-header {
    position: relative;
    margin-bottom: 40px;
}

.profile-cover {
    height: 300px;
    background: linear-gradient(135deg, #753bbd 0%, #5a2d8f 100%);
    border-radius: 12px;
    margin-bottom: -60px;
}

.profile-info {
    display: flex;
    align-items: flex-end;
    gap: 30px;
    padding: 0 40px;
    position: relative;
    z-index: 1;
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    background: white;
    border: 4px solid white;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    background: #753bbd;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 700;
}

.profile-details h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 5px;
}

.profile-type {
    color: #999;
    font-size: 14px;
    margin-bottom: 10px;
}

.profile-website {
    color: #753bbd;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
}

.profile-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 40px;
    padding: 0 40px;
}

.sidebar-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-card h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    color: #1a1a1a;
}

.sidebar-card p {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
}

.contact-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.contact-item:last-child {
    border-bottom: none;
}

.contact-item .label {
    font-weight: 600;
    color: #999;
    font-size: 13px;
}

.contact-item .value {
    color: #1a1a1a;
    font-size: 13px;
}

.social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.social-link {
    display: inline-block;
    padding: 8px 16px;
    background: #f0f0f0;
    color: #753bbd;
    text-decoration: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: #753bbd;
    color: white;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-number {
    font-size: 32px;
    font-weight: 700;
    color: #753bbd;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 14px;
    color: #999;
}

.titles-section h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.titles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.title-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.title-card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.title-image {
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: #f0f0f0;
}

.title-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.title-info {
    padding: 15px;
}

.title-info h3 {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.issue {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
}

.price {
    font-size: 16px;
    font-weight: 700;
    color: #753bbd;
    margin-bottom: 10px;
}

.btn-view {
    display: block;
    text-align: center;
    padding: 8px;
    background: #753bbd;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-view:hover {
    background: #5a2d8f;
}

.no-titles {
    grid-column: 1 / -1;
    text-align: center;
    color: #999;
    padding: 40px;
}

@media (max-width: 768px) {
    .profile-content {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0 20px;
    }

    .titles-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
}
</style>
@endsection

