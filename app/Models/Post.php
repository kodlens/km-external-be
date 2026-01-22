<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;


    protected $table = 'infos';
    //protected $primaryKey = 'id';

    protected $fillable = [
        'source_id',
        'title',
        'excerpt',

        'description',
        'description_text',

        'alias',
        'url',
        'agency_code',
        'thumbnail',

        'tags',
        'status',
        'source',
        'source_url',
        'content_type',
        'region',
        'agency',
        'regional_office',

        'is_publish',
        'publish_date',
        'material_type',

        'catalog_date',
        'author_name',
        'subject_headings',
        'publisher_name',
        'submittcategoryed_date',

        'encoded_by',
        'last_updated_by',

        'record_trail',
        'trash'
    ];




    public function subjects(){
        return $this->hasMany(InfoSubjectHeading::class, 'info_id', 'id')
          ->join('subject_headings', 'info_subject_headings.subject_heading_id', '=', 'subject_headings.id')
          ->join('subjects', 'subject_headings.subject_id', '=', 'subjects.id')
          ->select('info_subject_headings.*', 'subject_heading', 'subject', 'subject_id');
    }

}
