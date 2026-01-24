<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Http\Controllers\Helpers\RecordTrail;

class AdminPostArchiveController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Post/Archive/AdminPostArchiveIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);

        $data = Post::with(['subjects'])
            ->where('is_archive', 1);

        if ($req->search != '') {
            $data->where('title', 'like', '%'. $req->search . '%');
        }

        return $data->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }

    public function unArchive($id){
        $user = Auth::user();
        $name = $user->lname. ', ' . $user->fname;

        $data = Post::find($id);
        $data->is_archive = 0;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'unarchive', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'unarchive'
        ], 200);
    }
}
