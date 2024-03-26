<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageGenerationSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('image_generation_settings')->insert([
            ['function_name' => 'generateRandomImage', 'active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['function_name' => 'generateFrequencyWeightedImage', 'active' => false, 'created_at' => now(), 'updated_at' => now()],
            ['function_name' => 'generateMisidentificationWeightedImage', 'active' => false, 'created_at' => now(), 'updated_at' => now()],
            ['function_name' => 'generateRandomTrainImage', 'active' => false, 'created_at' => now(), 'updated_at' => now()],
            ['function_name' => 'generateRandomTestImage', 'active' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
