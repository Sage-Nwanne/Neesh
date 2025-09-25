<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'order_item_id', 'leg', 'tracking_number', 'carrier', 'status', 'shipped_at', 'delivered_at'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }

    public function orderItem() {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }
}

