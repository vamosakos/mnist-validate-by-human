<?php

namespace App\Http\Controllers;

use App\Models\MnistImage;
use App\Models\ImageFrequency;
use App\Models\NumberFrequency;
use App\Models\Misidentification;
use App\Models\UuidImage;
use App\Models\ImageGenerationSetting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ImageController extends Controller
{
    private $trainThreshold = 60000;
    private $testThreshold = 70000;

    public function imageGenerationSettings()
    {
        return Inertia::render('ImageGenerationSettings/ImageGenerationSettings');
    }

    public function generateImage(Request $request)
    {
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
        
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
    
        return $this->{$activeFunctionData->function_name}($request, $activeFunctionData->train, $activeFunctionData->test);
    }

    public function generateRandomImage(Request $request)
    {
        $uniqueId = $request->header('X-Client-Token');

        if (!$uniqueId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $startTime = microtime(true);

        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
        
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
        
        if (!$activeFunctionData->train && !$activeFunctionData->test) {
            return response()->json(['message' => 'Train and test fields must be true.'], 400);
        }

        $query = MnistImage::query();

        if ($activeFunctionData->train && !$activeFunctionData->test) {
            $query->where('image_id', '<', 60000);
        } elseif (!$activeFunctionData->train && $activeFunctionData->test) {
            $query->where('image_id', '>=', 60000);
        }

        $mnistImages = $query->get();

        $shuffledImages = $mnistImages->shuffle();

        $mnistImage = $shuffledImages->first();

        $endTime = microtime(true);

        $executionTime = ($endTime - $startTime);

        \Illuminate\Support\Facades\Log::info("Execution time for RandomImage: $executionTime seconds");
        \Illuminate\Support\Facades\Log::info("Selected RandomImage id: $mnistImage->image_id");

        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);

        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64
        ]);
    }

    public function generateFrequencyWeightedImage(Request $request)
    {
        $uniqueId = $request->header('X-Client-Token');
    
        if (!$uniqueId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $startTime = microtime(true);
    
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
    
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
    
        [$lowerBound, $upperBound] = $this->determineImageIdRange($activeFunctionData, $this->trainThreshold, $this->testThreshold);
    
        $maxGenerationCount = ImageFrequency::max('generation_count');
    
        $weightThreshold = ($maxGenerationCount > 0) ? ceil($maxGenerationCount / 2) : 0;
    
        $belowThresholdImages = MnistImage::leftJoin('image_frequencies', 'mnist_images.image_id', '=', 'image_frequencies.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(image_frequencies.generation_count, 0) as generation_count'))
            ->where('generation_count', '<', $weightThreshold)
            ->orWhereNull('generation_count')
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->whereBetween('mnist_images.image_id', [$lowerBound, $upperBound])
            ->orderBy('generation_count', 'asc')
            ->get();
    
        if ($belowThresholdImages->isNotEmpty()) {
            $mnistImage = $belowThresholdImages->random();
        } else {
            do {
                $allMnistImages = MnistImage::whereBetween('image_id', [$lowerBound, $upperBound])->get();
    
                $shuffledImages = $allMnistImages->shuffle();
    
                $mnistImage = $shuffledImages->first();
            } while (UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists());
        }
    
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime);
    
        \Illuminate\Support\Facades\Log::info("Execution time for FrequencyWeightedImage: $executionTime seconds");
        \Illuminate\Support\Facades\Log::info("Selected FrequencyWeightedImage id: $mnistImage->image_id");
    
        $this->associateImageWithSession($mnistImage->image_id, $uniqueId);
    
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);
    
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64
        ]);
    }

    public function generateMisidentificationWeightedImage(Request $request)
    {
        $uniqueId = $request->header('X-Client-Token');
    
        if (!$uniqueId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $startTime = microtime(true);
    
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
    
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
    
        [$lowerBound, $upperBound] = $this->determineImageIdRange($activeFunctionData, $this->trainThreshold, $this->testThreshold);
    
        $maxMisidentificationCount = Misidentification::max('count');
    
        $weightThreshold = ($maxMisidentificationCount > 0) ? ceil($maxMisidentificationCount / 2) : 0;
    
        $aboveThresholdImages = MnistImage::leftJoin('misidentifications', 'mnist_images.image_id', '=', 'misidentifications.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(misidentifications.count, 0) as misidentification_count'))
            ->where('misidentifications.count', '>=', $weightThreshold)
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->whereBetween('mnist_images.image_id', [$lowerBound, $upperBound])
            ->get();
    
        if ($aboveThresholdImages->isNotEmpty()) {
            $mnistImage = $aboveThresholdImages->random();
        }
    
        if ($aboveThresholdImages->isEmpty()) {
            $belowThresholdImages = MnistImage::leftJoin('misidentifications', 'mnist_images.image_id', '=', 'misidentifications.image_id')
                ->select('mnist_images.*', DB::raw('COALESCE(misidentifications.count, 0) as misidentification_count'))
                ->where('misidentifications.count', '>', 0)
                ->where('misidentifications.count', '<', $weightThreshold)
                ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                    $query->select('image_id')
                        ->from('uuid_images')
                        ->where('uuid', $uniqueId);
                })
                ->whereBetween('mnist_images.image_id', [$lowerBound, $upperBound])
                ->get();
    
            if ($belowThresholdImages->isNotEmpty()) {
                $mnistImage = $belowThresholdImages->random();
            } else {
                do {
                    $allMnistImages = MnistImage::whereBetween('image_id', [$lowerBound, $upperBound])->get();
    
                    $shuffledImages = $allMnistImages->shuffle();

                    $mnistImage = $shuffledImages->first();
                } while (UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists());
            }
        }
    
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime);
    
        \Illuminate\Support\Facades\Log::info("Execution time for MisidentificationWeightedImage: $executionTime seconds");
        \Illuminate\Support\Facades\Log::info("Selected MisidentificationWeightedImage id: $mnistImage->image_id");

        $this->associateImageWithSession($mnistImage->image_id, $uniqueId);
    
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);
    
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64,
        ]);
    }    


    private function determineImageIdRange($activeFunctionData, $trainThreshold, $testThreshold)
    {
        $lowerBound = 0;
        $upperBound = 0;

        if ($activeFunctionData->train == 1 && $activeFunctionData->test == 1) {
            $upperBound = $testThreshold - 1;
        } elseif ($activeFunctionData->train == 1 && $activeFunctionData->test == 0) {
            $upperBound = $trainThreshold - 1;
        } elseif ($activeFunctionData->train == 0 && $activeFunctionData->test == 1) {
            $lowerBound = $trainThreshold;
            $upperBound = $testThreshold - 1;
        }

        return [$lowerBound, $upperBound];
    }
    
    private function updateImageFrequency($imageId)
    {
        $imageFrequency = ImageFrequency::where('image_id', $imageId)->first();

        if ($imageFrequency) {
            $imageFrequency->increment('generation_count');
        } else {
            ImageFrequency::create([
                'image_id' => $imageId,
                'generation_count' => 1,
                'response_count' => 0,
            ]);
        }
    }

    private function updateNumberFrequency($label)
    {
        $numberFrequency = NumberFrequency::where('label', $label)->first();

        if ($numberFrequency) {
            $numberFrequency->increment('count');
        } else {
            NumberFrequency::create([
                'label' => $label,
                'count' => 1,
            ]);
        }
    }

    private function associateImageWithSession($imageId, $uniqueId)
    {
        $uuidImage = new UuidImage();
        $uuidImage->uuid = $uniqueId;
        $uuidImage->image_id = $imageId;
        $uuidImage->save();
    }

}
