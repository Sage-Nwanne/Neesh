<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_security_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('metric_type', ['orders_per_hour', 'card_changes_per_hour', 'failed_payments_per_hour'])->default('orders_per_hour');
            $table->integer('count')->default(0);
            $table->timestamp('window_start');
            $table->timestamp('window_end');
            $table->timestamps();
            
            $table->index('user_id');
            $table->index(['user_id', 'metric_type']);
            $table->index(['user_id', 'metric_type', 'window_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_security_metrics');
    }
};
