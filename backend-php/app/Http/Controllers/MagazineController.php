<?php

namespace App\Http\Controllers;

use App\Models\Magazine;
use App\Models\MagazineImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\PublisherProfile;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;

class MagazineController extends Controller
{
    public function create()
    {
        return view('magazines.create');
    }
    public function showByPublisher()
    {
        // publisher profile find karo
        $publisher = auth()->user();

        $publisherProfile = PublisherProfile::where('user_id', $publisher->id)->first();
        if (!$publisherProfile) {
            return redirect()->back()->with('error', 'Publisher profile not found.');
        }

        // us publisher ki magazines load karo + unki images
        $magazines = Magazine::with('images')
            ->where('publisher_id', $publisherProfile->id)
            ->get();

        // Fetch analytics data
        $orders = Order::where('publisher_id', $publisherProfile->id)
            ->with(['items', 'payment'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate financial metrics
        $totalSales = Order::where('publisher_id', $publisherProfile->id)
            ->where('status', 'submitted')
            ->sum('subtotal');

        $totalVolume = OrderItem::whereIn('order_id',
            Order::where('publisher_id', $publisherProfile->id)->pluck('id')
        )->sum('quantity');

        // Calculate sales growth (compare this month vs last month)
        $thisMonthSales = Order::where('publisher_id', $publisherProfile->id)
            ->where('status', 'submitted')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('subtotal');

        $lastMonthSales = Order::where('publisher_id', $publisherProfile->id)
            ->where('status', 'submitted')
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->sum('subtotal');

        $salesGrowth = $lastMonthSales > 0
            ? (($thisMonthSales - $lastMonthSales) / $lastMonthSales) * 100
            : 0;

        // Get daily sales data for chart (last 30 days)
        $dailySalesData = Order::where('publisher_id', $publisherProfile->id)
            ->where('status', 'submitted')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(subtotal) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Account balance (total sales - commission fees)
        $accountBalance = Order::where('publisher_id', $publisherProfile->id)
            ->where('status', 'submitted')
            ->selectRaw('SUM(subtotal - COALESCE(commission_fee, 0)) as balance')
            ->first()
            ->balance ?? 0;

        return view('publisher-dashboard', compact(
            'magazines',
            'publisherProfile',
            'orders',
            'totalSales',
            'totalVolume',
            'salesGrowth',
            'dailySalesData',
            'accountBalance'
        ));
    }
    public function show($id)
    {
        $magazine = Magazine::with('images', 'publisher')->findOrFail($id);

        // For related products, show others from same publisher or same genre
        $relatedMagazines = Magazine::where('publisher_id', $magazine->publisher_id)
            ->where('id', '!=', $magazine->id)
            ->take(4)
            ->get();

        return view('magazines.index', compact('magazine', 'relatedMagazines'));
    }
    public function edit($id)
    {
        $magazine = Magazine::with('images', 'publisher')->findOrFail($id);
        //   dd($magazine);
        return view('magazines.edit', compact('magazine'));


    }


    public function store(Request $request)
    {
        try {
            //code...

            $publisher = auth()->user();

            $publisherProfile = PublisherProfile::where('user_id', $publisher->id)->first();

            if (!$publisherProfile) {
                return redirect()->back()->with('error', 'Publisher profile not found.');
            }
            // ✅ validate input
            $validated = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'issue_number' => ['nullable', 'string', 'max:255'],
                'frequency' => ['nullable', 'string', 'max:255'],
                'type' => ['required', 'in:single,series'],
                'genre' => ['nullable', 'string'],
                'dimensions' => ['nullable', 'string'],
                'page_count' => ['nullable', 'integer'],
                'print_run' => ['required', 'integer'],
                'warehouse' => ['nullable', 'string'],
                'stock' => ['required', 'integer'],
                'restock_time' => ['nullable', 'string'],
                'promotional_text' => ['nullable', 'string'],
                'metadata' => ['nullable', 'string'],
                'wholesale_price' => ['required', 'numeric'],
                'retail_price' => ['required', 'numeric'],
                'discount' => ['nullable', 'string'],
                'payment_terms' => ['nullable', 'string'],
                'restock_timeline' => ['nullable', 'string'],
                'files' => ['nullable', 'array', 'max:6'],
                // 'files.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            ]);

            // ✅ save magazine
            $magazine = Magazine::create([
                'title_name' => $validated['title'],
                'publisher_id' => $publisherProfile->id, // ✅ ab correct foreign key
                'issue_identifier' => $validated['issue_number'] ?? null,
                'issue_frequency' => $validated['frequency'] ?? null,
                'type' => $validated['type'],
                'genre' => $validated['genre'] ?? null,
                'dimensions' => $validated['dimensions'] ?? null,
                'page_count' => $validated['page_count'] ?? null,
                'total_printed' => $validated['print_run'],
                'warehouse' => $validated['warehouse'] ?? null,
                'stock' => $validated['stock'],
                'restock_time' => $validated['restock_time'] ?? null,
                'promotional_text' => $validated['promotional_text'] ?? null,
                'metadata' => $validated['metadata'] ?? null,
                'wholesale_price' => $validated['wholesale_price'],
                'msrp' => $validated['retail_price'],
                'discount' => $validated['discount'] ?? null,
                'payment_terms' => $validated['payment_terms'] ?? null,
                'status' => 'pending',
                'restock_timeline' => $validated['restock_timeline'] ?? null,

            ]);

            // ✅ save images
            // dd($request->file('files'));
            if ($request->file('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('magazines', 'public');
                    MagazineImage::create([
                        'magazine_id' => $magazine->id,
                        'image_path' => $path,
                    ]);
                }
            }

            return redirect()->back()->with('success', 'Magazine uploaded successfully!');
        } catch (\Exception $e) {
            //throw $th;
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());

        }


    }
    public function update(Request $request, $id)
    {
        try {
            $publisher = auth()->user();
            $publisherProfile = PublisherProfile::where('user_id', $publisher->id)->first();

            if (!$publisherProfile) {
                return redirect()->back()->with('error', 'Publisher profile not found.');
            }

            $magazine = Magazine::where('id', $id)
                ->where('publisher_id', $publisherProfile->id)
                ->firstOrFail();

            $validated = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'issue_number' => ['nullable', 'string', 'max:255'],
                'issue_frequency' => ['nullable', 'string', 'max:255'],
                'type' => ['required', 'in:single,series'],
                'genre' => ['nullable', 'string'],
                'dimensions' => ['nullable', 'string'],
                'page_count' => ['nullable', 'integer'],
                'print_run' => ['required', 'integer'],
                'warehouse' => ['nullable', 'string'],
                'stock' => ['required', 'integer'],
                'restock_time' => ['nullable', 'string'],
                'promotional_text' => ['nullable', 'string'],
                'metadata' => ['nullable', 'string'],
                'wholesale_price' => ['required', 'numeric'],
                'retail_price' => ['required', 'numeric'],
                'discount' => ['nullable', 'string'],
                'payment_terms' => ['nullable', 'string'],
                'files' => ['nullable', 'array', 'max:6'],
                'restock_timeline' => ['nullable', 'string'],

            ]);

            $magazine->update([
                'title_name' => $validated['title'],
                'issue_identifier' => $validated['issue_number'] ?? null,
                'issue_frequency' => $validated['issue_frequency'] ?? null,
                'type' => $validated['type'],
                'genre' => $validated['genre'] ?? null,
                'dimensions' => $validated['dimensions'] ?? null,
                'page_count' => $validated['page_count'] ?? null,
                'total_printed' => $validated['print_run'],
                'warehouse' => $validated['warehouse'] ?? null,
                'stock' => $validated['stock'],
                'restock_time' => $validated['restock_time'] ?? null,
                'promotional_text' => $validated['promotional_text'] ?? null,
                'metadata' => $validated['metadata'] ?? null,
                'wholesale_price' => $validated['wholesale_price'],
                'msrp' => $validated['retail_price'],
                'discount' => $validated['discount'] ?? null,
                'payment_terms' => $validated['payment_terms'] ?? null,
                'restock_timeline' => $validated['restock_timeline'] ?? null,
            ]);

            // handle new image uploads (optional append)
            if ($request->file('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('magazines', 'public');
                    MagazineImage::create([
                        'magazine_id' => $magazine->id,
                        'image_path' => $path,
                    ]);
                }
            }

            return redirect()->route('magazines.show', $magazine->id)->with('success', 'Magazine updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }

}
