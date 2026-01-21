<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Models\Role;


class AdminRoleController extends Controller
{
    //
    public function index(){
        $roles = Auth::user()->load('role', 'role.role_has_permissions.permission')->role->role_has_permissions;
        $permissions = [];
        // convert to plain array
        foreach($roles as $permission){
            array_push($permissions, $permission->permission->name);
        }
        return Inertia::render('Admin/Role/RoleIndex', [
                'permissions'=> $permissions
        ]); 
    }


    public function show($id){
        return Role::find($id);
    }


    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Role::where('role', 'like', $req->role . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);
        return $data;
    }


    public function store(Request $req){
    
        $req->validate([
            'role' => ['required', 'unique:roles'],
        ]);

        Role::create([
            'role' => strtoupper($req->role),
            'guard_name' => 'web'
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }


    public function update(Request $req, $id){
    
        $req->validate([
            'role' => ['required', 'unique:roles,role,' . $id . ',id'],
        ]);

        $data = Role::find($id);
        $data->role = strtoupper($req->role);
        $data->save();
        
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $data = Role::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
