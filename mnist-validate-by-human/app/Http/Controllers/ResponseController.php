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
    public function getIdentificationsCount()
    {
        $identificationsCount = Response::count();
        return response()->json(['count' => $identificationsCount]);
    }

    public function saveMultipleResponses(Request $request)
    {
        $responses = $request->input('responses');
    
        foreach ($responses as $responseItem) {
            $response = new Response();
            $response->image_id = $responseItem['image_id'];
            $response->guest_response = $responseItem['guest_response'];
            $response->session_id = session()->getId();
            $response->response_time = $responseItem['response_time'];
            $response->save();
    
            $imageFrequency = ImageFrequency::where('image_id', $response->image_id)->first();
    
            if ($imageFrequency) {
                $imageFrequency->increment('response_count');
            } else {
                ImageFrequency::create([
                    'image_id' => $response->image_id,
                    'generation_count' => 1,
                    'response_count' => 1,
                ]);
            }
    
            $this->checkMisidentification($response);
        }
    
        return response()->json(['message' => 'Multiple responses saved successfully']);
    }
    
    private function checkMisidentification(Response $response)
    {
        $correctLabel = MnistImage::where('image_id', $response->image_id)->value('image_label');
    
        if ($correctLabel !== $response->guest_response) {
            $this->handleMisidentification($response->image_id, $correctLabel);
        }
    }

    private function handleMisidentification($imageId, $correctLabel)
    {
        $misidentification = Misidentification::where('image_id', $imageId)->first();
    
        if ($misidentification) {
            $misidentification->count++;
            $misidentification->save();
        } else {
            Misidentification::create([
                'image_id' => $imageId,
                'correct_label' => $correctLabel,
            ]);
        }
    }

}
