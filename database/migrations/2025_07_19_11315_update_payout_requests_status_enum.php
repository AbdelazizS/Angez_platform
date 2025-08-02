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
        Schema::table('payout_requests', function (Blueprint $table) {
            // Update the enum to include 'payout_paid'
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid', 'payout_paid'])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payout_requests', function (Blueprint $table) {
            // Revert back to original enum
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending')->change();
        });
    }
}; 