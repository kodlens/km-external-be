<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    //
    protected $fillable = [
        'article_id',
        'content_type',
        'slug',
        'title',
        'content',
        'clean_content',
        'url',
        'source',
        'agency',
        'regional_office',
        'is_publish',
        'material_type',
        'author',
        'publisher_name',
        'category'
    ];
}
