<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationApproved;
use App\Mail\ApplicationRejected;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function usersList()
    {
        $users = User::with('roles')->get(); // includes role info from spatie
        return view('admin.users.index', compact('users'));
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

    // ✅ Approve user application
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

        // Send approval email
        Mail::to($user->email)->send(new ApplicationApproved($user, $role));

        return redirect()->route('admin.users.view', $user->id)
            ->with('success', 'User approved successfully! Approval email sent.');
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

    // ✅ Admin Account Page
    public function account()
    {
        // TODO: Implement admin account settings
        // This page will show admin account details and settings
        return view('admin.account');
    }
}
