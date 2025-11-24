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
        Schema::create('galeri_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('galeri_id')
                ->constrained('galeri')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('kegiatan_id')
                ->constrained('kegiatan')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
            // Mencegah duplikasi relasi yang sama
            $table->unique(['galeri_id', 'kegiatan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeri_kegiatan');
    }
};
