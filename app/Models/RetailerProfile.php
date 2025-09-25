<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'store_name', 'location', 'aesthetic_tags', 'website'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function addresses() {
        return $this->hasMany(RetailerAddress::class, 'retailer_id');
    }

    public function stores() {
        return $this->hasMany(RetailerStore::class, 'retailer_id');
    }
}
