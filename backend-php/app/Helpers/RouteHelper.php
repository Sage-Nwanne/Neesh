<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class RouteHelper
{
    /**
     * Get the dashboard route based on user role
     * 
     * @return string
     */
    public static function getDashboardRoute()
    {
        $user = Auth::user();

        if (!$user) {
            return route('explore.index');
        }

        if ($user->hasRole('admin')) {
            return route('admin.dashboard');
        }

        if ($user->hasRole('publisher')) {
            return route('publisher.dashboard');
        }

        if ($user->hasRole('retailer')) {
            return route('retailer.dashboard');
        }

        return route('explore.index');
    }

    /**
     * Get the dashboard route name based on user role
     *
     * @return string
     */
    public static function getDashboardRouteName()
    {
        $user = Auth::user();

        if (!$user) {
            return 'explore.index';
        }

        if ($user->hasRole('admin')) {
            return 'admin.dashboard';
        }

        if ($user->hasRole('publisher')) {
            return 'publisher.dashboard';
        }

        if ($user->hasRole('retailer')) {
            return 'retailer.dashboard';
        }

        return 'explore.index';
    }

    /**
     * Get the user's role
     *
     * @return string|null
     */
    public static function getUserRole()
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        if ($user->hasRole('admin')) {
            return 'admin';
        }

        if ($user->hasRole('publisher')) {
            return 'publisher';
        }

        if ($user->hasRole('retailer')) {
            return 'retailer';
        }

        return null;
    }

    /**
     * Get role-based route
     *
     * @param string $routeName The route name without role prefix (e.g., 'catalogue', 'orders', 'account')
     * @return string
     */
    public static function getRoleBasedRoute($routeName)
    {
        $role = self::getUserRole();

        if (!$role) {
            return route('explore.index');
        }

        $routeKey = $role . '.' . $routeName;

        if (route($routeKey)) {
            return route($routeKey);
        }

        return route('explore.index');
    }
}

