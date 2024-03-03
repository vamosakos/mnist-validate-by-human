<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'ip_address',
        'user_agent',
        'payload',
        'last_activity'
    ];

    public function responses()
    {
        return $this->hasMany(Response::class, 'session_id');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'session_id');
    }
}
