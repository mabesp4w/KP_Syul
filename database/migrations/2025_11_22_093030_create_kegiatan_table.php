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
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kel_id') // kelurahan_id
                ->constrained('kelurahan')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->string('nm_kegiatan'); // nm_kegiatan
            $table->string('slug')->unique();
            $table->date('tgl_kegiatan'); // tanggal
            $table->time('jam_mulai')->nullable();
            $table->time('jam_seles')->nullable();
            $table->text('ket')->nullable(); // deskripsi
            $table->string('jenis');
            //  'pembelajaran',
            //     'sosial',
            //     'produktif',
            //     'seni',
            //     'lainnya'
            $table->enum('status', [ // status
                'terjadwal',
                'berlangsung',
                'selesai'
            ])->default('terjadwal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
