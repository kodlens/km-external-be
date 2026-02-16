<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use App\Models\Info;

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
use App\Http\Controllers\Helpers\RecordTrail;
use App\Http\Controllers\Base\InfoController;
use App\Http\Controllers\Helpers\Fetcher; // <--extending the Fetch

class PublisherInfoController extends InfoController
{


    public function index()
    {
        return Inertia::render('Publisher/Info/PublisherInfoIndex');
    }

    public function getData(Request $req)
    {
        $sort = explode('.', $req->sort_by);

        $user = Auth::user();

        $data = Info::query()->where('trash', 0);

        if ($req->status != '' || $req->status != null) {
            $data->where('status', $req->status);
        }

        $data->where('title', 'like', '%'.$req->title.'%');

        return $data
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }

    public function create()
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        $fetcher = new Fetcher();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $authors = $fetcher->getAuthorsAutocomplete();

        return Inertia::render('Publisher/Info/PublisherInfoCreateEdit', [
            'id' => 0,
            'ckLicense' => $CK_LICENSE,
            'info' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'authors' => $authors
        ]);
    }


    public function edit($id)
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        $fetcher = new Fetcher();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $authors = $fetcher->getAuthorsAutocomplete();

        $info = Info::with(['subjects'])->find($id);

          return Inertia::render('Publisher/Info/PublisherPostCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'info' => $info,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'authors' => $authors
        ]);
    }


    /** ======================================
     * This is delete function
    */
    public function destroy($id)
    {
        $user = Auth::user();

        $data = Info::find($id);

        if (! $data->description) {
            return response()->json([
                'errors' => [
                    'description' => 'No Content.',
                ],
                'message' => 'No image to remove from the content.',
            ], 422);
        }
        /*------------------------------------------------------
            Before executing delete, image must remove from the storage
            to free some memory.
        ------------------------------------------------------*/
        $filterDom = new FilterDom();
        $filterDom->removeImagesFromDOM($data->description);


        $name = $user->lname . ',' . $user->fname;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'delete', $user->id, $name);
        $data->save();

        Post::destroy($id);


        return response()->json([
            'status' => 'deleted',
        ], 200);
    }

    /** ======================================
     * This is soft trash/soft delete function
*/
    public function trash($id)
    {
        $user = Auth::user();
        $data = Post::find($id);
        $data->trash = 1;
        $name = $user->lname . ',' . $user->fname;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'trash', $user->id, $name);
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
        $name = $user->lname . ',' . $user->fname;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'draft', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'draft',
        ], 200);
    }

    public function postArchived($id)
    {
        $user = Auth::user();
        $name = $user->lname . ',' . $user->fname;

        $data = Post::find($id);
        // $data->status_id = 3; //submit-for-publishing (static)
        $data->status = 'archive'; // submit-for-publishing (static)
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'archive', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'archive',
        ], 200);
    }

    public function postSubmitForPublishing($id)
    {
        $user = Auth::user();
        $name = $user->lname . ',' . $user->fname;

        $data = Post::find($id);
        $data->status = 'submit'; // submit-for-publishing (static)
        // $data->status_id = 7; //submit-for-publishing (static)
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'submit', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'submit-for-publishing',
        ], 200);
    }
}
