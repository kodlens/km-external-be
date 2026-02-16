<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    //
    protected $fillable = [
        'source_id',
        'title',
        'excerpt',

        'description',
        'description_text',

        'alias',
        // 'url',
        // 'agency_code',
        // 'thumbnail',

        'tags',
        'status',
        // 'source',
        'source_url',
        //'content_type',
        'region',
        'agency',
        //'regional_office',

        'is_publish',
        'publish_date',
        'material_type',

        'catalog_date',
        'author_name',
        'subject_headings',
        'publisher_name',
        //'submittcategoryed_date',

        'encoded_by',
        'last_updated_by',

        'record_trail',
        'trash',
        'is_archive'
    ];
}
