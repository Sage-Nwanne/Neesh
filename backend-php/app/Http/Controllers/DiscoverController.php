<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
use App\Models\MagazineView;
use App\Models\RetailerProfile;
use App\Models\PublisherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DiscoverController extends Controller
{
    /**
     * Show the discover page with personalized recommendations
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $allMagazines = Magazine::with(['publisher', 'images'])->where('status', 'approved')->whereNull('archived_at')->get();
        
        // Get personalized recommendations
        $recommendedMagazines = $this->getRecommendedMagazines($user);
        
        // Get trending magazines (most viewed/bookmarked recently)
        $trendingMagazines = $this->getTrendingMagazines();
        
        // Get new magazines
        $newMagazines = Magazine::with(['publisher', 'images'])
            ->where('status', 'approved')
            ->whereNull('archived_at')
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get();
        
        // Get user's bookmarked magazines
        $bookmarkedMagazineIds = $user ? $user->bookmarks()->pluck('magazine_id')->toArray() : [];
        
        return view('discover.index', compact(
            'allMagazines',
            'recommendedMagazines',
            'trendingMagazines',
            'newMagazines',
            'bookmarkedMagazineIds'
        ));
    }

    /**
     * Get personalized magazine recommendations based on user behavior
     */
    private function getRecommendedMagazines($user)
    {
        if (!$user) {
            // Return random magazines for unauthenticated users
            return Magazine::with(['publisher', 'images'])
                ->where('status', 'approved')
                ->inRandomOrder()
                ->limit(12)
                ->get();
        }

        // Get user's preferred genres based on their interactions
        $preferredGenres = $this->getUserPreferredGenres($user);
        
        // Get magazines matching user's preferred genres
        $query = Magazine::with(['publisher', 'images'])
            ->where('status', 'approved');
        
        if (!empty($preferredGenres)) {
            $query->where(function ($q) use ($preferredGenres) {
                foreach ($preferredGenres as $genre) {
                    $q->orWhere('genre', 'like', '%' . $genre . '%');
                }
            });
        }
        
        // Exclude already bookmarked magazines
        $query->whereNotIn('id', $user->bookmarks()->pluck('magazine_id'));
        
        // Order by relevance (most viewed, highest rated, etc.)
        $recommendations = $query->orderBy('copies_sold', 'desc')
            ->limit(12)
            ->get();
        
        // If not enough recommendations, fill with random magazines
        if ($recommendations->count() < 12) {
            $remaining = 12 - $recommendations->count();
            $additionalMagazines = Magazine::with(['publisher', 'images'])
                ->where('status', 'approved')
                ->whereNotIn('id', $recommendations->pluck('id'))
                ->whereNotIn('id', $user->bookmarks()->pluck('magazine_id'))
                ->inRandomOrder()
                ->limit($remaining)
                ->get();
            
            $recommendations = $recommendations->merge($additionalMagazines);
        }
        
        return $recommendations;
    }

    /**
     * Get user's preferred genres based on their viewing and bookmarking history
     */
    private function getUserPreferredGenres($user)
    {
        // Get genres from bookmarked magazines
        $bookmarkedGenres = $user->bookmarks()
            ->with('magazine')
            ->get()
            ->pluck('magazine.genre')
            ->filter()
            ->toArray();
        
        // Get genres from viewed magazines
        $viewedGenres = MagazineView::where('user_id', $user->id)
            ->with('magazine')
            ->get()
            ->pluck('magazine.genre')
            ->filter()
            ->toArray();
        
        // Get genres from user's profile if they're a retailer
        $profileGenres = [];
        if ($user->hasRole('retailer') && $user->retailerProfile) {
            $profileGenres = $user->retailerProfile->interested_genres ?? [];
        }
        
        // Combine and count genre occurrences
        $allGenres = array_merge($bookmarkedGenres, $viewedGenres, $profileGenres);
        $genreCounts = array_count_values($allGenres);
        
        // Sort by frequency and return top genres
        arsort($genreCounts);
        return array_keys(array_slice($genreCounts, 0, 5));
    }

    /**
     * Get trending magazines (most viewed/bookmarked in the last 30 days)
     */
    private function getTrendingMagazines()
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        $trendingIds = DB::table('bookmarks')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('magazine_id')
            ->selectRaw('magazine_id, COUNT(*) as bookmark_count')
            ->orderBy('bookmark_count', 'desc')
            ->limit(12)
            ->pluck('magazine_id');
        
        return Magazine::with(['publisher', 'images'])
            ->whereIn('id', $trendingIds)
            ->where('status', 'approved')
            ->get();
    }

    /**
     * View a publisher's profile and catalogue
     */
    public function viewPublisher($publisherId)
    {
        $publisher = PublisherProfile::findOrFail($publisherId);
        $magazines = $publisher->magazines()
            ->where('status', 'approved')
            ->whereNull('archived_at')
            ->with(['images'])
            ->get();
        
        $user = Auth::user();
        $bookmarkedMagazineIds = $user ? $user->bookmarks()->pluck('magazine_id')->toArray() : [];
        
        return view('discover.publisher-profile', compact(
            'publisher',
            'magazines',
            'bookmarkedMagazineIds'
        ));
    }

    /**
     * Track magazine view
     */
    public function trackView($magazineId)
    {
        $user = Auth::user();
        
        if ($user) {
            MagazineView::create([
                'user_id' => $user->id,
                'magazine_id' => $magazineId,
            ]);
        }
        
        return response()->json(['success' => true]);
    }
}

