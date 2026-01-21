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
        Schema::create('freedowm_walls', function (Blueprint $table) {
            $table->id('freedom_wall_id');

            $table->text('content')->nullable();

            $table->unsignedBigInteger('like')->default(0);
            $table->unsignedBigInteger('unlike')->default(0);
            $table->unsignedBigInteger('happy')->default(0);
            $table->unsignedBigInteger('sad')->default(0);
            $table->unsignedBigInteger('care')->default(0);
            $table->unsignedBigInteger('angry')->default(0);


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freedowm_walls');
    }
};
