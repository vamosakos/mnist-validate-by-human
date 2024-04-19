<?php

namespace App\Http\Controllers;

use App\Models\ImageFrequency;
use App\Models\MnistImage;
use App\Models\Misidentification;
use App\Models\Response;
use App\Models\ImageGenerationSetting;
use App\Models\GuestSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
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

    public function imageFrequenciesCharts()
    {
        return $this->fetchImageFrequencies('Statistics/ImageFrequenciesCharts');
    }

    public function imageFrequenciesDataList()
    {
        return $this->fetchImageFrequencies('Statistics/ImageFrequenciesDataList');
    }

    private function fetchResponses($viewName)
    {
        // Fetch responses from the database
        $responses = Response::all();
        
        // Fetch guest settings based on session_id and add 'hand' and 'field_of_study' information to responses
        $guestSettings = GuestSetting::all();
        $settingMapping = $guestSettings->keyBy('session_id');
        $responses->each(function ($response) use ($settingMapping) {
            $guestSetting = $settingMapping->get($response->session_id);
            $response->hand = optional($guestSetting)->hand ?? 'Unknown hand';
            $response->field_of_study = optional($guestSetting)->field_of_study ?? 'Unknown major';
        });
        
        // Modify or process the responses data as needed
        
        return Inertia::render($viewName, [
            'responses' => $responses,
        ]);
    }
    
    public function responsesDataList()
    {
        return $this->fetchResponses('Statistics/ResponsesDataList');
    }

    public function responsesCharts()
    {
        return $this->fetchResponses('Statistics/ResponsesCharts');
    }
    
    public function getImageById($imageId)
    {
        $mnistImage = MnistImage::where('image_id', $imageId)->first();
    
        if (!$mnistImage) {
            return response()->json(['error' => 'Image not found.'], 404);
        }
    
        // Base64-kódolt kép adatának visszaadása
        return response()->json([
            'image_data' => $mnistImage->image_base64,
            'image_label' => $mnistImage->image_label
        ]);
    }

    private function calculateLabelCounts()
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

    public function deleteSelectedImageFrequency(Request $request)
    {
        if (!$request->has('selectedRows')) {
            return response()->json(['error' => 'Nincsenek kiválasztott elemek.'], 400);
        }
    
        $selectedRows = $request->selectedRows;
    
        try {
            $imageFrequencies = ImageFrequency::whereIn('id', $selectedRows)->get();
    
            foreach ($imageFrequencies as $imageFrequency) {
                // Töröljük a kapcsolódó válaszokat
                $imageFrequency->responses()->delete();
                // Töröljük az ImageFrequency-t
                $imageFrequency->delete();
            }
    
            return response()->json(['message' => 'Az elemek sikeresen törölve lettek.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hiba történt a törlés során.'], 500);
        }
    }
    
    
    public function deleteSelectedResponse(Request $request)
    {
        if (!$request->has('selectedRows')) {
            return response()->json(['error' => 'Nincsenek kiválasztott elemek.'], 400);
        }
    
        $selectedRows = $request->selectedRows;
    
        try {
            $responses = Response::whereIn('id', $selectedRows)->get();
    
            foreach ($responses as $response) {
                // Get the associated image frequency
                $imageFrequency = $response->imageFrequency;
    
                // Check for misidentification
                $misidentification = Misidentification::where('image_id', $response->image_id)
                ->where('correct_label', '<>', $response->guest_response)
                ->first();
    
                // Delete the response
                $response->delete();
    
                // Decrease response_count
                if ($imageFrequency->response_count > 0) {
                    $imageFrequency->response_count--;
                    
                    // Decrease generation_count by the same amount as response_count
                    if ($imageFrequency->generation_count > 0) {
                        $imageFrequency->generation_count--;
                    }
                }

                // Delete the record if generation_count is zero
                if ($imageFrequency->generation_count == 0) {
                    $imageFrequency->delete();
                }
    
                // Decrease misidentifications count if misidentification exists and guest_response doesn't match correct_label
                if ($misidentification && $response->guest_response != $misidentification->correct_label) {
                    if ($misidentification->count > 0) {
                        $misidentification->count--;
                        if ($misidentification->count == 0) {
                            $misidentification->delete();
                        } else {
                            $misidentification->save();
                        }
                    }
                }
    
                $imageFrequency->save();
            }
    
            return response()->json(['message' => 'Az elemek sikeresen törölve lettek.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hiba történt a törlés során: '.$e->getMessage()], 500);
        }
    }
    
    public function getActiveFunction()
    {
        $activeSetting = ImageGenerationSetting::where('active', 1)->first();

        if ($activeSetting) {
            return response()->json([
                'activeFunction' => $activeSetting->function_name,
                'train' => $activeSetting->train,
                'test' => $activeSetting->test
            ]);
        } else {
            return response()->json([
                'activeFunction' => null,
                'train' => null,
                'test' => null
            ]);
        }
    }

    public function setActiveFunction(Request $request)
    {
        // Ellenőrizzük, hogy a kért funkció neve valóban létezik-e az adatbázisban
        $validFunctions = ['generateRandomImage', 'generateFrequencyWeightedImage', 'generateMisidentificationWeightedImage', 'generateRandomTrainImage', 'generateRandomTestImage'];
        if (!in_array($request->function_name, $validFunctions)) {
            return response()->json(['message' => 'Invalid function name.'], 422);
        }
    
        // Frissítjük az adatbázist az új aktív funkcióval és a train, test mezőkkel
        ImageGenerationSetting::where('function_name', $request->function_name)
            ->update([
                'active' => 1,
                'train' => $request->train ?? true,
                'test' => $request->test ?? true 
            ]);
    
        // Minden más funkció inaktívvá válik
        ImageGenerationSetting::where('function_name', '!=', $request->function_name)
            ->update([
                'active' => 0,
                'train' => 0,
                'test' => 0
            ]);
    
        return response()->json(['message' => 'Active settings updated successfully.']);
    }
    
}