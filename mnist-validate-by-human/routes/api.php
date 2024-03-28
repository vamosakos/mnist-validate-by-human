<?php

use App\Http\Controllers\ImageController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/generate-image', [ImageController::class, 'generateImage']);
Route::post('/set-image-generation', [StatisticsController::class, 'setActiveFunction']);


Route::group(['middleware' => ['web']], function () {
    Route::post('/save-response', [ResponseController::class, 'saveResponse']);
    Route::post('/feedbacks', [FeedbackController::class, 'store']);
    Route::get('/csrf-token', function () {
        return response()->json(['csrfToken' => csrf_token()]);
    });
});

Route::get('/identifications/count', [ResponseController::class, 'getIdentificationsCount']);
