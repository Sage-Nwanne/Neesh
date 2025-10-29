<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'publisher_id',
        'amount',
        'type',
        'status',
        'stripe_transfer_id',
        'bank_account_last4',
        'notes',
        'requested_at',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function publisher()
    {
        return $this->belongsTo(PublisherProfile::class, 'publisher_id');
    }
}
