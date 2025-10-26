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
        <div class="magazine-publisher">
            <a href="{{ route('publisher.profile', $magazine->publisher_id) }}" style="color: #999; text-decoration: none;">
                {{ $magazine->publisher->company_name ?? 'Unknown Publisher' }}
            </a>
        </div>
        <div class="magazine-price">${{ number_format($magazine->msrp ?? 0, 2) }}</div>
        <div class="magazine-actions">
            <button class="btn-small btn-view" data-magazine-id="{{ $magazine->id }}">View</button>
            <button class="btn-small btn-bookmark {{ $isBookmarked ? 'bookmarked' : '' }}" data-magazine-id="{{ $magazine->id }}">
                {{ $isBookmarked ? '✓ Bookmarked' : 'Bookmark' }}
            </button>
        </div>
    </div>
</div>

