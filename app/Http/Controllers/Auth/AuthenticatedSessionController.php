<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request) : RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        //$role = auth()->user()->role;
        //return redirect('/admin/dashboard');
        //return redirect()->route('admin.dashboard');
        // return response()->json([
        //     'role' => $role
        // ], 200);
        $user = Auth::user();
        $user->update(['last_login' => now()]);

        $role = $user->role;

        if(strtolower($role) == 'admin')
            return redirect()->intended(RouteServiceProvider::ADMIN);
        else if(strtolower($role) == 'encoder')
            return redirect()->intended(RouteServiceProvider::ENCODER);
        else if(strtolower($role) == 'publisher')
            return redirect()->intended(RouteServiceProvider::PUBLISHER);
        else
            return redirect()->intended(RouteServiceProvider::HOME);

        //return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/km/login');
    }
}
