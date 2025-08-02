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
        Schema::create('client_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company_name')->nullable();
            $table->string('industry')->nullable();
            $table->text('about')->nullable();
            $table->string('location')->nullable();
            $table->string('website')->nullable();
            $table->enum('budget_preference', ['low', 'medium', 'high', 'enterprise'])->default('medium');
            $table->json('preferences')->nullable();
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
        Schema::dropIfExists('client_profiles');
    }
}; 