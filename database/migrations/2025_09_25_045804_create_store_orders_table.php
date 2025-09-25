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
       Schema::create('store_orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('retailer_store_id')->constrained('retailer_stores')->onDelete('cascade');
    $table->string('external_order_id')->nullable();
    $table->json('raw_payload')->nullable();
    $table->string('status')->default('imported'); // imported, processed, failed
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_orders');
    }
};
