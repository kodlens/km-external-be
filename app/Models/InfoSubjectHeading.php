<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfoSubjectHeading extends Model
{
    //

    protected $fillable = [
        'info_id',
        'subject_heading_id',
        'score',
        'analysis'
    ];
}
