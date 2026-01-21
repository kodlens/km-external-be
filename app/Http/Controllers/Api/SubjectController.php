<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    public function loadSubjects(){
        return Subject::with(['subject_headings'])
            ->get();
    }
}
