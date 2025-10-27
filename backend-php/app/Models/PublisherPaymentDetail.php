<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublisherPaymentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'preferred_payout_method',
        'account_holder_name',
        'account_number_iban',
        'routing_swift_code',
        'business_address',
        'tax_id',
        'currency_preference',
        'payment_contact_email',
    ];

    /**
     * Relationship: each payment detail belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
