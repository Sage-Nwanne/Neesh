<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RetailerProfile;
use App\Models\Magazine;
use App\Models\RetailerAddress;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ApplicationConfirmation;


class RetailerController extends Controller
{
     public function dashboard()
    {
        $retailerProfile = RetailerProfile::where('user_id', auth()->id())->first();
        // $stores = RetailerStore::where('retailer_id', $retailerProfile->id)->get();
    $magazines = Magazine::with('images')->get();
        return view('retailer.dashboard', compact('magazines', 'retailerProfile'));
    }
   public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'buyer_name' => 'required|string|max:255',
            'email_address' => 'required|email|unique:users,email',
            'phone_number' => 'required|string|max:20',
            'password' => 'required|string|min:6',
            'storename' => 'required|string|max:255',
            'bussinesyears' => 'nullable|integer|min:0',
            'storecategory' => 'nullable|string|max:255',
            'store_type' => 'nullable|string|max:255',
            'store_size' => 'nullable|string|max:255',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip_code' => 'required|string|max:20',
            'target_customers' => 'nullable|array',
            'store_aesthetic' => 'nullable|array',
            'interested_genres' => 'nullable|array',
            'pos_system' => 'nullable|string|max:255',
            'issue_frequency' => 'nullable|string|max:255',
            'monthly_budget' => 'nullable|numeric',
            'magazine_titles' => 'nullable|string',
            'magazine_sources' => 'nullable|array',
            'mag_other_input' => 'nullable|string|max:255',
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['buyer_name'],
                'email' => $validated['email_address'],
                'password' => Hash::make($validated['password']),
            ]);

            $user->assignRole('retailer');

            $profile = RetailerProfile::create([
                'user_id' => $user->id,
                'store_name' => $validated['storename'],
                'business_years' => $validated['bussinesyears'] ?? null,
                'store_category' => $validated['storecategory'] ?? null,
                'store_type' => $validated['store_type'] ?? null,
                'store_size' => $validated['store_size'] ?? null,
                'target_customers' => $validated['target_customers'] ?? [],
                'store_aesthetic' => $validated['store_aesthetic'] ?? [],
                'interested_genres' => $validated['interested_genres'] ?? [],
                'pos_system' => $validated['pos_system'] ?? null,
                'issue_frequency' => $validated['issue_frequency'] ?? null,
                'monthly_budget' => $validated['monthly_budget'] ?? null,
                'magazine_titles' => $validated['magazine_titles'] ?? null,
                'magazine_sources' => $validated['magazine_sources'] ?? [],
                'mag_other_input' => $validated['mag_other_input'] ?? null,
            ]);

            RetailerAddress::create([
                'retailer_id' => $profile->id,
                'address_line1' => $validated['address_line1'],
                'address_line2' => $validated['address_line2'] ?? null,
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip_code' => $validated['zip_code'],
                'country' => 'US',
            ]);

            return $user;
        });

        // Send confirmation email to user (wrapped in try-catch to prevent error display)
        try {
            Mail::to($user->email)->send(new ApplicationConfirmation($user, 'retailer'));
        } catch (\Exception $mailException) {
            Log::error('Confirmation email failed to send', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $mailException->getMessage(),
            ]);
            // Don't expose mail errors to user - email may still be queued
        }

        event(new Registered($user));
        Auth::login($user);

        return redirect(RouteServiceProvider::HOME)
            ->with('success', 'Retailer registered successfully! You will receive a confirmation email from admin shortly.');

    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
    }
}


    public function updateaddress(Request $request)
{
    $request->validate([
        'address_line1' => 'required|string|max:255',
        'address_line2' => 'nullable|string|max:255',
        'city' => 'required|string|max:100',
        'state' => 'nullable|string|max:100',
        'zip_code' => 'nullable|string|max:20',
        'country' => 'nullable|string|max:100',
    ]);

    $address = RetailerAddress::find($request->address_id);

    if (!$address || $address->retailer_id !== auth()->user()->retailerProfile->id) {
        abort(403, 'Unauthorized');
    }

    $address->update($request->only([
        'address_line1', 'address_line2', 'city', 'state', 'zip_code', 'country'
    ]));

    return redirect()->back()->with('success', 'Address updated successfully.');
}

}

