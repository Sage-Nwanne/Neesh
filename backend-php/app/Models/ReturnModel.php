<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnModel extends Model
{
    use HasFactory;

    protected $table = 'returns';

    protected $fillable = [
        'order_id', 'status', 'reason', 'tracking_number', 'received_at', 'refunded_at', 'notes'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }

    public function items() {
        return $this->hasMany(ReturnItem::class, 'return_id');
    }
}
