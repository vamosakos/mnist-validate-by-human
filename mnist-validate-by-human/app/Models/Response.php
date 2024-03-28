<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Response extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['image_id', 'guest_response', 'session_id', 'response_time'];

    protected $dates = ['deleted_at'];

    public function mnistImage()
    {
        return $this->belongsTo(MnistImage::class, 'image_id');
    }

    public function imageFrequency()
    {
        return $this->belongsTo(ImageFrequency::class, 'image_id', 'image_id');
    }

}
