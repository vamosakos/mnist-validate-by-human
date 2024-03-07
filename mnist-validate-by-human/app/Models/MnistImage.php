<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MnistImage extends Model
{
    use HasFactory;

    protected $table = 'mnist_images';
    
    protected $fillable = ['image_id', 'image_label', 'image_base64'];

    public function misidentifications()
    {
        return $this->hasMany(Misidentification::class, 'correct_label');
    }
}
