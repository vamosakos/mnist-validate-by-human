<?php

namespace App\Http\Controllers;

use App\Models\MnistImage;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function generateImage()
    {
        // Execute the Python script to generate a random MNIST image ID, label, and base64-encoded image
        chdir(base_path());
        $scriptPath = base_path('storage/scripts/mnist_script.py');
        $output = shell_exec("python $scriptPath");

        // Process the output to extract the image ID, label, and base64-encoded image
        $outputArray = explode(" ", trim($output)); // Split the output into an array using space as delimiter
        $imageId = (int)$outputArray[0]; // First element contains the image ID
        $imageLabel = (int)$outputArray[1]; // Second element contains the image label
        $imageBase64 = $outputArray[2]; // Third element contains the base64-encoded image

        // Save the generated MNIST image ID, label, and base64-encoded image to the database
        MnistImage::create([
            'image_id' => $imageId,
            'image_label' => $imageLabel,
        ]);

        // Return the image ID, label, and base64-encoded image to the frontend
        return Response::json([
            'image_id' => $imageId,
            'image_label' => $imageLabel,
            'image_base64' => $imageBase64
        ]);
    }
}