<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubjectArticleController extends Controller
{
    public function searchArticle($subjectSlug){
        
    }

    public function articlesBySubject(Request $req){
        return $req;
    }
}
