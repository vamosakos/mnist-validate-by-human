<?php

namespace App\Http\Controllers;

use App\Models\ImageFrequency;
use App\Models\MnistImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;

class StatisticsController extends Controller
{
    public function imageFrequencies()
    {
        $imageFrequencies = ImageFrequency::all();

        return Inertia::render('Statistics/ImageFrequencies', [
            'imageFrequencies' => $imageFrequencies,
        ]);
    }

    public function getImageById($imageId)
    {
        $mnistImage = MnistImage::where('image_id', $imageId)->first();

        if (!$mnistImage) {
            return response()->json(['error' => 'Image not found.'], 404);
        }

        return Response::make(base64_decode($mnistImage->image_base64), 200, [
            'Content-Type' => 'image/png',
        ]);
    }
}