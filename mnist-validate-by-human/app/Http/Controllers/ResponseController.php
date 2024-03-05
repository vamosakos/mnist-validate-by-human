<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Response;
use App\Models\Misidentification;
use App\Models\MnistImage;
use App\Models\ImageFrequency;

class ResponseController extends Controller
{
    public function saveResponse(Request $request)
    {
        // Validate the request data if necessary
        $response = new Response();
        $response->image_id = $request->input('image_id');
        $response->guest_response = $request->input('guest_response');
        $response->session_id = $request->session()->getId();
        $response->response_time = $request->input('response_time');
        
        $response->save();
    

        // Update 'image_frequencies' table
        $imageFrequency = ImageFrequency::where('image_id', $response->image_id)->first();

        if ($imageFrequency) {
            // If 'image_frequencies' record exists, increment the response count
            $imageFrequency->increment('response_count');
        } else {
            // If 'image_frequencies' record does not exist, create a new record
            ImageFrequency::create([
                'image_id' => $response->image_id,
                'generation_count' => 1,
                'response_count' => 1,
            ]);
        }

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

    public function getIdentificationsCount()
    {
        $identificationsCount = Response::count();
        return response()->json(['count' => $identificationsCount]);
    }

}
