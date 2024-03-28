<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ImageFrequency extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'image_frequencies';

    protected $fillable = ['image_id', 'generation_count', 'response_count'];

    protected $dates = ['deleted_at'];

    public function mnistImage()
    {
        return $this->belongsTo(MnistImage::class, 'image_id');
    }

    public function responses()
    {
        return $this->hasMany(Response::class, 'image_id', 'image_id');
    }
}