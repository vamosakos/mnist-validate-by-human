<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'comment' => 'required',
            'email' => 'nullable|email',
        ]);

        $feedback = new Feedback();
        $feedback->comment = $validatedData['comment'];
        $feedback->email = $validatedData['email'];
        $feedback->save();

        return response()->json(['message' => 'Feedback stored successfully'], 201);
    }
}
