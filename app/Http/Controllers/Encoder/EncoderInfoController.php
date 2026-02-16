<?php

namespace App\Http\Controllers\Encoder;

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

class EncoderInfoController extends InfoController
{


    public function index()
    {
        return Inertia::render('Encoder/Info/EncoderInfoIndex');
    }

    public function getData(Request $req)
    {
        $sort = explode('.', $req->sort_by);

        $user = Auth::user();

        $data = Info::query()->where('trash', 0)
            ->where('encoded_by', $user->id);

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

        return Inertia::render('Encoder/Info/EncoderInfoCreateEdit', [
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

          return Inertia::render('Encoder/Info/EncoderInfoCreateEdit', [
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


}
