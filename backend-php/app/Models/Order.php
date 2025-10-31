<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'retailer_id',
        'publisher_id',
        'retailer_store_id',
        'shipping_address_id',
        'billing_address_id',
        'status',
        'subtotal',
        'commission_fee',
        'external_order_id',
    ];

    public function publisher()
    {
        return $this->belongsTo(PublisherProfile::class, 'publisher_id');
    }

    public function retailer()
    {
        return $this->belongsTo(RetailerProfile::class, 'retailer_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function returns()
    {
        return $this->hasMany(ReturnModel::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }
}
