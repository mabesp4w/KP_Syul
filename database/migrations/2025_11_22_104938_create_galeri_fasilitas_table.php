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
        Schema::create('galeri_fasilitas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('galeri_id')
                ->constrained('galeri')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('fasilitas_id')
                ->constrained('fasilitas')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();

            $table->unique(['galeri_id', 'fasilitas_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeri_fasilitas');
    }
};
