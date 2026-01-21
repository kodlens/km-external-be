<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SubjectHeading;
use App\Models\Subject;
use App\Models\Info;

class SubjectHeadingSearchController extends Controller
{

    /* ====================================
        This will handle the search by subject
    ==================================== */
   public function searchLatest(Request $req)
    {
        $yearNow = now()->year;

        $validated = $req->validate([
            'key'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['key']  ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        $results = Info::join('info_subject_headings as a', 'infos.id', '=', 'a.info_id')
            ->join('subject_headings as b', 'a.subject_heading_id', '=', 'b.id')
            ->join('subjects as c', 'b.subject_id', '=', 'c.id')
            ->select([
                'infos.id',
                'infos.title',
                'infos.description',
                'infos.description_text',
                'infos.alias as slug',
                'infos.source_url',
                'infos.publish_date',
            ])
            ->selectRaw(
                "MATCH(infos.title, infos.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance",
                [$search]
            )
            ->selectRaw(
                "(infos.title LIKE ?) AS title_match",
                [$search . '%']
            )
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->whereRaw(
                        "MATCH(infos.title, infos.description_text)
                        AGAINST (? IN NATURAL LANGUAGE MODE)",
                        [$search]
                    )
                    ->orWhere('infos.title', 'LIKE', "{$search}%")
                    ->orWhere('infos.description_text', 'LIKE', "%{$search}%");
                });
            })
            ->whereYear('infos.publish_date', $yearNow)
            ->when($subj !== '' && $subj !== 'all', function ($q) use ($subj) {
                $q->where('c.slug', $subj);
            })
            ->when($sh !== '' && $sh !== 'all', function ($q) use ($sh) {
                $q->where('b.slug', $sh);
            })
            ->orderByDesc('title_match')
            ->orderByDesc('relevance')
            ->paginate(10);

        return $results;

    }


    /* ====================================

        This will handle the search by subject headings
        and then search the key within the subject scope only

    ==================================== */

    public function subjectLabels(Request $req){

        $validated = $req->validate([
            'key' => 'string|nullable',
            'subj' => 'string|nullable',
            'sh' => 'string|nullable'
        ]);

        $subj   = trim($validated['subj'] ?? '');
        $search = trim($validated['key'] ?? '');
        $sh     = trim($validated['sh'] ?? '');

        $subjects = DB::table('info_subject_headings as a')
            ->join('infos as b', 'a.info_id', '=', 'b.id')
            ->join('subject_headings as c', 'a.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->selectRaw(
                "d.subject, d.slug, MAX(
                    COALESCE(MATCH(b.title, b.description_text) AGAINST (? IN NATURAL LANGUAGE MODE), 0)
                ) AS relevance, count(d.subject) as count",
                [$search]
            )
            ->where(function ($q) use ($search) {
                $q->whereRaw("MATCH(b.title, b.description_text) AGAINST (? IN NATURAL LANGUAGE MODE)", [$search])
                    ->orWhere('b.title', 'LIKE', "%{$search}%")
                    ->orWhere('b.description_text', 'LIKE', "%{$search}%");
            })
            ->where('c.slug', $sh)
            ->groupBy('d.subject')
            ->orderByDesc('relevance')
            ->limit(10)
            ->get();

        return $subjects;
    }

    function dashToSpace(string $text): string
    {
        return str_replace('-', ' ', $text);
    }



    public function subjectHeadingLabels(Request $req){

         $validated = $req->validate([
            'key' => 'string|nullable',
            'subj' => 'string|nullable',
            'sh' => 'string|nullable'
        ]);


        $subj   = trim($validated['subj'] ?? '');
        $search = trim($validated['key'] ?? '');
        $sh     = trim($validated['sh'] ?? '');

        //$subjectHeading = SubjectHeading::where('slug', $sh)->first();
        //$subject = Subject::where('id', $subjectHeading->subject_id)->first();

         $subjectHeadings = DB::table('subject_headings as sh')
            ->join('info_subject_headings as ish', 'ish.subject_heading_id', '=', 'sh.id')
            ->join('infos as i', 'i.id', '=', 'ish.info_id')
            ->join('subjects as s', 's.id', '=', 'sh.subject_id')
            ->select('sh.subject_heading', 'sh.slug')
            ->selectRaw(
                "MAX(
                    COALESCE(MATCH(i.title, i.description_text) AGAINST (? IN NATURAL LANGUAGE MODE), 0)
                ) AS relevance, count(sh.subject_heading) as count",
                [$search]
            )

            ->where(function ($q) use ($search) {
                $q->whereRaw("MATCH(i.title, i.description_text) AGAINST (? IN NATURAL LANGUAGE MODE)", [$search])
                    ->orWhere('i.title', 'LIKE', "%{$search}%")
                    ->orWhere('i.description_text', 'LIKE', "%{$search}%");
            })
            ->where('s.slug', $subj)
            ->groupBy('sh.id', 'sh.subject_heading')
            ->orderByDesc('relevance')
            ->limit(10)->get(['slug', 'subject_heading']); // <-- limit here

        return $subjectHeadings;
    }


}
