<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Author;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthorController extends Controller
{
    //
    public function index(){
        return Inertia::render('Panel.Author.AuthorIndex');
    }


    public function show($id){
        return Author::find($id);
    }

    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Author::where('author', 'like', $req->title . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        // $data = Category::where('title', 'like', $req->title . '%')
        //     ->get();

        return $data;
    }

    public function loadData(){

        return Author::orderBy('author', 'asc')
            ->get();
  
    }

    public function create(){
        return view('panel.author.author-create-edit')
            ->with('id', 0);
    }

    public function store(Request $req){
    
        $req->validate([
            'author' => ['required', 'unique:categories'],
        ]);

        Author::create([
            'author' => ucfirst($req->author),
            'is_active' => $req->is_active
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }


    public function edit($id){

        return view('panel.author.author-create-edit')
            ->with('id', $id);
    }
    public function update(Request $req, $id){
    
        $req->validate([
            'title' => ['required', 'unique:authors,author,' . $id . ',id'],
        ]);

        $data = Author::find($id);
        $data->author = ucfirst($req->author);
        $data->is_active = $req->is_active;
        $data->save();
        
        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $data = Author::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
