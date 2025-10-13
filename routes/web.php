<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MagazineController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RetailerController;

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

Route::get('/admin/verify-user/{id}', [AdminController::class, 'verifyUser'])
    ->name('admin.verify.user');


Route::get('/', function () {
    return view('welcome');
});
Route::get('/start', function () {
    return view('start');
})->name('start');
Route::get('/register/publisher', function () {
    return view('publisher.auth.register');
})->name('register.publisher');
Route::get('/register/retailer', function () {
    return view('retailer.auth.register');
})->name('register.retailer');

Route::get('/checkout', function () {
    return view('checkout');
})->name('checkout');
Route::post('/retailerregister', [RetailerController::class, 'store'])->name('register.submit.retailer');
Route::put('/retailer/address/update', [RetailerController::class, 'updateaddress'])->name('retailer.address.update');


// Route::get('/dashboard', function () {
//     return view('dashboard'); 
// })->middleware(['auth', 'verified'])->name('dashboard');


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
Route::get('/magazine/{id}', [MagazineController::class, 'show'])->name('magazines.show');

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
