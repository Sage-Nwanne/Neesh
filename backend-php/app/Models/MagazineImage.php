<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MagazineImage extends Model
{
    use HasFactory;

    protected $fillable = ['magazine_id', 'image_path'];

    public function magazine()
    {
        return $this->belongsTo(Magazine::class);
    }
}
