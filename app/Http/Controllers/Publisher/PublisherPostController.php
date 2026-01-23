<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;

class PublisherPostController extends Controller
{

    private $uploadPath = 'storage/upfiles'; //this is the upload path
    private $fileCustomPath = 'public/upfiles/'; //this is for delete, or checking if file is exist



    public function index()
    {
        return Inertia::render('Publisher/Post/PublisherPostIndex');
    }

    public function getData(Request $req){

        //$sort = explode('.', $req->sort_by);

        $status = '';

        $user = Auth::user()->load('role');

        $data = Post::with(['subjects'])
            ->where('trash', 0)
            ->whereIn('status', ['publish', 'submit', 'unpublish'])
            ->when($req->search, function ($q) use ($req) {
                $q->where(function ($qq) use ($req) {
                    $qq->where('title', 'like', '%' . $req->search . '%')
                    ->orWhere('id', 'like', '%' . $req->search . '%');
                });
            })
        ->orderBy('id', 'desc')
        ->paginate($req->perpage);

        return response()->json($data, 200);
    }

    public function formView($id){

        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        $roleId = Auth::user()->role_id;

        $post = Post::with(['subjects'])->find($id);

        return Inertia::render('Publisher/Post/PublisherPostFormView',[
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'post' => $post
        ]);
    }

