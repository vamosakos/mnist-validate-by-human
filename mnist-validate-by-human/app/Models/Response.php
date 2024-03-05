<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use HasFactory;

    protected $fillable = ['image_id', 'guest_response', 'session_id', 'response_time'];

    public function mnistImage()
    {
        return $this->belongsTo(MnistImage::class, 'image_id');
    }

}
