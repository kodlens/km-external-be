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

        'record_trail',
        'trash'
    ];


    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function author(){
        return $this->belongsTo(User::class, 'author_id')
            ->select('id', 'lastname', 'firstname', 'middlename', 'bio');
    }

    public function quarter(){
        return $this->belongsTo(Quarter::class);
    }

    public function status(){
        return $this->belongsTo(Status::class);
    }

    public function postlogs(){
        return $this->hasMany(PostLog::class)
            ->orderBy('id', 'desc');
    }

}
