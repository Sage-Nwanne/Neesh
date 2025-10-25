<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bookmark;
use App\Models\Magazine;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    /**
     * Toggle bookmark for a magazine
     */
    public function toggle($magazineId)
    {
        $user = Auth::user();
        $magazine = Magazine::findOrFail($magazineId);

        $bookmark = Bookmark::where('user_id', $user->id)
            ->where('magazine_id', $magazineId)
            ->first();

        if ($bookmark) {
            // Remove bookmark
            $bookmark->delete();
            return response()->json([
                'success' => true,
                'bookmarked' => false,
                'message' => 'Bookmark removed'
            ]);
        } else {
            // Add bookmark
            Bookmark::create([
                'user_id' => $user->id,
                'magazine_id' => $magazineId
            ]);
            return response()->json([
                'success' => true,
                'bookmarked' => true,
                'message' => 'Bookmark added'
            ]);
        }
    }

    /**
     * Get all bookmarks for the current user
     */
    public function index()
    {
        $user = Auth::user();
        $bookmarks = Bookmark::where('user_id', $user->id)
            ->with('magazine')
            ->get();

        return view('bookmarks.index', ['bookmarks' => $bookmarks]);
    }

    /**
     * Check if a magazine is bookmarked by the current user
     */
    public function isBookmarked($magazineId)
    {
        $user = Auth::user();
        $bookmarked = Bookmark::where('user_id', $user->id)
            ->where('magazine_id', $magazineId)
            ->exists();

        return response()->json(['bookmarked' => $bookmarked]);
    }
}
