<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('magazines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publisher_id')->constrained('publisher_profiles')->onDelete('cascade');
            $table->string('title_name');
            $table->string('issue_identifier');
            $table->string('cover_image')->nullable();
            $table->string('genre')->nullable();
            $table->text('description')->nullable();
            $table->string('dimensions')->nullable();
            $table->integer('page_count')->nullable();
            $table->integer('stock')->default(0);
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->decimal('msrp', 10, 2)->nullable();
            $table->string('return_policy')->nullable();
            $table->text('retailer_fit_tags')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('magazines');
    }
};
