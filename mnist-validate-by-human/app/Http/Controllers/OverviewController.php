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
        $totalGeneratedImages = $this->getTotalGeneratedImages();
        $trainImagesCount = $this->getImagesCount(0, 59999);
        $testImagesCount = $this->getImagesCount(60000, 69999);

        $totalResponses = $this->getTotalResponses();
        $responsesFromTrain = $this->getResponsesCount(0, 59999);
        $responsesFromTest = $this->getResponsesCount(60000, 69999);

        $totalMisidentifications = $this->getTotalMisidentifications();
        $misidentificationsFromTrain = $this->getMisidentificationsCount(0, 4);
        $misidentificationsFromTest = $this->getMisidentificationsCount(5, 9);

        $mostGeneratedImageId = $this->getMostGeneratedImageId();
        $mostGeneratedImageCount = $this->getImageCount($mostGeneratedImageId);
        $mostGeneratedImageData = $this->getImageData($mostGeneratedImageId);

        $mostRespondedImageId = $this->getMostRespondedImageId();
        $mostRespondedImageCount = $this->getImageCount($mostRespondedImageId);
        $mostRespondedImageData = $this->getImageData($mostRespondedImageId);

        $mostMisidentificatedImageId = $this->getMostMisidentificatedImageId();
        $mostMisidentificatedImageCount = $this->getMisidentificatedImageCount($mostMisidentificatedImageId);
        $mostMisidentificatedImageData = $this->getImageData($mostMisidentificatedImageId);

        $mostGeneratedNumber = $this->getMostGeneratedNumber();

        $mostMisidentifiedNumber = $this->getMostMisidentifiedNumber();

        $averageResponseTime = $this->getAverageResponseTime();

        $averageResponsePerDay = $this->getAverageResponsePerDay();

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
            'averageResponseTime' => $averageResponseTime,
            'averageResponsePerDay' => $averageResponsePerDay,
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

    private function getTotalGeneratedImages()
    {
        return ImageFrequency::sum('generation_count');
    }

    private function getImagesCount($start, $end)
    {
        return ImageFrequency::whereBetween('image_id', [$start, $end])->sum('generation_count');
    }

    private function getTotalResponses()
    {
        return ImageFrequency::sum('response_count');
    }

    private function getResponsesCount($start, $end)
    {
        return ImageFrequency::whereBetween('image_id', [$start, $end])->sum('response_count');
    }

    private function getTotalMisidentifications()
    {
        return Misidentification::sum('count');
    }

    private function getMisidentificationsCount($start, $end)
    {
        return Misidentification::whereBetween('correct_label', [$start, $end])->sum('count');
    }

    private function getMostGeneratedImageId()
    {
        return ImageFrequency::orderByDesc('generation_count')->value('image_id');
    }

    private function getMostRespondedImageId()
    {
        return ImageFrequency::orderByDesc('response_count')->value('image_id');
    }

    private function getImageCount($imageId)
    {
        return ImageFrequency::where('image_id', $imageId)->value('generation_count');
    }

    private function getImageData($imageId)
    {
        return MnistImage::where('image_id', $imageId)->value('image_base64');
    }

    private function getMostMisidentificatedImageId()
    {
        return Misidentification::orderByDesc('count')->value('image_id');
    }

    private function getMisidentificatedImageCount($imageId)
    {
        return Misidentification::where('image_id', $imageId)->value('count');
    }

    private function getMostGeneratedNumber()
    {
        $result = NumberFrequency::select('label')
            ->orderByDesc('count')
            ->limit(1)
            ->first();

        return $result ? $result->label : null;
    }

    private function getMostMisidentifiedNumber()
    {
        $result = Misidentification::select('correct_label')
            ->groupBy('correct_label')
            ->orderByDesc(DB::raw('SUM(count)'))
            ->limit(1)
            ->first();

        return $result ? $result->correct_label : null;
    }

    private function getAverageResponseTime()
    {
        $averageResponseTimeInMilliseconds = Response::avg('response_time');
        return round($averageResponseTimeInMilliseconds / 1000, 2);
    }

    private function getAverageResponsePerDay()
    {
        $result = ImageFrequency::selectRaw('COUNT(DISTINCT DATE(created_at)) as day_count, SUM(response_count) as total_response_count')
            ->first();

        if ($result->day_count > 0) {
            return round($result->total_response_count / $result->day_count, 2);
        } else {
            return 0.00;
        }
    }
}
