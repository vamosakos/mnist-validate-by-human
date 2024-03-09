<?php

namespace App\Http\Controllers;

use App\Models\ImageFrequency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function imageFrequencies()
    {
        $imageFrequencies = ImageFrequency::all();

        return Inertia::render('Statistics/ImageFrequencies', [
            'imageFrequencies' => $imageFrequencies,
        ]);
    }
}