@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow-lg">
                <div class="card-body p-5 text-center">
                    <h2 class="mb-4">🔐 Admin Panel Access</h2>
                    
                    <p class="text-muted mb-4">
                        You are about to be redirected to the admin dashboard where you can review and manage publisher submissions.
                    </p>

                    <div class="alert alert-info mb-4">
                        <strong>Note:</strong> You will be able to:
                        <ul class="text-start mt-2">
                            <li>View all publisher submissions</li>
                            <li>Review detailed publisher information</li>
                            <li>Approve or reject publishers</li>
                            <li>Send verification emails</li>
                        </ul>
                    </div>

                    <div class="d-flex gap-3 justify-content-center">
                        <a href="{{ route('admin.redirect', ['confirmed' => 'true']) }}" class="btn btn-primary btn-lg">
                            ✅ Yes, Continue to Admin Dashboard
                        </a>

                        <a href="{{ route('home') }}" class="btn btn-secondary btn-lg">
                            ❌ Cancel
                        </a>
                    </div>

                    <hr class="my-4">

                    <p class="text-muted small">
                        <strong>Direct Access:</strong> You can also access the admin dashboard directly at
                        <code>app.neesh.art/admin/dashboard</code>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

