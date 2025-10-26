<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail; // ye line uncomment karo



class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
public function sendEmailVerificationNotification()
    {
        // Do nothing (we don’t want to send verification to the user)
    }
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function publisherProfile()
{
    return $this->hasOne(PublisherProfile::class);
}
public function retailerProfile()
{
    return $this->hasOne(RetailerProfile::class);
}


public function paymentDetails()
{
    return $this->hasOne(PublisherPaymentDetail::class, 'user_id');
}

public function bookmarks()
{
    return $this->hasMany(Bookmark::class);
}

public function magazineViews()
{
    return $this->hasMany(MagazineView::class);
}


}
