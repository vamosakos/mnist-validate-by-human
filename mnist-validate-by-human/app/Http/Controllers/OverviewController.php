<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImageFrequency;
use App\Models\Misidentification;
use App\Models\MnistImage;
use App\Models\NumberFrequency;
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

        // Get the most responsed image id
        $mostRespondedImageId = ImageFrequency::orderByDesc('response_count')->value('image_id');

        // Get the most misidentifcated image id
        $mostMisidentificatedImageId = Misidentification::orderByDesc('count')->value('image_id');

        // Get the most generated number
        $mostGeneratedNumberResult = NumberFrequency::select('label')
            ->orderByDesc('count')
            ->limit(1)
            ->first();

        $mostGeneratedNumber = $mostGeneratedNumberResult ? $mostGeneratedNumberResult->label : null;

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
            // Add more data as needed for other sections
        ];

        return Inertia::render('Overview/Overview', $data);
    }
}
