<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelurahanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get kecamatan IDs
        $kecamatan = DB::table('kecamatan')->get();

        $kelurahan = [];

        foreach ($kecamatan as $kec) {
            // Tambahkan minimal 3 kelurahan untuk setiap kecamatan
            $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Kelurahan 1 ' . $kec->nm_kec];
            $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Kelurahan 2 ' . $kec->nm_kec];
            $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Kelurahan 3 ' . $kec->nm_kec];
        }

        // Untuk beberapa kecamatan utama, tambahkan kelurahan yang lebih spesifik
        $kecamatanUtama = DB::table('kecamatan')
            ->whereIn('nm_kec', ['Jayapura Utara', 'Jayapura Selatan', 'Abepura', 'Merauke', 'Sorong', 'Manokwari Barat'])
            ->get();

        foreach ($kecamatanUtama as $kec) {
            // Hapus kelurahan generik untuk kecamatan utama
            $kelurahan = array_filter($kelurahan, function($kel) use ($kec) {
                return $kel['kec_id'] != $kec->id;
            });

            // Tambahkan kelurahan spesifik
            if ($kec->nm_kec === 'Jayapura Utara') {
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Hamadi'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Entrop'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Argapura'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Tanjung Ria'];
            } elseif ($kec->nm_kec === 'Jayapura Selatan') {
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Apo'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Numbay'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Waena'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Hedam'];
            } elseif ($kec->nm_kec === 'Abepura') {
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Abepura'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Kotaraja'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Asano'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Awiyo'];
            } elseif ($kec->nm_kec === 'Merauke') {
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Bambu Pemali'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Maro'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Rimba Jaya'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Seringgu Jaya'];
            } elseif ($kec->nm_kec === 'Sorong') {
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Klamono'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Klasaman'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Klasuat'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Remu'];
            } elseif ($kec->nm_kec === 'Manokwari Barat') {
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Amban'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Sanggeng'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Wosi'];
                $kelurahan[] = ['kec_id' => $kec->id, 'nm_kel' => 'Anday'];
            }
        }

        DB::table('kelurahan')->insert($kelurahan);
    }
}

