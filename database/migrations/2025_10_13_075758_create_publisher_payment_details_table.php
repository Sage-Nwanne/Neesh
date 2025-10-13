<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('publisher_payment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('preferred_payout_method')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('account_number_iban')->nullable();
            $table->string('routing_swift_code')->nullable();
            $table->text('business_address')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('currency_preference')->nullable()->default('USD');
            $table->string('payment_contact_email')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publisher_payment_details');
    }
};
