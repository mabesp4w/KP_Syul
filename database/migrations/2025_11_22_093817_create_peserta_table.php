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
        Schema::create('peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kel_id') // kelurahan_id
                ->constrained('kelurahan')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->foreignId('prog_id') // program_id
                ->constrained('program_pendidikan')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->string('no_induk')->unique(); // nomor_induk
            $table->string('nm_lengkap'); // nama_lengkap
            $table->string('tmp_lhr'); // tempat_lahir
            $table->date('tgl_lhr'); // tanggal_lahir
            $table->enum('jk', ['L', 'P']); // jenis_kelamin
            $table->text('alamat'); // alamat
            $table->string('no_tlp'); // nomor_telepon
            $table->string('email')->nullable();
            $table->string('nm_wali')->nullable(); // nama_wali
            $table->string('tlp_wali')->nullable(); // telepon_wali

            $table->string('foto')->nullable();
            $table->date('tgl_dftr'); // tanggal_daftar
            $table->enum('status', [ // status
                'aktif',
                'lulus',
                'tidak_aktif',
                'cuti'
            ])->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta');
    }
};
