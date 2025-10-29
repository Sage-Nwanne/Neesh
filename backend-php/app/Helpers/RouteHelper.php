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
}

