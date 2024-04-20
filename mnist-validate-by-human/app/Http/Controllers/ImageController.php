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
        // Lekérjük az aktív funkciót az adatbázisból
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
        
        // Ellenőrizzük, hogy a megadott aktív funkció létezik-e
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
    
        // Hívjuk meg az aktív funkciót, átadva a request-et és a train és test mezőket
        return $this->{$activeFunctionData->function_name}($request, $activeFunctionData->train, $activeFunctionData->test);
    }

    public function generateRandomImage(Request $request)
    {
        // Get the unique ID from the request header
        $uniqueId = $request->header('X-Client-Token');

        if (!$uniqueId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $startTime = microtime(true);

        // Lekérjük az aktív funkciót az adatbázisból
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
        
        // Ellenőrizzük, hogy a megadott aktív funkció létezik-e
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
        
        // Ellenőrizzük, hogy a train és test mezők értéke true
        if (!$activeFunctionData->train && !$activeFunctionData->test) {
            return response()->json(['message' => 'Train and test fields must be true.'], 400);
        }

        // Get all Mnist images based on the train and test flags
        $query = MnistImage::query();

        if ($activeFunctionData->train && !$activeFunctionData->test) {
            // Only select images with IDs from 0 to 59999
            $query->where('image_id', '<', 60000);
        } elseif (!$activeFunctionData->train && $activeFunctionData->test) {
            // Only select images with IDs from 60000 to the end
            $query->where('image_id', '>=', 60000);
        }

        // Get all matching records
        $mnistImages = $query->get();

        // Shuffle the array of records
        $shuffledImages = $mnistImages->shuffle();

        // Get the first image from the shuffled array
        $mnistImage = $shuffledImages->first();

        $endTime = microtime(true);

        $executionTime = ($endTime - $startTime);

        \Illuminate\Support\Facades\Log::info("Execution time for RandomImage: $executionTime seconds");

        // If no record found, return the case when no images are available
        if (!$mnistImage) {
            return response()->json(['error' => 'No images available'], 404);
        }

        // Update 'image_frequencies' and 'number_frequencies' tables
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);

        // Return the image ID, label, and base64-encoded image to the frontend
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64
        ]);
    }

    public function generateFrequencyWeightedImage(Request $request)
    {
        // Get the unique ID from the request header
        $uniqueId = $request->header('X-Client-Token');
    
        if (!$uniqueId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $startTime = microtime(true);
    
        // Find the active function settings
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
    
        // Check if the active function data is found
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
    
        // Determine the range of image_ids based on the active function settings
        [$lowerBound, $upperBound] = $this->determineImageIdRange($activeFunctionData, $this->trainThreshold, $this->testThreshold);
    
        $maxGenerationCount = ImageFrequency::max('generation_count');
    
        // Calculate the threshold for generation count
        $weightThreshold = ($maxGenerationCount > 0) ? ceil($maxGenerationCount / 2) : 0;
    
        // Now integrate this range into the main query
        $belowThresholdImages = MnistImage::leftJoin('image_frequencies', 'mnist_images.image_id', '=', 'image_frequencies.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(image_frequencies.generation_count, 0) as generation_count'))
            ->where('generation_count', '<', $weightThreshold)
            ->orWhereNull('generation_count') // generation_count NULL or 0
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->whereBetween('mnist_images.image_id', [$lowerBound, $upperBound]) // Add the range constraint
            ->orderBy('generation_count', 'asc')
            ->get();
    
        // If there are images below or equals the threshold, select one randomly
        if ($belowThresholdImages->isNotEmpty()) {
            // Select a random image from below threshold images
            $mnistImage = $belowThresholdImages->random();
        } else {
            // If no such images, continue with the original logic
            do {
                // Get all Mnist images based on the dataset
                $allMnistImages = MnistImage::whereBetween('image_id', [$lowerBound, $upperBound])->get();
    
                // Shuffle the array of records
                $shuffledImages = $allMnistImages->shuffle();
    
                // Get the first image from the selected array
                $mnistImage = $shuffledImages->first();
            } while (UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists());
        }
    
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime);
    
        \Illuminate\Support\Facades\Log::info("Execution time for FrequencyWeightedImage: $executionTime seconds");
    
        // Associate the selected image with the current session
        $this->associateImageWithSession($mnistImage->image_id, $uniqueId);
    
        // Update 'image_frequencies' and 'number_frequencies' tables
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);
    
        // Log the selected image id
        \Illuminate\Support\Facades\Log::info("Selected image id: $mnistImage->image_id");
    
        // Return the selected image to the frontend
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64
        ]);
    }

    public function generateMisidentificationWeightedImage(Request $request)
    {
        // Get the unique ID from the request header
        $uniqueId = $request->header('X-Client-Token');
    
        if (!$uniqueId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $startTime = microtime(true);
    
        // Find the active function settings
        $activeFunctionData = ImageGenerationSetting::where('active', true)->first();
    
        // Check if the active function data is found
        if (!$activeFunctionData) {
            return response()->json(['message' => 'Active function not found.'], 404);
        }
    
        [$lowerBound, $upperBound] = $this->determineImageIdRange($activeFunctionData, $this->trainThreshold, $this->testThreshold);
    
        // Find the maximum misidentification count
        $maxMisidentificationCount = Misidentification::max('count');
    
        // Calculate the threshold for misidentification count
        $weightThreshold = ($maxMisidentificationCount > 0) ? ceil($maxMisidentificationCount / 2) : 0;
    
        // Select images with weights based on misidentifications
        $aboveThresholdImages = MnistImage::leftJoin('misidentifications', 'mnist_images.image_id', '=', 'misidentifications.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(misidentifications.count, 0) as misidentification_count'))
            ->where('misidentifications.count', '>=', $weightThreshold)
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->whereBetween('mnist_images.image_id', [$lowerBound, $upperBound]) // Add the range constraint
            ->get();
    
        // If there are images above or equals the weight threshold, select one randomly
        if ($aboveThresholdImages->isNotEmpty()) {
            $mnistImage = $aboveThresholdImages->random();
        }
    
        // If no record is found try to find a record with count below the threshold but above 0
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
                ->whereBetween('mnist_images.image_id', [$lowerBound, $upperBound]) // Add the range constraint
                ->get();
    
            // If there are images below the threshold, select one randomly
            if ($belowThresholdImages->isNotEmpty()) {
                $mnistImage = $belowThresholdImages->random();
            } else {
                // If no such images, continue with the original logic
                do {
                    // Get all Mnist images
                    $allMnistImages = MnistImage::whereBetween('image_id', [$lowerBound, $upperBound])->get();
    
                    // Shuffle the array of records
                    $shuffledImages = $allMnistImages->shuffle();
    
                    // Get the first image from the selected array
                    $mnistImage = $shuffledImages->first();
                } while (UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists());
            }
        }
    
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime);
    
        \Illuminate\Support\Facades\Log::info("Execution time for MisidentificationWeightedImage: $executionTime seconds");
    
        // Associate the selected image with the current session
        $this->associateImageWithSession($mnistImage->image_id, $uniqueId);
    
        // Update 'image_frequencies' and 'number_frequencies' tables
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);
    
        // Return the selected image to the frontend
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64,
        ]);
    }    


    public function determineImageIdRange($activeFunctionData, $trainThreshold, $testThreshold)
    {
        $lowerBound = 0;
        $upperBound = 0;

        if ($activeFunctionData->train == 1 && $activeFunctionData->test == 1) {
            // Both train and test are active, all image_ids are eligible
            $upperBound = $testThreshold - 1;
        } elseif ($activeFunctionData->train == 1 && $activeFunctionData->test == 0) {
            // Only train is active, image_ids range from 0 to $trainThreshold - 1
            $upperBound = $trainThreshold - 1;
        } elseif ($activeFunctionData->train == 0 && $activeFunctionData->test == 1) {
            // Only test is active, image_ids range from $trainThreshold to $testThreshold - 1
            $lowerBound = $trainThreshold;
            $upperBound = $testThreshold - 1;
        }

        return [$lowerBound, $upperBound];
    }
    
    private function updateImageFrequency($imageId)
    {
        // Update 'image_frequencies' table
        $imageFrequency = ImageFrequency::where('image_id', $imageId)->first();

        if ($imageFrequency) {
            // If 'image_frequencies' record exists, increment the generation count
            $imageFrequency->increment('generation_count');
        } else {
            // If 'image_frequencies' record does not exist, create a new record
            ImageFrequency::create([
                'image_id' => $imageId,
                'generation_count' => 1, // Increment generation count when a new image is generated
                'response_count' => 0,
            ]);
        }
    }

    private function updateNumberFrequency($label)
    {
        // Update 'number_frequencies' table
        $numberFrequency = NumberFrequency::where('label', $label)->first();

        if ($numberFrequency) {
            // If 'number_frequencies' record exists, increment the count
            $numberFrequency->increment('count');
        } else {
            // If 'number_frequencies' record does not exist, create a new record
            NumberFrequency::create([
                'label' => $label,
                'count' => 1, // Increment count when a new image with the label is generated
            ]);
        }
    }

    // Helper function to associate an image with a session
    private function associateImageWithSession($imageId, $uniqueId)
    {
        $uuidImage = new UuidImage();
        $uuidImage->uuid = $uniqueId;
        $uuidImage->image_id = $imageId;
        $uuidImage->save();
    }


    public function generateRandomImageOld()
    {
        // Execute the Python script to generate a random MNIST image ID, label, dataset type, and base64-encoded image
        chdir(base_path());
        $scriptPath = base_path('storage/scripts/old_random_mnist_script.py');
        $output = shell_exec("python $scriptPath");

        // Process the output to extract the image ID, label, dataset type, and base64-encoded image
        $outputArray = explode(" ", trim($output)); // Split the output into an array using space as delimiter
        $imageId = (int)$outputArray[0]; // First element contains the image ID
        $imageLabel = (int)$outputArray[1]; // Second element contains the image label
        $datasetType = $outputArray[2]; // Third element contains the dataset type (train or test)
        $imageBase64 = $outputArray[3]; // Fourth element contains the base64-encoded image

        // If dataset type is 'test', add 60000 to the image ID
        if ($datasetType === 'test') {
            $imageId += 60000;
        }

        // Check if the image ID already exists in the database
        $mnistImage = MnistImage::where('image_id', $imageId)->first();

        if (!$mnistImage) {
            // Image ID does not exist, so create a new record
            $mnistImage = MnistImage::create([
                'image_id' => $imageId,
                'image_label' => $imageLabel,
                'image_base64' => $imageBase64, // Add the base64-encoded image to the database
            ]);
        }

        // Update 'image_frequencies' table
        $imageFrequency = ImageFrequency::where('image_id', $imageId)->first();

        if ($imageFrequency) {
            // If 'image_frequencies' record exists, increment the generation count
            $imageFrequency->increment('generation_count');
        } else {
            // If 'image_frequencies' record does not exist, create a new record
            ImageFrequency::create([
                'image_id' => $imageId,
                'generation_count' => 1, // Increment generation count when a new image is generated
                'response_count' => 0,
            ]);
        }

        // Update 'number_frequencies' table
        $numberFrequency = NumberFrequency::where('label', $imageLabel)->first();

        if ($numberFrequency) {
            // If 'number_frequencies' record exists, increment the count
            $numberFrequency->increment('count');
        } else {
            // If 'number_frequencies' record does not exist, create a new record
            NumberFrequency::create([
                'label' => $imageLabel,
                'count' => 1, // Increment count when a new image with the label is generated
            ]);
        }

        // Return the image ID, label, dataset type, and base64-encoded image to the frontend
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $imageBase64
        ]);
    }
}

