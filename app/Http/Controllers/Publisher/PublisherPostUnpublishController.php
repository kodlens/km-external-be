<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Models\Post;

class PublisherPostUnpublishController extends Controller
{
    public function index()
    {
        return Inertia::render('Publisher/Post/Unpublish/PublisherPostUnpublishIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);
        $status = '';
       
        $user = Auth::user()->load('role');

        $data = Post::with(['category', 'author']);
        if ($status != '') {
            $data->where('status', $status);
        }
        $data->where('title', 'like', '%'. $req->search . '%');

        return $data->where('trash', 0)
            ->where('status', 'unpublish')
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }
}
