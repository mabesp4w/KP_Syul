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
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            // kegiatan_id
            $table->foreignId('kegiatan_id')
                ->constrained('kegiatan')
                ->onUpdate('cascade')
                ->onDelete('restrict')->nullable();
            $table->string('judul'); // judul
            $table->string('slug')->unique();
            $table->text('isi');
            $table->date('tgl_pub'); // tanggal_publish
            $table->string('penulis');
            $table->string('kat'); // kategori
            // 'pengumuman',
            // 'acara',
            // 'prestasi',
            // 'info_umum'
            $table->string('foto_utama')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};
