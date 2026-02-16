<?php
namespace App\Http\Controllers\Helpers;

use App\Models\Region;
use App\Models\Agency;
use App\Models\Info;
use App\Models\RegionalOffice;

class Fetcher {

public function getSections() {
        $data = Section::where('active', 1)->get();
        return $data;
    }

    public function getCategories(){
        $data = Category::where('active', 1)->get();
        //return response()->json($data);
        return $data;
    }

    public function getRegions(){
        $data = Region::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return $data;

    }



/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Get the list of regional offices
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
/*******  e15ad8db-d389-4066-9407-a31965f5be53  *******/
    public function getRegionalOffices(){
        $data = RegionalOffice::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return $data;

    }

     public function getAgencies(){
        //$data = Agency::where('active', 1)->get();
        $data = Article::distinct()
            ->select('agency')
            ->whereNotNull('agency')       // remove null
            ->where('agency', '!=', '')    // remove empty strings
            ->orderBy('agency', 'asc')
            ->get();

        return $data;
    }

    public function getAuthorsAutocomplete(){
            $data = Article::distinct('author')
            ->select('author')
            ->orderBy('author', 'asc')
            ->get();

        return $data;

    }


    public function getTags(){
        $data = Article::distinct('tags')
            ->select('tags')
            ->orderBy('tags', 'asc')
            ->get();

        $tags = [];

        foreach($data as $key => $tag){
            if(empty($tag->tags)) continue;
            $explodedTags = explode(',', $tag->tags);
            foreach($explodedTags as $explodedTag){
                if(in_array(ucwords($explodedTag), $tags)) continue;
                array_push($tags, ucwords($explodedTag));
            }
        }

        return $tags;
    }


}
