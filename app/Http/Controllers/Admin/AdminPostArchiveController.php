<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;
use Auth;

class AdminPostArchiveController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Post/Archive/AdminPostArchiveIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);
        $status = '';

        if($req->status != '' || $req->status != null){
            $status = $req->status;
        }
        $data = Post::with(['category', 'author']);
        if ($status != '') {
            $data = $data->where('status', $status);
        }
        $data->where('title', 'like', '%'. $req->search . '%')
            ->where('status', 'archive');

        return $data->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }
}
