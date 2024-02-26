<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;
use App\Models\Misidentification;
use App\Models\MnistImage;

class ResponseController extends Controller
{
    public function saveResponse(Request $request)
    {
        // Validate the request data if necessary
        $response = new Response();
        $response->image_id = $request->input('image_id');
        $response->guest_response = $request->input('guest_response');
        
        $response->save();
    
        // Check if the guest response is a misidentification
        $this->checkMisidentification($response);
    
        return response()->json(['message' => 'Response saved successfully']);
    }
    
    private function checkMisidentification(Response $response)
    {
        $correctLabel = MnistImage::where('image_id', $response->image_id)->value('image_label');
    
        if ($correctLabel !== $response->guest_response) {
            // It's a misidentification, insert or update count in misidentifications table
            $this->handleMisidentification($response->image_id, $correctLabel);
        }
    }

    private function handleMisidentification($imageId, $correctLabel)
    {
        $misidentification = Misidentification::where('image_id', $imageId)->first();
    
        if ($misidentification) {
            // Misidentification record exists, update count
            $misidentification->count++;
            $misidentification->save();
        } else {
            // Misidentification record doesn't exist, create a new one
            Misidentification::create([
                'image_id' => $imageId,
                'correct_label' => $correctLabel,
            ]);
        }
    }
}
