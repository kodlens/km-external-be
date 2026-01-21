<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;
use Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminSectionController extends Controller
{
    public function index(){
       

        return Inertia::render('Admin/Section/AdminSectionIndex');
    }


    public function show($id){
        return Section::find($id);
    }



    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Section::where('section', 'like', $req->search . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        // $data = Section::where('title', 'like', $req->title . '%')
        //     ->get();

        return $data;
    }

    public function store(Request $req){
    
        $req->validate([
            'section' => ['required', 'unique:sections'],
        ]);

        Section::create([
            'section' => ucfirst($req->section),
            'active' => $req->active ? 1: 0
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }


  
    public function update(Request $req, $id){
    
        $req->validate([
            'section' => ['required', 'unique:sections,section,' . $id . ',id'],
        ]);

        $data = Section::find($id);
        $data->section = ucfirst($req->section);
        $data->active = $req->active ? 1: 0;
        $data->save();
        
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $data = Section::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
