<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;
use Auth;


class AdminTrashController extends Controller
{
    
    public function index()
    {
        return Inertia::render('Admin/Trash/TrashIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);
        
        $cat = '';
        $status = '';

        if($req->title != '' || $req->title != null){
           $cat = $req->title;
        }
        if($req->status != '' || $req->status != null){
            $status = $req->status;
        }
        
        $user = Auth::user()->load('role');

        $data = Post::with(['category', 'author', 'status']);
        if ($status != '') {
            $data = $data->where('status_id', $status);
        }
        $data->where('title', 'like', '%'. $req->search . '%');

        

        /** for the meantime, author and publisher and admin can access this
         * roles that created aside from these roles name is not allowed to get data here
        */
       //AUTHOR
        if(strtolower($user->role->role) === 'author'){

            return $data->where('author_id', $user->id)
                ->where('trash', 1)
                ->orderBy('id', 'desc')
                ->paginate($req->perpage);
        }

         //PUBLISHER
         if(strtolower($user->role->role) === 'publisher'){

            return $data->whereIn('status_id', ['7', '6', '2', '8'])
                ->where('trash', 1)
                ->orderBy('id', 'desc')
                ->paginate($req->perpage);
        }

        //PUBLISHER AND ADMIN
        if(strtolower($user->role->role) === 'admin'){

            return $data
                ->orderBy('id', 'desc')
                ->paginate($req->perpage);
        }

        return [];
    }

}
