<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerStore extends Model
{
    use HasFactory;

    protected $fillable = ['retailer_id','platform','store_name','store_url','access_token','status'];

    public function retailer() {
        return $this->belongsTo(RetailerProfile::class, 'retailer_id');
    }
}

