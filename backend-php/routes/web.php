<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MagazineController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RetailerController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\PublisherPageController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\PublisherFinancialController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProfileManagementController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\StripePayoutController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Main web routes for the application.
| Includes role-based access control for Admin, Publisher, and Retailer.
|--------------------------------------------------------------------------
*/

// ---------------------
// Public Routes
// ---------------------
Route::get('/', fn() => view('welcome'))->name('home');
Route::get('/checkout', fn() => view('checkout'))->name('checkout');
Route::get('/termsandconditions', fn() => view('terms'))->name('terms');
Route::get('/help-center', [PublisherPageController::class, 'helpCenter'])->name('help-center');
Route::get('/faq', [PublisherPageController::class, 'faq'])->name('faq');
Route::get('/explore', [DiscoverController::class, 'index'])->name('explore.index');

// Registration Pages
Route::get('/register/publisher', fn() => view('publisher.auth.register'))->name('register.publisher');
Route::get('/register/retailer', fn() => view('retailer.auth.register'))->name('register.retailer');

// Admin Panel Redirect (requires authentication)
Route::get('/admin-laravel-redirect', function () {
    // Redirect to login if not authenticated
    if (!auth()->check()) {
        return redirect()->route('login');
    }

    // Check if user is admin
    if (!auth()->user()->hasRole('admin')) {
        abort(403, 'Unauthorized access to admin panel');
    }

    // If confirmed parameter is present, redirect to admin dashboard
    if (request()->get('confirmed') === 'true') {
        return redirect('https://app.neesh.art/admin/dashboard');
    }

    // Show confirmation page
    return view('admin.redirect');
})->name('admin.redirect');

// Registration Handlers
Route::post('/publisherregister', [RegisteredUserController::class, 'publisherstore'])->name('register.submit.publisher');
Route::post('/retailerregister', [RetailerController::class, 'store'])->name('register.submit.retailer');

// ---------------------
// Authenticated Common Routes
// ---------------------
Route::middleware(['auth', 'verified'])->group(function () {

    // Common dashboard redirect based on role
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return app(AdminController::class)->dashboard();
        }

        if ($user->hasRole('publisher')) {
            return app(MagazineController::class)->showByPublisher();
        }

        if ($user->hasRole('retailer')) {
            return app(RetailerController::class)->dashboard();
        }

        abort(403, 'Unauthorized access.');
    })->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Bookmark Routes
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/bookmarks/{magazineId}/toggle', [BookmarkController::class, 'toggle'])->name('bookmarks.toggle');
    Route::get('/bookmarks/{magazineId}/check', [BookmarkController::class, 'isBookmarked'])->name('bookmarks.check');
});

// ---------------------
// Admin Routes
// ---------------------
Route::post('/admin/{id}/verify', [AdminController::class, 'verifyUser'])->name('users.verify');
Route::get('/admin/verify-user/{id}', [AdminController::class, 'viewUser']);


Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // user related routes
    Route::get('/users', [AdminController::class, 'usersList'])->name('users');
    Route::get('/users/{id}', [AdminController::class, 'viewUser'])->name('users.view');
    Route::post('/users/{id}/verify', [AdminController::class, 'verifyUser'])->name('users.verify');
    Route::post('/users/{id}/approve', [AdminController::class, 'approveUser'])->name('users.approve');
    Route::post('/users/{id}/reject', [AdminController::class, 'rejectUser'])->name('users.reject');
    Route::post('/users/{id}/revoke', [AdminController::class, 'revokeUser'])->name('users.revoke');

    // Admin messages and account routes
    Route::get('/messages', [AdminController::class, 'messages'])->name('messages');
    Route::get('/account', [AdminController::class, 'account'])->name('account');
});


// ---------------------
// Publisher Routes
// ---------------------
Route::middleware(['auth', 'role:publisher'])->prefix('publisher')->name('publisher.')->group(function () {
    Route::get('/dashboard', [MagazineController::class, 'showByPublisher'])->name('dashboard');

    Route::get('/magazines/create', [MagazineController::class, 'create'])->name('magazines.create');
    Route::get('/magazines/edit/{id}', [MagazineController::class, 'edit'])->name('magazines.edit');
    Route::get('/magazines/{id}/analytics', [MagazineController::class, 'analytics'])->name('magazines.analytics');
    Route::post('/magazines', [MagazineController::class, 'store'])->name('magazines.store');
    Route::post('/magazines/{id}', [MagazineController::class, 'update'])->name('magazines.update');
    Route::post('/magazines/{id}/archive', [MagazineController::class, 'archive'])->name('magazines.archive');
    Route::post('/magazines/{id}/unarchive', [MagazineController::class, 'unarchive'])->name('magazines.unarchive');
    Route::get('/archived-titles', [MagazineController::class, 'archivedTitles'])->name('archived-titles');

    // Publisher Pages
    Route::get('/catalogue', [PublisherPageController::class, 'catalogue'])->name('catalogue');
    Route::get('/messages', [PublisherPageController::class, 'messages'])->name('messages');
    Route::get('/account', [PublisherPageController::class, 'account'])->name('account');
    Route::get('/help-center', [PublisherPageController::class, 'helpCenter'])->name('help-center');
    Route::get('/faq', [PublisherPageController::class, 'faq'])->name('faq');

    // Financial Management Routes
    Route::get('/transfers', [PublisherFinancialController::class, 'transfers'])->name('transfers');
    Route::post('/transfers', [PublisherFinancialController::class, 'storeTransfer'])->name('transfers.store');
    Route::get('/orders', [PublisherFinancialController::class, 'orders'])->name('orders');
    Route::get('/orders/{id}', [PublisherFinancialController::class, 'orderDetail'])->name('orders.detail');
    Route::get('/transactions', [PublisherFinancialController::class, 'transactions'])->name('transactions');
});

