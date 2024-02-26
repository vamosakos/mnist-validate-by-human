<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Misidentification extends Model
{
    use HasFactory;

    protected $table = 'misidentifications';

    protected $fillable = ['image_id', 'correct_label', 'count'];

    public function mnistImage()
    {
        return $this->belongsTo(MnistImage::class, 'image_id');
    }
}
