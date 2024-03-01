<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecaptchaController extends Controller
{
    public function verify(Request $request)
    {
        $response = Http::asForm()
            ->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => '6Le0v38pAAAAABjgagZZf-G1KTGcY1YUfWRxN5Ut',
                'response' => $request->input('captchaResponse'),
            ])->json();

        if ($response['success']) {
            // A ReCAPTCHA válasz sikeres, engedélyezzük a felhasználó műveletét
            return response()->json(['success' => true]);
        } else {
            // A ReCAPTCHA válasz sikertelen, küldjünk vissza hibát vagy egyéb megfelelő választ
            return response()->json(['success' => false, 'error' => 'Invalid reCAPTCHA response']);
        }
    }
}
