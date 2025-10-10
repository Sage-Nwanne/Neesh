<?php

namespace App\Http\Controllers;

use App\Models\User;

class AdminController extends Controller
{
    public function verifyUser($id)
    {
        $user = User::findOrFail($id);

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified(); // Laravel built-in
        }

        return redirect()->route('home') // or admin dashboard
            ->with('status', 'User verified successfully!');
    }
}
