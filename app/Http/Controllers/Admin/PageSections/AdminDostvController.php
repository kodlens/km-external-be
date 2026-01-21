<?php

namespace App\Http\Controllers\Admin\PageSections;

use App\Http\Controllers\Base\DostvController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Dostv;
use Illuminate\Support\Facades\Storage;

class AdminDostvController extends DostvController
{
    public function index(){
        return Inertia::render('Admin/PageSections/Dostv/DostvIndex');
    }

    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Dostv::where('title', 'like', $req->title . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }

    public function create(){
        return Inertia::render('Admin/PageSections/Dostv/DostvMain/DostvMainCreateEdit',[
            'id' => 0,
            'dostv' => null
        ]);
    }

    public function edit($id){ 
        $data = Dostv::find($id);

        return Inertia::render('Admin/PageSections/Dostv/DostvMain/DostvMainCreateEdit',[
            'id' => $id,
            'dostv' => $data
        ]);
    }
    
}
