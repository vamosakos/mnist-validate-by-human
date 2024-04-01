<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Feedback;
use Carbon\Carbon;
use Inertia\Inertia;

class FeedbackController extends Controller
{

    public function index()
    {
        $feedbacks = Feedback::all()->map(function ($feedback) {
            $feedback->formatted_created_at = Carbon::parse($feedback->created_at)->format('Y-m-d H:i:s');
            return $feedback;
        });
        
        return Inertia::render('Feedback/Feedback', [
            'feedbacks' => $feedbacks
        ]);
    }

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
