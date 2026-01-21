<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\DostvBanner;
use Illuminate\Support\Facades\Storage;

class AdminDostvBannerController extends Controller
{
    //

    // public function getData(Request $req){
    //      $sort = explode('.', $req->sort_by);

    //     $data = DostvBanner::where('name', 'like', $req->search . '%')
    //         ->orderBy($sort[0], $sort[1])
    //         ->paginate($req->perpage);

    //     return $data;
    // }   
    
    
    public function create(){
        return Inertia::render('Admin/PageSections/Dostv/DostvBanner/DostvBannerCreateEdit',[
            'id' => 0,
            'dostvBanner' => null
        ]);
    }

    public function store(Request $req){
        
        $req->validate([
            'name' => ['required', 'string', 'max:255', 'unique:dostv_banners'],
            'description' => ['required'],
            'banner' => ['required'],
        ],[
            'banner.required' => 'Please upload an image.'

        ]);

        $banner = '';

        if($req->has('banner')){
            if(!isset($req->banner) && $req->banner[0]){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload an image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $banner = $req->banner[0]['response']; //get the filename of the file uploaded
        }

        DostvBanner::create([
            'banner' => $banner,
            'name' => $req->name,
            'description' => $req->description,
            'active' => $req->active ?1:0,
        ]);

        if (Storage::exists('public/temp/' . $banner)) {
            // Move the file
            Storage::move('public/temp/' . $banner, 'public/dostv/banners/' . $banner); 
            Storage::delete('public/temp/' . $banner);
        }

        return response()->json([
            'status' => 'saved'
        ], 200);
    }



      public function edit($id){
        $dostBanner = DostvBanner::find($id);
        return Inertia::render('Admin/PageSections/Dostv/DostvBanner/DostvBannerCreateEdit',[
            'id' => $id,
            'dostvBanner' => $dostBanner
        ]);
    }

    public function update(Request $req, $id){
        

        $req->validate([
            'name' => ['required', 'string', 'max:255', 'unique:dostv_banners,name,' .$id.',id'],
            'description' => ['required'],
            'banner' => ['required'],
        ],[
            'banner.required' => 'Please upload an image.'
        ]);

        $banner = '';

        if($req->has('banner')){
            if(!isset($req->banner) && $req->banner[0]){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload an image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $banner = $req->banner[0]['response']; //get the filename of the file uploaded
        }

        DostvBanner::where('id', $id)
            ->update([
            'banner' => $banner,
            'name' => $req->name,
            'description' => $req->description,
            'active' => $req->active ?1:0,
        ]);

        if (Storage::exists('public/temp/' . $banner)) {
            // Move the file
            Storage::move('public/temp/' . $banner, 'public/dostv/banners/' . $banner); 
            Storage::delete('public/temp/' . $banner);
        }

        return response()->json([
            'status' => 'updated'
        ], 200);
    }





    


  

}
