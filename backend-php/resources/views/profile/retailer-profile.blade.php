@extends('layouts.app')

@section('content')
<div class="profile-container">
    <!-- Profile Header -->
    <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
            <div class="profile-avatar">
                @if($retailer->logo)
                    <img src="{{ asset('storage/' . $retailer->logo) }}" alt="{{ $retailer->company_name }}">
                @else
                    <div class="avatar-placeholder">{{ substr($retailer->company_name, 0, 1) }}</div>
                @endif
            </div>
            <div class="profile-details">
                <h1>{{ $retailer->company_name }}</h1>
                <p class="profile-type">Retailer</p>
                @if($retailer->website)
                    <a href="{{ $retailer->website }}" target="_blank" class="profile-website">{{ $retailer->website }}</a>
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
                <p>{{ $retailer->description ?? 'No description provided.' }}</p>
            </div>

            <div class="sidebar-card">
                <h3>Contact Information</h3>
                @if($retailer->phone)
                    <div class="contact-item">
                        <span class="label">Phone</span>
                        <span class="value">{{ $retailer->phone }}</span>
                    </div>
                @endif
                <div class="contact-item">
                    <span class="label">Email</span>
                    <span class="value">{{ $retailer->user->email }}</span>
                </div>
            </div>

            @if($retailer->social_media)
            <div class="sidebar-card">
                <h3>Follow</h3>
                <div class="social-links">
                    @php
                        $socials = is_string($retailer->social_media) ? json_decode($retailer->social_media, true) : $retailer->social_media;
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
                    <div class="stat-number">{{ $storeCount }}</div>
                    <div class="stat-label">Stores</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ $retailer->created_at->diffInMonths(now()) }}</div>
                    <div class="stat-label">Months Active</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ $retailer->stores()->count() }}</div>
                    <div class="stat-label">Connected Platforms</div>
                </div>
            </div>

            <!-- Stores Section -->
            <section class="stores-section">
                <h2>Connected Stores</h2>
                <div class="stores-list">
                    @forelse($retailer->stores as $store)
                        <div class="store-card">
                            <div class="store-header">
                                <h3>{{ $store->store_name }}</h3>
                                <span class="platform-badge">{{ ucfirst($store->platform) }}</span>
                            </div>
                            <div class="store-details">
                                <p class="store-url">
                                    <a href="{{ $store->store_url }}" target="_blank">{{ $store->store_url }}</a>
                                </p>
                                <p class="store-status">
                                    <span class="status-indicator {{ $store->status === 'active' ? 'active' : 'inactive' }}"></span>
                                    {{ ucfirst($store->status) }}
                                </p>
                            </div>
                        </div>
                    @empty
                        <p class="no-stores">No connected stores yet.</p>
                    @endforelse
                </div>
            </section>

            <!-- About Section -->
            <section class="about-section">
                <h2>About {{ $retailer->company_name }}</h2>
                <div class="about-content">
                    <p>{{ $retailer->description ?? 'No additional information provided.' }}</p>
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

.stores-section h2,
.about-section h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.stores-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.store-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.store-card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.store-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.store-header h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
}

.platform-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #753bbd;
    color: white;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
}

.store-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.store-url a {
    color: #753bbd;
    text-decoration: none;
    font-size: 13px;
    word-break: break-all;
}

.store-url a:hover {
    text-decoration: underline;
}

.store-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
}

.status-indicator.active {
    background: #4caf50;
}

.no-stores {
    grid-column: 1 / -1;
    text-align: center;
    color: #999;
    padding: 40px;
}

.about-section {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.about-content {
    color: #666;
    line-height: 1.8;
    font-size: 15px;
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

    .stores-list {
        grid-template-columns: 1fr;
    }
}
</style>
@endsection

