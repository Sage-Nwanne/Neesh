<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PublisherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PublisherFinancialController extends Controller
{
    /**
     * Show Publisher Transfer System page
     */
    public function transfers()
    {
        try {
            $user = auth()->user();
            $publisherProfile = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            // Get recent transfers
            $transfers = Transfer::where('publisher_id', $publisherProfile->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Calculate available balance
            $totalEarnings = Order::where('publisher_id', $publisherProfile->id)
                ->where('status', 'completed')
                ->sum('subtotal');

            $totalTransferred = Transfer::where('publisher_id', $publisherProfile->id)
                ->whereIn('status', ['completed', 'processing'])
                ->sum('amount');

            $availableBalance = $totalEarnings - $totalTransferred;

            // Get bank account info from publisher payment details
            $bankAccount = $publisherProfile->paymentDetails ?? null;

            return view('publisher.pages.transfers', compact(
                'publisherProfile',
                'transfers',
                'availableBalance',
                'totalEarnings',
                'totalTransferred',
                'bankAccount'
            ));
        } catch (\Exception $e) {
            Log::error('Transfer page error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load transfers page.');
        }
    }

    /**
     * Store a new transfer request
     */
    public function storeTransfer(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:1',
                'type' => 'required|in:instant,standard',
            ]);

            $user = auth()->user();
            $publisherProfile = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            // Check available balance
            $totalEarnings = Order::where('publisher_id', $publisherProfile->id)
                ->where('status', 'completed')
                ->sum('subtotal');

            $totalTransferred = Transfer::where('publisher_id', $publisherProfile->id)
                ->whereIn('status', ['completed', 'processing'])
                ->sum('amount');

            $availableBalance = $totalEarnings - $totalTransferred;

            if ($validated['amount'] > $availableBalance) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient balance for this transfer.'
                ], 422);
            }

            // Create transfer record
            $transfer = Transfer::create([
                'publisher_id' => $publisherProfile->id,
                'amount' => $validated['amount'],
                'type' => $validated['type'],
                'status' => 'pending',
                'requested_at' => now(),
            ]);

            // TODO: Integrate with Stripe Connect for actual transfer
            // For now, mark as processing
            $transfer->update([
                'status' => 'processing',
                'processed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transfer request submitted successfully.',
                'transfer' => $transfer
            ]);
        } catch (\Exception $e) {
            Log::error('Transfer creation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create transfer.'
            ], 500);
        }
    }

    /**
     * Show Publisher Order Management page
     */
    public function orders()
    {
        try {
            $user = auth()->user();
            $publisherProfile = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            // Get orders with filtering and sorting
            $query = Order::where('publisher_id', $publisherProfile->id)
                ->with(['retailer', 'items', 'payment', 'shipments']);

            // Apply filters
            if (request('status')) {
                $query->where('status', request('status'));
            }

            if (request('payment_status')) {
                $query->whereHas('payment', function ($q) {
                    $q->where('status', request('payment_status'));
                });
            }

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('external_order_id', 'like', "%$search%")
                        ->orWhereHas('retailer', function ($q) use ($search) {
                            $q->where('store_name', 'like', "%$search%");
                        });
                });
            }

            // Apply sorting
            $sortBy = request('sort_by', 'created_at');
            $sortOrder = request('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $orders = $query->paginate(15);

            // Get summary statistics
            $totalOrders = Order::where('publisher_id', $publisherProfile->id)->count();
            $pendingOrders = Order::where('publisher_id', $publisherProfile->id)
                ->where('status', 'pending')->count();
            $completedOrders = Order::where('publisher_id', $publisherProfile->id)
                ->where('status', 'completed')->count();
            $totalRevenue = Order::where('publisher_id', $publisherProfile->id)
                ->where('status', 'completed')
                ->sum('subtotal');

            return view('publisher.pages.orders', compact(
                'publisherProfile',
                'orders',
                'totalOrders',
                'pendingOrders',
                'completedOrders',
                'totalRevenue'
            ));
        } catch (\Exception $e) {
            Log::error('Orders page error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load orders page.');
        }
    }

    /**
     * Show individual order detail page
     */
    public function orderDetail($orderId)
    {
        try {
            $user = auth()->user();
            $publisherProfile = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            $order = Order::where('publisher_id', $publisherProfile->id)
                ->with(['retailer', 'items.magazine', 'payment', 'shipments', 'returns'])
                ->findOrFail($orderId);

            return view('publisher.pages.order-detail', compact('order', 'publisherProfile'));
        } catch (\Exception $e) {
            Log::error('Order detail error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load order details.');
        }
    }

    /**
     * Show Transaction History page
     */
    public function transactions()
    {
        try {
            $user = auth()->user();
            $publisherProfile = PublisherProfile::where('user_id', $user->id)->firstOrFail();

            // Get all transfers and payments organized chronologically
            $transfers = Transfer::where('publisher_id', $publisherProfile->id)
                ->orderBy('created_at', 'desc')
                ->get();

            $payments = Payment::whereHas('order', function ($q) use ($publisherProfile) {
                $q->where('publisher_id', $publisherProfile->id);
            })
                ->with('order')
                ->orderBy('created_at', 'desc')
                ->get();

            // Merge and organize by date
            $transactions = collect();

            foreach ($transfers as $transfer) {
                $transactions->push([
                    'type' => 'transfer',
                    'date' => $transfer->created_at,
                    'amount' => $transfer->amount,
                    'status' => $transfer->status,
                    'description' => 'Transfer - ' . ucfirst($transfer->type),
                    'data' => $transfer
                ]);
            }

            foreach ($payments as $payment) {
                $transactions->push([
                    'type' => 'payment',
                    'date' => $payment->created_at,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'description' => 'Payment - Order #' . $payment->order->external_order_id,
                    'data' => $payment
                ]);
            }

            // Sort by date descending
            $transactions = $transactions->sortByDesc('date')->values();

            // Group by date
            $groupedTransactions = $transactions->groupBy(function ($item) {
                return $item['date']->format('Y-m-d');
            });

            // Calculate totals
            $totalTransferred = Transfer::where('publisher_id', $publisherProfile->id)
                ->where('status', 'completed')
                ->sum('amount');

            $totalReceived = Payment::whereHas('order', function ($q) use ($publisherProfile) {
                $q->where('publisher_id', $publisherProfile->id);
            })
                ->where('status', 'succeeded')
                ->sum('amount');

            return view('publisher.pages.transactions', compact(
                'publisherProfile',
                'groupedTransactions',
                'transactions',
                'totalTransferred',
                'totalReceived'
            ));
        } catch (\Exception $e) {
            Log::error('Transactions page error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load transactions.');
        }
    }
}
