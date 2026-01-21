<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdminBannerController extends Controller
{
    public function index(){
        return Inertia::render('Admin/PageSections/Banner/BannerIndex');
    }




    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Banner::where('name', 'like', $req->search . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }


    public function create(){ 
        return Inertia::render('Admin/PageSections/Banner/BannerCreateEdit',[
            'id' => 0,
            'banner' => null
        ]);
    }


    public function store(Request $req){
        $req->validate([
            'name' => ['required', 'string', 'max:255', 'unique:banners'],
            'description' => ['required', 'string'],
            'upload' => ['required'],
        ],[
            'upload.required' => 'Please upload an image.',
        ]);

        $imgFilename = '';

        if($req->has('upload')){
            if(!isset($req->upload[0]) && $req->upload[0]['response' == '']){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload an image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $imgFilename = $req->upload[0]['response']; //get the filename of the file uploaded
        }

        Banner::create([
            'name' => $req->name,
            'description' => $req->description,
            'img' => $imgFilename,
            'active' => $req->active ? 1 : 0,
        ]);
        
        /** MOVE IMAGE FROM TEMP DIR TO BANNER IMAGE DIR */
        if (Storage::exists('public/temp/' . $imgFilename)) {
            // Move the file
            Storage::move('public/temp/' . $imgFilename, 'public/banner_images/' . $imgFilename); 
            Storage::delete('public/temp/' . $imgFilename);
        }
        /** MOVE FILE */

        //return success to frontend
        return response()->json([
            'status' => 'saved'
        ], 200);

    }



    public function edit($id){ 
        $data = Banner::find($id);

        return Inertia::render('Admin/PageSections/Banner/BannerCreateEdit',[
            'id' => $id,
            'banner' => $data
        ]);
    }


    public function update(Request $req, $id){

        $req->validate([
            'name' => ['required', 'string', 'max:255', 'unique:banners,name,' . $id . ',id'],
            'description' => ['required', 'string'],
            'upload' => ['required'],
        ],[
            'upload.required' => 'Please upload an image.',
        ]);

        /** ASSIGN NAME FOR IMAGE NAME */
        $imgFilename = '';
        if($req->has('upload')){
            if(!isset($req->upload[0]) && $req->upload[0]['response' == '']){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload an image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $imgFilename = $req->upload[0]['response']; //get the filename of the file uploaded
        }


        //UPDATE IMAGE ON THE DATABASE
        Banner::where('id', $id)
            ->update([
                'name' => $req->name,
                'description' => $req->description,
                'img' => $imgFilename,
                'active' => $req->active ? 1 : 0,
            ]);

        /** MOVE IMAGE FROM TEMP DIR TO BANNER IMAGE DIR */
        if (Storage::exists('public/temp/' . $imgFilename)) {
            // Move the file
            Storage::move('public/temp/' . $imgFilename, 'public/banner_images/' . $imgFilename); 
            Storage::delete('public/temp/' . $imgFilename);
        }
        /** MOVE FILE */
        
        //return status update
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function setActive($id){
        
        DB::select('update banners set active = 0');

        Banner::where('id', $id)
            ->update(['active'=> 1]);

        return response()->json([
            'status' => 'active'
        ], 200);
    }
    

    
    public function destroy($id){
        $banner = Banner::find($id);
        
        //look for the image save on storage dir, and remove the img
        if(Storage::exists('public/temp/' .$banner->img)) {
            Storage::delete('public/temp/' . $banner->img);
        }

        //look for the image save on storage dir, and remove the img
        if(Storage::exists('public/banner_images/' .$banner->img)) {
            Storage::delete('public/banner_images/' . $banner->img);
        }

        //delete/remove image from the database
        Banner::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }


     /** =================IMAGE HANDLING =================*/
    public function tempUpload(Request $req){

        $req->validate([
            'upload' => ['required', 'mimes:jpg,jpeg,png', 'max:1536']
        ],[
            'upload.max' => 'The upload image must not be greater than 1MB in size.'
        ]);

        $file = $req->upload;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('public/temp', $imageName);
        $n = explode('/', $imagePath);
        return $n[2];
    }
    public function removeUpload($fileName){
       
        if(Storage::exists('public/temp/' .$fileName)) {
            Storage::delete('public/temp/' . $fileName);

            return response()->json([
                'status' => 'temp_deleted'
            ], 200);
        }

        //this will remove the image from banner_image
        if(Storage::exists('public/banner_images/' . $fileName)) {
            Storage::delete('public/banner_images/' . $fileName);

            Banner::where('img', $fileName)
                ->update([
                    'img' => null
                ]);
            return response()->json([
                'status' => 'banner_removed'
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error'
        ], 200);
    }
     /** =================IMAGE HANDLING =================*/

}
