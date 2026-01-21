<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostLog;
use App\Models\Quarter;
use App\Models\Section;
use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EncoderPostController extends Controller
{
    private $uploadPath = 'storage/upfiles'; // this is the upload path

    private $fileCustomPath = 'public/upfiles/'; // this is for delete, or checking if file is exist

    public function index()
    {
        return Inertia::render('Encoder/Post/EncoderPostIndex');
    }

    public function getData(Request $req)
    {

        $sort = explode('.', $req->sort_by);
        $status = '';

        $user = Auth::user()->load('role');
        $data = Post::query();

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

    public function store(Request $req)
    {

        $req->validate([
            'title' => ['required', new ValidateTitle(0)],
            'description' => ['required'],
        ], [
            'description.required' => 'description is required.',
        ]);

        try {

            /* ==============================
                this method detects and convert the content containing <img src=(base64 img), since it's not a good practice saving image
                to the database in a base64 format, this will convert the base64 to a file, re render the content
                change the <img src=(base64) /> to <img src="/storage_path/your_dir" />
            */
            $modifiedHtml = $this->filterDOM($req->description);
            /* ============================== */

            /* ==============================
                this will clean all html tags, leaving the content, this data may use to train AI models,
            */
            $content = trim(strip_tags($req->description)); // cleaning all tags
            /* ============================== */

            $user = Auth::user();

            // convert tags to string
            // $tagsString = '';
            // foreach($req->tags as $key => $tag){
            //     if($key == 0){
            //         $tagsString = $tag;
            //     }else{
            //         $tagsString = $tagsString . ',' .$tag;
            //     }
            // }

            // $publicationDate = null;
            // if($req->publication_date != null || $req->publication_date != ''){
            //     $publicationDate = date('Y-m-d', strtotime($req->publication_date));
            // }

            //$imgFilename = $req->upload[0]['response']; // get the filename of the file uploaded

            $data = Post::create([
                'title' => $req->title,
                'slug' => Str::slug($req->title),
                'excerpt' => $req->excerpt,
                'source' => 'km-stii',
                'agency' => 'stii',
                'status' => 'draft',
                'is_publish' => 0,
                // 'section_id' => $req->section,
                'description' => $modifiedHtml, // modified content, changing the base64 image src to img src="/path/folder"
                'description_text' => $content,
                'encoded_by' => $user->id,
                'record_trail' => 'insert|('.$user->id.')'.$user->lname . ','. $user->fname . '|' . date('Y-m-d H:i:s') . ';',
                /** 1 for insert, 0 for delete and 2 for update */
            ]);

            // PostLog::create([
            //     'user_id' => $user->id,
            //     'post_id' => $data->id,
            //     'alias' => $user->lastname.', '.$user->firstname,
            //     'description' => $req->is_submit == 1 ? 'submit for publishing' : 'create post',
            //     'action' => 'create',
            // ]);

            // if (Storage::exists('public/temp/'.$imgFilename)) {
            //     // Move the file
            //     Storage::move('public/temp/'.$imgFilename, 'public/featured_images/'.$imgFilename);
            //     Storage::delete('public/temp/'.$imgFilename);
            // }

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

        $post = Post::find($id);

        return Inertia::render('Encoder/Post/EncoderPostCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'post' => $post]);
    }

    public function update(Request $req, $id)
    {

        $req->validate([
            'title' => ['required', new ValidateTitle($id)],
            //'excerpt' => ['required'],
            'description' => ['required'],
        ], [
            'description.required' => 'Content is required.'

        ]);

        try {

            /* ==============================
                this method detects and convert the content containing <img src=(base64 img), since it's not a good practice saving image
                to the database in a base64 format, this will convert the base64 to a file, re render the content
                change the <img src=(base64) /> to <img src="/storage_path/your_dir" />
            */
            $modifiedHtml = $this->filterDOM($req->description);
            /* ============================== */

            /* ==============================
                this will clean all html tags, leaving the content, this data may use to train AI models,
            */
            $content = trim(strip_tags($req->description)); // cleaning all tags
            /* ============================== */

            $data = Post::find($id);
            $user = Auth::user();



            // $imgFilename = $req->upload ? $req->upload[0]['response'] : null;
            // update data in table articles

            // return $imgFilename;

            $data->title = $req->title;
            $data->alias = Str::slug($req->title);
            $data->excerpt = $req->excerpt ? $req->excerpt : null;
            $data->source = 'km-stii';
            $data->agency = 'stii';
            $data->status = 'draft';
            $data->is_publish = 0;
            $data->description = $modifiedHtml;
            $data->description_text = $content;
            $data->last_updated_by = $user->id;
            $data->record_trail = $data->record_trail . "update|(".$user->id.")".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";

            $data->save();

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

    /* ==============================
        this method return the content
        change the <img src=(base64) /> to <img src="/storage_path/your_dir" />
    */
    private function filterDOM($content)
    {
        $modifiedHtml = '';

        $doc = new \DOMDocument('1.0', 'UTF-8'); // solution add bacbkward slash
        libxml_use_internal_errors(true);
        libxml_clear_errors();
        $doc->encoding = 'UTF-8';
        $htmlContent = $content;
        $doc->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'));
        // $doc->loadHTML($htmlContent);

        $images = $doc->getElementsByTagName('img');
        // Find all img tags
        $counter = 0;

        foreach ($images as $image) {

            $src = $image->getAttribute('src');
            $currentTimestamp = time(); // Get the current Unix timestamp
            $md5Hash = md5($currentTimestamp.$counter); // Create an MD5 hash of the timestamp

            // Check if the src is a data URL (Base64)
            if (strpos($src, 'data:image/') === 0) {
                // Extract image format (e.g., png, jpeg) detect fileFormat
                $imageFormat = explode(';', explode('/', $src)[1])[0];

                // Modify the src to point to the directory where the image is stored
                // $imageName = $imgPath . $md5Hash . '.' . $imageFormat; // Replace with your logic for generating unique filenames
                $imageName = $md5Hash.'.'.$imageFormat; // Replace with your logic for generating unique filenames

                // file_put_contents($this->uploadPath, base64_decode(str_replace('data:image/'.$imageFormat.';base64,', '', $src))); // Save the image
                file_put_contents($this->uploadPath.'/'.$imageName, base64_decode(str_replace('data:image/'.$imageFormat.';base64,', '', $src))); // Save the image

                // Set the new src attribute
                // concat '/' for directory
                $image->setAttribute('src', '/'.$this->uploadPath.'/'.$imageName);
            }
            // to make image name unique add counter in time and hash the time together with the counter
            $counter++;
        }
        // save all changes
        $modifiedReviseImg = $doc->saveHTML();

        // removing all html,header //only tag inside the body will be saved
        $newDocImg = new \DOMDocument('1.0', 'UTF-8'); // solution add bacbkward slash
        libxml_use_internal_errors(true);
        libxml_clear_errors();
        $newDocImg->encoding = 'UTF-8';
        // $newDocImg->loadHTML($modifiedReviseImg);
        $newDocImg->loadHTML(mb_convert_encoding($modifiedReviseImg, 'HTML-ENTITIES', 'UTF-8'));

        // Find the <body> tag
        $bodyNode = $newDocImg->getElementsByTagName('body')->item(0);

        if ($bodyNode !== null) {
            // Create a new document for the content inside <body>
            $newDoc = new \DOMDocument;
            foreach ($bodyNode->childNodes as $node) {
                $newNode = $newDoc->importNode($node, true);
                $newDoc->appendChild($newNode);
            }

            // Output the content inside <body>
            $modifiedHtml = $newDoc->saveHTML();
        }

        return $modifiedHtml;
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
        $data->record_trail = $data->record_trail.';delete-'.$user->lastname.', '.$user->firstname.'-'.date('Y-m-d H:i:s');

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
        $data->save();

        $user = Auth::user();
        PostLog::create([
            'user_id' => $user->id,
            'post_id' => $data->id,
            'alias' => $user->lastname.', '.$user->firstname,
            'description' => 'trash post',
            'action' => 'trash',
        ]);

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

        $data = Post::find($id);
        $data->status = 'draft'; // submit-for-publishing (static)
        $data->trash = 0; // be sure to set 0 the trash if draft
        $data->save();

        $user = Auth::user();
        PostLog::create([
            'user_id' => $user->id,
            'post_id' => $data->id,
            'alias' => $user->lastname.', '.$user->firstname,
            'description' => 'draft post',
            'action' => 'draft',
        ]);

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
        PostLog::create([
            'user_id' => $user->id,
            'post_id' => $data->id,
            'alias' => $user->lastname.', '.$user->firstname,
            'description' => 'archived post',
            'action' => 'archive',
        ]);

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
        PostLog::create([
            'user_id' => $user->id,
            'post_id' => $data->id,
            'alias' => $user->lastname.', '.$user->firstname,
            'description' => 'submit for publishing',
            'action' => 'submit',
        ]);

        return response()->json([
            'status' => 'submit-for-publishing',
        ], 200);
    }
}
