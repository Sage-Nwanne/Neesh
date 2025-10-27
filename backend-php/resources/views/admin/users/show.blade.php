@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <h2>User Details</h2>

    <div class="card p-4 shadow-sm mt-3">
        <h4>User Info</h4>
        <p><strong>Name:</strong> {{ $user->name }}</p>
        <p><strong>Email:</strong> {{ $user->email }}</p>
        <p><strong>Role:</strong> {{ ucfirst($user->roles->pluck('name')->first()) }}</p>
        <p><strong>Status:</strong> 
            @if($user->email_verified_at)
                ✅ Verified ({{ $user->email_verified_at->format('d M Y') }})
            @else
                ❌ Not Verified
            @endif
        </p>
    </div>

    {{-- Publisher Profile --}}
    @if($user->hasRole('publisher') && $user->publisherProfile)
    <div class="card p-4 shadow-sm mt-4">
        <h4>Publisher Profile</h4>
        <p><strong>Business Name:</strong> {{ $user->publisherProfile->company_name }}</p>
        <p><strong>Payout Email:</strong> {{ $user->publisherProfile->payout_email }}</p>
    </div>

    {{-- Payment Details --}}
    @if($user->paymentDetails)
    <div class="card p-4 shadow-sm mt-4">
        <h4>Payment & Payout Details</h4>
        <p><strong>Preferred Payout Method:</strong> {{ $user->paymentDetails->preferred_payout_method ?? '—' }}</p>
        <p><strong>Account Holder Name:</strong> {{ $user->paymentDetails->account_holder_name ?? '—' }}</p>
        <p><strong>IBAN:</strong> {{ $user->paymentDetails->account_number_iban ?? '—' }}</p>
        <p><strong>SWIFT Code:</strong> {{ $user->paymentDetails->routing_swift_code ?? '—' }}</p>
        <p><strong>Business Address:</strong> {{ $user->paymentDetails->business_address ?? '—' }}</p>
        <p><strong>Tax ID:</strong> {{ $user->paymentDetails->tax_id ?? '—' }}</p>
        <p><strong>Currency:</strong> {{ $user->paymentDetails->currency_preference ?? 'USD' }}</p>
        <p><strong>Payment Contact Email:</strong> {{ $user->paymentDetails->payment_contact_email ?? '—' }}</p>
    </div>
    @endif

    {{-- Magazines --}}
    @if($user->publisherProfile->magazines->count())
    <div class="card p-4 shadow-sm mt-4">
        <h4>Magazine Information</h4>
        @foreach($user->publisherProfile->magazines as $magazine)
            <div class="border rounded p-3 mb-4">
                <p><strong>Title:</strong> {{ $magazine->title_name }}</p>
                <p><strong>Description:</strong> {{ $magazine->description }}</p>
                <p><strong>Type:</strong> {{ ucfirst($magazine->type) }}</p>
                <p><strong>Print Run:</strong> {{ $magazine->total_printed }}</p>
                <p><strong>Available Stock:</strong> {{ $magazine->stock }}</p>
                <p><strong>Wholesale Price:</strong> ${{ $magazine->wholesale_price }}</p>
                <p><strong>Retail Price:</strong> ${{ $magazine->msrp }}</p>
                <p><strong>Fulfillment Method:</strong> {{ $magazine->fulfillment_method }}</p>
                <p><strong>Genre:</strong> {{ $magazine->genres }}</p>
                <p><strong>Return Policy:</strong> {{ $magazine->return_policy }}</p>
                <p><strong>Promotional Text:</strong> {{ $magazine->promotional_text }}</p>

                @if($magazine->images->count())
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        @foreach($magazine->images as $img)
                            <img src="{{ asset('storage/' . $img->image_path) }}" alt="Magazine Image" width="120" class="rounded shadow-sm">
                        @endforeach
                    </div>
                @endif
            </div>
        @endforeach
    </div>
    @endif
    @endif

    {{-- Retailer Profile --}}
    @if($user->hasRole('retailer') && $user->retailerProfile)
    <div class="card p-4 shadow-sm mt-4">
        <h4>Retailer Profile</h4>
        <p><strong>Store Name:</strong> {{ $user->retailerProfile->store_name }}</p>
        <p><strong>Business Years:</strong> {{ $user->retailerProfile->business_years ?? '—' }}</p>
        <p><strong>Store Category:</strong> {{ $user->retailerProfile->store_category ?? '—' }}</p>
        <p><strong>Store Type:</strong> {{ $user->retailerProfile->store_type ?? '—' }}</p>
        <p><strong>Store Size:</strong> {{ $user->retailerProfile->store_size ?? '—' }}</p>
        <p><strong>Target Customers:</strong> {{ implode(', ', $user->retailerProfile->target_customers ?? []) }}</p>
        <p><strong>Store Aesthetic:</strong> {{ implode(', ', $user->retailerProfile->store_aesthetic ?? []) }}</p>
        <p><strong>Interested Genres:</strong> {{ implode(', ', $user->retailerProfile->interested_genres ?? []) }}</p>
        <p><strong>POS System:</strong> {{ $user->retailerProfile->pos_system ?? '—' }}</p>
        <p><strong>Issue Frequency:</strong> {{ $user->retailerProfile->issue_frequency ?? '—' }}</p>
        <p><strong>Monthly Budget:</strong> {{ $user->retailerProfile->monthly_budget ?? '—' }}</p>
    </div>
    @endif

    <div class="mt-4">
        @if(!$user->email_verified_at)
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <form action="{{ route('admin.users.approve', $user->id) }}" method="POST" style="display: inline;">
                @csrf
                <button type="submit" class="btn btn-success">Approve Application</button>
            </form>

            <button class="btn btn-danger" onclick="showRejectModal()">Reject Application</button>
        </div>
        @else
            <div style="display: flex; gap: 10px; align-items: center;">
                <button class="btn btn-secondary" disabled>Already Approved</button>
                <a href="{{ route('admin.users') }}" class="btn btn-link">← Back to Users List</a>
            </div>
        @endif
    </div>

    <!-- Reject Modal -->
    <div id="rejectModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; width: 90%;">
            <h4>Reject Application</h4>
            <p>Are you sure you want to reject this application?</p>
            <form action="{{ route('admin.users.reject', $user->id) }}" method="POST">
                @csrf
                <div style="margin-bottom: 15px;">
                    <label for="reason" style="display: block; margin-bottom: 5px;">Reason (optional):</label>
                    <textarea name="reason" id="reason" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: Arial, sans-serif;" rows="4" placeholder="Provide a reason for rejection..."></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="hideRejectModal()">Cancel</button>
                    <button type="submit" class="btn btn-danger">Confirm Rejection</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function showRejectModal() {
            document.getElementById('rejectModal').style.display = 'flex';
        }
        function hideRejectModal() {
            document.getElementById('rejectModal').style.display = 'none';
        }
    </script>
</div>
@endsection
