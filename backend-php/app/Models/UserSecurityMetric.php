<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSecurityMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'metric_type',
        'count',
        'window_start',
        'window_end',
    ];

    protected $casts = [
        'window_start' => 'datetime',
        'window_end' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('metric_type', $type);
    }

    public function scopeActive($query)
    {
        return $query->where('window_end', '>', now());
    }

    public function scopeOrdersPerHour($query)
    {
        return $query->where('metric_type', 'orders_per_hour');
    }

    public function scopeCardChangesPerHour($query)
    {
        return $query->where('metric_type', 'card_changes_per_hour');
    }

    public function scopeFailedPaymentsPerHour($query)
    {
        return $query->where('metric_type', 'failed_payments_per_hour');
    }
}
