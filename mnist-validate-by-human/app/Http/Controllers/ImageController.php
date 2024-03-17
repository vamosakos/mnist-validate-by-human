<?php

namespace App\Http\Controllers;

use App\Models\MnistImage;
use App\Models\ImageFrequency;
use App\Models\NumberFrequency;
use App\Models\Misidentification;
use App\Models\UuidImage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;


class ImageController extends Controller
{
    public function generateRandomImage()
    {
        // Randomly select a record from the database
        $mnistImage = MnistImage::inRandomOrder()->first();

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

    public function generateWeightedRandomImage(Request $request)
    {
        // Get the unique ID from the request header
        $uniqueId = $request->header('X-Client-Token');

        // Find the maximum generation count
        $maxGenerationCount = ImageFrequency::max('generation_count');

        // Calculate the threshold for generation count
        $threshold = ($maxGenerationCount > 0) ? ceil($maxGenerationCount / 2) : 0;

        // Log the threshold value
        \Illuminate\Support\Facades\Log::info("Threshold for generation count: $threshold");

        // Select images with weights based on frequency
        $aboveThresholdImages = MnistImage::leftJoin('image_frequencies', 'mnist_images.image_id', '=', 'image_frequencies.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(image_frequencies.generation_count, 0) as generation_count'))
            ->where('generation_count', '<=', $threshold)
            ->orderBy('generation_count', 'asc')
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->get();

        // If there are images below or equals the treshold, select one randomly
        if ($aboveThresholdImages->isNotEmpty()) {
            $mnistImage = $aboveThresholdImages->random();
        } else {
            // If no such images, continue with the original logic
            do {
                $mnistImage = MnistImage::inRandomOrder()->first();
            } while (UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists());
        }

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
        
        // Find the maximum misidentification count
        $maxMisidentificationCount = Misidentification::max('count');

        // Calculate the threshold for misidentification count
        $threshold = ($maxMisidentificationCount > 0) ? ceil($maxMisidentificationCount / 2) : 0;

        // Log the threshold value
        \Illuminate\Support\Facades\Log::info("Threshold for misidentification count: $threshold");

        // Select images with weights based on misidentifications
        $aboveThresholdImages = MnistImage::leftJoin('misidentifications', 'mnist_images.image_id', '=', 'misidentifications.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(misidentifications.count, 0) as misidentification_count'))
            ->where('misidentifications.count', '>=', $threshold)
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->get();

        // If there are images above or equals the treshold, select one randomly
        if ($aboveThresholdImages->isNotEmpty()) {
            $mnistImage = $aboveThresholdImages->random();
        }

        // If no record is found try to find a record with count below the threshold but above 0
        if ($aboveThresholdImages->isEmpty()) {
            $belowThresholdImages = MnistImage::leftJoin('misidentifications', 'mnist_images.image_id', '=', 'misidentifications.image_id')
                ->select('mnist_images.*', DB::raw('COALESCE(misidentifications.count, 0) as misidentification_count'))
                ->where('misidentifications.count', '>', 0)
                ->where('misidentifications.count', '<', $threshold)
                ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                    $query->select('image_id')
                        ->from('uuid_images')
                        ->where('uuid', $uniqueId);
                })
                ->get();

            // If there are images below the threshold, select one randomly
            if ($belowThresholdImages->isNotEmpty()) {
                $mnistImage = $belowThresholdImages->random();
            } else {
                // If no such images, continue with the original logic
                do {
                    $mnistImage = MnistImage::inRandomOrder()->first();
                } while (UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists());
            }
        }

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
            'image_base64' => $mnistImage->image_base64,
        ]);
    }

    public function generateRandomTrainImages()
    {
        // Randomly select a record from the database where image_id is between 0 and 59999
        $mnistImage = MnistImage::whereBetween('image_id', [0, 59999])->inRandomOrder()->first();
    
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
    
    public function generateRandomTestImages()
    {
        // Randomly select a record from the database where image_id is between 60000 and 69999
        $mnistImage = MnistImage::whereBetween('image_id', [60000, 69999])->inRandomOrder()->first();
    
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


    public function generateImageOld()
    {
        // Execute the Python script to generate a random MNIST image ID, label, dataset type, and base64-encoded image
        chdir(base_path());
        $scriptPath = base_path('storage/scripts/random_mnist_script.py');
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

