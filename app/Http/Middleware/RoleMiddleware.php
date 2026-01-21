<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;
use Illuminate\Support\Facades\Route;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(Auth::check()){

            // this method will return routeNames
            $routeName = Route::currentRouteName();
            //return redirect($routeName);

            $roles = Auth::user()->load('role', 'role.role_has_permissions.permission')->role->role_has_permissions;
            $permissions = [];
            // convert to plain array
            foreach($roles as $permission){
                array_push($permissions, $permission->permission->name);
            }

            if(in_array(strtolower($routeName),$permissions)){
                $response = $next($request);
                $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
                $response->headers->set('Pragma', 'no-cache');
                $response->headers->set('Expires', '0');
                return $response;
            }else{
                return abort(403);
            }
        }

        return abort(403);
    }
}
