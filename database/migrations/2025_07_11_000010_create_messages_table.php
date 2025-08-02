<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->text('content')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_type')->nullable(); // e.g. image, doc, final_delivery
            $table->boolean('view_once')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('messages');
    }
}; 