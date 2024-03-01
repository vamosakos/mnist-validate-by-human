<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'comment' => 'required',
        ]);

        $feedback = new Feedback();
        $feedback->comment = $validatedData['comment'];
        $feedback->session_id = $request->session()->getId();
        $feedback->save();

        return response()->json(['message' => 'Feedback stored successfully'], 201);
    }
}
