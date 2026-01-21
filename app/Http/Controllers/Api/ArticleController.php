<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Info;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    public function loadArticle($slug){
        return Info::where('alias', $slug)
            ->select('id', 'title', 'description', 'description_text', 'alias as slug',
                'publish_date')
            ->first();
    }

    public function articlesBySubject(Request $req){

        $search = $req->search;
        $subject = $req->subject;

        // ===== GET RELATED SUBJECTS =====
        $subjects = DB::table('info_subject_headings as a')
            ->join('infos as b', 'a.info_id', '=', 'b.id')
            ->join('subject_headings as c', 'a.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->select(
                'b.id',
                'b.title',
                'b.description',
                'b.description_text',
                'c.subject_heading',
                'd.subject',
                'd.slug'
            )
            ->selectRaw("
                COALESCE(
                    MATCH(b.title, b.description) AGAINST (? IN NATURAL LANGUAGE MODE),
                    0
                ) AS relevance
            ", [$search])
            ->where('d.slug', $subject)
            ->where(function ($q) use ($search) {
                $q->whereRaw("MATCH(b.title, b.description) AGAINST (? IN NATURAL LANGUAGE MODE)", [$search])
                ->orWhere('b.title', 'LIKE', "%{$search}%")
                ->orWhere('b.description', 'LIKE', "%{$search}%");
            })
            ->orderByDesc('relevance')
            ->paginate(10);

            return $subjects;
    }

    public function loadRelatedArticle($slug) {

        $info = Info::where('alias', $slug)->first();

        $relatedArticles = Info::select('id', 'title', 'alias as slug', 'description_text', 'publish_date')
            ->selectRaw("MATCH(title, description_text) AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance", [$info->title])
            ->whereRaw("MATCH(title, description_text) AGAINST (? IN NATURAL LANGUAGE MODE)", [$info->title])
            ->where('id', '!=', $info->id)  // exclude current article
            ->orderByDesc('publish_date')
            ->orderByDesc('relevance')
            ->limit(10)
            ->get();


        return $relatedArticles;
    }
}
