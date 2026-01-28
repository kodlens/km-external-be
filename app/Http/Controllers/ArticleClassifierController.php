<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use App\Http\Controllers\Helpers\FilterDom;

class ArticleClassifierController extends Controller
{
    public function classify(Request $request)
    {

        $request->validate([
            'content' => 'required|string',
        ]);

        $filterDom = new FilterDom();
        $content = $filterDom->htmlToPlainText($request->content);

        $topK = 5;
        $model = 'llama3';

        $headings = DB::table('subject_headings')->get();

        $shIds = $headings->pluck('id')->toArray();
        $shLabels = $headings->pluck('label')->toArray();

        $subjectList = collect($shIds)
            ->zip($shLabels)
            ->map(fn ($v) => "{$v[0]}:{$v[1]}")
            ->implode(' | ');

        $prompt = <<<PROMPT
            You are a strict classification engine, not a chatbot.

            TASK:
            Select up to {$topK} MOST RELEVANT SubjectHeadings.

            RULES (MUST FOLLOW):
            - Choose ONLY from the provided SubjectHeadings.
            - Do NOT guess or infer loosely related topics.
            - Only select a SubjectHeading if it is DIRECTLY and CLEARLY related.
            - Maximum output items: $topK
            - Minimum relevance score to include an item: 0.50
            - If fewer than $topK meet the threshold, return fewer.
            - If below threshold, use the Others

            SubjectHeadings (ID:Label):
            {$subjectList}

            Article:
            \"\"\"{$content}\"\"\"

            OUTPUT:
            Return ONLY valid JSON array. Do not explain
        PROMPT;

        return $prompt;

        $ollama = Http::timeout(120)->post(
            'http://192.168.40.48:11434/api/generate',
            [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false,
                'options' => ['temperature' => 0.2],
            ]
        );

        if (!$ollama->successful()) {
            return response()->json(['message' => 'Ollama failed'], 500);
        }

        $raw = trim($ollama->json('response'));

        return $raw;

        try {
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\Throwable $e) {
            preg_match_all('/\{[^}]+\}/', $raw, $matches);
            $parsed = array_map(fn ($m) => json_decode($m, true), $matches[0]);
        }

        $now = Carbon::now();

        $results = collect($parsed)
            ->filter(fn ($r) => ($r['score'] ?? 0) > 0.5)
            ->take($topK)
            ->values();

        // foreach ($results as $res) {
        //     DB::table('info_subject_headings')->insert([
        //         'info_id' => $request->info_id,
        //         'subject_heading_id' => $res['id'],
        //         'score' => $res['score'],
        //         'analysis' => $res['analysis'],
        //         'created_at' => $now,
        //     ]);
        // }

        return response()->json([
            'results' => $results,
        ]);
    }
}
