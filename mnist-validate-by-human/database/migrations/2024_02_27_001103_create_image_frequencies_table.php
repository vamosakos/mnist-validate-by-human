<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImageFrequenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('image_frequencies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('image_id')->index();
            $table->foreign('image_id')->references('image_id')->on('mnist_images')->onDelete('cascade');
            $table->integer('generation_count')->default(0);
            $table->integer('response_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('image_frequencies');
    }
}