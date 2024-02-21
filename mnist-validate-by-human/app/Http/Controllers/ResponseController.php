<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;

class ResponseController extends Controller
{
    public function saveResponse(Request $request)
    {
        // Validate the request data if necessary

        $response = new Response();
        $response->image_id = $request->input('image_id');
        $response->guest_response = $request->input('guest_response');
        
        $response->save();

        return response()->json(['message' => 'Response saved successfully']);
    }
}
