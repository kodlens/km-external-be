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
        Schema::create('comments', function (Blueprint $table) {
            $table->id('comment_id');

            $table->unsignedBigInteger('article_id');
            $table->foreign('article_id')->references('article_id')->on('articles')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->text('comment')->nullable();

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
        Schema::dropIfExists('comments');
    }
};
