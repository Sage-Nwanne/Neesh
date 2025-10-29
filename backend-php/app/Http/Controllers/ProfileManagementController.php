<?php

namespace App\Http\Controllers;

use App\Models\PublisherProfile;
use App\Models\RetailerProfile;
use App\Models\Magazine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileManagementController extends Controller
{
    /**
     * Show publisher profile
     */
    public function publisherProfile($publisherId)
    {
        try {
            $publisher = PublisherProfile::with(['user', 'magazines'])->findOrFail($publisherId);

            // Get published magazines count
            $publishedCount = Magazine::where('publisher_id', $publisherId)
                ->where('archived_at', null)
                ->count();

            // Get total sales
            $totalSales = Magazine::where('publisher_id', $publisherId)
                ->sum('sales_volume');

            return view('profile.publisher-profile', compact('publisher', 'publishedCount', 'totalSales'));
        } catch (\Exception $e) {
            Log::error('Publisher profile error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Publisher profile not found.');
        }
    }

    /**
     * Show retailer profile
     */
    public function retailerProfile($retailerId)
    {
        try {
            $retailer = RetailerProfile::with(['user', 'stores'])->findOrFail($retailerId);

            // Get store count
            $storeCount = $retailer->stores()->count();

            return view('profile.retailer-profile', compact('retailer', 'storeCount'));
        } catch (\Exception $e) {
            Log::error('Retailer profile error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Retailer profile not found.');
        }
    }

    /**
     * Show publisher account settings
     */
    public function publisherSettings()
    {
        try {
            $user = auth()->user();
            $publisher = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            return view('profile.publisher-settings', compact('publisher'));
        } catch (\Exception $e) {
            Log::error('Publisher settings error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load settings.');
        }
    }

    /**
     * Update publisher profile
     */
    public function updatePublisherProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'company_name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'website' => 'nullable|url',
                'phone' => 'nullable|string|max:20',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'social_media' => 'nullable|array',
            ]);

            $user = auth()->user();
            $publisher = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            // Handle logo upload
            if ($request->hasFile('logo')) {
                if ($publisher->logo) {
                    Storage::disk('public')->delete($publisher->logo);
                }
                $logoPath = $request->file('logo')->store('publishers/logos', 'public');
                $validated['logo'] = $logoPath;
            }

            // Handle social media
            if (isset($validated['social_media'])) {
                $validated['social_media'] = json_encode($validated['social_media']);
            }

            $publisher->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Update publisher profile error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile.'
            ], 500);
        }
    }

    /**
     * Show retailer account settings
     */
    public function retailerSettings()
    {
        try {
            $user = auth()->user();
            $retailer = RetailerProfile::where('user_id', $user->id)->firstOrFail();

            return view('profile.retailer-settings', compact('retailer'));
        } catch (\Exception $e) {
            Log::error('Retailer settings error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load settings.');
        }
    }

    /**
     * Update retailer profile
     */
    public function updateRetailerProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'company_name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'website' => 'nullable|url',
                'phone' => 'nullable|string|max:20',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'social_media' => 'nullable|array',
            ]);

            $user = auth()->user();
            $retailer = RetailerProfile::where('user_id', $user->id)->firstOrFail();

            // Handle logo upload
            if ($request->hasFile('logo')) {
                if ($retailer->logo) {
                    Storage::disk('public')->delete($retailer->logo);
                }
                $logoPath = $request->file('logo')->store('retailers/logos', 'public');
                $validated['logo'] = $logoPath;
            }

            // Handle social media
            if (isset($validated['social_media'])) {
                $validated['social_media'] = json_encode($validated['social_media']);
            }

            $retailer->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Update retailer profile error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile.'
            ], 500);
        }
    }
}
