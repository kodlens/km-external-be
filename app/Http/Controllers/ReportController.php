<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function articlesByQuarter(){

         $currentYear = Carbon::now()->year;
        $minYear = $currentYear - 2; // Last 4 years including current

        $data = DB::table('posts')
            ->select('YEAR', 'quarter_id', DB::raw('COUNT(*) as total_published'))
            ->where('status', 'publish') // Assuming 1 = Published
            ->where('is_archived', false)
            ->where('trash', false)
            ->where('YEAR', '>=', $minYear)
            ->groupBy('YEAR', 'quarter_id')
            ->orderByDesc('YEAR')
            ->orderBy('quarter_id')
            ->get();

        return response()->json($data);
    }


    public function articlesByStatus()
    {
        $data = DB::table('posts')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->where('trash', false)
            ->groupBy('status')
            ->orderBy('status')
            ->get();

        return response()->json($data);
    }

    public function publicationTimeliness()
    {
        return DB::table('posts')
            ->select('id', 'title', 'created_at', 'publication_date',
                    DB::raw('DATEDIFF(publication_date, created_at) as days_to_publish'))
            ->where('status', 'publish')
            ->whereNotNull('created_at')
            ->whereNotNull('publication_date')
            ->where('trash', false)
            ->orderByDesc('days_to_publish')
            ->limit(50)
            ->get();
    }

}
