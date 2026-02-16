<?php

namespace App\Http\Controllers\Base;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Info;
use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;
use App\Http\Controllers\Helpers\RecordTrail;
use App\Models\Information;


class InfoController extends Controller
{
    //
    public function store(Request $req)
    {
        //return $req;
        $req->validate([
            'title' => ['required', new ValidateTitle(0)],
            'description' => ['required'],
        ], [
            'description.required' => 'Description is required.',
        ]);

        try {

            DB::transaction(function () use ($req) {


                /* ==============================
                    Convert base64 images → files and rewrite HTML
                ============================== */
                $filterDom = new FilterDom();
                $modifiedHtml = $filterDom->filterDOM($req->description);

                /* ==============================
                    Clean HTML → plain text
                ============================== */
                $content = $filterDom->htmlToPlainText($req->description);

                $dateFormated = $req->publish_date
                    ? date('Y-m-d', strtotime($req->publish_date))
                    : null;

                /* ==============================
                Covert Array tags to string/plain text
                ============================== */
                $tagsString = null;
                if(isset($req->tags)){

                    foreach($req->tags as $key => $tag){
                        if($key == 0){
                            $tagsString = $tag;
                        }else{
                            $tagsString = $tagsString . ',' .$tag;
                        }
                    }
                }

                $user = Auth::user();
                $name = $user->lname . ',' . $user->fname;

                $data = Info::create([
                    'title' => $req->title,
                    'alias' => Str::slug($req->title),
                    'description' => $modifiedHtml,
                    'description_text' => $content,
                    'author_name' => $req->author_name ? $req->author_name : null,
                    'encoded_by' => $user->id,
                    'encoded_at' => now(),
                    'region' => $req->region,
                    'agency' => $req->agency,
                    'tags' => $tagsString,
                    'source_url' => $req->source_url,
                    'status' => $req->status,
                    'publish_date' => $dateFormated,
                    'is_publish' => 0,
                    // 'is_ojt' => $user->role === 'encoder' ? $user->is_ojt : 0,
                    //'is_press_release' => $req->is_press_release ? 1 : 0,
                    'record_trail' => (new RecordTrail())
                        ->recordTrail('', 'insert', $user->id, $name),
                ]);

            });

            return response()->json([
                'status' => 'saved',
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $req, $id){

        $req->validate([
            'title' => ['required', 'unique:infos,title,' . $id . ',id'],
            'description' => ['required', 'string'],
        ]);


        $filterDom = new FilterDom();
        $modifiedHtml = $filterDom->filterDOM($req->description);

        /* ==============================
            Clean HTML → plain text
        ============================== */
        $content = $filterDom->htmlToPlainText($req->description);

        $dateFormated = $req->publish_date
            ? date('Y-m-d', strtotime($req->publish_date))
            : null;

        //convert tags to string
        $tagsString = null;
        if(isset($req->tags)){

            foreach($req->tags as $key => $tag){
                if($key == 0){
                    $tagsString = $tag;
                }else{
                    $tagsString = $tagsString . ',' .$tag;
                }
            }
        }

        //call user for record trail
        $user = Auth::user();
        $name = $user->lname . ',' . $user->fname;

        //update data in table articles
        $data = Info::find($id);
        $data->title = $req->title;
        $data->alias = Str::slug($req->title);
        $data->description = $modifiedHtml;
        $data->description_text = $content;

        $data->author_name = $req->author_name ? $req->author_name : null;
        $data->last_updated_by = $user->id;
        $data->last_updated_at = now();
        $data->agency = $req->agency ? $req->agency : null;
        $data->region = $req->region ? $req->region : null;
        $data->source_url = $req->source_url;
        $data->status = $req->status;
        $data->publish_date = $dateFormated;
        $data->tags = $tagsString;

        // if($user->role === 'encoder'){
        //     $data->is_ojt = $user->is_ojt;
        // }

        //$data->is_press_release = $req->is_press_release ? 1 : 0;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'update', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'updated'
        ], 200);

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

        Info::destroy($id);


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
        $data = Info::find($id);
        $data->status = 'trash';
        $data->trash = 1;
        $name = $user->lname . ',' . $user->fname;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'trash', $user->id, $name);
        $data->save();

        //remove to info table
        Information::where('source_id', $id)
            ->update([
                'is_publish' => 0,
            ]);

        return response()->json([
            'status' => 'trashed',
        ], 200);
    }

        public function publish($id){

        try {
            DB::transaction(function () use ($id) {
                // Database operations here
                $user = Auth::user();

                $data = Info::find($id);
                $data->status = 'publish'; //submit-for-publishing (static)
                $data->record_trail = $data->record_trail . 'publish|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
                $data->save();


                $info = Information::updateOrCreate(['source_id' => $data->id],
                [
                    'source_id' => $data->id,
                    'title' => $data->title,
                    'description' => $data->description,
                    'description_text' => $data->description_text,
                    'alias' => $data->alias,
                    'agency_code' => $req->agency,
                    'tags' => $data->tags,
                    'source' => 'scienceph',
                    'source_url' => 'https://www.science.ph',
                    'content_type' => 'blog',
                    'region' => $data->region,
                    'is_publish' => 1,
                ]);


            });

            return response()->json([
                'status' => 'publish'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function draft($id){

        try {
            DB::transaction(function () use ($id) {
                $user = Auth::user();
                $data = Info::find($id);
                $data->status = 'draft';
                $data->trash = 0;
                $data->record_trail = $data->record_trail . 'draft|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
                $data->save();

                $infoExists = Information::where('alias', $data->alias)->exists();
                if($infoExists){
                    Information::where('alias', $data->alias)->update([
                        'is_publish' => 0
                    ]);
                }

            });

            return response()->json([
                'status' => 'draft'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }


    }




}
