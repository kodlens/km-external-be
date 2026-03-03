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
        $shLabels = $headings->pluck('subject_heading')->toArray();

        $subjectList = collect($shIds)
            ->zip($shLabels)
            ->map(fn ($v) => "{$v[0]}:{$v[1]}")
            ->implode(' | ');


        $prompt = <<<PROMPT
            You are a strict classification engine, not a chatbot.

            TASK:
            Select up to {$topK} MOST RELEVANT SubjectHeadings from the article given below.

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
            Return ONLY valid JSON array and follow this format {id: <id>, score: <score>, analysis: <you analysis why this is relevant>}. Do not explain or add any text outside the JSON array.
        PROMPT;

        //return response()->json(['prompt' => $prompt]);
        //return $prompt;

        define('API_OLLAMA', env('AI_API'));

        $ollama = Http::timeout(120)->post(
            API_OLLAMA . '/generate',
            [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false, // 👈 change this
                'options' => ['temperature' => 0.2],
            ]
        );

        if (!$ollama->successful()) {
            return response()->json(['message' => 'Ollama failed'], 500);
        }

        $raw = trim($ollama->json('response'));


        try {
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\Throwable $e) {
            preg_match_all('/\{[^}]+\}/', $raw, $matches);
            $parsed = array_map(fn ($m) => json_decode($m, true), $matches[0]);
        }

        $now = Carbon::now();

        $results = collect($parsed)
            ->filter(fn ($r) => ($r['score'] ?? 0) > 0.2)
            ->take($topK)
            ->values();

        return response()->json([
            'results' => \json_decode($results),
            'raw' => $raw,
            'parsed' => $parsed,
        ]);

        // foreach ($results as $res) {
        //     DB::table('info_subject_headings')->insert([
        //         'info_id' => $request->info_id,
        //         'subject_heading_id' => $res['id'],
        //         'score' => $res['score'],
        //         'analysis' => $res['analysis'],
        //         'created_at' => $now,
        //     ]);
        // }

    }
}
