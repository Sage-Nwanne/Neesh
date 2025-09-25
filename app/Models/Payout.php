<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = ['publisher_id', 'amount', 'status', 'payout_date'];

    public function publisher() {
        return $this->belongsTo(PublisherProfile::class, 'publisher_id');
    }
}
