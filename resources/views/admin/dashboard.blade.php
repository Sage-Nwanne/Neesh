@extends('layouts.app')

@section('content')
<style>
    .application-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: box-shadow 0.3s ease;
    }
    .application-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 15px;
    }
    .app-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }
    .app-subtitle {
        font-size: 13px;
        color: #666;
        margin-top: 3px;
    }
    .app-status {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    .status-pending {
        background-color: #fff3cd;
        color: #856404;
    }
    .status-approved {
        background-color: #d4edda;
        color: #155724;
    }
    .app-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 15px;
    }
    .detail-item {
        font-size: 13px;
    }
    .detail-label {
        color: #666;
        font-weight: 500;
        margin-bottom: 3px;
    }
    .detail-value {
        color: #333;
        word-break: break-word;
    }
    .app-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;
    }
    .btn-action {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .btn-view {
        background-color: #007bff;
        color: white;
    }
    .btn-view:hover {
        background-color: #0056b3;
    }
    .btn-approve {
        background-color: #28a745;
        color: white;
    }
    .btn-approve:hover {
        background-color: #218838;
    }
    .btn-reject {
        background-color: #dc3545;
        color: white;
    }
    .btn-reject:hover {
        background-color: #c82333;
    }
    .section-title {
        font-size: 20px;
        font-weight: 600;
        margin-top: 30px;
        margin-bottom: 20px;
        color: #333;
    }
    .no-applications {
        text-align: center;
        padding: 40px;
        color: #999;
        font-size: 14px;
    }
</style>

<div class="container mt-5">
    <h2>Applications Management</h2>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <!-- Publisher Applications Section -->
    <div class="section-title">📰 Publisher Applications</div>
    @if ($publisherApplications->count() > 0)
        @foreach ($publisherApplications as $application)
            <div class="application-card">
                <div class="app-header">
                    <div>
                        <div class="app-title">
                            PUBLISHER - {{ $application->name }} - {{ $application->email }}
                        </div>
                        <div class="app-subtitle">
                            Submitted at: {{ $application->created_at->format('m/d/Y, g:i A') }}
                        </div>
                    </div>
                    <div class="app-status">
                        <span class="status-badge status-pending">PENDING</span>
                    </div>
                </div>

                @if ($application->publisherProfile)
                    <div class="app-details">
                        <div class="detail-item">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">{{ $application->email }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Business Name</div>
                            <div class="detail-value">{{ $application->publisherProfile->company_name ?? 'N/A' }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Payout Email</div>
                            <div class="detail-value">{{ $application->publisherProfile->payout_email ?? 'N/A' }}</div>
                        </div>
                        @if ($application->publisherProfile->magazines->count() > 0)
                            <div class="detail-item">
                                <div class="detail-label">Magazine Title</div>
                                <div class="detail-value">{{ $application->publisherProfile->magazines->first()->title_name ?? 'N/A' }}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Type</div>
                                <div class="detail-value">{{ ucfirst($application->publisherProfile->magazines->first()->type ?? 'N/A') }}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Description</div>
                                <div class="detail-value">{{ Str::limit($application->publisherProfile->magazines->first()->description ?? 'N/A', 100) }}</div>
                            </div>
                        @endif
                    </div>
                @endif

                <div class="app-actions">
                    <a href="{{ route('admin.users.view', $application->id) }}" class="btn-action btn-view">View Details</a>
                    <form method="POST" action="{{ route('admin.users.verify', $application->id) }}" style="display: inline;">
                        @csrf
                        <button type="submit" class="btn-action btn-approve">Approve</button>
                    </form>
                    <form method="POST" action="{{ route('admin.users.reject', $application->id) }}" style="display: inline;" onsubmit="return confirm('Are you sure you want to reject this application?');">
                        @csrf
                        <button type="submit" class="btn-action btn-reject">Reject</button>
                    </form>
                </div>
            </div>
        @endforeach
    @else
        <div class="no-applications">No pending publisher applications</div>
    @endif

    <!-- Retailer Applications Section -->
    <div class="section-title">🏪 Retailer Applications</div>
    @if ($retailerApplications->count() > 0)
        @foreach ($retailerApplications as $application)
            <div class="application-card">
                <div class="app-header">
                    <div>
                        <div class="app-title">
                            RETAILER - {{ $application->name }} - {{ $application->email }}
                        </div>
                        <div class="app-subtitle">
                            Submitted at: {{ $application->created_at->format('m/d/Y, g:i A') }}
                        </div>
                    </div>
                    <div class="app-status">
                        <span class="status-badge status-pending">PENDING</span>
                    </div>
                </div>

                @if ($application->retailerProfile)
                    <div class="app-details">
                        <div class="detail-item">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">{{ $application->email }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Store Name</div>
                            <div class="detail-value">{{ $application->retailerProfile->store_name ?? 'N/A' }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Store Category</div>
                            <div class="detail-value">{{ $application->retailerProfile->store_category ?? 'N/A' }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Store Type</div>
                            <div class="detail-value">{{ $application->retailerProfile->store_type ?? 'N/A' }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Business Years</div>
                            <div class="detail-value">{{ $application->retailerProfile->business_years ?? 'N/A' }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Store Size</div>
                            <div class="detail-value">{{ $application->retailerProfile->store_size ?? 'N/A' }}</div>
                        </div>
                    </div>
                @endif

                <div class="app-actions">
                    <a href="{{ route('admin.users.view', $application->id) }}" class="btn-action btn-view">View Details</a>
                    <form method="POST" action="{{ route('admin.users.verify', $application->id) }}" style="display: inline;">
                        @csrf
                        <button type="submit" class="btn-action btn-approve">Approve</button>
                    </form>
                    <form method="POST" action="{{ route('admin.users.reject', $application->id) }}" style="display: inline;" onsubmit="return confirm('Are you sure you want to reject this application?');">
                        @csrf
                        <button type="submit" class="btn-action btn-reject">Reject</button>
                    </form>
                </div>
            </div>
        @endforeach
    @else
        <div class="no-applications">No pending retailer applications</div>
    @endif

    <!-- All Users Section -->
    <div class="section-title">👥 All Users</div>
    <table class="table table-striped mt-3">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($users as $user)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ ucfirst($user->roles->pluck('name')->first()) ?? 'N/A' }}</td>
                    <td>
                        @if ($user->email_verified_at)
                            <span class="badge bg-success">Verified</span>
                        @else
                            <span class="badge bg-warning">Pending</span>
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('admin.users.view', $user->id) }}" class="btn btn-sm btn-primary">View</a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
