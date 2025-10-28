<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'magazine_id',
        'quantity',
        'unit_price',
        'return_eligible',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function magazine()
    {
        return $this->belongsTo(Magazine::class);
    }

    public function returnItems()
    {
        return $this->hasMany(ReturnItem::class, 'order_item_id');
    }
}
