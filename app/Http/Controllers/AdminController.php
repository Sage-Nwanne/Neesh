<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\PublisherApprovalNotification;
use Illuminate\Support\Facades\Mail;

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

            // Send approval email to user
            $dashboardUrl = route('dashboard');
            Mail::to($user->email)->send(new PublisherApprovalNotification($user, $dashboardUrl));
        }

        return redirect()->route('admin.users')->with('success', 'User verified successfully! Approval email sent.');
    }

    // ✅ Reject user
    public function rejectUser($id)
    {
        $user = User::findOrFail($id);

        // Delete the user and related data
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'Publisher submission rejected and user account deleted.');
    }

    public function dashboard()
    {
        // Fetch pending publisher applications (unverified publishers)
        $publisherApplications = User::with(['publisherProfile.magazines.images', 'paymentDetails'])
            ->whereHas('roles', fn($q) => $q->where('name', 'publisher'))
            ->where('email_verified_at', null)
            ->orderBy('created_at', 'desc')
            ->get();

        // Fetch pending retailer applications (unverified retailers)
        $retailerApplications = User::with('retailerProfile')
            ->whereHas('roles', fn($q) => $q->where('name', 'retailer'))
            ->where('email_verified_at', null)
            ->orderBy('created_at', 'desc')
            ->get();

        // Fetch all users for admin overview
        $users = User::all();

        return view('admin.dashboard', compact('users', 'publisherApplications', 'retailerApplications'));
    }
    // public function verifyUser($id)
    // {
    //     $user = User::findOrFail($id);

    //     if (! $user->hasVerifiedEmail()) {
    //         $user->markEmailAsVerified(); // Laravel built-in
    //     }

    //     return redirect()->route('home') // or admin dashboard
    //         ->with('status', 'User verified successfully!');
    // }
}
