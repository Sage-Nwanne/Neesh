<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetailerProfile extends Model
{
    use HasFactory;

 protected $fillable = [
        'user_id',
        'store_name',
        'business_years',
        'store_category',
        'store_type',
        'store_size',
        'target_customers',
        'store_aesthetic',
        'interested_genres',
        'pos_system',
        'issue_frequency',
        'monthly_budget',
        'magazine_titles',
        'magazine_sources',
        'mag_other_input',
    ];

    protected $casts = [
        'target_customers' => 'array',
        'store_aesthetic' => 'array',
        'interested_genres' => 'array',
        'magazine_sources' => 'array',
    ];
    
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
