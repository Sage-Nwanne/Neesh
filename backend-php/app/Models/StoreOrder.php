<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreOrder extends Model
{
    use HasFactory;

    protected $fillable = ['retailer_store_id', 'external_order_id', 'raw_payload', 'status'];

    protected $casts = ['raw_payload' => 'array'];

    public function store() {
        return $this->belongsTo(RetailerStore::class, 'retailer_store_id');
    }
}
