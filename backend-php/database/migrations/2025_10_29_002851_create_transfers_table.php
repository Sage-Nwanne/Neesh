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
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publisher_id')->constrained('publisher_profiles')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('type')->default('standard'); // instant, standard
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->string('stripe_transfer_id')->nullable();
            $table->string('bank_account_last4')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
