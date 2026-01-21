<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         $authHeader = $request->header('Authorization'); // e.g. "Bearer YOUR_TOKEN"

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return abort(403, 'Unauthorized');
        }

        $token = substr($authHeader, 7); // remove "Bearer " part

        if ($token !== config('app.api_token')) {
            return abort(403, 'Invalid token');
        }

        return $next($request);
    }
}
