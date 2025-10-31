<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'type',
        'payload',
        'received_at',
        'processed_at',
        'status',
        'error',
        'retry_count',
    ];

    protected $casts = [
        'payload' => 'json',
        'received_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessed($query)
    {
        return $query->where('status', 'processed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function markAsProcessed(): void
    {
        $this->update([
            'status' => 'processed',
            'processed_at' => now(),
        ]);
    }

    public function markAsFailed($error): void
    {
        $this->update([
            'status' => 'failed',
            'error' => $error,
            'retry_count' => $this->retry_count + 1,
        ]);
    }

    public function incrementRetry(): void
    {
        $this->update([
            'retry_count' => $this->retry_count + 1,
        ]);
    }
}
