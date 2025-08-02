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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['credit', 'debit', 'payout_request', 'payout_paid', 'payout_approved', 'payout_rejected']);
            $table->decimal('amount', 15, 2);
            $table->string('description');
            $table->foreignId('order_id')->nullable()->constrained();
            $table->foreignId('payout_request_id')->nullable()->constrained();
            $table->foreignId('admin_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
