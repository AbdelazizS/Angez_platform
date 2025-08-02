<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('client_confirmed')->default(false);
            $table->boolean('freelancer_confirmed')->default(false);
        });
    }
    public function down() {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['client_confirmed', 'freelancer_confirmed']);
        });
    }
}; 