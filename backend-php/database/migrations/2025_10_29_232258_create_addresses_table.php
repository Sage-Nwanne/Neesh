<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['shipping', 'billing'])->default('shipping');
            $table->string('country')->default('US');
            $table->string('line1');
            $table->string('line2')->nullable();
            $table->string('city');
            $table->string('state_province')->nullable();
            $table->string('postal_code');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            
            $table->index('user_id');
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
