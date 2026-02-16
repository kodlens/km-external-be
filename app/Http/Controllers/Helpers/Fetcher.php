<?php
namespace App\Http\Controllers\Helpers;

use App\Models\Region;
use App\Models\Agency;
use App\Models\Info;
use App\Models\RegionalOffice;

class Fetcher {


    public function getRegions(){
        $data = Region::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return $data;
    }


     public function getAgencies(){
        //$data = Agency::where('active', 1)->get();
        $data = Info::distinct()
            ->select('agency')
            ->whereNotNull('agency')       // remove null
            ->where('agency', '!=', '')    // remove empty strings
            ->orderBy('agency', 'asc')
            ->get();

        return $data;
    }

    public function getAuthorsAutocomplete(){
            $data = Info::distinct('author_name')
            ->whereNotNull('author_name')
            ->select('author_name')
            ->orderBy('author_name', 'asc')
            ->get();

        return $data;

    }


    public function getTags(){
        $data = Info::distinct('tags')
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
