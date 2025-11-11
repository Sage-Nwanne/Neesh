<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

/**
 * AuthProvisioning Service
 * 
 * Handles user credential generation for login on account approval.
 * Supports two modes:
 * - 'magic': Generate a magic login link (recommended for UX)
 * - 'password': Generate a temporary password
 */
class AuthProvisioning
{
    /**
     * Auth mode from config: 'magic' or 'password'
     */
    protected string $authMode;

    /**
     * Dashboard/app URL for redirects
     */
    protected string $dashboardUrl;

    public function __construct()
    {
        $this->authMode = config('auth-provisioning.mode', 'password');
        $this->dashboardUrl = config('auth-provisioning.dashboard_url', config('app.frontend_url', 'https://app.neesh.art'));
    }

    /**
     * Provision a user with login credentials
     * 
     * @param User $user The user to provision
     * @param string $role The user's role (publisher, retailer, etc.)
     * @return array{loginLink?: string, tempCreds?: array{email: string, password: string}, authMode: string}
     * @throws \Exception
     */
    public function provisionUser(User $user, string $role = 'user'): array
    {
        if ($this->authMode === 'magic') {
            return $this->provisionMagicLink($user);
        } else {
            return $this->provisionTempPassword($user);
        }
    }

    /**
     * Generate a magic login link for password-less access
     * 
     * @param User $user
     * @return array{loginLink: string, authMode: string}
     */
    protected function provisionMagicLink(User $user): array
    {
        // Generate a unique token for magic link
        $token = Str::random(32);
        
        // Store the token (you would need to create a magic_links table or use password_reset_tokens)
        $this->storeMagicLinkToken($user->email, $token);
        
        // Create the magic link URL
        $loginLink = $this->dashboardUrl . '/auth/magic-link?token=' . $token . '&email=' . urlencode($user->email);
        
        return [
            'loginLink' => $loginLink,
            'authMode' => 'magic'
        ];
    }

    /**
     * Generate a temporary password for the user
     * 
     * @param User $user
     * @return array{tempCreds: array{email: string, password: string}, authMode: string}
     */
    protected function provisionTempPassword(User $user): array
    {
        $tempPassword = $this->generateSecurePassword();
        
        // Update the user's password
        $user->password = bcrypt($tempPassword);
        $user->save();
        
        // Mark as password provisioned (optional - add a column if you want to track this)
        // $user->update(['password_provisioned_at' => now()]);
        
        return [
            'tempCreds' => [
                'email' => $user->email,
                'password' => $tempPassword
            ],
            'authMode' => 'password'
        ];
    }

    /**
     * Generate a secure temporary password
     * 
     * @param int $length
     * @return string
     */
    protected function generateSecurePassword(int $length = 12): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
        $password = '';
        
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[mt_rand(0, strlen($chars) - 1)];
        }
        
        return $password;
    }

    /**
     * Store magic link token in password reset tokens table
     * Laravel's password_reset_tokens table works well for this
     * 
     * @param string $email
     * @param string $token
     * @return void
     */
    protected function storeMagicLinkToken(string $email, string $token): void
    {
        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => hash('sha256', $token),
                'created_at' => now()
            ]
        );
    }

    /**
     * Get auth mode configuration
     * 
     * @return string
     */
    public function getAuthMode(): string
    {
        return $this->authMode;
    }

    /**
     * Get dashboard URL
     * 
     * @return string
     */
    public function getDashboardUrl(): string
    {
        return $this->dashboardUrl;
    }
}
