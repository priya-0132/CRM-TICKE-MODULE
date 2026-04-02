<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    // Add all fields you want to fill
    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'file',
        'author_id',
        'assigned_to',
    ];

    // Relations
    public function author() {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function assignee() {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
{
    return $this->hasMany(Comment::class);
}
}