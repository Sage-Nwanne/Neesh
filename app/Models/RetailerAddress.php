<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerAddress extends Model
{
    use HasFactory;

    protected $fillable = ['retailer_id','type','address_line1','address_line2','city','state','country','postal_code'];

    public function retailer() {
        return $this->belongsTo(RetailerProfile::class, 'retailer_id');
    }
}

