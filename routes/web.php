<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MagazineController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RetailerController;

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

// Registration Pages
Route::get('/register/publisher', fn() => view('publisher.auth.register'))->name('register.publisher');
Route::get('/register/retailer', fn() => view('retailer.auth.register'))->name('register.retailer');

// Registration Handlers
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

    // Add more admin routes here...
    Route::get('/magazines/create', [MagazineController::class, 'create'])->name('magazines.create');
    Route::get('/magazines/edit/{id}', [MagazineController::class, 'edit'])->name('magazines.edit');
    Route::post('/magazines', [MagazineController::class, 'store'])->name('magazines.store');
    Route::post('/magazines/{id}', [MagazineController::class, 'update'])->name('magazines.update');
});


// ---------------------
// Publisher Routes
// ---------------------
Route::middleware(['auth', 'role:publisher'])->prefix('publisher')->group(function () {
    Route::get('/dashboard', [MagazineController::class, 'showByPublisher'])->name('publisher.dashboard');

    Route::get('/magazines/create', [MagazineController::class, 'create'])->name('magazines.create');
    Route::get('/magazines/edit/{id}', [MagazineController::class, 'edit'])->name('magazines.edit');
    Route::post('/magazines', [MagazineController::class, 'store'])->name('magazines.store');
    Route::post('/magazines/{id}', [MagazineController::class, 'update'])->name('magazines.update');
});

// ---------------------
// Retailer Routes
// ---------------------
Route::middleware(['auth', 'role:retailer'])->prefix('retailer')->group(function () {
    Route::get('/dashboard', [RetailerController::class, 'dashboard'])->name('dashboard');
    Route::put('/address/update', [RetailerController::class, 'updateaddress'])->name('retailer.address.update');
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
// Auth Scaffolding Routes
// ---------------------
require __DIR__ . '/auth.php';
