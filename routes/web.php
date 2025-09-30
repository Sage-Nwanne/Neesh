<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MagazineController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return "Welcome Admin!";
    });
});

// Publisher routes

Route::middleware(['auth', 'role:publisher'])->group(function () {
    Route::get('/magazines/create', [MagazineController::class, 'create'])->name('magazines.create');
    Route::post('/magazines', [MagazineController::class, 'store'])->name('magazines.store');
});

// Retailer routes
Route::middleware(['auth', 'role:retailer'])->group(function () {
    Route::get('/retailer/dashboard', function () {
        return "Welcome Retailer!";
    });
});
Route::middleware(['auth', 'role:admin|publisher'])->group(function () {
    Route::get('/products/manage', function () {
        return "Admin & Publisher can manage products.";
    });
});


require __DIR__.'/auth.php';
