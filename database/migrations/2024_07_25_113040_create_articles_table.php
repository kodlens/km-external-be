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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('slug')->nullable();
            $table->text('article_content')->nullable();
            $table->unsignedBigInteger('category_id');
            $table->string('author', 100)->nullable();
            $table->unsignedBigInteger('author_id');
            $table->string('encoded_by', 100)->nullable();
            $table->string('modified_by', 100)->nullable();
            $table->string('featured_image')->nullable();
            $table->string('featured_image_caption')->nullable();
            $table->date('date_published')->nullable();
            $table->string('status', 30)->nullable();
            $table->tinyInteger('is_featured')->default(0);
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
