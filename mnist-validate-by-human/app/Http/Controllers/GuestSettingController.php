<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\GuestSetting;

class GuestSettingController extends Controller
{
    public function getSessionData()
    {
        // Az aktuális session ID lekérése
        $sessionId = Session::getId();
    
        // Ellenőrizzük, hogy van-e rekord a guest_settings táblában az aktuális session ID-vel
        $guestSetting = GuestSetting::where('session_id', $sessionId)->first();
    
        // Ha van rekord, akkor visszatérünk az adatokkal, különben üres választ küldünk
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
        // Validáljuk az adatokat és állítsuk be a szükséges szabályokat
        $validatedData = $request->validate([
            'field_of_study' => 'required|string',
            'hand' => 'required|in:left,right',
        ]);
    
        // Hozzunk létre egy új GuestSetting rekordot és mentsük el az adatbázisba
        $guestSetting = new GuestSetting();
        $guestSetting->field_of_study = $validatedData['field_of_study'];
        $guestSetting->hand = $validatedData['hand'];
        $guestSetting->session_id = $request->session()->getId();
        $guestSetting->save();
    
        // Válasz küldése a kliensnek
        return response()->json(['message' => 'Guest setting stored successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        // Validáljuk az adatokat és állítsuk be a szükséges szabályokat
        $validatedData = $request->validate([
            'field_of_study' => 'required|string',
            'hand' => 'required|in:left,right',
        ]);

        // Keresünk a megadott ID-val rendelkező rekordot
        $guestSetting = GuestSetting::find($id);
        if (!$guestSetting) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        // Frissítjük a rekordot az új adatokkal
        $guestSetting->field_of_study = $validatedData['field_of_study'];
        $guestSetting->hand = $validatedData['hand'];
        $guestSetting->save();

        // Válasz küldése a kliensnek
        return response()->json(['message' => 'Guest setting updated successfully']);
    }
}
