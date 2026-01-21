<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {

            if (Auth::guard($guard)->check()) {

                $role = Auth::user()->role;
                //return redirect(RouteServiceProvider::HOME);
                if(strtolower($role) == 'admin')
                    return redirect('/admin/dashboard');

                if(strtolower($role) == 'publisher')
                    return redirect('/publisher/dashboard');

                if(strtolower($role) == 'encoder')
                    return redirect('/encoder/dashboard');

                //return redirect('/panel/dashboard');
            }
        }

        return $next($request);
    }
}
