<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Magazine;
use App\Models\Quarter;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminMagazineController extends Controller
{
    public function index(){
        return Inertia::render('Admin/PageSections/Magazine/MagazineIndex');
    }

    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Magazine::where('title', 'like', '%' .$req->search . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }


    public function create(){ 
        $quarters = Quarter::all();

        return Inertia::render('Admin/PageSections/Magazine/MagazineCreateEdit',[
            'id' => 0,
            'banner' => null,
            'quarters' => $quarters
        ]);
    }


    public function store(Request $req){

        $req->validate([
            'title' => ['required', 'string', 'max:255', 'unique:magazines'],
            'excerpt' => ['required'],
            'quarter' => ['required'],
            'year' => ['required', 'gt:1901'],
            'cover_file' => ['required'],
            'magazine_file' => ['required'],
        ],[
            'cover_file.required' => 'Please upload an image.',
            'magazine_file.required' => 'Please upload the magazine.',
            'year.gt' => 'Invalid year.',

        ]);

        $imgFilename = '';
        $magazineFilename = '';

        if($req->has('cover_file')){
            if(!isset($req->cover_file) && $req->cover_file[0]){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload an image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $imgFilename = $req->cover_file[0]['response']; //get the filename of the file uploaded
        }


        if($req->has('magazine_file')){
            if(!isset($req->magazine_file) && $req->magazine_file[0]){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload magazine.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $magazineFilename = $req->magazine_file[0]['response']; //get the filename of the file uploaded
        }

        Magazine::create([
            'title' => $req->title,
            'slug' => Str::slug($req->title),
            'excerpt' => $req->excerpt,
            'cover' => $imgFilename,
            'quarter' => $req->quarter,
            'magazine_path' => $magazineFilename,
            'year' => $req->year,
            'is_featured' => $req->is_featured ? 1 : 0,
        ]);
        
        /** MOVE IMAGE FROM TEMP DIR TO BANNER IMAGE DIR */
        if (Storage::exists('public/temp/' . $imgFilename)) {
            // Move the file
            Storage::move('public/temp/' . $imgFilename, 'public/magazines/' . $imgFilename); 
            Storage::delete('public/temp/' . $imgFilename);
        }
        if (Storage::exists('public/temp/' . $magazineFilename)) {
            // Move the file
            Storage::move('public/temp/' . $magazineFilename, 'public/magazines/releases/' . $magazineFilename); 
            Storage::delete('public/temp/' . $magazineFilename);
        }
        /** MOVE FILE */

        //return success to frontend
        return response()->json([
            'status' => 'saved'
        ], 200);
    }



    public function edit($id){ 
        $data = Magazine::find($id);
        $quarters = Quarter::all();

        return Inertia::render('Admin/PageSections/Magazine/MagazineCreateEdit',[
            'id' => $id,
            'magazine' => $data,
            'quarters' => $quarters,
        ]);
    }


    public function update(Request $req, $id){
        
        $req->validate([
            'title' => ['required', 'string', 'max:255', 'unique:magazines,title,' . $id . ',id'],
            'excerpt' => ['required', 'string'],
            'quarter' => ['required'],
            'year' => ['required', 'gt:1901'],
            'cover_file' => ['required'],
            'magazine_file' => ['required'],
        ],
        [
            'cover_file.required' => 'Please upload an image.',
            'magazine_file.required' => 'Please upload the magazine.',
            'year.gt' => 'Invalid year.',
        ]);

        
        $coverFileName = '';
        $magazineFilename = '';

        
        if($req->has('cover_file')){
            if(!isset($req->cover_file) && $req->cover_file[0]){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload an image.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }

            $coverFileName = $req->cover_file[0]['response']; //get the filename of the file uploaded
        }

        if($req->has('magazine_file')){
            if(!isset($req->magazine_file) && $req->magazine_file[0]){
                return response()->json([
                    'errors' => [
                        'upload' => ['Please upload magazine.'],
                        'message' => 'Empty field.'
                    ]
                ], 422);
            }
            $magazineFilename = $req->magazine_file[0]['response']; //get the filename of the file uploaded
        }

        //UPDATE Magazine
        Magazine::where('id', $id)
            ->update([
                'title' => $req->title,
                'slug' => Str::slug($req->title),
                'cover' => $coverFileName,
                'excerpt' => $req->excerpt,
                'magazine_path' => $magazineFilename,
                'quarter' => $req->quarter,
                'year' => $req->year,
                'is_featured' => $req->is_featured ? 1 : 0,
            ]);

         /** MOVE IMAGE FROM TEMP DIR TO BANNER IMAGE DIR */
        if (Storage::exists('public/temp/' . $coverFileName)) {
            // Move the file
            Storage::move('public/temp/' . $coverFileName, 'public/magazines/' . $coverFileName); 
            Storage::delete('public/temp/' . $coverFileName);
        }

        if (Storage::exists('public/temp/' . $magazineFilename)) {
            // Move the file
            Storage::move('public/temp/' . $magazineFilename, 'public/magazines/releases/' . $magazineFilename); 
            Storage::delete('public/temp/' . $magazineFilename);
        }
        /** MOVE FILE */
        
        //return status update
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $magazine = Magazine::find($id);
        
        //cover image
        if(Storage::exists('public/magazines/' .$magazine->cover)) {
            Storage::delete('public/magazines/' . $magazine->cover);
        }

        //pdf file
        if(Storage::exists('public/magazines/releases/' .$magazine->magazine_path)) {
            Storage::delete('public/magazines/releases/' . $magazine->magazine_path);
        }

        //delete/remove image from the database
        Magazine::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }


    public function setFeatured($id){
        Magazine::query()->update(['is_featured' => 0]);
        $magazine = Magazine::find($id);
        $magazine->is_featured = 1;
        $magazine->save();

        return response()->json([
            'status' => 'featured'
        ], 200);
    }
    
    /** IMAGE HANDLING */
    /* ================= */
    public function tempUploadCoverMagazine(Request $req){
        //return $req;
         $req->validate([
            'cover_file' => ['required', 'mimes:jpg,jpeg,png', 'max:1536']
        ],[
            'upload.max' => 'The upload image must not be greater than 1MB in size.'
        ]);

        $file = $req->cover_file;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $fileName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('public/temp', $fileName);
        $n = explode('/', $filePath);
        return $n[2];
    }

     /** IMAGE HANDLING */
    /* ================= */
    public function tempUploadPDFMagazine(Request $req){
        //return $req;
        $req->validate([
            'magazine_file' => ['required', 'mimes:pdf']
        ]);

        $file = $req->magazine_file;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $fileName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('public/temp', $fileName);
        $n = explode('/', $filePath);
        return $n[2];
    }

    public function tempRemoveCoverMagazine($fileName){
       
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


    // //remove from magazines folder
    public function deleteCoverMagazine($id, $fileName){

        $data = Magazine::find($id);
        $data->cover = null;
        $data->save();

        if(Storage::exists('public/magazines/' .$fileName)) {
            Storage::delete('public/magazines/' . $fileName);

            if(Storage::exists('public/temp/' .$fileName)) {
                Storage::delete('public/temp/' . $fileName);
            }

            return response()->json([
                'status' => 'cover_deleted'
            ], 200);
        }

        return response()->json([
            'errors' => [
                'cover' => ['Error deleting cover photo.']
            ],
            'message' => 'Error deleting cover photo.'
        ], 422);
    }



    // //delete and remove from magazine folder
    public function deleteMagazine($id, $fileName){

        $data = Magazine::find($id);
        $data->magazine_path = null;
        $data->save();

        if(Storage::exists('public/magazines/releases/' .$fileName)) {
            Storage::delete('public/magazines/releases/' . $fileName);

            if(Storage::exists('public/temp/' .$fileName)) {
                Storage::delete('public/temp/' . $fileName);
            }

            return response()->json([
                'status' => 'magazine_deleted'
            ], 200);
        }

        return response()->json([
            'errors' => [
                'magazine' => ['Error deleting cover photo.']
            ],
            'message' => 'Error deleting cover photo.'
        ], 422);
    }



}
