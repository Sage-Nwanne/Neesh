<div class="magazine-card">
    <a href="{{ route('magazines.show', $magazine->id) }}" style="text-decoration: none; color: inherit;">
        <div class="magazine-image">
            @if($magazine->images->count() > 0)
                <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}" alt="{{ $magazine->title_name }}" style="width: 100%; height: 100%; object-fit: cover;">
            @else
                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #753bbd 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">
                    No Image
                </div>
            @endif
        </div>
        <div class="magazine-info">
            <div class="magazine-title">{{ $magazine->title_name }}</div>
            <div class="magazine-issue">{{ $magazine->issue_identifier ?? 'Single Issue' }}</div>
            <div class="magazine-price">${{ number_format($magazine->msrp ?? 0, 2) }}</div>
        </div>
    </a>
    <div class="magazine-actions">
        @auth
            <button class="btn-bookmark" data-magazine-id="{{ $magazine->id }}" style="background: none; border: none; cursor: pointer; padding: 8px; color: #753bbd;">
                <i class="fas fa-bookmark" style="font-size: 18px;"></i>
            </button>
        @else
            <a href="{{ route('login') }}" style="background: none; border: none; cursor: pointer; padding: 8px; color: #753bbd; text-decoration: none;">
                <i class="fas fa-bookmark" style="font-size: 18px;"></i>
            </a>
        @endauth
    </div>
</div>

