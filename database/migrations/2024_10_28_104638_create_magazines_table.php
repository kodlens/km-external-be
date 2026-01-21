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
        Schema::create('magazines', function (Blueprint $table) {
            $table->id();
            $table->string('cover')->nullable();
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->string('magazine_path')->nullable();    
            $table->tinyInteger('quater')->default(0);
            $table->text('excerpt')->nullable();
            $table->integer('year')->default(0);
            $table->tinyInteger('is_featured')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('magazines');
    }
};
