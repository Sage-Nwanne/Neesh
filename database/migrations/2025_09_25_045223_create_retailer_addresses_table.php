<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retailer_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retailer_id')->constrained('retailer_profiles')->onDelete('cascade');
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');
            $table->string('country')->default('US'); // optional default
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retailer_addresses');
    }
};
