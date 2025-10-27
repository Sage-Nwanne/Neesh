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
       Schema::create('returns', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
    $table->string('status')->default('awaiting'); // awaiting, received, refunded, partially_refunded
    $table->text('reason')->nullable();
    $table->string('tracking_number')->nullable();
    $table->timestamp('received_at')->nullable();
    $table->timestamp('refunded_at')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_models');
    }
};
