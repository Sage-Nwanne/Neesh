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
        Schema::create('retailer_stores', function (Blueprint $table) {
    $table->id();
    $table->foreignId('retailer_id')->constrained('retailer_profiles')->onDelete('cascade');
    $table->string('platform'); // shopify, woocommerce, custom
    $table->string('store_name');
    $table->string('store_url');
    $table->string('access_token')->nullable();
    $table->string('status'); // active, inactive, revoked
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retailer_stores');
    }
};
