<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'role',
        'guard_name',
    ];


    public function role_has_permissions(){
        return $this->hasMany(RoleHasPermission::class, 'role_id');
    }
}
