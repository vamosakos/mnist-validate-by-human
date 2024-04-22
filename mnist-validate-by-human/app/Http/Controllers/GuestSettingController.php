<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\GuestSetting;

class GuestSettingController extends Controller
{
    public function getSessionData()
    {
        $sessionId = Session::getId();
    
        $guestSetting = GuestSetting::where('session_id', $sessionId)->first();
    
        if ($guestSetting) {
            return response()->json([
                'exists' => true,
                'record' => $guestSetting
            ]);
        } else {
            return response()->json(['exists' => false]);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'field_of_study' => 'required|string',
            'hand' => 'required|in:left,right',
        ]);
    
        $guestSetting = new GuestSetting();
        $guestSetting->field_of_study = $validatedData['field_of_study'];
        $guestSetting->hand = $validatedData['hand'];
        $guestSetting->session_id = $request->session()->getId();
        $guestSetting->save();
    
        return response()->json(['message' => 'Guest setting stored successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'field_of_study' => 'required|string',
            'hand' => 'required|in:left,right',
        ]);

        $guestSetting = GuestSetting::find($id);
        if (!$guestSetting) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $guestSetting->field_of_study = $validatedData['field_of_study'];
        $guestSetting->hand = $validatedData['hand'];
        $guestSetting->save();

        return response()->json(['message' => 'Guest setting updated successfully']);
    }
}
