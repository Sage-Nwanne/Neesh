<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('magazines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publisher_id')->constrained('publisher_profiles')->onDelete('cascade');
            $table->string('title_name');
            $table->string('issue_identifier');
            $table->string('cover_image')->nullable();
            $table->string('logo')->nullable(); // new logo field
            $table->string('genre')->nullable();
            $table->text('description')->nullable();
            $table->string('dimensions')->nullable();
            $table->integer('page_count')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('total_printed')->default(0); // new field
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->decimal('msrp', 10, 2)->nullable();
            $table->string('return_policy')->nullable();
            $table->text('retailer_fit_tags')->nullable();
            $table->string('type')->default('single_issue'); // series or single_issue
            $table->boolean('visibility')->default(true); // new field
            $table->date('restock_timeline')->nullable(); // restock timeline
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magazines');
    }
};
