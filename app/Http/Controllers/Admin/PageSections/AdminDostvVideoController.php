<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Dostv;
use App\Models\DostvVideo;

class AdminDostvVideoController extends Controller
{
    

    public function show($id){
        return Dostv::find($id);
    }

    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);
        //return DostvVideo::all();
        //return $req->title;

        $data = DostvVideo::orderBy($sort[0], $sort[1]);

        if(isset($req->title)){
            $data = DostvVideo::where('title', 'like', $req->title . '%');
        }

        return $data->paginate($req->perpage);
    }

    public function getFeaturedVideos(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = DostvVideo::orderBy($sort[0], $sort[1]);

        if(isset($req->title)){
            $data = DostvVideo::where('title', 'like', $req->title . '%');
        }

        return $data->where('is_featured', 1)->get();
    }

    public function create(){
         return Inertia::render('Admin/PageSections/Dostv/DostvVideos/DostvVideosCreateEdit',[
            'id' => 0,
        ]);
    }

    public function store(Request $req){
  
        $req->validate([
            'title'=> ['required','string'],
            'excerpt' => ['required', 'string'],
            'link' => ['required']
        ]);

        Dostv::create([
            'title' => $req->title,
            'excerpt' => $req->excerpt,
            'link' => $req->link,
            'order_no' => $req->order_no
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }


     public function update(Request $req, $id){
  
        $req->validate([
            'title'=> ['required','string', 'unique:dostvs,title,'.$id.',id'],
            'excerpt' => ['required', 'string'],
            'link' => ['required']
        ]);

        Dostv::where('id', $id)
            ->update([
            'title' => $req->title,
            'excerpt' => $req->excerpt,
            'link' => $req->link,
            'order_no' => $req->order_no
        ]);

        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){  

        Dostv::destroy($id);

        return response()->json([
            'status'=> 'deleted'
        ],200);

    }


      
    public function  setFeatued($id, $value){
        Dostv::where('id', $id)
            ->update([
                'is_featured' => $value
            ]);
        return response()->json([
            'status' => 'featured'
        ], 200);
    }
}
