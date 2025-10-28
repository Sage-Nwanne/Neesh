@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <h2>Account Settings</h2>
    
    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>Admin Account Information</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label"><strong>Name:</strong></label>
                        <p>{{ auth()->user()->name }}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label"><strong>Email:</strong></label>
                        <p>{{ auth()->user()->email }}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label"><strong>Role:</strong></label>
                        <p>
                            @foreach (auth()->user()->roles as $role)
                                <span class="badge bg-primary">{{ ucfirst($role->name) }}</span>
                            @endforeach
                        </p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label"><strong>Account Status:</strong></label>
                        <p>
                            @if (auth()->user()->email_verified_at)
                                <span class="badge bg-success">Verified</span>
                            @else
                                <span class="badge bg-warning">Pending Verification</span>
                            @endif
                        </p>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h5>Account Actions</h5>
                </div>
                <div class="card-body">
                    <a href="{{ route('profile.edit') }}" class="btn btn-primary">Edit Profile</a>
                    <a href="{{ route('password.update') }}" class="btn btn-secondary">Change Password</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

