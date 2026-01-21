<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Auth;

class MyAccountController extends Controller
{
    public function index(){

        $user = Auth::user();

        if($user->role == 'publisher'){
            return Inertia::render('Publisher/PublisherMyAccount', []);
        }

        if($user->role == 'author'){
            return Inertia::render('Author/AuthorMyAccount', []);
        }
        
    }

    public function update(Request $req){
        $user = Auth::user();

        $req->validate([
            'username' => ['required', 'unique:users,username,' .$user->id .',id'],
            'lastname' => ['required', 'max:100', 'string'],
            'firstname' => ['required', 'max:100', 'string'],
            'middlename' => ['max:100'],
            'sex' => ['required', 'max:100', 'string']
        ]);
      

        $data = User::find($user->id);
        $data->username = $req->username;
        $data->lastname = $req->lastname;
        $data->firstname = $req->firstname;
        $data->middlename = $req->middlename;
        $data->sex = $req->sex;
        $data->bio = $req->bio;
        $data->save();

        return response()->json([
            'status' => 'updated'
        ], 200);
    }
}
