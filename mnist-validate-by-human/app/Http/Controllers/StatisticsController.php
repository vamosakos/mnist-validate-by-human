<?php

namespace App\Http\Controllers;

use App\Models\ImageFrequency;
use App\Models\MnistImage;
use App\Models\Misidentification;
use App\Models\Response;
use App\Models\ImageGenerationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response as FacadeResponse;
use Symfony\Component\Process\Process;

class StatisticsController extends Controller
{
    private function fetchImageFrequencies($viewName)
    {
        $imageFrequencies = ImageFrequency::all();
    
        // Fetch misidentifications count for each image
        $imageFrequencies->each(function ($frequency) {
            $frequency->misidentifications_count = Misidentification::where('image_id', $frequency->image_id)->sum('count');
        });
    
        return Inertia::render($viewName, [
            'imageFrequencies' => $imageFrequencies,
        ]);
    }

    public function getImageById($imageId)
    {
        $mnistImage = MnistImage::where('image_id', $imageId)->first();

        if (!$mnistImage) {
            return response()->json(['error' => 'Image not found.'], 404);
        }

        return FacadeResponse::make(base64_decode($mnistImage->image_base64), 200, [
            'Content-Type' => 'image/png',
        ]);
    }

    public function imageFrequencies()
    {
        return $this->fetchImageFrequencies('Statistics/ImageFrequencies');
        
    }

    public function imageFrequenciesDataList()
    {
        return $this->fetchImageFrequencies('Statistics/ImageFrequenciesDataList');
    }

    public function calculateLabelCounts()
    {
        $responses = Response::join('mnist_images', 'responses.image_id', '=', 'mnist_images.image_id')
            ->select('mnist_images.image_label', 'responses.guest_response')
            ->get();

        $label_counts = [];

        foreach ($responses as $response) {
            $image_label = $response->image_label;
            $guest_response = $response->guest_response;

            if (!isset($label_counts[$image_label])) {
                $label_counts[$image_label] = array_fill(0, 10, 0);
            }

            $label_counts[$image_label][$guest_response]++;
        }

        return $label_counts;
    }

    public function generateHeatmap()
    {
        // Data retrieval from the backend
        $labelCounts = $this->calculateLabelCounts();
    
        // Data conversion to JSON format
        $jsonData = json_encode($labelCounts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
        // Path to the Python script
        $scriptPath = base_path('storage/scripts/mnist_heatmap.py');
    
        // Executing the Python script with shell_exec and passing data in JSON format
        $output = shell_exec("python $scriptPath \"$jsonData\"");
    
        // Extract the base64-encoded image data from the Python script output
        $heatmap_base64 = trim($output); // Remove any leading/trailing whitespace
    
        // Returning the base64-encoded image data
        return response()->json(['heatmap_base64' => $heatmap_base64]);
    }

    public function fetchResponses($viewName)
    {
        // Fetch responses from the database
        $responses = Response::all();
    
        // Modify or process the responses data as needed
    
        return Inertia::render($viewName, [
            'responses' => $responses,
        ]);
    }
    
    public function responsesDataList()
    {
        return $this->fetchResponses('Statistics/ResponsesDataList');
    }

    public function responsesGraphsCharts()
    {
        return $this->fetchResponses('Statistics/ResponsesGraphsCharts');
    }

    public function deleteSelectedItems(Request $request, $model)
    {
        // Ellenőrizzük, hogy van-e kiválasztott elem
        if (!$request->has('selectedRows')) {
            return response()->json(['error' => 'Nincsenek kiválasztott elemek.'], 400);
        }
    
        // Kiválasztott elemek törlése
        $selectedRows = $request->selectedRows;
    
        try {
            // Logikai törlés végrehajtása
            $model::whereIn('id', $selectedRows)->delete();
    
            // Sikeres törlés esetén válasz küldése
            return response()->json(['message' => 'Az elemek sikeresen törölve lettek.'], 200);
        } catch (\Exception $e) {
            // Hiba esetén hibaüzenet küldése
            return response()->json(['error' => 'Hiba történt a törlés során.'], 500);
        }
    }
    
    public function deleteSelectedImageFrequency(Request $request)
    {
        return $this->deleteSelectedItems($request, ImageFrequency::class);
    }
    
    public function deleteSelectedResponse(Request $request)
    {
        return $this->deleteSelectedItems($request, Response::class);
    }

    public function setActiveFunction(Request $request)
    {
        // Ellenőrizzük, hogy a kért funkció neve valóban létezik-e az adatbázisban
        $validFunctions = ['generateRandomImage', 'generateFrequencyWeightedImage', 'generateMisidentificationWeightedImage', 'generateRandomTrainImage', 'generateRandomTestImage'];
        if (!in_array($request->function_name, $validFunctions)) {
            return response()->json(['message' => 'Invalid function name.'], 422);
        }

        // Frissítjük az adatbázist az új aktív funkcióval
        ImageGenerationSetting::where('function_name', $request->function_name)
            ->update(['active' => 1]);

        // Minden más funkció inaktívvá válik
        ImageGenerationSetting::where('function_name', '!=', $request->function_name)
            ->update(['active' => 0]);

        return response()->json(['message' => 'Active settings updated successfully.']);
    }

}