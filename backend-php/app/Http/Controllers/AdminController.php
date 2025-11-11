<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationApproved;
use App\Mail\ApplicationRejected;
use App\Services\AuthProvisioning;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected AuthProvisioning $authProvisioning;

    public function __construct(AuthProvisioning $authProvisioning)
    {
        $this->authProvisioning = $authProvisioning;
    }

    public function usersList(Request $request)
    {
        $query = User::with('roles');

        // Filter by verification status
        $verificationFilter = $request->get('verification', 'all');
        if ($verificationFilter === 'verified') {
            $query->whereNotNull('email_verified_at');
        } elseif ($verificationFilter === 'pending') {
            $query->whereNull('email_verified_at');
        }

        // Filter by verification date range
        $dateFilter = $request->get('date_filter', 'all');
        if ($dateFilter !== 'all') {
            $now = now();
            switch ($dateFilter) {
                case 'this_week':
                    $query->whereNotNull('email_verified_at')
                        ->whereBetween('email_verified_at', [$now->startOfWeek(), $now->endOfWeek()]);
                    break;
                case 'this_month':
                    $query->whereNotNull('email_verified_at')
                        ->whereBetween('email_verified_at', [$now->startOfMonth(), $now->endOfMonth()]);
                    break;
                case 'last_6_months':
                    $query->whereNotNull('email_verified_at')
                        ->where('email_verified_at', '>=', $now->subMonths(6));
                    break;
                case 'this_year':
                    $query->whereNotNull('email_verified_at')
                        ->whereBetween('email_verified_at', [$now->startOfYear(), $now->endOfYear()]);
                    break;
            }
        }

        // Search by email
        $searchEmail = $request->get('search_email');
        if ($searchEmail) {
            $query->where('email', 'like', '%' . $searchEmail . '%');
        }

        $users = $query->get();
        return view('admin.users.index', compact('users', 'verificationFilter', 'dateFilter', 'searchEmail'));
    }

    // ✅ View single user details
    public function viewUser($id)
    {
        $user = User::with(['roles', 'publisherProfile.magazines.images', 'paymentDetails'])->findOrFail($id);
        return view('admin.users.show', compact('user'));
    }


    // ✅ Verify user
    public function verifyUser($id)
    {
        $user = User::findOrFail($id);

        // Set email verified timestamp if not already set
        if (is_null($user->email_verified_at)) {
            $user->email_verified_at = now();
            $user->save();
        }

        return redirect()->route('admin.users')->with('success', 'User verified successfully!');
    }

    public function dashboard()
    {
        // Fetch all users for admin overview
        $users = User::all();
        return view('admin.dashboard', compact('users'));
    }

    // ✅ Approve user application with credential provisioning
    public function approveUser($id)
    {
        $user = User::findOrFail($id);

        // Mark email as verified
        if (is_null($user->email_verified_at)) {
            $user->email_verified_at = now();
            $user->save();
        }

        // Get user role
        $role = $user->roles->pluck('name')->first() ?? 'user';

        try {
            // Provision login credentials (magic link or temporary password)
            $provisioningData = $this->authProvisioning->provisionUser($user, $role);
            
            // Extract provisioning info
            $loginLink = $provisioningData['loginLink'] ?? null;
            $tempCreds = $provisioningData['tempCreds'] ?? null;
            $authMode = $provisioningData['authMode'] ?? 'password';
            $dashboardUrl = $this->authProvisioning->getDashboardUrl();

            // Send approval email with login credentials
            Mail::to($user->email)->send(
                new ApplicationApproved(
                    $user,
                    $role,
                    $loginLink,
                    $tempCreds,
                    $authMode,
                    $dashboardUrl
                )
            );

            return redirect()->route('admin.users.view', $user->id)
                ->with('success', 'User approved successfully! Approval email with login details sent.');
        } catch (\Exception $e) {
            \Log::error('Error approving user', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->route('admin.users.view', $user->id)
                ->with('error', 'User approved but error sending email: ' . $e->getMessage());
        }
    }

    // ✅ Reject user application
    public function rejectUser($id, Request $request)
    {
        $user = User::findOrFail($id);

        // Get user role
        $role = $user->roles->pluck('name')->first() ?? 'user';

        // Get rejection reason from request
        $reason = $request->input('reason', null);

        // Send rejection email
        Mail::to($user->email)->send(new ApplicationRejected($user, $role, $reason));

        // Optionally delete the user or mark as rejected
        // For now, we'll just send the email and keep the user record
        // You can add a 'status' column to users table if needed

        return redirect()->route('admin.users.view', $user->id)
            ->with('success', 'User rejected. Rejection email sent.');
    }

    // ✅ Admin Messages Page
    public function messages()
    {
        // TODO: Implement messaging functionality
        // This page will show messages sent to hi@neesh.art and message threads
        return view('admin.messages');
    }

    // ✅ Revoke/Unverify user account
    public function revokeUser($id)
    {
        $user = User::findOrFail($id);

        // Get user role
        $role = $user->roles->pluck('name')->first() ?? 'user';

        // Unverify the user
        $user->email_verified_at = null;
        $user->save();

        // Send account revoked email
        Mail::to($user->email)->send(new \App\Mail\AccountRevoked($user, $role));

        return redirect()->route('admin.users.view', $user->id)
            ->with('success', 'User account revoked successfully! Revocation email sent.');
    }

    // ✅ Admin Account Page
    public function account()
    {
        // TODO: Implement admin account settings
        // This page will show admin account details and settings
        return view('admin.account');
    }
}

