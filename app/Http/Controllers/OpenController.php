<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\SubjectHeading;

class OpenController extends Controller
{
    public function getSubjects(){
        $subjects = Subject::where('active', 1)->with('subject_headings')->get();
        return response()->json($subjects);
    }

    public function getSubjectHeadingsWithParams($subjectId){
        $subjectHeadings = Subject::find($subjectId)->subject_headings()->where('active', 1)->get();
        return response()->json($subjectHeadings);
    }


    public function getSubjectHeadings(){

        $data = SubjectHeading::where('active', 1)->get();
        return response()->json($data);
    }

}
