<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'retailer_id',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'zip_code',
        'country',
    ];

    public function retailer()
    {
        return $this->belongsTo(RetailerProfile::class, 'retailer_id');
    }
}
