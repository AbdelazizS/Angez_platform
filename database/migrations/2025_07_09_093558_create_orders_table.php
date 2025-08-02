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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('freelancer_id')->constrained('users')->onDelete('cascade');
            
            // Order details
            $table->string('order_number')->unique(); // Auto-generated order number
            $table->string('package_name'); // Selected package name
            $table->unsignedBigInteger('package_price'); // Package price
            $table->unsignedBigInteger('service_fee'); // Platform fee (10%)
            $table->unsignedBigInteger('total_amount'); // Total amount including fees
            $table->json('requirements')->nullable(); // Client requirements (now JSON)
            $table->text('additional_notes')->nullable(); // Additional notes
            
            // Payment details
            $table->string('transaction_ref')->nullable(); // Payment transaction reference
            $table->string('payment_screenshot')->nullable(); // Payment proof screenshot
            $table->enum('payment_status', ['pending', 'verified', 'failed'])->default('pending');
            $table->enum('payment_method', ['bank_transfer', 'mobile_money', 'cash'])->nullable();
            
            // Order status
            $table->enum('status', ['pending', 'payment_verified', 'in_progress', 'review', 'completed', 'cancelled'])->default('pending');
            
            // Timestamps
            $table->timestamp('payment_verified_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['client_id', 'status']);
            $table->index(['freelancer_id', 'status']);
            $table->index(['order_number']);
            $table->index(['transaction_ref']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
