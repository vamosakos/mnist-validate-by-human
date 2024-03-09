<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UuidImage extends Model
{
    use HasFactory;

    protected $table = 'uuid_images';
    
    protected $fillable = ['uuid, image_id'];

}
