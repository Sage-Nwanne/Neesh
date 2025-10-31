<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter as LaravelRateLimiter;

class RateLimiter
{
    /**
     * Check if user has exceeded checkout rate limit
     */
    public static function checkCheckoutLimit(int $userId, string $ipAddress): bool
    {
        $userKey = "checkout_user_{$userId}";
        $ipKey = "checkout_ip_{$ipAddress}";

        // Per-user limit: 10 per minute
        if (LaravelRateLimiter::tooManyAttempts($userKey, 10)) {
            return false;
        }

        // Per-IP limit: 30 per hour
        $ipCount = Cache::get($ipKey, 0);
        if ($ipCount >= 30) {
            return false;
        }

        return true;
    }

    /**
     * Increment checkout attempt counter
     */
    public static function incrementCheckoutAttempt(int $userId, string $ipAddress): void
    {
        $userKey = "checkout_user_{$userId}";
        $ipKey = "checkout_ip_{$ipAddress}";

        // Increment user counter (1 minute window)
        LaravelRateLimiter::hit($userKey, 60);

        // Increment IP counter (1 hour window)
        $currentCount = Cache::get($ipKey, 0);
        Cache::put($ipKey, $currentCount + 1, 3600);
    }

    /**
     * Get remaining attempts for user
     */
    public static function getRemainingAttempts(int $userId): int
    {
        $key = "checkout_user_{$userId}";
        $limit = 10;
        $attempts = LaravelRateLimiter::attempts($key);
        return max(0, $limit - $attempts);
    }

    /**
     * Get seconds until rate limit resets
     */
    public static function getSecondsUntilReset(int $userId): int
    {
        $key = "checkout_user_{$userId}";
        return LaravelRateLimiter::availableIn($key);
    }

    /**
     * Reset rate limit for user
     */
    public static function reset(int $userId): void
    {
        $key = "checkout_user_{$userId}";
        LaravelRateLimiter::clear($key);
    }
}
