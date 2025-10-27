<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retailer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // Step 2 - Store Information
            $table->string('store_name');
            $table->integer('business_years')->nullable();
            $table->string('store_category')->nullable();
            $table->string('store_type')->nullable();
            $table->string('store_size')->nullable();

            // Step 4 - Store Profile
            $table->json('target_customers')->nullable();
            $table->json('store_aesthetic')->nullable();
            $table->json('interested_genres')->nullable();

            // Step 5 - Business Operations
            $table->string('pos_system')->nullable();
            $table->string('issue_frequency')->nullable();
            $table->decimal('monthly_budget', 10, 2)->nullable();
            $table->text('magazine_titles')->nullable();
            $table->json('magazine_sources')->nullable();
            $table->string('mag_other_input')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retailer_profiles');
    }
};
