<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ChangePasswordController extends Controller
{
    public function index(){
        $user = Auth::user();

        if($user->role == 'publisher'){
            return Inertia::render('Publisher/PublisherChangePassword');
        }

        if($user->role == 'author'){
            return Inertia::render('Author/AuthorChangePassword');
        }

        
    }

    public function changePassword(Request $req){

        $req->validate([
            'old_password' => 'required',
            'password' => 'confirmed|min:4|different:old_password',
        ]);

        if (Hash::check($req->old_password, Auth::user()->password)) { 
        
           $data = Auth::user();
           $data->password = Hash::make($req->password);
           $data->save();

           return response()->json([
            'status' => 'changed'
           ], 200);
        }else{
            return response()->json([
                'errors' => [
                    'old_password' => ['Invalid password.']
                ]
            ], 422);
        }
            
    }
}
