<?php

namespace App\Http\Controllers;

use App\Models\MnistImage;
use App\Models\ImageFrequency;
use App\Models\NumberFrequency;
use App\Models\UuidImage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;


class ImageController extends Controller
{
    public function generateImage()
    {
        // Randomly select a record from the database
        $mnistImage = MnistImage::inRandomOrder()->first();

        // If no record found, return empty response
        if (!$mnistImage) {
            return response()->json([], 404);
        }

        // Update 'image_frequencies' table
        $imageFrequency = ImageFrequency::where('image_id', $mnistImage->image_id)->first();

        if ($imageFrequency) {
            // If 'image_frequencies' record exists, increment the generation count
            $imageFrequency->increment('generation_count');
        } else {
            // If 'image_frequencies' record does not exist, create a new record
            ImageFrequency::create([
                'image_id' => $mnistImage->image_id,
                'generation_count' => 1, // Increment generation count when a new image is generated
                'response_count' => 0,
            ]);
        }

        // Update 'number_frequencies' table
        $numberFrequency = NumberFrequency::where('label', $mnistImage->image_label)->first();

        if ($numberFrequency) {
            // If 'number_frequencies' record exists, increment the count
            $numberFrequency->increment('count');
        } else {
            // If 'number_frequencies' record does not exist, create a new record
            NumberFrequency::create([
                'label' => $mnistImage->image_label,
                'count' => 1, // Increment count when a new image with the label is generated
            ]);
        }

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

        // Select images with weights based on frequency
        $mnistImage = MnistImage::leftJoin('image_frequencies', 'mnist_images.image_id', '=', 'image_frequencies.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(image_frequencies.generation_count, 0) as generation_count'))
            ->where('generation_count', '<', 5) // Azokat a képeket válassza ki, amelyeknek a generációszáma 5 alatt van
            ->orderBy('generation_count', 'asc') // Növekvő sorrendben rendezze az alapján, hogy milyen gyakran jelennek meg
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->inRandomOrder() // Vegye figyelembe a véletlenszerű sorrendet
            ->first();
        
        // Handle the case when no record is found
        while (!$mnistImage || UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists()) {
            $mnistImage = MnistImage::inRandomOrder()->first();
        }
    
        // Associate the selected image with the current session
        $this->associateImageWithSession($mnistImage->image_id, $uniqueId);

        // Update 'image_frequencies' and 'number_frequencies' tables
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);
    
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
        
        // Select images with weights based on misidentifications
        $mnistImage = MnistImage::leftJoin('misidentifications', 'mnist_images.image_id', '=', 'misidentifications.image_id')
            ->select('mnist_images.*', DB::raw('COALESCE(misidentifications.count, 0) as misidentification_count'))
            ->where('misidentifications.count', '>', 0)
            ->orderBy('misidentification_count', 'desc')
            ->whereNotIn('mnist_images.image_id', function ($query) use ($uniqueId) {
                $query->select('image_id')
                    ->from('uuid_images')
                    ->where('uuid', $uniqueId);
            })
            ->inRandomOrder()
            ->first();

        // If no record is found or the selected image is already associated with the session, try again
        while (!$mnistImage || UuidImage::where('uuid', $uniqueId)->where('image_id', $mnistImage->image_id)->exists()) {
            $mnistImage = MnistImage::inRandomOrder()->first();
        }

        // If still no record is found, handle the case when no images are available
        if (!$mnistImage) {
            return response()->json(['error' => 'No images available'], 404);
        }

        // Associate the selected image with the current session
        $this->associateImageWithSession($mnistImage->image_id, $uniqueId);

        // Update 'image_frequencies' and 'number_frequencies' tables
        $this->updateImageFrequency($mnistImage->image_id);
        $this->updateNumberFrequency($mnistImage->image_label);

        // Return the selected image to the frontend along with the unique ID
        return response()->json([
            'image_id' => $mnistImage->image_id,
            'image_label' => $mnistImage->image_label,
            'image_base64' => $mnistImage->image_base64,
            'unique_id' => $uniqueId
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
        DB::table('uuid_images')->insert([
            'uuid' => $uniqueId,
            'image_id' => $imageId,
            'created_at' => now(),
            'updated_at' => now()
        ]);
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

