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
        $responses = Response::all();
        
        $guestSettings = GuestSetting::all();
        $settingMapping = $guestSettings->keyBy('session_id');
        $responses->each(function ($response) use ($settingMapping) {
            $guestSetting = $settingMapping->get($response->session_id);
            $response->hand = optional($guestSetting)->hand ?? 'Unknown hand';
            $response->field_of_study = optional($guestSetting)->field_of_study ?? 'Unknown major';
        });
        
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
        $labelCounts = $this->calculateLabelCounts();
    
        $jsonData = json_encode($labelCounts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
        $scriptPath = base_path('storage/scripts/mnist_heatmap.py');
    
        $output = shell_exec("python $scriptPath \"$jsonData\"");

        $heatmap_base64 = trim($output);
    
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
                $imageFrequency->responses()->delete();
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
                $imageFrequency = $response->imageFrequency;

                $misidentification = Misidentification::where('image_id', $response->image_id)
                ->where('correct_label', '<>', $response->guest_response)
                ->first();
    
                $response->delete();
    
                if ($imageFrequency->response_count > 0) {
                    $imageFrequency->response_count--;

                    if ($imageFrequency->generation_count > 0) {
                        $imageFrequency->generation_count--;
                    }
                }

                if ($imageFrequency->generation_count == 0) {
                    $imageFrequency->delete();
                }
    
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
        $validFunctions = ['generateRandomImage', 'generateFrequencyWeightedImage', 'generateMisidentificationWeightedImage', 'generateRandomTrainImage', 'generateRandomTestImage'];
        if (!in_array($request->function_name, $validFunctions)) {
            return response()->json(['message' => 'Invalid function name.'], 422);
        }
    
        ImageGenerationSetting::where('function_name', $request->function_name)
            ->update([
                'active' => 1,
                'train' => $request->train ?? true,
                'test' => $request->test ?? true 
            ]);
    
        ImageGenerationSetting::where('function_name', '!=', $request->function_name)
            ->update([
                'active' => 0,
                'train' => 0,
                'test' => 0
            ]);
    
        return response()->json(['message' => 'Active settings updated successfully.']);
    }
    
}