    public function update(Request $req, $id)
    {
        $req->validate([
            'title' => ['required', new ValidateTitle($id)],
            'author_name' => ['string', 'nullable'],
            'description' => ['required'],
            'subjects' => ['required', 'array', 'min:1'],
        ], [
            'description.required' => 'Content is required.'

        ]);

        try {

            /* ==============================
                this method detects and convert the content containing <img src=(base64 img), since it's not a good practice saving image
                to the database in a base64 format, this will convert the base64 to a file, re render the content
                change the <img src=(base64) /> to <img src="/storage_path/your_dir" />
            */

            $modifiedHtml = (new FilterDom())->filterDOM($req->description);

            /* ============================== */

            /* ==============================
                this will clean all html tags, leaving the content, this data may use to train AI models,
            */
            $content = trim(strip_tags($req->description)); // cleaning all tags
            /* ============================== */


            //format publish date
            $dateFormated = $req->publish_date ? date('Y-m-d', strtotime($req->publish_date)) : null;

            $data = Post::find($id);
            $user = Auth::user();

            $data->title = $req->title;
            $data->alias = Str::slug($req->title);
            $data->excerpt = $req->excerpt ? $req->excerpt : null;
            $data->source_url = $req->source_url;
            $data->agency = $req->agency;
            $data->status = $req->status;
            $data->is_publish = 0;
            $data->description = $modifiedHtml;
            $data->description_text = $content;
            $data->author_name = $req->author_name;
            $data->last_updated_by = $user->id;
            $data->publish_date = $dateFormated;
            $data->record_trail = $data->record_trail . "update|".$user->id."|".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";

            $data->save();

            //delete all related subjects
            DB::table('info_subject_headings')->where('info_id', $id)->delete();
            foreach($req->subjects as $subject){
                DB::table('info_subject_headings')->insert([
                    'info_id' => $id,
                    'subject_heading_id' => $subject['subject_heading_id'],
                ]);
            }

            return response()->json([
                'status' => 'updated',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 200);
        }
    }


    /** ======================================
     * This is delete function
    ==========================================*/
    public function destroy($id){
        $user = Auth::user();

        $data = Post::find($id);

        if(!$data->description){
            return response()->json([
                'errors' => [
                    'empty_description' => 'No Content.'
                ],
                'message' => 'Error'
            ], 422);
        }
        /*------------------------------------------------------
            Before executing delete, image must remove from the storage
            to free some memory.
        ------------------------------------------------------*/

        $doc = new \DOMDocument('1.0', 'UTF-8'); //solution add backward slash
        libxml_use_internal_errors(true);
        libxml_clear_errors();
        $doc->encoding = 'UTF-8';
        $htmlContent = $data->description ? $data->description : '';
        $doc->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'));
        $images = $doc->getElementsByTagName('img');


        foreach ($images as $image) {
            $src = $image->getAttribute('src');
            //output --> storage/upload_files/130098028b5a1f88aa110e1146ce8375.jpeg
            //sample output of $src

            $imgName = explode('/', $src); //this will explode separate using / character
            $fileImageName = $imgName[3]; //get the 4th index, this is the filename -> 130098028b5a1f88aa110e1146ce8375.jpeg

            if(Storage::exists($this->fileCustomPath .$fileImageName)) {
                Storage::delete($this->fileCustomPath . $fileImageName);
            }
        }

        Post::destroy($id);
        $data->record_trail = $data->record_trail . "delete|".$user->id."|".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";



        return response()->json([
            'status' => 'deleted'
        ], 200);
    }


    /** ======================================
     * This is soft delete function
    ==========================================*/
    public function trash($id){
        $user = Auth::user();
        $data = Post::find($id);
        $data->trash = 1;
        $data->save();
        $data->record_trail = $data->record_trail . "trashed|".$user->id."|".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";



        return response()->json([
            'status' => 'trashed'
        ], 200);
    }



    /** IMAGE HANDLING */
    /* ================= */
    public function tempUpload(Request $req){
        //return $req;
        $req->validate([
            'featured_image' => ['required', 'mimes:jpg,jpeg,png']
        ]);
        $file = $req->featured_image;
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

        return response()->json([
            'status' => 'temp_error'
        ], 200);
    }


    // //remove from featured_image folder
    public function imageRemove($id, $fileName){

        $data = Post::find($id);
        $data->featured_image = null;
        $data->save();

        if(Storage::exists('public/featured_images/' .$fileName)) {
            Storage::delete('public/featured_images/' . $fileName);

            if(Storage::exists('public/temp/' .$fileName)) {
                Storage::delete('public/temp/' . $fileName);
            }

            return response()->json([
                'status' => 'temp_deleted'
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error'
        ], 200);
    }





    public function postPublish($id){
        $user = Auth::user();

        $data = Post::find($id);
        $data->status = 'publish'; //submit-for-publishing (static)
        $data->record_trail = $data->record_trail . 'publish|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
        $data->save();

        return response()->json([
            'status' => 'publish'
        ], 200);

    }

    public function postUnpublish($id){
        $user = Auth::user();
        $data = Post::find($id);
        $data->status = 'unpublish';
        $data->record_trail = $data->record_trail . 'unpublish|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
        $data->save();

        return response()->json([
            'status' => 'unpublish'
        ], 200);
    }

    public function postReturnToEncoder($id){
        $user = Auth::user();
        $data = Post::find($id);
        $data->status = 'return';
        $data->record_trail = $data->record_trail . 'return to encoder|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';

        $data->save();

        return response()->json([
            'status' => 'return'
        ], 200);
    }

    // public function postArchived($id){
    //     $data = Post::find($id);
    //     $data->status_id = 3; //submit-for-publishing (static)
    //     $data->save();

    //     return response()->json([
    //         'status' => 'archived'
    //     ], 200);
    // }

    // public function postSubmitForPublishing($id){
    //     $data = Post::find($id);
    //     $data->status_id = 7; //submit-for-publishing (static)
    //     $data->save();

    //     return response()->json([
    //         'status' => 'submit-for-publishing'
    //     ], 200);
    // }

    public function setPublishDate(Request $req, $id){
        $validated = $req->validate([
            'publish_date' => ['required']
        ]);

        $dateFormatted = date('Y-m-d', strtotime($req->publish_date));
        //return $dateFormatted;
        $data = Post::find($id);
        $data->publication_date = $dateFormatted;
        $data->save();

        return response()->json([
            'status' => 'updated'
        ], 200);
    }



}
