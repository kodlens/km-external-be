<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Models\Post;

use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;

class EncoderPostController extends Controller
{

    private $fileCustomPath = 'public/upfiles/';

    public function index()
    {
        return Inertia::render('Encoder/Post/EncoderPostIndex');
    }

    public function getData(Request $req)
    {

        $sort = explode('.', $req->sort_by);
        $status = '';

        $user = Auth::user()->load('role');
        $data = Post::query()->where('trash', 0);

        if ($req->status != '' || $req->status != null) {
            $data->where('status', $req->status);
        }

        $data->where('title', 'like', '%'.$req->search.'%');

        return $data
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }

    public function create()
    {

        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');

        return Inertia::render('Encoder/Post/EncoderPostCreateEdit', [
            'id', 0,
            'ckLicense' => $CK_LICENSE,
            'data', [],
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
            $dateFormated = $req->publish_date ? date('Y-m-d', strtotime($req->publish_date)) : null;

            $user = Auth::user();

            $data = Post::create([
                'title' => $req->title,
                'slug' => Str::slug($req->title),
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
                'record_trail' => 'insert|('.$user->id.')'.$user->lname . ','. $user->fname . '|' . date('Y-m-d H:i:s') . ';',
                /** 1 for insert, 0 for delete and 2 for update */
            ]);

            foreach($req->subjects as $subject){
                DB::table('info_subject_headings')->insert([
                    'info_id' => $data->id,
                    'subject_heading_id' => $subject['subject_heading_id'],
                ]);
            }

            return response()->json([
                'status' => 'saved',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function edit($id)
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');

        $post = Post::with(['subjects'])->find($id);

        return Inertia::render('Encoder/Post/EncoderPostCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'post' => $post]);
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

            $dateFormated = $req->publish_date ? date('Y-m-d', strtotime($req->publish_date)) : null;

            $data = Post::find($id);
            $user = Auth::user();

            // $imgFilename = $req->upload ? $req->upload[0]['response'] : null;
            // update data in table articles

            // return $imgFilename;

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
            $data->record_trail = $data->record_trail . "update|(".$user->id.")".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";

            $data->save();

            //delete all related subjects
            DB::table('info_subject_headings')->where('info_id', $id)->delete();
            foreach($req->subjects as $subject){
                DB::table('info_subject_headings')->insert([
                    'info_id' => $id,
                    'subject_heading_id' => $subject['subject_heading_id'],
                ]);
            }

            // PostLog::create([
            //     'user_id' => $user->id,
            //     'post_id' => $data->id,
            //     'alias' => $user->lastname.', '.$user->firstname,
            //     'description' => $req->is_submit == 1 ? 'update and submit for publishing' : 'update post',
            //     'action' => 'update',
            // ]);

            // if (Storage::exists('public/temp/'.$imgFilename)) {
            //     // Move the file
            //     Storage::move('public/temp/'.$imgFilename, 'public/featured_images/'.$imgFilename);
            //     Storage::delete('public/temp/'.$imgFilename);
            // }

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
    public function destroy($id)
    {
        $user = Auth::user();

        $data = Post::find($id);

        if (! $data->description) {
            return response()->json([
                'errors' => [
                    'empty_description' => 'No Content.',
                ],
                'message' => 'Error',
            ], 422);
        }
        /*------------------------------------------------------
            Before executing delete, image must remove from the storage
            to free some memory.
        ------------------------------------------------------*/

        $doc = new \DOMDocument('1.0', 'UTF-8'); // solution add backward slash
        libxml_use_internal_errors(true);
        libxml_clear_errors();
        $doc->encoding = 'UTF-8';
        $htmlContent = $data->description ? $data->description : '';
        $doc->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'));
        $images = $doc->getElementsByTagName('img');

        foreach ($images as $image) {
            $src = $image->getAttribute('src');
            // output --> storage/upload_files/130098028b5a1f88aa110e1146ce8375.jpeg
            // sample output of $src

            $imgName = explode('/', $src); // this will explode separate using / character
            $fileImageName = $imgName[3]; // get the 4th index, this is the filename -> 130098028b5a1f88aa110e1146ce8375.jpeg

            if (Storage::exists($this->fileCustomPath.$fileImageName)) {
                Storage::delete($this->fileCustomPath.$fileImageName);
            }
        }

        Post::destroy($id);
        $data->record_trail = $data->record_trail.';delete|'.'('.$user->id.')'.$user->lname.', '.$user->fname.'|'.date('Y-m-d H:i:s');

        return response()->json([
            'status' => 'deleted',
        ], 200);
    }

    /** ======================================
     * This is soft delete function
    ==========================================*/
    public function trash($id)
    {
        $user = Auth::user();
        $data = Post::find($id);
        $data->trash = 1;
        $data->record_trail = $data->record_trail.';trash|'.'('.$user->id.')'.$user->lname.', '.$user->fname.'|'.date('Y-m-d H:i:s');
        $data->save();

        return response()->json([
            'status' => 'trashed',
        ], 200);
    }

    /** IMAGE HANDLING */
    /* ================= */
    public function tempUpload(Request $req)
    {
        // return $req;
        $req->validate([
            'featured_image' => ['required', 'mimes:jpg,jpeg,png', 'max:1024'],
        ], [
            'featured_image.max' => 'The upload image must not be greater than 1MB in size',
        ]);
        $file = $req->featured_image;
        $fileGenerated = md5($file->getClientOriginalName().time());
        $imageName = $fileGenerated.'.'.$file->getClientOriginalExtension();
        $imagePath = $file->storeAs('public/temp', $imageName);
        $n = explode('/', $imagePath);

        return $n[2];
    }

    public function removeUpload($fileName)
    {

        if (Storage::exists('public/temp/'.$fileName)) {
            Storage::delete('public/temp/'.$fileName);

            return response()->json([
                'status' => 'temp_deleted',
            ], 200);
        }

        // this will remove the image from featured_image
        if (Storage::exists('public/featured_images/'.$fileName)) {
            Storage::delete('public/featured_images/'.$fileName);

            Post::where('featured_image', $fileName)
                ->update([
                    'featured_image' => null,
                ]);

            return response()->json([
                'status' => 'removed',
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error',
        ], 200);
    }

    public function postDraft($id)
    {
        $user = Auth::user();
        $data = Post::find($id);
        $data->status = 'draft'; // submit-for-publishing (static)
        $data->trash = 0; // be sure to set 0 the trash if draft
        $data->record_trail = $data->record_trail . "draft|(".$user->id.")".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";
        $data->save();

        return response()->json([
            'status' => 'draft',
        ], 200);
    }

    public function postArchived($id)
    {
        $data = Post::find($id);
        // $data->status_id = 3; //submit-for-publishing (static)
        $data->status = 'archive'; // submit-for-publishing (static)
        $data->save();

        $user = Auth::user();

        return response()->json([
            'status' => 'archive',
        ], 200);
    }

    public function postSubmitForPublishing($id)
    {
        $data = Post::find($id);
        $data->status = 'submit'; // submit-for-publishing (static)
        // $data->status_id = 7; //submit-for-publishing (static)
        $data->save();

        $user = Auth::user();

        return response()->json([
            'status' => 'submit-for-publishing',
        ], 200);
    }
}
