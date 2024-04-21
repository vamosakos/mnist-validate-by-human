<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\FeedbackController;
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

Route::redirect('register', '/mnist-human-validation', 301);

Route::redirect('/', '/mnist-human-validation', 301);

Route::get('/mnist-human-validation', function () {
    return Inertia::render('About/About');
})->middleware(['guest'])->name('about');

Route::get('/mnist-human-validation-test', function () {
    return Inertia::render('Survey/Survey');
})->middleware(['guest'])->name('test');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy/PrivacyPolicy');
})->name('privacy-policy');

Route::get('/terms-of-service', function () {
    return Inertia::render('TermsOfService/TermsOfService');
})->name('terms-of-service');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/statistics/image-frequencies-charts', [StatisticsController::class, 'imageFrequenciesCharts'])->name('statistics.imageFrequenciesCharts');
    Route::get('/statistics/responses-charts', [StatisticsController::class, 'responsesCharts'])->name('statistics.responsesCharts');
    Route::get('/statistics/image-frequencies-data-listing', [StatisticsController::class, 'imageFrequenciesDataList'])->name('statistics.imageFrequenciesDataList');
    Route::get('/statistics/responses-data-listing', [StatisticsController::class, 'responsesDataList'])->name('statistics.responsesDataList');
    Route::get('/overview', [OverviewController::class, 'index'])->name('overview.index');
    Route::get('/feedbacks', [FeedbackController::class, 'index'])->name('feedback.feedback');
    Route::get('/image-generation-settings', [ImageController::class, 'imageGenerationSettings'])->name('ImageGenerationSettings.ImageGenerationSettings');

    //api routes
    Route::get('/get-image/{imageId}', [StatisticsController::class, 'getImageById']);
    Route::get('/statistics/heatmap', [StatisticsController::class, 'generateHeatmap']);
    Route::post('/statistics/delete-selected-image-frequencies', [StatisticsController::class, 'deleteSelectedImageFrequency']);
    Route::post('/statistics/delete-selected-responses', [StatisticsController::class, 'deleteSelectedResponse']);
});

require __DIR__.'/auth.php';
