<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Magazine extends Model
{
    use HasFactory;

   protected $fillable = [
    'publisher_id','title_name','issue_identifier','cover_image','logo','genre','description',
    'dimensions','page_count','stock','total_printed','wholesale_price','msrp',
    'return_policy','retailer_fit_tags','type','visibility','archive','restock_timeline','status'
];


    public function publisher() {
        return $this->belongsTo(PublisherProfile::class, 'publisher_id');
    }
    public function images()
{
    return $this->hasMany(MagazineImage::class);
}

}
