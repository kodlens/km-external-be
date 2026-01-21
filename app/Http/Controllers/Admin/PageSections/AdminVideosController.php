<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\FeaturedVideo;

class AdminVideosController extends Controller
{
    //
    public function index(){
        return Inertia::render('Admin/PageSections/Videos/VideosIndex');
    }

    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = FeaturedVideo::where('title', 'like', $req->title . '%')
            ->where('is_featured', 0)
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }


    
    public function getFeaturedVideos(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = FeaturedVideo::where('title', 'like', $req->title . '%')
            ->where('is_featured', 1)
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }

    


    public function create(){ 
        return Inertia::render('Admin/PageSections/Videos/VideosCreateEdit',[
            'id' => 0,
            'featuredVideo' => null
        ]);
    }


    public function store(Request $req){

        $req->validate([
            'title' => ['required', 'string', 'max:255', 'unique:featured_videos'],
            'excerpt' => ['required', 'string'],
            'link' => ['required'],
            //'order_no' => ['required', 'unique:featured_videos'],
        ]);


        FeaturedVideo::create([
            'title' => $req->title,
            'excerpt' => $req->excerpt,
            'link' => $req->link,
            'order_no' => $req->order_no,
            'is_featured' => $req->is_featured ? 1 : 0,
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }



    public function edit($id){ 
        $data = FeaturedVideo::find($id);

        return Inertia::render('Admin/PageSections/FeaturedVideos/FeaturedVideosCreateEdit',[
            'id' => $id,
            'featuredVideo' => $data
        ]);
    }


    public function update(Request $req, $id){

        $req->validate([
            'title' => ['required', 'string', 'max:255', 'unique:featured_videos'],
            'excerpt' => ['required', 'string'],
            'link' => ['required'],
            //'order_no' => ['required', 'unique:featured_videos'],
        ]);


        FeaturedVideo::where('id', $id)
            ->update([
                'title' => $req->title,
                'excerpt' => $req->excerpt,
                'link' => $req->link,
                'order_no' => $req->order_no,
                'is_featured' => $req->is_featured ? 1 : 0,
            ]);

        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy ($id){
        FeaturedVideo::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }

    public function setFeatured($id){
        $featured = FeaturedVideo::find($id);
        $featured->is_featured = 1;
        $featured->save();

        return response()->json([
            'status'=> 'featured'
        ], 200);
    }
    
    public function setUnfeatured($id){
        $featured = FeaturedVideo::find($id);
        $featured->is_featured = 0;
        $featured->save();

        return response()->json([
            'status'=> 'unfeatured'
        ], 200);
    }

    

    public function updateOrderNo(Request $req, $id){
        
        $req->validate([
            'order_no' => ['required'],
        ]);

        FeaturedVideo::where('id', $id)
            ->update([
                'order_no'=> $req->order_no
            ]);

        return response()->json([
            'status'=> 'order_updated'
        ], 200);
    }
}
