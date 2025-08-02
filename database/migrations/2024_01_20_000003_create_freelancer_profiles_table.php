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
        Schema::create('freelancer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->json('languages')->nullable();
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->string('location')->nullable();
            $table->string('website')->nullable();
            $table->json('social_links')->nullable();
            $table->json('certifications')->nullable();
            $table->string('education')->nullable();
            $table->enum('availability_status', ['available', 'busy', 'unavailable'])->default('available');
            $table->string('response_time')->default('24 hours');
            $table->decimal('success_rate', 5, 2)->default(0);
            $table->unsignedInteger('completed_orders')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelancer_profiles');
    }
}; 