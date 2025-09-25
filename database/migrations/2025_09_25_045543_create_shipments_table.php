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
        Schema::create('shipments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
    $table->foreignId('order_item_id')->nullable()->constrained('order_items')->onDelete('set null');
    $table->string('leg')->comment('publisher_to_admin, admin_to_retailer, retailer_to_admin, admin_to_publisher');
    $table->string('tracking_number')->nullable();
    $table->string('carrier')->nullable();
    $table->string('status')->default('pending'); // pending, in_transit, delivered
    $table->timestamp('shipped_at')->nullable();
    $table->timestamp('delivered_at')->nullable();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
