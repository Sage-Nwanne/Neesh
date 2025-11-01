<?php

namespace App\Services;

use App\Models\PaymentAttempt;
use App\Models\UserSecurityMetric;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FraudDetection
{
    const MAX_ORDER_VALUE = 5000; // $5000 USD
    const MAX_ORDERS_PER_HOUR = 5;
    const MAX_CARD_CHANGES_PER_HOUR = 3;
    const BLOCKED_COUNTRIES = ['KP', 'IR', 'SY', 'CU']; // North Korea, Iran, Syria, Cuba

    /**
     * Analyze payment for fraud risk
     */
    public static function analyze(int $userId, array $paymentData): array
    {
        $riskLevel = 'low';
        $flags = [];

        // Check order value
        if ($paymentData['amount'] >= self::MAX_ORDER_VALUE) {
            $riskLevel = 'high';
            $flags[] = 'High order value ($' . number_format($paymentData['amount'], 2) . ')';
        }

        // Check velocity
        $velocityCheck = self::checkVelocity($userId);
        if ($velocityCheck['flagged']) {
            $riskLevel = $velocityCheck['risk_level'];
            $flags = array_merge($flags, $velocityCheck['flags']);
        }

        // Check geo-location
        $country = $paymentData['country'] ?? 'US';
        if (in_array($country, self::BLOCKED_COUNTRIES)) {
            $riskLevel = 'high';
            $flags[] = 'Blocked country: ' . $country;
        }

        // Check for suspicious patterns
        $patternCheck = self::checkSuspiciousPatterns($userId);
        if ($patternCheck['flagged']) {
            $riskLevel = 'medium';
            $flags = array_merge($flags, $patternCheck['flags']);
        }

        return [
            'risk_level' => $riskLevel,
            'flags' => $flags,
            'requires_review' => $riskLevel === 'high',
            'requires_3ds' => $riskLevel === 'high' || $riskLevel === 'medium',
        ];
    }

    /**
     * Check velocity metrics
     */
    private static function checkVelocity(int $userId): array
    {
        $flags = [];
        $riskLevel = 'low';
        $flagged = false;

        try {
            // Check if database connection is available
            if (!self::isDatabaseAvailable()) {
                return [
                    'flagged' => false,
                    'risk_level' => 'low',
                    'flags' => [],
                ];
            }

            $now = Carbon::now();
            $oneHourAgo = $now->copy()->subHour();

            // Check orders per hour
            $ordersThisHour = UserSecurityMetric::where('user_id', $userId)
                ->where('metric_type', 'orders_per_hour')
                ->where('window_end', '>', $oneHourAgo)
                ->sum('count');

            if ($ordersThisHour >= self::MAX_ORDERS_PER_HOUR) {
                $flagged = true;
                $riskLevel = 'medium';
                $flags[] = 'Multiple orders in short time (' . $ordersThisHour . ' orders/hour)';
            }

            // Check card changes per hour
            $cardChangesThisHour = UserSecurityMetric::where('user_id', $userId)
                ->where('metric_type', 'card_changes_per_hour')
                ->where('window_end', '>', $oneHourAgo)
                ->sum('count');

            if ($cardChangesThisHour >= self::MAX_CARD_CHANGES_PER_HOUR) {
                $flagged = true;
                $riskLevel = 'high';
                $flags[] = 'Multiple card changes (' . $cardChangesThisHour . ' changes/hour)';
            }
        } catch (\Exception $e) {
            // Database not available, skip velocity checks
        }

        return [
            'flagged' => $flagged,
            'risk_level' => $riskLevel,
            'flags' => $flags,
        ];
    }

    /**
     * Check if database connection is available
     */
    private static function isDatabaseAvailable(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check for suspicious patterns
     */
    private static function checkSuspiciousPatterns(int $userId): array
    {
        $flags = [];
        $flagged = false;

        try {
            // Check if database connection is available
            if (!self::isDatabaseAvailable()) {
                return [
                    'flagged' => false,
                    'flags' => [],
                ];
            }

            // Check for failed payment attempts
            $failedAttempts = PaymentAttempt::where('user_id', $userId)
                ->where('status', 'failed')
                ->where('created_at', '>', Carbon::now()->subHour())
                ->count();

            if ($failedAttempts >= 3) {
                $flagged = true;
                $flags[] = 'Multiple failed payment attempts (' . $failedAttempts . ')';
            }
        } catch (\Exception $e) {
            // Database not available, skip pattern checks
        }

        return [
            'flagged' => $flagged,
            'flags' => $flags,
        ];
    }

    /**
     * Record velocity metric
     */
    public static function recordMetric(int $userId, string $metricType): void
    {
        $now = Carbon::now();
        $windowStart = $now->copy()->startOfHour();
        $windowEnd = $windowStart->copy()->addHour();

        $metric = UserSecurityMetric::where('user_id', $userId)
            ->where('metric_type', $metricType)
            ->where('window_start', $windowStart)
            ->first();

        if ($metric) {
            $metric->increment('count');
        } else {
            UserSecurityMetric::create([
                'user_id' => $userId,
                'metric_type' => $metricType,
                'count' => 1,
                'window_start' => $windowStart,
                'window_end' => $windowEnd,
            ]);
        }
    }

    /**
     * Check if country is blocked
     */
    public static function isCountryBlocked(string $country): bool
    {
        return in_array($country, self::BLOCKED_COUNTRIES);
    }
}
