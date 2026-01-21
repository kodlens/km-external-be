<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



/* ============================
    Search route
============================= */
Route::get('/search/latest', [\App\Http\Controllers\Api\SearchController::class, 'searchLatest']);
Route::get('/search/others', [\App\Http\Controllers\Api\SearchController::class, 'searchOthers']);

/* ============================
    Sidebar subject and subject headings search
============================= */
//Subject page api call for subject list
Route::get('/subject-labels/search', [\App\Http\Controllers\Api\SearchController::class, 'subjectLabels']);
//Subject page api call for subject-headings list
Route::get('/subject-headings/search', [\App\Http\Controllers\Api\SearchController::class, 'subjectHeadingLabels']);




/* ============================
This route is for by subject
============================= */
//calling the list of subject and subject headings on SUBJECT SEARCH
Route::get('/subject/search-latest', [\App\Http\Controllers\Api\SubjectSearchController::class, 'searchLatest']);
Route::get('/subject/search-others', [\App\Http\Controllers\Api\SubjectSearchController::class, 'searchOthers']);

/* ============================
    Sidebar subject and subject headings search
============================= */
Route::get('/subject/subject-labels', [\App\Http\Controllers\Api\SubjectSearchController::class, 'subjectLabels']);
Route::get('/subject/subject-headings', [\App\Http\Controllers\Api\SubjectSearchController::class, 'subjectHeadingLabels']);

/* ===============================
This route is for by subject search
================================= */




/* ============================
This route is for by subject headings label
============================= */
//calling the list of subject labels on SUBJECT HEADINGS SEARCH
//Route::get('/subject-headings/search/latest', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'searchLatest']);
//Route::get('/subject-headings/search/others', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'searchOthers']);
//Route::get('/subject-headings/subject-labels', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'subjectLabels']);
//Route::get('/subject-headings/subject-headings', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'subjectHeadingLabels']);

/* ============================
This route is for by subject headings label
************ END ****************
============================= */




Route::get('/load-subjects', [\App\Http\Controllers\Api\SubjectController::class, 'loadSubjects']);
Route::get('/load-article/{slug}', [\App\Http\Controllers\Api\ArticleController::class, 'loadArticle']);
Route::get('/load-related-article/{title}', [\App\Http\Controllers\Api\ArticleController::class, 'loadRelatedArticle']);

//Route::get('/subjects/{subjectSlug}', [\App\Http\Controllers\Api\SubjectArticleController::class, 'loadArticle']);
Route::get('/subject/articles-by-subject', [\App\Http\Controllers\Api\ArticleController::class, 'articlesBySubject']);
