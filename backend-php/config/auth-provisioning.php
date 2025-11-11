<?php

/**
 * Auth Provisioning Configuration
 * 
 * Controls how users are provisioned with login credentials during account approval.
 * 
 * Two modes are supported:
 * - 'password': Generate temporary passwords for users to reset on first login
 * - 'magic': Generate magic login links for password-less access (recommended)
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Mode
    |--------------------------------------------------------------------------
    |
    | Determines how users receive login credentials:
    |
    | 'password' - Users receive a temporary password that they must change
    |             on first login. Familiar UX but slightly less secure.
    |
    | 'magic'    - Users receive a magic link that bypasses password entry.
    |             Better UX and security. Requires frontend support.
    |
    */
    'mode' => env('AUTH_PROVISIONING_MODE', 'password'),

    /*
    |--------------------------------------------------------------------------
    | Dashboard URL
    |--------------------------------------------------------------------------
    |
    | The frontend application URL where users will be sent to log in.
    | This is used in acceptance emails for the login link/button.
    |
    */
    'dashboard_url' => env('DASHBOARD_URL', env('APP_FRONTEND_URL', 'https://app.neesh.art')),

    /*
    |--------------------------------------------------------------------------
    | Temporary Password Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for temporary password generation (only used in password mode)
    |
    */
    'password' => [
        'length' => 12,
        'include_special_chars' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Magic Link Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for magic links (only used in magic mode)
    |
    */
    'magic_link' => [
        'expiry_hours' => 72,
        'token_length' => 32,
    ],

];
