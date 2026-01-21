<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class AdminDashboardController extends Controller
{
    //
    public function index(){
        return Inertia::render('Admin/AdminDashboard');
    }
}