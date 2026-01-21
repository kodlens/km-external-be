<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostComment;
use Auth;

class PostCommentController extends Controller
{
    //
    public function postCommentStore(Request $req, $id){
        $user = Auth::user();

        $req->validate([
            'comments' => ['required']
        ]);


        $data = PostComment::create([
            'comments' => $req->comments,
            'post_id' => $id,
            'user_id' => $user->id
        ]);

        return response()->json([
            'status' => 'comment-saved'
        ], 200);

    }
    

    public function getComments($id){

        return PostComment::join('users as b', 'post_comments.user_id', 'b.id')
            ->join('roles as c', 'b.role_id', 'c.id')
            ->select('post_comments.*', 'b.lastname', 'b.firstname', 'b.middlename',
                'c.role')
            ->where('post_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
