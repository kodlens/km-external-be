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

        $data = Post::with('subjects');

        if (!empty($req->search)) {
            $data->where('title', 'like', '%' . $req->search . '%');
        }

        /** for the meantime, author and publisher and admin can access this
         * roles that created aside from these roles name is not allowed to get data here
        */
        $user = Auth::user();

       //AUTHOR
        if(strtolower($user->role) === 'author'){

            return $data->where('author_id', $user->id)
                ->where('trash', 1)
                ->orderBy('id', 'desc')
                ->paginate($req->perpage);
        }

         //PUBLISHER
         if(strtolower($user->role) === 'publisher'){

            return $data->whereIn('status_id', ['7', '6', '2', '8'])
                ->where('trash', 1)
                ->orderBy('id', 'desc')
                ->paginate($req->perpage);
        }

        //PUBLISHER AND ADMIN
        if(strtolower($user->role) === 'admin'){

            return $data
                ->orderBy('id', 'desc')
                ->paginate($req->perpage);
        }

        return [];
    }

}
