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
        Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('retailer_id')->constrained('retailer_profiles');
    $table->foreignId('publisher_id')->constrained('publisher_profiles');
    $table->foreignId('retailer_store_id')->nullable()->constrained('retailer_stores');
    $table->string('status')->default('submitted');
    $table->decimal('subtotal',10,2)->default(0);
    $table->decimal('commission_fee',10,2)->default(0);
    $table->string('external_order_id')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
