<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Info;
use App\Models\InfoSubjectHeading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\SubjectSearch;

class SubjectSearchController extends Controller
{

    private $limit = 0;
    private $paginate = 10;

    public function searchLatest(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            'key'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['key']  ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        //$searchObject = new SubjectSearch();
        //return $searchObject->searchLatestNoKeyword($subj, $sh, $yearNow);

        $subQuery = DB::table('infos as a')
            ->join('info_subject_headings as b', 'a.id', '=', 'b.info_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->select([
                'a.id',
                'a.title',
                'a.description',
                'a.description_text',
                'a.alias as slug',
                'a.source_url',
                'a.publish_date',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.subject',
                'd.slug as subject_slug'
            ])

            ->whereYear('publish_date', '<=', $yearNow)
            ->whereYear('publish_date', '>=', $yearNow - 4) // older than 5 years
            ->groupBy('a.id');

        /**
        🔍 FULLTEXT SEARCH (only when keyword exists)
         */
        if ($search !== '') {
            $subQuery->selectRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance",
                [$search]
            )
            ->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            )
            ->orderByDesc('relevance', 'DESC');
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');

        if ($subj !== '' && $subj !== 'all') {
            $results->where('t1.subject_slug', $subj);
        }

        if ($sh !== '' && $sh !== 'all') {
            $results->where('t1.subject_heading_slug', $sh);
        }

        return $results->paginate($this->paginate);

    }

    public function searchOthers(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            'key'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['key']  ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        $subQuery = DB::table('infos as a')
            ->join('info_subject_headings as b', 'a.id', '=', 'b.info_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->select([
                'a.id',
                'a.title',
                'a.description',
                'a.description_text',
                'a.alias as slug',
                'a.source_url',
                'a.publish_date',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.subject',
                'd.slug as subject_slug'
            ])
            ->whereYear('publish_date', '<', $yearNow - 4)// older than 5 years
            ->groupBy('a.id');

        /**
        🔍 FULLTEXT SEARCH (only when keyword exists)
         */
        if ($search !== '') {
            $subQuery->selectRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance",
                [$search]
            )
            ->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            )
            ->orderByDesc('relevance');
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');

        /**
         * 📚 Subject filter
         * if subject is not empty and not all
         */
        if ($subj !== '' && $subj !== 'all') {
            $results->where('t1.subject_slug', $subj);
        }

        /**
         * 🧩 Subject heading filter
         * if subject heading is not empty and not all
         */
        if ($sh !== '' && $sh !== 'all') {
            $results->where('t1.subject_heading_slug', $sh);
        }


        return $results->paginate($this->paginate);

    }


    /*=====================================
    SUBJECT LABELS FOR SEARCH FILTER
    This will return the list and count of subjects based on search key
    =====================================*/
    public function subjectLabels(Request $req){

        $validated = $req->validate([
            'key'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['key'] ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        $subQuery = DB::table('infos as a')
            ->join('info_subject_headings as b', 'a.id', '=', 'b.info_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->groupBy('a.id')
            ->select(
                'd.id',
                'd.subject',
                'd.slug'
            );

        /**
        * 🔍 FULLTEXT search if there is search keyword
        */
        if ($search !== '') {
            $subQuery->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            );
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        /**
         * 📚 Subject filter
         * if subject is not empty and not all
         */
        if ($subj !== '' && $subj !== 'all') {
            $subQuery->where('d.slug', $subj);
        }

        /**
         * 🧩 Subject heading filter
         * if subject heading is not empty and not all
         */
        if ($sh !== '' && $sh !== 'all') {
            $subQuery->where('c.slug', $sh);
        }

        //for accurate, we need to count on the subquery
        $subjects = DB::query()
            ->fromSub($subQuery, 't1')
            ->select(
                't1.*',
                DB::raw('COUNT(t1.subject) as count')
            )
            ->groupBy('t1.subject')
            ->orderByDesc('count')
            ->get();

        return $subjects;

    }

    public function subjectHeadingLabels(Request $req){

        $validated = $req->validate([
            'key'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['key'] ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        $subQuery = DB::table('infos as a')
            ->join('info_subject_headings as b', 'a.id', '=', 'b.info_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->groupBy('a.id')
            ->select(
                'c.id',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.subject',
                'd.slug as subject_slug'
            );

        /**
        * 🔍 FULLTEXT search — SAME logic as main query
        */
        if ($search !== '') {
            $subQuery->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            );
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        //for accurate, we need to count on the subquery
        $res = DB::query()
            ->fromSub($subQuery, 't1')
            ->select(
                't1.*',
                DB::raw('COUNT(t1.subject_heading) as count')
            );


        if ($subj !== '' && $subj !== 'all') {
            $res->where('subject_slug', $subj);
        }


        if ($sh !== '' && $sh !== 'all') {
            $res->where('subject_heading_slug', $sh);
        }

        return $res->groupBy('t1.subject_heading')
            ->orderByDesc('count')
            ->get();

    }


}
