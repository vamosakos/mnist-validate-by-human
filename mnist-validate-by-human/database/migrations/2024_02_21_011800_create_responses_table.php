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
        Schema::create('responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('image_id'); // Match the data type of mnist_images' id
            $table->foreign('image_id')->references('image_id')->on('mnist_images')->onDelete('cascade');
            $table->integer('guest_response');
            $table->string('session_id');
            $table->foreign('session_id')->references('id')->on('sessions');
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('responses');
    }
};
