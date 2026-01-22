<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Status;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Category;
use App\Models\Section;
use App\Models\Author;
use App\Models\Quarter;
use App\Models\PostLog;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;

class PublisherPostController extends Controller
{

    private $uploadPath = 'storage/upfiles'; //this is the upload path
    private $fileCustomPath = 'public/upfiles/'; //this is for delete, or checking if file is exist



    public function index()
    {
        return Inertia::render('Publisher/Post/PublisherPostIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);

        $status = '';

        $user = Auth::user()->load('role');

        $data = Post::with(['subjects'])
            ->where('status', '!=', 'draft');

        if ($req->status != '' || $req->status != null) {
            $data->where('status', $status);
        }
        $data->where('title', 'like', '%'. $req->search . '%')
            ->orWhere('id', 'like', '%'. $req->search . '%');

        return $data->where('trash', 0)
            ->where(function($q){
                $q->where('status', '!=', 'draft')
                    ->where('status','!=', 'publish');
            })
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);

    }

    public function formView($id){
        $roleId = Auth::user()->role_id;

        $article = Post::with('category', 'author', 'quarter', 'postlogs')->find($id);

        $categories = Category::orderBy('title', 'asc')->get();
        $sections = Section::orderBy('order_no', 'asc')->get();
        $authors = User::join('roles', 'roles.id', 'users.role_id')
            ->select('users.id', 'users.lastname', 'users.firstname', 'users.middlename', 'roles.role')
            ->where('roles.role', 'author')
            ->get();

        $quarters = Quarter::orderBy('quarter_name', 'asc')->get();

        return Inertia::render('Publisher/Post/PublisherPostFormView',[
            'id' => $id,
            'categories' => $categories,
            'sections' => $sections,
            'authors' => $authors,
            'quarters' => $quarters,
            'article' => $article]);
    }

    public function update(Request $req, $id){

        $req->validate([
            'title' => ['required', 'unique:posts,title,' . $id . ',id'],
            'excerpt' => ['required'],
            'description' => ['required'],
            'category' => ['required'],
            'status' => ['required_if:is_submit,0'],
            //'author' => ['required'],
        ],[
            'description.required' => 'Content is required.',
            'status.required_if' => 'Status is required.',

        ]);

        $data = Post::find($id);
        $user = Auth::user();

        $data->status = $req->is_submit > 0 ? 'publish' : 'return'; //set to send-for-publishing
        $data->record_trail = $data->record_trail . 'update-('.$user->id.')'.$user->lastname . ', ' . $user->firstname . '-' . date('Y-m-d H:i:s') . ';';
        $data->save();

        PostLog::create([
            'user_id' => $user->id,
            'post_id' => $data->id,
            'alias' => $user->lastname . ', ' . $user->firstname,
            'description' => $req->is_submit > 0 ? 'post publish' : 'return to author',
            'action' => 'update'
        ]);

        return response()->json([
            'status' => 'updated'
        ], 200);
    }









    /* ==============================
        this method return the content
        change the <img src=(base64) /> to <img src="/storage_path/your_dir" />
    */
   private function filterDOM($content){
        $modifiedHtml = '';

        $doc = new \DOMDocument('1.0', 'UTF-8'); //solution add bacbkward slash
        libxml_use_internal_errors(true);
        libxml_clear_errors();
        $doc->encoding = 'UTF-8';
        $htmlContent = $content;
        $doc->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'));
        //$doc->loadHTML($htmlContent);

        $images = $doc->getElementsByTagName('img');
        // Find all img tags
        $counter = 0;

        foreach ($images as $image) {

            $src = $image->getAttribute('src');
            $currentTimestamp = time(); // Get the current Unix timestamp
            $md5Hash = md5($currentTimestamp . $counter); // Create an MD5 hash of the timestamp

            // Check if the src is a data URL (Base64)
            if (strpos($src, 'data:image/') === 0) {
                // Extract image format (e.g., png, jpeg) detect fileFormat
                $imageFormat = explode(';', explode('/', $src)[1])[0];

                // Modify the src to point to the directory where the image is stored
                //$imageName = $imgPath . $md5Hash . '.' . $imageFormat; // Replace with your logic for generating unique filenames
                $imageName = $md5Hash . '.' . $imageFormat; // Replace with your logic for generating unique filenames

                //file_put_contents($this->uploadPath, base64_decode(str_replace('data:image/'.$imageFormat.';base64,', '', $src))); // Save the image
                file_put_contents($this->uploadPath . '/' . $imageName, base64_decode(str_replace('data:image/'.$imageFormat.';base64,', '', $src))); // Save the image

                // Set the new src attribute
                //concat '/' for directory
                $image->setAttribute('src', '/'.$this->uploadPath.'/' . $imageName);
            }
            //to make image name unique add counter in time and hash the time together with the counter
            $counter++;
        }
        //save all changes
        $modifiedReviseImg = $doc->saveHTML();

        //removing all html,header //only tag inside the body will be saved
        $newDocImg =  new \DOMDocument('1.0', 'UTF-8'); //solution add bacbkward slash
        libxml_use_internal_errors(true);
        libxml_clear_errors();
        $newDocImg->encoding = 'UTF-8';
        //$newDocImg->loadHTML($modifiedReviseImg);
        $newDocImg->loadHTML(mb_convert_encoding($modifiedReviseImg, 'HTML-ENTITIES', 'UTF-8'));

        // Find the <body> tag
        $bodyNode = $newDocImg->getElementsByTagName('body')->item(0);

        if ($bodyNode !== null) {
            // Create a new document for the content inside <body>
            $newDoc = new \DOMDocument();
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
        $data->record_trail = $data->record_trail . ';delete-'.$user->lastname . ', '. $user->firstname . '-' . date('Y-m-d H:i:s');


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
        $data->record_trail = $data->record_trail . ';trash-'.$user->lastname . ', '. $user->firstname . '-' . date('Y-m-d H:i:s');


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
