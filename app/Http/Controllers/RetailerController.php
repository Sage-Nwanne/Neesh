<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RetailerProfile;
use App\Models\Magazine;
use App\Models\RetailerAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;


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
            //code...
        $validated = $request->validate([
            // Step 1
            'buyer_name' => 'required|string|max:255',
            'email_address' => 'required|email|unique:users,email',
            'phone_number' => 'required|string|max:20',
            'password' => 'required|string|min:6',

            // Step 2
            'storename' => 'required|string|max:255',
            'bussinesyears' => 'nullable|integer|min:0',
            'storecategory' => 'nullable|string|max:255',
            'store_type' => 'nullable|string|max:255',
            'store_size' => 'nullable|string|max:255',

            // Step 3
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip_code' => 'required|string|max:20',

            // Step 4
            'target_customers' => 'nullable|array',
            'store_aesthetic' => 'nullable|array',
            'interested_genres' => 'nullable|array',

            // Step 5
            'pos_system' => 'nullable|string|max:255',
            'issue_frequency' => 'nullable|string|max:255',
            'monthly_budget' => 'nullable|numeric',
            'magazine_titles' => 'nullable|string',
            'magazine_sources' => 'nullable|array',
            'mag_other_input' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Step 1 — Create user
            $user = User::create([
                'name' => $validated['buyer_name'],
                'email' => $validated['email_address'],
                'password' => Hash::make($validated['password']),
            ]);

            $user->assignRole('retailer'); // if Spatie roles are in use

            // Step 2–5 — Create retailer profile
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

            // Step 3 — Create address
            RetailerAddress::create([
                'retailer_id' => $profile->id,
                'address_line1' => $validated['address_line1'],
                'address_line2' => $validated['address_line2'] ?? null,
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip_code' => $validated['zip_code'],
                'country' => 'US', // optional
            ]);
        });
        return redirect()->back()->with('success', 'Retailer created successfully!');
  
    } catch (\Exception $e) {
            //throw $th;
        return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());

        }

    }
}

