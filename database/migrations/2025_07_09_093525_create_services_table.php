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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('title_ar')->nullable(); // Arabic title
            $table->text('description');
            $table->text('description_ar')->nullable(); // Arabic description
            $table->text('detailed_description')->nullable();
            $table->text('detailed_description_ar')->nullable();
            $table->string('category')->nullable();
            $table->string('category_ar')->nullable();
            $table->string('subcategory')->nullable();
            $table->string('subcategory_ar')->nullable();
            $table->unsignedBigInteger('price');
            $table->string('delivery_time');
            $table->string('delivery_time_ar')->nullable();
            $table->unsignedInteger('revisions')->default(0);
            $table->json('tags')->nullable();
            $table->json('tags_ar')->nullable();
            $table->json('gallery')->nullable();
            $table->json('features')->nullable();
            $table->json('features_ar')->nullable();
            $table->json('dynamic_sections')->nullable(); // For dynamic sections in service details
            $table->json('packages')->nullable(); // For multiple pricing packages
            $table->json('packages_ar')->nullable();
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('orders')->default(0);
            $table->json('faq')->nullable();
            $table->json('faq_ar')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
