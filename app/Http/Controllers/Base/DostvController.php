<?php

namespace App\Http\Controllers\Base;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dostv;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


class DostvController extends Controller
{
    public function store(Request $req){
      
        $req->validate([
            'title' => ['required', 'string', 'max:255', 'unique:dostvs'],
            'link' => ['required'],
            'featured_image' => ['required'],
        ]);
       

        if($req->has('featured_image')){
            if(!isset($req->featured_image[0]) && $req->featured_image[0]['response' == '']){

                return response()->json([
                    'errors' => [
                        'featured_image' => ['Please upload featured image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }
        }
        
        $imgFilename = $req->featured_image[0]['response']; //get the filename of the file uploaded

        Dostv::create([
            'title' => $req->title,
            'description' => $req->description,
            'featured_image' => $imgFilename,
            'website' => $req->website,
            'link' => $req->link,
            'active' => $req->active ? 1 : 0,
        ]);

        if (Storage::exists('public/temp/' . $imgFilename)) {
            // Move the file
            Storage::move('public/temp/' . $imgFilename, 'public/dostv/' . $imgFilename); 
            Storage::delete('public/temp/' . $imgFilename);
        }

        return response()->json([
            'status' => 'saved'
        ], 200);
    }

    
    public function update(Request $req, $id){

         $req->validate([
            'title' => ['required', 'string', 'max:255', 'unique:dostvs,title,' .$id.',id'],
            'link' => ['required'],
            'featured_image' => ['required'],
        ]);

        if($req->has('featured_image')){
            if(!isset($req->featured_image[0]) && $req->featured_image[0]['response' == '']){

                return response()->json([
                    'errors' => [
                        'featured_image' => ['Please upload featured image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }
        }
        
        $imgFilename = $req->featured_image[0]['response']; //get the filename of the file uploaded


        Dostv::where('id', $id)
            ->update([
                'title' => $req->title,
                'description' => $req->description,
                'featured_image' => $imgFilename,
                'website' => $req->website,
                'link' => $req->link,
                'active' => $req->active ? 1 : 0,
            ]);

        if (Storage::exists('public/temp/' . $imgFilename)) {
            // Move the file
            Storage::move('public/temp/' . $imgFilename, 'public/dostv/' . $imgFilename); 
            Storage::delete('public/temp/' . $imgFilename);
        }

        return response()->json([
            'status' => 'updated'
        ], 200);
    }




    /*===========================================
    
        upload and remove banner base functions

    ===========================================*/
    public function tempUploadBanner(Request $req){
        //return $req;
        $req->validate([
            'featured_image' => ['required', 'mimes:jpg,jpeg,png', 'max:2000']
        ]);

        $file = $req->featured_image;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $fileName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('public/temp', $fileName);
        $n = explode('/', $filePath);
        return $n[2];
    }

    public function tempRemoveBanner($fileName){
       
        if(Storage::exists('public/temp/' .$fileName)) {
            Storage::delete('public/temp/' . $fileName);
            return response()->json([
                'status' => 'temp_deleted'
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error'
        ], 200);
    }

    public function deleteDostvBanner($id, $fileName){
        Dostv::where('id', $id)
            ->update([
                'featured_image' => null
            ]);

        //look for the image save on storage dir, and remove the img
        if(Storage::exists('public/dostv/' .$fileName)) {
            Storage::delete('public/dostv/' . $fileName);
        }
    }



    public function destroy($id){
        $banner = Dostv::find($id);
        
        //look for the image save on storage dir, and remove the img
        if(Storage::exists('public/temp/' .$banner->featured_image)) {
            Storage::delete('public/temp/' . $banner->featured_image);
        }

        //look for the image save on storage dir, and remove the featured_image
        if(Storage::exists('public/dostv/' .$banner->featured_image)) {
            Storage::delete('public/dostv/' . $banner->featured_image);
        }

        //delete/remove image from the database
        Dostv::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }



    public function setActive($id){
        
        DB::select('update dostvs set active = 0');

        Dostv::where('id', $id)
            ->update(['active'=> 1]);

        return response()->json([
            'status' => 'active'
        ], 200);
    }
    

}
