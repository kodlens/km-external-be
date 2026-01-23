<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Models\Post;
use App\Http\Controllers\Helpers\FilterDom;
use App\Http\Controllers\Helpers\RecordTrail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\DB;

class AdminPostController extends Controller
{

    private $fileCustomPath = 'public/upfiles/'; //this is for delete, or checking if file is exist

    public function index()
    {
        return Inertia::render('Admin/Post/AdminPostIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);
        $status = '';

        if($req->status != '' || $req->status != null){
            $status = $req->status;
        }
        $data = Post::with(['subjects']);
        if ($status != '') {
            $data = $data->where('status', $status);
        }
        $data->where('title', 'like', '%'. $req->search . '%');
        return $data->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }


    public function create(){

        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');

        return Inertia::render('Admin/Post/AdminPostCreateEdit', [
            'id' => 0,
            'ckLicense' => $CK_LICENSE,
            'post' => null,
        ]);
    }


    public function store(Request $req){


        $req->validate([
            'title' => ['required', new ValidateTitle(0)],
            'author_name' => ['string', 'nullable'],
            'description' => ['required'],
            'subjects' => ['required', 'array', 'min:1'],
        ], [
            'description.required' => 'Description is required.',
        ]);


        try {
            DB::transaction(function () use ($req) {
                // Database operations here
                /* ==============================
                    convert base64 images → files and rewrite HTML
                */
                $modifiedHtml = (new FilterDom())->filterDOM($req->description);
                /* ============================== */

                /* ==============================
                    this will clean all html tags, leaving the content, this data may use to train AI models,
                */
                $filterDOM = new FilterDom();
                $content = $filterDOM->htmlToPlainText($req->description);
                /* ============================== */
                $dateFormated = $req->publish_date ? date('Y-m-d', strtotime($req->publish_date)) : null;

                $user = Auth::user();
                $name = $user->lname . ',' . $user->fname;

                $data = Post::create([
                    'title' => $req->title,
                    'alias' => Str::slug($req->title),
                    'excerpt' => $req->excerpt,
                    'source_url' => $req->source_url,
                    'agency' => $req->agency,
                    'status' => $req->status,
                    'is_publish' => 0,
                    'description' => $modifiedHtml, // modified content, changing the base64 image src to img src="/path/folder"
                    'description_text' => $content,
                    'author_name' => $req->author_name,
                    'encoded_by' => $user->id,
                    'publish_date' => $dateFormated,
                    'record_trail' => (new RecordTrail())->recordTrail('', 'insert', $user->id, $name),
                ]);

                foreach($req->subjects as $subject){
                    if(!empty($subject['subject_heading_id'])){
                        DB::table('info_subject_headings')->insert([
                            'info_id' => $data->id,
                            'subject_heading_id' => $subject['subject_heading_id'],
                        ]);
                    }
                }
            });

            return response()->json([
                'status' => 'saved'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

    }


    public function edit($id){
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');

        $post = Post::with('subjects')->find($id);

        return Inertia::render('Admin/Post/AdminPostCreateEdit',[
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'post' => $post]);
    }

    public function update(Request $req, $id){

        $req->validate([
            'title' => ['required', 'unique:posts,title,' . $id . ',id'],
            'excerpt' => ['required'],
            'description' => ['required'],
            'category' => ['required'],
            'status' => ['required_if:is_submit,0'],
            'subjects' => ['required', 'array', 'min:1'],
        ],[
            'description.required' => 'Content is required.',
        ]);

        try {
            DB::transaction(function () use ($req, $id) {
                // Database operations here
                $formatDate = $req->publish_date ? date('Y-m-d', strtotime($req->publish_date)) : null;

                /* ==============================
                    this will convert all base64 images to files and rewrite the html,
                */
                    $imgFilename = $req->imgFilename;
                    $modifiedHtml = $this->filterDOM($req->description);
                /* ==============================*/


                /* ==============================
                    this will clean all html tags, leaving the content, this data may use to train AI models,
                */
                $filterDOM = new FilterDom();
                $content = $filterDOM->htmlToPlainText($req->description);
                /* ==============================*/


                $data = Post::find($id);
                $user = Auth::user();

                $name = $user->lname . ', ' . $user->fname;

                $data->title = $req->title;
                $data->slug = Str::slug($req->title);
                $data->excerpt = $req->excerpt;
                $data->agency = $req->agency;
                $data->source_url = $req->source_url;
                $data->description = $modifiedHtml;
                $data->description_text = $content;
                $data->status = $req->$status;
                $data->author_name = $req->author_name;
                $data->publish_date = $formatDate;
                $data->last_updated_by = $user->id;
                $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'update', $user->id, $name);
                $data->save();

            });

            return response()->json([
                'status' => 'updated'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

    }


    /** ======================================
     * This is delete function
    */
    public function destroy($id){
        $user = Auth::user();
        $name = $user->lname. ', ' . $user->fname;

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

        $filterDom = new FilterDom();
        $filterDom->removeImagesFromDOM($data->description);


        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'delete', $user->id, $name);
        $data->save();

        Post::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }


    /* ======================================
      This is soft delete function
    */
    public function trash($id){

        $user = Auth::user();
        $name = $user->lname. ', ' . $user->fname;

        $data = Post::find($id);
        $data->trash = 1;
        $data->save();

        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'trash', $user->id, $name);

        return response()->json([
            'status' => 'trashed'
        ], 200);
    }



    /** IMAGE HANDLING */
    /* ================= */
    public function tempUpload(Request $req){
        //return $req;
        $req->validate([
            'featured_image' => ['required', 'mimes:jpg,jpeg,png', 'max:1024']
        ],[
            'featured_image.max' => 'The upload field must not be greater than 1MB in size.'
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


    public function publish($id){
        $data = Post::find($id);
        $data->status = 'publish';
        $data->publication_date = date('Y-m-d');
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'publish', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'publish'
        ], 200);
    }
    public function unpublish($id){
        $data = Post::find($id);
        $data->status = 'unpublish';
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'unpublish', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'unpublish'
        ], 200);
    }


    public function draft($id){
        $data = Post::find($id);
        $data->status = 'draft';
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'draft', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'draft'
        ], 200);
    }

    public function archive($id){
        $data = Post::find($id);
        $data->status = 'archive';
        $data->save();

        return response()->json([
            'status' => 'archive'
        ], 200);
    }

    public function submit($id){
        $data = Post::find($id);
        $data->status = 'submit';
        $data->save();

        return response()->json([
            'status' => 'submit'
        ], 200);
    }

    public function setPublishDate(Request $req, $id){
        $validation = $req->validate([
            'publication_date' => ['required']
        ]);

        $data = Post::find($id);
        $data->publication_date = date('Y-m-d', strtotime($req->publication_date));
        $data->save();

        return response()->json([
            'status' => 'success'
        ], 200);
    }

}
