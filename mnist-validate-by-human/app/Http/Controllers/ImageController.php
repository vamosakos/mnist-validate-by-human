<?php

namespace App\Http\Controllers;

use App\Models\MnistImage;
use App\Models\ImageFrequency;
use App\Models\NumberFrequency;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function generateImage()
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
