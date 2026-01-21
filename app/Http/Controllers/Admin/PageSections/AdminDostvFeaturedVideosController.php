<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dostv;

class AdminDostvFeaturedVideosController extends Controller
{
    //


    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Dostv::where('title', 'like', $req->title . '%')
            ->where('is_featured', 1)
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }

    
}