// ---------------------
// Retailer Routes
// ---------------------
Route::middleware(['auth', 'role:retailer'])->prefix('retailer')->name('retailer.')->group(function () {
    Route::get('/dashboard', [RetailerController::class, 'dashboard'])->name('dashboard');
    Route::put('/address/update', [RetailerController::class, 'updateaddress'])->name('address.update');
    Route::get('/catalogue', [PublisherPageController::class, 'catalogue'])->name('catalogue');
    Route::get('/orders', [PublisherPageController::class, 'orders'])->name('orders');
    Route::get('/messages', [PublisherPageController::class, 'messages'])->name('messages');
    Route::get('/account', [PublisherPageController::class, 'account'])->name('account');
});

// ---------------------
// Shared Routes (Admin + Publisher)
// ---------------------
Route::middleware(['auth', 'role:admin|publisher'])->group(function () {
    Route::get('/products/manage', fn() => "Admin & Publisher can manage products.")->name('products.manage');
});

// ---------------------
// Public Magazine Route
// ---------------------
Route::get('/magazine/{id}', [MagazineController::class, 'show'])->name('magazines.show');

// ---------------------
// Public Publisher Profile Route
// ---------------------
Route::get('/publisher/{publisherId}', [DiscoverController::class, 'viewPublisher'])->name('publisher.profile');
Route::post('/magazine/{magazineId}/track-view', [DiscoverController::class, 'trackView'])->name('magazine.track-view');

// ---------------------
// Profile Management Routes
// ---------------------
Route::get('/profile/publisher/{publisherId}', [ProfileManagementController::class, 'publisherProfile'])->name('profile.publisher');
Route::get('/profile/retailer/{retailerId}', [ProfileManagementController::class, 'retailerProfile'])->name('profile.retailer');

Route::middleware(['auth', 'role:publisher'])->group(function () {
    Route::get('/profile/publisher/settings', [ProfileManagementController::class, 'publisherSettings'])->name('profile.publisher-settings');
    Route::post('/profile/update-publisher', [ProfileManagementController::class, 'updatePublisherProfile'])->name('profile.update-publisher');
});

Route::middleware(['auth', 'role:retailer'])->group(function () {
    Route::get('/profile/retailer/settings', [ProfileManagementController::class, 'retailerSettings'])->name('profile.retailer-settings');
    Route::post('/profile/update-retailer', [ProfileManagementController::class, 'updateRetailerProfile'])->name('profile.update-retailer');
});

// ---------------------
// Checkout Routes
// ---------------------
Route::middleware(['auth', 'role:retailer'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/payment-intent', [CheckoutController::class, 'createPaymentIntent'])->name('checkout.payment-intent');
    Route::post('/checkout/process', [CheckoutController::class, 'processOrder'])->name('checkout.process');
    Route::get('/checkout/success/{orderId?}', [CheckoutController::class, 'success'])->name('checkout.success');
});

Route::post('/checkout/cart', [CheckoutController::class, 'getCart'])->name('checkout.cart');

// ---------------------
// Stripe Payment Routes (Retailer)
// ---------------------
Route::middleware(['auth', 'role:retailer'])->prefix('stripe')->name('stripe.')->group(function () {
    Route::post('/payment-intent', [StripePaymentController::class, 'createPaymentIntent'])->name('payment-intent');
    Route::post('/confirm-payment', [StripePaymentController::class, 'confirmPayment'])->name('confirm-payment');
    Route::get('/payment-status', [StripePaymentController::class, 'getPaymentStatus'])->name('payment-status');
});

// ---------------------
// Stripe Payout Routes (Publisher)
// ---------------------
Route::middleware(['auth', 'role:publisher'])->prefix('stripe')->name('stripe.')->group(function () {
    Route::get('/onboarding', [StripePayoutController::class, 'getOnboardingLink'])->name('onboarding');
    Route::post('/payout', [StripePayoutController::class, 'createPayout'])->name('payout');
    Route::get('/payouts', [StripePayoutController::class, 'listPayouts'])->name('payouts');
});

// ---------------------
// Auth Scaffolding Routes
// ---------------------
require __DIR__ . '/auth.php';
