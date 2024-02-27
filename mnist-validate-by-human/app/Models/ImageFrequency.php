<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageFrequency extends Model
{
    use HasFactory;

    protected $table = 'image_frequencies';

    protected $fillable = ['image_id', 'generation_count', 'response_count'];

    public function mnistImage()
    {
        return $this->belongsTo(MnistImage::class, 'image_id');
    }
}