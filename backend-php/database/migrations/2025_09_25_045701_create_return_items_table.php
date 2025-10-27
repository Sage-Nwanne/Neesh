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
       Schema::create('return_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('return_id')->constrained('returns')->onDelete('cascade');
    $table->foreignId('order_item_id')->constrained('order_items')->onDelete('cascade');
    $table->integer('quantity');
    $table->decimal('refund_amount', 10, 2);
    $table->string('status')->default('pending'); // pending, approved, rejected, refunded
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_items');
    }
};
