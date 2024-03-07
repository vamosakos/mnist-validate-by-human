<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImageFrequency;
use App\Models\Misidentification;
use App\Models\MnistImage;
use App\Models\NumberFrequency;
use App\Models\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OverviewController extends Controller
{
    public function index()
    {
        // Calculate the total generated images count
        $totalGeneratedImages = ImageFrequency::sum('generation_count');

        // Calculate the count for train and test images
        $trainImagesCount = ImageFrequency::whereBetween('image_id', [0, 59999])->sum('generation_count');
        $testImagesCount = ImageFrequency::whereBetween('image_id', [60000, 69999])->sum('generation_count');

        // Calculate the total responses count
        $totalResponses = ImageFrequency::sum('response_count');

        // Calculate the count of responses from train and test images
        $responsesFromTrain = ImageFrequency::whereBetween('image_id', [0, 59999])->sum('response_count');
        $responsesFromTest = ImageFrequency::whereBetween('image_id', [60000, 69999])->sum('response_count');

        // Calculate the total misidentifications count
        $totalMisidentifications = Misidentification::sum('count');

        // Calculate the count of misidentifications from train and test images
        $misidentificationsFromTrain = Misidentification::whereBetween('correct_label', [0, 4])->sum('count');
        $misidentificationsFromTest = Misidentification::whereBetween('correct_label', [5, 9])->sum('count');

        // Get the most generated image id
        $mostGeneratedImageId = ImageFrequency::orderByDesc('generation_count')->value('image_id');

        // Get the count of the most generated image
        $mostGeneratedImageCount = ImageFrequency::where('image_id', $mostGeneratedImageId)
        ->value('generation_count');

         // Get the base64-encoded image data for the most generated image
        $mostGeneratedImageData = MnistImage::where('image_id', $mostGeneratedImageId)->value('image_base64');

        // Get the most responsed image id
        $mostRespondedImageId = ImageFrequency::orderByDesc('response_count')->value('image_id');

        // Get the count of responses for the most responded image
        $mostRespondedImageCount = ImageFrequency::where('image_id', $mostRespondedImageId)->value('response_count');

        // Get the base64-encoded image data for the most responsed image id
        $mostRespondedImageData = MnistImage::where('image_id', $mostRespondedImageId)->value('image_base64');

        // Get the most misidentifcated image id
        $mostMisidentificatedImageId = Misidentification::orderByDesc('count')->value('image_id');

        // Get the count of misidentifications for the most misidentified image
        $mostMisidentificatedImageCount = Misidentification::where('image_id', $mostMisidentificatedImageId)->value('count');

        // Get the base64-encoded image data for the most misidentificated image id
        $mostMisidentificatedImageData = MnistImage::where('image_id', $mostMisidentificatedImageId)->value('image_base64');

        // Get the most generated number
        $mostGeneratedNumberResult = NumberFrequency::select('label')
            ->orderByDesc('count')
            ->limit(1)
            ->first();

        $mostGeneratedNumber = $mostGeneratedNumberResult ? $mostGeneratedNumberResult->label : null;

        // Get the most misidentified number from the misidentifications table
        $mostMisidentifiedNumberResult = Misidentification::select('correct_label')
            ->groupBy('correct_label')
            ->orderByDesc(DB::raw('SUM(count)'))
            ->limit(1)
            ->first();

        $mostMisidentifiedNumber = $mostMisidentifiedNumberResult ? $mostMisidentifiedNumberResult->correct_label : null;

        // Calculate the average response time in milliseconds
        $averageResponseTimeInMilliseconds = Response::avg('response_time');

        // Convert milliseconds to seconds
        $averageResponseTimeInSeconds = $averageResponseTimeInMilliseconds / 1000;

        // Round the average response time to 2 decimal places
        $roundedAverageResponseTime = round($averageResponseTimeInSeconds, 2);

        // Calculate the average response per day from image_frequencies table
        $averageResponsePerDay = ImageFrequency::selectRaw('COUNT(DISTINCT DATE(created_at)) as day_count, SUM(response_count) as total_response_count')
            ->first(); // Use first to get the result as an object

        // Check if there are days to avoid division by zero
        if ($averageResponsePerDay->day_count > 0) {
            // Calculate the rounded average response per day
            $roundedAverageResponsePerDay = round($averageResponsePerDay->total_response_count / $averageResponsePerDay->day_count, 2);
        } else {
            // Handle the case where there are no days
            $roundedAverageResponsePerDay = 0.00;
        }

        // Pass the data to the Overview page
        $data = [
            'totalGeneratedImages' => $totalGeneratedImages,
            'trainImagesCount' => $trainImagesCount,
            'testImagesCount' => $testImagesCount,
            'totalResponses' => $totalResponses,
            'responsesFromTrain' => $responsesFromTrain,
            'responsesFromTest' => $responsesFromTest,
            'totalMisidentifications' => $totalMisidentifications,
            'misidentificationsFromTrain' => $misidentificationsFromTrain,
            'misidentificationsFromTest' => $misidentificationsFromTest,
            'mostGeneratedImageId' => $mostGeneratedImageId,
            'mostRespondedImageId' => $mostRespondedImageId,
            'mostMisidentificatedImageId' => $mostMisidentificatedImageId,
            'mostGeneratedNumber' => $mostGeneratedNumber, 
            'mostMisidentifiedNumber' => $mostMisidentifiedNumber,
            'averageResponseTime' => $roundedAverageResponseTime,
            'averageResponsePerDay' => $roundedAverageResponsePerDay,
            'mostGeneratedImageData' => $mostGeneratedImageData,
            'mostRespondedImageData' => $mostRespondedImageData,
            'mostMisidentificatedImageData' => $mostMisidentificatedImageData,
            'mostGeneratedImageCount' => $mostGeneratedImageCount,
            'mostMisidentificatedImageCount' => $mostMisidentificatedImageCount,
            'mostRespondedImageCount' => $mostRespondedImageCount,
            // Add more data as needed for other sections
        ];

        return Inertia::render('Overview/Overview', $data);
    }
}
