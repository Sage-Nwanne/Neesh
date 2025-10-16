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
            
            // Basic info
            $table->string('title_name');
            $table->string('issue_identifier')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('logo')->nullable();
            $table->string('genre')->nullable();
            $table->text('warehouse')->nullable();
            $table->text('description')->nullable();
            
            // Specs
            $table->string('dimensions')->nullable();
            $table->integer('page_count')->nullable();
            $table->string('specs')->nullable();
            
            // Inventory
            $table->integer('stock')->default(0);
            $table->integer('total_printed')->default(0);
            $table->integer('copies_sold')->default(0); // ✅ new
            
            // Pricing
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->decimal('msrp', 10, 2)->nullable();
            
            // Publishing info
            $table->string('type')->default('single_issue'); // series or single_issue
            $table->integer('series_issue_count')->nullable(); // ✅ new
            $table->string('issue_frequency')->nullable();     // ✅ new
            $table->string('discount')->nullable();     // ✅ new
            
            // Policies & logistics
            $table->string('return_policy')->nullable();
            $table->string('fulfillment_method')->nullable();  // ✅ new
            
            // Metadata
            $table->text('retailer_fit_tags')->nullable();
            $table->text('promotional_text')->nullable();      // ✅ new
            $table->json('metadata')->nullable();              // ✅ new
            $table->boolean('sales_experience')->default(false); // ✅ new (yes/no)
            $table->text('sales_feedback')->nullable();        // ✅ new
            
            // Visibility & status
            $table->boolean('visibility')->default(true);
            $table->string('restock_timeline')->nullable();
            $table->string('payment_terms')->nullable();

            $table->string('status')->default('pending');


            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magazines');
    }
};
