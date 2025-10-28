@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <h2>All Users</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <!-- Filters and Search -->
    <div class="card p-4 mb-4">
        <form method="GET" action="{{ route('admin.users') }}" class="row g-3">
            <!-- Verification Status Filter -->
            <div class="col-md-3">
                <label for="verification" class="form-label">Verification Status</label>
                <select class="form-select" id="verification" name="verification">
                    <option value="all" {{ $verificationFilter === 'all' ? 'selected' : '' }}>All Users</option>
                    <option value="verified" {{ $verificationFilter === 'verified' ? 'selected' : '' }}>Verified Only</option>
                    <option value="pending" {{ $verificationFilter === 'pending' ? 'selected' : '' }}>Pending Only</option>
                </select>
            </div>

            <!-- Date Filter (only shows when verified is selected) -->
            <div class="col-md-3">
                <label for="date_filter" class="form-label">Verified Date Range</label>
                <select class="form-select" id="date_filter" name="date_filter">
                    <option value="all" {{ $dateFilter === 'all' ? 'selected' : '' }}>All Dates</option>
                    <option value="this_week" {{ $dateFilter === 'this_week' ? 'selected' : '' }}>This Week</option>
                    <option value="this_month" {{ $dateFilter === 'this_month' ? 'selected' : '' }}>This Month</option>
                    <option value="last_6_months" {{ $dateFilter === 'last_6_months' ? 'selected' : '' }}>Last 6 Months</option>
                    <option value="this_year" {{ $dateFilter === 'this_year' ? 'selected' : '' }}>This Year</option>
                </select>
            </div>

            <!-- Email Search -->
            <div class="col-md-4">
                <label for="search_email" class="form-label">Search by Email</label>
                <input type="text" class="form-control" id="search_email" name="search_email" placeholder="Enter email..." value="{{ $searchEmail ?? '' }}">
            </div>

            <!-- Submit Button -->
            <div class="col-md-2 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">Filter</button>
            </div>
        </form>
    </div>

    <!-- Users Table -->
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
            @forelse($users as $user)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>{{ ucfirst($user->roles->pluck('name')->first()) ?? 'N/A' }}</td>
                <td>
                    @if($user->email_verified_at)
                        <span class="badge bg-success">Verified</span>
                    @else
                        <span class="badge bg-warning">Pending</span>
                    @endif
                </td>
                <td>
                    <a href="{{ route('admin.users.view', $user->id) }}" class="btn btn-sm btn-primary">View</a>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center text-muted">No users found matching your filters.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
