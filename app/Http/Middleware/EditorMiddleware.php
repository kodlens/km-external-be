<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;

class EditorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $role = Auth::user()->role;
        if(in_array(strtolower($role), ['administrator', 'editor'])){
            // $response = $next($request);
            // $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
            // $response->headers->set('Pragma', 'no-cache');
            // $response->headers->set('Expires', '0');
            // return $response;
            return $next($request);
        }

        abort(403);
    }
}
