<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'field_of_study',
        'hand',
        'session_id',
    ];
}
