<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Magazine;
use App\Models\PublisherProfile;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;
use App\Models\MagazineImage; // add this on top
use App\Models\PublisherPaymentDetail;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationConfirmation;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('publisher.auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    //   public function store(Request $request): RedirectResponse
// {
//     dd($request->all());
//     try {
//         // Step 1: validate everything
//         $validated = $request->validate([
//             // user fields
//             'firstname' => ['required', 'string', 'max:255'],
//             'lastname' => ['required', 'string', 'max:255'],
//             'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
//             'password' => ['required'],

    //             // publisher profile
//             'bussinessname' => ['required', 'string', 'max:255'],

    //             // magazine fields
//             'magazine_title' => ['required', 'string', 'max:255'],
//             'magazinedescription' => ['nullable', 'string'],
//             'issue_type' => ['required', 'in:single,series'],
//             'series_issue_count' => ['nullable', 'integer'],
//             'issue_frequency' => ['nullable', 'string'],
//             'print_run' => ['required', 'integer'],
//             'available_quantities' => ['required', 'integer'],
//             'wholesale_price' => ['required', 'numeric'],
//             'retail_price' => ['required', 'numeric'],
//             'specs' => ['nullable', 'string'],
//             'fulfillment_method' => ['required', 'string'],
//             'shipping_city' => ['required', 'string'],
//             'shipping_state' => ['required', 'string'],
//             'shipping_country' => ['required', 'string'],
//             'return_policy' => ['nullable', 'string'],
//             'promotional_text' => ['nullable', 'string'],
//             'metadata' => ['nullable', 'string'],

    //             // sales experience
//             'sales_experience' => ['required', 'in:yes,no'],
//             'distribution_channels' => ['nullable', 'array'],
//             'copies_sold' => ['nullable', 'integer'],
//             'sales_feedback' => ['nullable', 'string'],
//         ]);

    //         DB::beginTransaction();

    //         // Step 2: create user
//         $user = User::create([
//             'name' => $validated['firstname'] . ' ' . $validated['lastname'],
//             'email' => $validated['email'],
//             'password' => Hash::make($validated['password']),
//         ]);
//         $user->assignRole('publisher');

    //         // Step 3: create publisher profile
//         $publisher = PublisherProfile::create([
//             'user_id' => $user->id,
//             'company_name' => $validated['bussinessname'],
//             'payout_email' => $validated['email'],
//         ]);

    //         // Step 4: create first magazine
//         $magazine = Magazine::create([
//             'publisher_id' => $publisher->id,
//             'title_name' => $validated['magazine_title'],
//             'issue_identifier' => uniqid('issue_'),
//             'description' => $validated['magazinedescription'] ?? null,
//             'type' => $validated['issue_type'] === 'series' ? 'series' : 'single_issue',
//             'series_issue_count' => $validated['series_issue_count'] ?? null,
//             'issue_frequency' => $validated['issue_frequency'] ?? null,
//             'total_printed' => $validated['print_run'],
//             'stock' => $validated['available_quantities'],
//             'wholesale_price' => $validated['wholesale_price'],
//             'msrp' => $validated['retail_price'],
//             'dimensions' => $validated['specs'] ?? null,
//             'fulfillment_method' => $validated['fulfillment_method'],
//             'return_policy' => $validated['return_policy'] ?? null,
//             'promotional_text' => $validated['promotional_text'] ?? null,
//             'metadata' => $validated['metadata'] ?? null,
//             'sales_experience' => $validated['sales_experience'] === 'yes',
//             'copies_sold' => $validated['copies_sold'] ?? 0,
//             'sales_feedback' => $validated['sales_feedback'] ?? null,
//             'retailer_fit_tags' => $validated['distribution_channels'] ? implode(',', $validated['distribution_channels']) : null,
//             'status' => 'pending',
//         ]);

    //         DB::commit();

    //         // Step 5: login + redirect
//         event(new Registered($user));
//         Auth::login($user);

    //         return redirect(RouteServiceProvider::HOME)
//             ->with('success', 'Publisher and magazine registered successfully!');

    //     } catch (\Throwable $e) {
//         DB::rollBack();

    //         // error ko log kar do
//         Log::error('Registration failed: ' . $e->getMessage(), [
//             'trace' => $e->getTraceAsString(),
//         ]);

    //         // user ko redirect with error
//         return redirect()->back()
//             ->withInput()
//             ->withErrors(['error' => 'Something went wrong during registration: ' . $e->getMessage()]);
//     }
// }
    public function store(Request $request): RedirectResponse
    {
        // dd($request->all());
        // dd($request->file('files'));

        // dd($request->all());
        try {
            // Step 1: validate everything
            $validated = $request->validate([
                // user fields
                'firstname' => ['required', 'string', 'max:255'],
                'lastname' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required'],

                // publisher profile
                'bussinessname' => ['required', 'string', 'max:255'],

                // magazine fields
                'magazine_title' => ['required', 'string', 'max:255'],
                'magazinedescription' => ['nullable', 'string'],
                'issue_type' => ['required', 'in:single,series'],
                'series_issue_count' => ['nullable', 'integer'],
                'issue_frequency' => ['nullable', 'string'],
                'print_run' => ['required', 'integer'],
                'page_count' => ['nullable', 'integer'],
                'genre' => ['nullable', 'string'],
                'available_quantities' => ['required', 'integer'],
                'wholesale_price' => ['required', 'numeric'],
                'retail_price' => ['required', 'numeric'],
                'specs' => ['nullable', 'string'],
                'fulfillment_method' => ['required', 'string'],
                'shipping_city' => ['required', 'string'],
                'shipping_state' => ['required', 'string'],
                'shipping_country' => ['required', 'string'],
                'return_policy' => ['nullable', 'string'],
                'promotional_text' => ['nullable', 'string'],
                'metadata' => ['nullable', 'string'],
                // payout / payment details
                'payout_method' => ['nullable', 'string'],
                'account_holder_name' => ['nullable', 'string', 'max:255'],
                'iban' => ['nullable', 'string', 'max:255'],
                'swift_code' => ['nullable', 'string', 'max:255'],
                'business_address' => ['nullable', 'string'],
                'tax_id' => ['nullable', 'string', 'max:255'],
                'currency_preference' => ['nullable', 'string', 'max:10'],
                'payment_contact_email' => ['nullable', 'email', 'max:255'],

                // sales experience
                'sales_experience' => ['required', 'in:yes,no'],
                'distribution_channels' => ['nullable', 'array'],
                'copies_sold' => ['nullable', 'integer'],
                'sales_feedback' => ['nullable', 'string'],

                // files
                'files' => ['nullable', 'array', 'max:6'],
                // 'files.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // max 5MB
            ]);

            DB::beginTransaction();

            // Step 2: create user
            $user = User::create([
                'name' => $validated['firstname'] . ' ' . $validated['lastname'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $user->assignRole('publisher');

            // Step 3: create publisher profile
            $publisher = PublisherProfile::create([
                'user_id' => $user->id,
                'company_name' => $validated['bussinessname'],
                'payout_email' => $validated['email'],
            ]);
            // Step 4: store payment & payout information
            PublisherPaymentDetail::create([
                'user_id' => $user->id,
                'preferred_payout_method' => $validated['payout_method'] ?? null,
                'account_holder_name' => $validated['account_holder_name'] ?? null,
                'account_number_iban' => $validated['iban'] ?? null,
                'routing_swift_code' => $validated['swift_code'] ?? null,
                'business_address' => $validated['business_address'] ?? null,
                'tax_id' => $validated['tax_id'] ?? null,
                'currency_preference' => $validated['currency_preference'] ?? 'USD',
                'payment_contact_email' => $validated['payment_contact_email'] ?? null,
            ]);

            // Step 4: create first magazine
            $magazine = Magazine::create([
                'publisher_id' => $publisher->id,
                'title_name' => $validated['magazine_title'],
                'issue_identifier' => $validated['series_issue_count'] ?? null,
                'description' => $validated['magazinedescription'] ?? null,
                'type' => $validated['issue_type'] === 'series' ? 'series' : 'single_issue',
                'series_issue_count' => $validated['series_issue_count'] ?? null,
                'issue_frequency' => $validated['issue_frequency'] ?? null,
                'total_printed' => $validated['print_run'],
                'stock' => $validated['available_quantities'],
                'warehouse' => $request->warehouse ?? null,
                'genres' => $validated['genre'] ?? null,
                'wholesale_price' => $validated['wholesale_price'],
                'msrp' => $validated['retail_price'],
                'dimensions' => $validated['dimensions'] ?? null,
                'page_count' => $validated['page_count'] ?? null,
                'specs' => $validated['specs'] ?? null,
                'fulfillment_method' => $validated['fulfillment_method'],
                'return_policy' => $validated['return_policy'] ?? null,
                'promotional_text' => $validated['promotional_text'] ?? null,
                'metadata' => $validated['metadata'] ?? null,
                'sales_experience' => $validated['sales_experience'] === 'yes',
                'copies_sold' => $validated['copies_sold'] ?? 0,
                'sales_feedback' => $validated['sales_feedback'] ?? null,
                'retailer_fit_tags' => isset($validated['distribution_channels'])
                    ? implode(',', $validated['distribution_channels'])
                    : null,
                'status' => 'pending',
            ]);
            Log::info('request files', ['files' => $request->file('files')]);
            // Step 5: handle file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('magazines', 'public'); // storage/app/public/magazines
                    MagazineImage::create([
                        'magazine_id' => $magazine->id,
                        'image_path' => $path,
                    ]);
                }
            }

            DB::commit();

            // Step 6: Send confirmation email to user
            Mail::to($user->email)->send(new ApplicationConfirmation($user, 'publisher'));

            // Step 7: login + redirect
            event(new Registered($user));
            Auth::login($user);

            return redirect(RouteServiceProvider::HOME)
                ->with('success', 'Publisher registered successfully!, You will receive a confirmation email from admin shortly.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());

        }
    }


}
