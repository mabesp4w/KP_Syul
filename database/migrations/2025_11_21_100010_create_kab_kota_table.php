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
        Schema::create('kab_kota', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prov_id') // provinsi_id
                ->constrained('provinsi')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->string('nm_kab'); // nama_kabupaten
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kab_kota');
    }
};
