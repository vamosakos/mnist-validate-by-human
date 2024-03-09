<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\OverviewController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::redirect('/', '/mnist-human-validation');

Route::get('/mnist-human-validation', function () {
    return Inertia::render('About/About');
})->middleware(['guest'])->name('about');

Route::get('/mnist-human-validation-test', function () {
    return Inertia::render('Survey/Survey');
})->middleware(['guest'])->name('test');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/statistics/image-frequencies', [StatisticsController::class, 'imageFrequencies'])->name('statistics.imageFrequencies');
    Route::get('/overview', [OverviewController::class, 'index'])->name('overview.index');
});

Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});

require __DIR__.'/auth.php';
