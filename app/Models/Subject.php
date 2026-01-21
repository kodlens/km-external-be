<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'subject',
        'active',
    ];

    public function subject_headings(){
        return $this->hasMany(SubjectHeading::class);
    }

}
