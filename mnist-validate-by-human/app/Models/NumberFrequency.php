<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NumberFrequency extends Model
{
    use HasFactory;

    protected $table = 'number_frequencies';

    protected $fillable = ['label', 'count'];
}
