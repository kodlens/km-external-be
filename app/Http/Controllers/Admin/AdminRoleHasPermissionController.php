<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RoleHasPermission;
use Auth;
use App\Models\Role;
use App\Models\Permission;
use Inertia\Inertia;
use Inertia\Response;


class AdminRoleHasPermissionController extends Controller
{
    //
    public function index(){
        $roles = Auth::user()->load('role', 'role.role_has_permissions.permission')->role->role_has_permissions;
        $permissions = [];
        // convert to plain array
        foreach($roles as $permission){
            array_push($permissions, $permission->permission->name);
        }

        $selectPermissions = Permission::orderBy('label', 'asc')->get();

        $selectRoles = Role::orderBy('role', 'asc')
            ->get();

        return Inertia::render('Panel/RoleHasPermission/RoleHasPermissionIndex', [
            'permissions' => $permissions,
            'selectRoles' => $selectRoles,
            'selectPermissions' => $selectPermissions,
        ]);
    }


    public function show($id){
        return RoleHasPermission::find($id);
    }


    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = RoleHasPermission::with('permission', 'role')
            ->whereHas('permission', function($q) use ($req){
                $q->where('module_name', 'like', $req->module . '%');
            })
            ->whereHas('role', function($q) use ($req){
                $q->where('role', 'like', $req->role . '%');
            })
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }


    public function store(Request $req){
    
        $req->validate([
            'permission' => ['required'],
            'role' => ['required'],
        ]);

        $exists = RoleHasPermission::where('role_id', $req->role)
            ->where('permission_id', $req->permission)
            ->exists();

        if($exists){
            return response()->json([
                'errors' => [
                    'permission' => ['Permission and roles already assigned.']
                ],
                'message' => 'Already assigned.'
            ], 422);
        }
        
     
        RoleHasPermission::create([
            'permission_id' => $req->permission,
            'role_id' => $req->role
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }


    public function edit($id){

        $roles = Role::orderBy('role', 'asc')
        ->get();

        $permissions = Permission::orderBy('label', 'asc')
            ->get();
            
        $data = RoleHasPermission::find($id);

        return view('panel.role-has-permission.role-has-permission-create-edit')
            ->with('id', $id)
            ->with('roles', $roles)
            ->with('data', $data)
            ->with('permissions', $permissions);
    }

    public function update(Request $req, $id){
    
        $req->validate([
            'permission' => ['required'],
            'role' => ['required'],
        ]);

        $data = RoleHasPermission::find($id);
        $data->permission_id = $req->permission;
        $data->role_id = $req->role;
        $data->save();
        
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $data = RoleHasPermission::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
