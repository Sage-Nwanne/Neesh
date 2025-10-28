<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Magazine extends Model
{
    use HasFactory;

    protected $fillable = [
        'publisher_id',
        'title_name',
        'issue_identifier',
        'cover_image',
        'logo',
        'specs',
        'genre',
        'warehouse',
        'description',
        'dimensions',
        'discount',
        'page_count',
        'stock',
        'total_printed',
        'copies_sold',
        'wholesale_price',
        'msrp',
        'type',
        'series_issue_count',
        'issue_frequency',
        'return_policy',
        'fulfillment_method',
        'retailer_fit_tags',
        'promotional_text',
        'metadata',
        'sales_experience',
        'sales_feedback',
        'visibility',
        'restock_timeline',
        'status',
        'payment_terms',
        'archived_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'sales_experience' => 'boolean',
        'visibility' => 'boolean',
    ];


    public function publisher()
    {
        return $this->belongsTo(PublisherProfile::class, 'publisher_id');
    }
    public function images()
    {
        return $this->hasMany(MagazineImage::class);
    }
}
