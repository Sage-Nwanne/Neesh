<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\RateLimiter;
use Illuminate\Support\Facades\Cache;

class RateLimiterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }

    public function test_checkout_limit_allows_first_attempt(): void
    {
        $userId = 1;
        $ipAddress = '192.168.1.1';

        $result = RateLimiter::checkCheckoutLimit($userId, $ipAddress);
        $this->assertTrue($result);
    }

    public function test_checkout_limit_blocks_after_10_attempts_per_minute(): void
    {
        $userId = 1;
        $ipAddress = '192.168.1.1';

        // Make 10 successful attempts
        for ($i = 0; $i < 10; $i++) {
            $result = RateLimiter::checkCheckoutLimit($userId, $ipAddress);
            $this->assertTrue($result);
            RateLimiter::incrementCheckoutAttempt($userId, $ipAddress);
        }

        // 11th attempt should be blocked
        $result = RateLimiter::checkCheckoutLimit($userId, $ipAddress);
        $this->assertFalse($result);
    }

    public function test_checkout_limit_blocks_after_30_attempts_per_ip_per_hour(): void
    {
        $ipAddress = '192.168.1.1';

        // Make 30 successful attempts from different users on same IP
        for ($i = 0; $i < 30; $i++) {
            $userId = $i + 1; // Different user each time
            $result = RateLimiter::checkCheckoutLimit($userId, $ipAddress);
            $this->assertTrue($result);
            RateLimiter::incrementCheckoutAttempt($userId, $ipAddress);
        }

        // 31st attempt from a new user on same IP should be blocked
        $result = RateLimiter::checkCheckoutLimit(31, $ipAddress);
        $this->assertFalse($result);
    }

    public function test_different_users_have_separate_limits(): void
    {
        $ipAddress = '192.168.1.1';

        // User 1 makes 10 attempts
        for ($i = 0; $i < 10; $i++) {
            RateLimiter::checkCheckoutLimit(1, $ipAddress);
            RateLimiter::incrementCheckoutAttempt(1, $ipAddress);
        }

        // User 2 should still be able to make attempts
        $result = RateLimiter::checkCheckoutLimit(2, $ipAddress);
        $this->assertTrue($result);
    }

    public function test_different_ips_have_separate_limits(): void
    {
        $ipAddress1 = '192.168.1.1';
        $ipAddress2 = '192.168.1.2';

        // IP 1 makes 30 attempts from different users
        for ($i = 0; $i < 30; $i++) {
            $userId = $i + 1;
            RateLimiter::checkCheckoutLimit($userId, $ipAddress1);
            RateLimiter::incrementCheckoutAttempt($userId, $ipAddress1);
        }

        // IP 2 should still be able to make attempts (different IP, separate limit)
        $result = RateLimiter::checkCheckoutLimit(31, $ipAddress2);
        $this->assertTrue($result);
    }

    public function test_get_remaining_attempts(): void
    {
        $userId = 1;
        $ipAddress = '192.168.1.1';

        $remaining = RateLimiter::getRemainingAttempts($userId);
        $this->assertEquals(10, $remaining);

        RateLimiter::incrementCheckoutAttempt($userId, $ipAddress);
        $remaining = RateLimiter::getRemainingAttempts($userId);
        $this->assertEquals(9, $remaining);
    }

    public function test_reset_clears_rate_limit(): void
    {
        $userId = 1;
        $ipAddress = '192.168.1.1';

        // Make 10 attempts
        for ($i = 0; $i < 10; $i++) {
            RateLimiter::checkCheckoutLimit($userId, $ipAddress);
            RateLimiter::incrementCheckoutAttempt($userId, $ipAddress);
        }

        // Should be blocked
        $result = RateLimiter::checkCheckoutLimit($userId, $ipAddress);
        $this->assertFalse($result);

        // Reset
        RateLimiter::reset($userId);

        // Should be allowed again
        $result = RateLimiter::checkCheckoutLimit($userId, $ipAddress);
        $this->assertTrue($result);
    }
}
