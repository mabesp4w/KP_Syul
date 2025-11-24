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
        Schema::create('program_pendidikan', function (Blueprint $table) {
            $table->id();
            $table->string('nm_prog'); // nama_program
            $table->string('slug')->unique();
            $table->string('kat');
            // 'PAUD',
            //     'Paket A',
            //     'Paket B',
            //     'Paket C',
            //     'Keaksaraan Dasar',
            //     'Keaksaraan Usaha Mandiri',
            //     'Kursus',
            //     'Pendidikan Perempuan'
            $table->text('desk')->nullable(); // deskripsi
            $table->string('tgt_pst'); // target_peserta
            $table->string('durasi'); // durasi
            $table->decimal('biaya', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_pendidikan');
    }
};
