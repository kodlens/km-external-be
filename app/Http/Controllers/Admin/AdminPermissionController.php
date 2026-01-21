<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;
use Auth;
use Inertia\Inertia;
use Inertia\Response;


class AdminPermissionController extends Controller
{
    //
    public function index(){

        $roles = Auth::user()->load('role', 'role.role_has_permissions.permission')->role->role_has_permissions;
        $permissions = [];
        // convert to plain array
        foreach($roles as $permission){
            array_push($permissions, $permission->permission->name);
        }
        return Inertia::render('Admin/Permission/PermissionIndex', [
            'permissions' => $permissions
        ]);
    }


    public function show($id){
        return Permission::find($id);
    }

    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Permission::where('label', 'like', $req->label . '%')
            ->orderBy($sort[0], $sort[1]);
            
        if($req->module != '' || $req->module != null){
            $data->where('module_name', 'like', $req->module . '%');
        }
            
        return $data->paginate($req->perpage);
    }


    public function store(Request $req){
    
        $req->validate([
            'label' => ['required'],
            'module_name' => ['required'],
            'name' => ['required', 'unique:permissions'],
        ]);

        Permission::create([
            'module_name' => strtoupper($req->module_name),
            'label' => ucfirst($req->label),
            'name' => strtolower($req->name),
            'description' => $req->description,
            'guard_name' => 'web'
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }



    public function update(Request $req, $id){
    
        $req->validate([
            'module_name' => ['required'],
            'label' => ['required'],
            'name' => ['required', 'unique:permissions,name,' . $id . ',id'],
        ]);

        $data = Permission::find($id);
        $data->module_name = strtoupper($req->module_name);
        $data->label = ucfirst($req->label);
        $data->name = strtolower($req->name);
        $data->description = $req->description;
        $data->save();
        
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $data = Permission::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
