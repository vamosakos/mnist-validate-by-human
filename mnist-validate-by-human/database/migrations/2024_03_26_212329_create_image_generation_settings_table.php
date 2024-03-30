<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('image_generation_settings', function (Blueprint $table) {
            $table->id();
            $table->enum('function_name', ['generateRandomImage', 'generateFrequencyWeightedImage', 'generateMisidentificationWeightedImage', 'generateRandomTrainImage', 'generateRandomTestImage']);
            $table->boolean('active')->default(false);
            $table->boolean('train')->default(true);
            $table->boolean('test')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('image_generation_settings');
    }
};
