<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update the ENUM type for the 'type' column
        DB::statement("ALTER TABLE wallet_transactions MODIFY COLUMN type ENUM('credit', 'debit', 'payout_request', 'payout_paid', 'payout_approved', 'payout_rejected') NOT NULL");
    }

    public function down(): void
    {
        // Revert to the original ENUM values (edit as needed)
        DB::statement("ALTER TABLE wallet_transactions MODIFY COLUMN type ENUM('credit', 'debit', 'payout_request', 'payout_paid') NOT NULL");
    }
}; 