<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MagazineController extends Controller
{
    public function create()
    {
        return view('magazines.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_name' => 'required|string|max:255',
            'issue_identifier' => 'required|string|max:255',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // extra images
            'genre' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'dimensions' => 'nullable|string|max:255',
            'page_count' => 'nullable|integer',
            'stock' => 'nullable|integer',
            'wholesale_price' => 'nullable|numeric',
            'msrp' => 'nullable|numeric',
            'return_policy' => 'nullable|string|max:255',
            'retailer_fit_tags' => 'nullable|string',
        ]);

        // Create magazine
        $magazine = Magazine::create([
            'publisher_id' => Auth::user()->publisherProfile->id, // assuming relation
            'title_name' => $request->title_name,
            'issue_identifier' => $request->issue_identifier,
            'cover_image' => $request->file('cover_image')
                ? $request->file('cover_image')->store('magazines/covers', 'public')
                : null,
            'genre' => $request->genre,
            'description' => $request->description,
            'dimensions' => $request->dimensions,
            'page_count' => $request->page_count,
            'stock' => $request->stock ?? 0,
            'wholesale_price' => $request->wholesale_price,
            'msrp' => $request->msrp,
            'return_policy' => $request->return_policy,
            'retailer_fit_tags' => $request->retailer_fit_tags,
            'status' => 'pending',
            'logo' => $request->file('logo')
                ? $request->file('logo')->store('magazines/logos', 'public')
                : null,
            'type' => $request->type,
            'total_printed' => $request->total_printed ?? 0,
            'visibility' => $request->has('visibility'),
            'restock_timeline' => $request->restock_timeline,

        ]);

        // Store multiple images (extra fields, not in migration)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('magazines/images', 'public');
                $magazine->images()->create([
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->route('magazines.create')->with('success', 'Magazine submitted successfully!');
    }
}
