<?php

namespace App\Http\Controllers\Author;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Models\Post;

class EncoderPostPublishController extends Controller
{
    public function index()
    {
        return Inertia::render('Encoder/Post/Publish/EncoderPostPublishIndex');
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

        return $data->where('author_id', $user->id)
            ->where('trash', 0)
            ->where('status', 'publish')
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }
}
