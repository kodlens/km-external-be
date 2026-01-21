<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Post;

class AdminPostFeaturedController extends Controller
{
    //
    public function index(){
        return Inertia::render('Admin/Post/Featured/AdminPostFeaturedIndex');
    }


    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);

        $data = Post::with(['category', 'author'])
            ->where('is_featured', 1)
            ->where('title', 'like', '%'. $req->search . '%');
            
       
        return $data->orderBy('order_no', 'asc')
            ->paginate($req->perpage);
            
    }

    public function postFeaturedUpdateOrderNo(Request $req){
        
        try {
            $req->validate([
                'order_no' => ['required'],
                'post_id' => ['required']
            ]);
    
            $data = Post::find($req->post_id);
            $data->order_no = $req->order_no;
            $data->save();
    
            return response()->json([
                'status' => 'updated'
            ], 200);

        }catch(\Exception $e){

            return response()->json([
                'errors' => [
                    'error' => [$e->getMessage()]
                ],
            'message' => $e->getMessage()], 500);
            
        }
        
    }

}
