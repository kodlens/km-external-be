<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\StatusPair;
use Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            // Example: Authenticated user
            // 'categories' => function () {
            //     return Category::where('active', 1)->count() > 0
            //         ? Category::orderBy('title', 'asc')->select('id','title', 'slug')->get()
            //         : null;
            // },

            // 'permissions' => function () {
            //     if (Auth::check()) {
            //         $permissions = [];
            //         $roles = Auth::user()->load('role', 'role.role_has_permissions.permission')->role->role_has_permissions;

            //         foreach ($roles as $permission) {
            //             $permissions[] = $permission->permission->name;
            //         }

            //         return count($permissions) > 0 ? $permissions : null;
            //     }
            //     return null;
            // },

            // 'statuses' => function () {
            //     if (Auth::check()) {
            //         $roleId = Auth::user()->role_id;
            //         $statuses = StatusPair::join('statuses', 'statuses.id', 'status_pairs.status_id')
            //             ->join('roles', 'roles.id', 'status_pairs.role_id')
            //             ->select('status_id', 'statuses.status_key', 'statuses.status', 'roles.id', 'roles.role')
            //             ->where('status_pairs.role_id', $roleId)
            //             ->where('statuses.is_active', 1)
            //             ->orderBy('statuses.status', 'asc')->get();

            //         return count($statuses) > 0 ? $statuses : null;
            //     }
            //     return null;
            // },




        ]);
    }
}
