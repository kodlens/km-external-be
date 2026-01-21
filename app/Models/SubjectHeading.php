<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubjectHeading extends Model
{
    protected $fillable = [
        'subject_id',
        'subject_heading',
        'slug',
        'active',
    ];
}
