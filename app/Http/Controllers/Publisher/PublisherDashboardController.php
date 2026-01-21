<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublisherDashboardController extends Controller
{
    //
    public function index(){
        return Inertia::render('Publisher/PublisherDashboard');
    }
}
