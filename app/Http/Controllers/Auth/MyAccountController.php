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

        if($user->role == 'encoder'){
            return Inertia::render('Encoder/EncoderMyAccount', []);
        }

    }

    public function update(Request $req){
        $user = Auth::user();

        $req->validate([
            //'username' => ['required', 'unique:users,username,' .$user->id .',id'],
            'lname' => ['required', 'max:100', 'string'],
            'fname' => ['required', 'max:100', 'string'],
            'mname' => ['max:100'],
            'sex' => ['required', 'max:100', 'string']
        ]);


        $data = User::find($user->id);
        //$data->username = $req->username;
        $data->lname = $req->lname;
        $data->fname = $req->fname;
        $data->mname = $req->mname;
        $data->sex = $req->sex;
        $data->save();

        return response()->json([
            'status' => 'updated'
        ], 200);
    }
}
