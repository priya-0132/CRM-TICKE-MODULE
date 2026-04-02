<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'description',
    ];

    // ✅ Relationship: Log belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}