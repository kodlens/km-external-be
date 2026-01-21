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
        Schema::create('featured_videos', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('excerpt')->nullable();
            $table->text('link')->nullable();
            $table->integer('order_no')->nullable();
            $table->tinyInteger('is_featured')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_videos');
    }
};
