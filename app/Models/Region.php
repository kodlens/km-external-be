<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $primaryKey = 'region_id';

    protected $fillable = [
        'name',
        'description',
        'order_no',
        'active'
    ];
}
