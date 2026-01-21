<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class OpenController extends Controller
{
    public function getSubjects(){
        $subjects = Subject::where('active', 1)->with('subject_headings')->get();
        return response()->json($subjects);
    }

    public function getSubjectHeadings($subjectId){
        $subjectHeadings = Subject::find($subjectId)->subject_headings()->where('active', 1)->get();
        return response()->json($subjectHeadings);
    }

}
