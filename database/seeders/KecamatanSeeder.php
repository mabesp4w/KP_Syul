<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KecamatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get kabupaten/kota IDs
        $kabKota = DB::table('kab_kota')->get()->keyBy('nm_kab');

        $kecamatan = [];

        // Jayapura
        if (isset($kabKota['Jayapura'])) {
            $kecamatan = array_merge($kecamatan, [
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Jayapura Utara'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Jayapura Selatan'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Abepura'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Muara Tami'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Heram'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Sentani'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Sentani Timur'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Sentani Barat'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Kemtuk'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Kemtuk Gresi'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Nimboran'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Nimbokrang'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Unurum Guay'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Demta'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Kaureh'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Depapre'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Yokari'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Raveni Rara'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Waibu'],
                ['kab_id' => $kabKota['Jayapura']->id, 'nm_kec' => 'Ebungfau'],
            ]);
        }

        // Merauke
        if (isset($kabKota['Merauke'])) {
            $kecamatan = array_merge($kecamatan, [
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Merauke'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Muting'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Okaba'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Kimaam'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Semangga'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Tanah Miring'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Jagebob'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Sota'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Ulilin'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Elikobal'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Kurik'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Naukenjerai'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Animha'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Malind'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Tubang'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Ngguti'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Kaptel'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Tabonji'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Waan'],
                ['kab_id' => $kabKota['Merauke']->id, 'nm_kec' => 'Ilwayab'],
            ]);
        }

        // Mimika
        if (isset($kabKota['Mimika'])) {
            $kecamatan = array_merge($kecamatan, [
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Mimika Baru'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Agimuga'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Jila'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Jita'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Alama'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Hoya'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Iwaka'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Wania'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Amar'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Alp'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Nogolait'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Pulau Burung'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Kuala Kencana'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Tembagapura'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Mimika Timur'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Mimika Barat'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Mimika Timur Jauh'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Mimika Tengah'],
                ['kab_id' => $kabKota['Mimika']->id, 'nm_kec' => 'Kuala Kencana'],
            ]);
        }

        // Sorong
        if (isset($kabKota['Sorong'])) {
            $kecamatan = array_merge($kecamatan, [
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong Barat'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong Timur'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong Utara'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong Kepulauan'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong Manoi'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Klaurung'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Malaimsimsa'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Sorong Kota'],
                ['kab_id' => $kabKota['Sorong']->id, 'nm_kec' => 'Klaurung'],
            ]);
        }

        // Manokwari
        if (isset($kabKota['Manokwari'])) {
            $kecamatan = array_merge($kecamatan, [
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Manokwari Barat'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Manokwari Timur'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Manokwari Utara'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Manokwari Selatan'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Tanah Rubuh'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Prafi'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Masni'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Sidey'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Warmare'],
                ['kab_id' => $kabKota['Manokwari']->id, 'nm_kec' => 'Oransbari'],
            ]);
        }

        // Tambahkan kecamatan untuk semua kabupaten/kota lainnya
        // Catatan: Data lengkap bisa ditambahkan sesuai kebutuhan
        // Untuk saat ini, kita akan menambahkan minimal 1 kecamatan untuk setiap kabupaten/kota yang belum ada

        $allKabKota = DB::table('kab_kota')->get();
        $existingKabIds = collect($kecamatan)->pluck('kab_id')->unique();

        foreach ($allKabKota as $kab) {
            if (!$existingKabIds->contains($kab->id)) {
                $kecamatan[] = [
                    'kab_id' => $kab->id,
                    'nm_kec' => 'Kecamatan ' . $kab->nm_kab,
                ];
            }
        }

        DB::table('kecamatan')->insert($kecamatan);
    }
}

