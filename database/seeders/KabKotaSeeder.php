<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KabKotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get provinsi IDs
        $provinsi = DB::table('provinsi')->get()->keyBy('nm_prov');

        $kabKota = [
            // Papua
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Jayapura'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Merauke'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Mimika'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Biak Numfor'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Nabire'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Paniai'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Puncak Jaya'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Sarmi'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Keerom'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Pegunungan Bintang'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Yahukimo'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Tolikara'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Waropen'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Boven Digoel'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Mappi'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Asmat'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Supiori'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Mamberamo Raya'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Nduga'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Lanny Jaya'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Yalimo'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Puncak'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Dogiyai'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Intan Jaya'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Deiyai'],
            ['prov_id' => $provinsi['Papua']->id, 'nm_kab' => 'Kota Jayapura'],

            // Papua Barat
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Sorong'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Manokwari'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Fakfak'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Kaimana'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Teluk Wondama'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Teluk Bintuni'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Raja Ampat'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Sorong Selatan'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Maybrat'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Tambrauw'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Pegunungan Arfak'],
            ['prov_id' => $provinsi['Papua Barat']->id, 'nm_kab' => 'Kota Sorong'],

            // Papua Selatan
            ['prov_id' => $provinsi['Papua Selatan']->id, 'nm_kab' => 'Merauke'],
            ['prov_id' => $provinsi['Papua Selatan']->id, 'nm_kab' => 'Boven Digoel'],
            ['prov_id' => $provinsi['Papua Selatan']->id, 'nm_kab' => 'Mappi'],
            ['prov_id' => $provinsi['Papua Selatan']->id, 'nm_kab' => 'Asmat'],

            // Papua Tengah
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Mimika'],
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Paniai'],
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Puncak Jaya'],
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Dogiyai'],
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Intan Jaya'],
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Deiyai'],
            ['prov_id' => $provinsi['Papua Tengah']->id, 'nm_kab' => 'Nabire'],

            // Papua Pegunungan
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Jayawijaya'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Pegunungan Bintang'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Yahukimo'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Tolikara'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Lanny Jaya'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Yalimo'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Puncak'],
            ['prov_id' => $provinsi['Papua Pegunungan']->id, 'nm_kab' => 'Nduga'],

            // Papua Barat Daya
            ['prov_id' => $provinsi['Papua Barat Daya']->id, 'nm_kab' => 'Sorong'],
            ['prov_id' => $provinsi['Papua Barat Daya']->id, 'nm_kab' => 'Sorong Selatan'],
            ['prov_id' => $provinsi['Papua Barat Daya']->id, 'nm_kab' => 'Raja Ampat'],
            ['prov_id' => $provinsi['Papua Barat Daya']->id, 'nm_kab' => 'Tambrauw'],
            ['prov_id' => $provinsi['Papua Barat Daya']->id, 'nm_kab' => 'Maybrat'],
            ['prov_id' => $provinsi['Papua Barat Daya']->id, 'nm_kab' => 'Kota Sorong'],
        ];

        DB::table('kab_kota')->insert($kabKota);
    }
}

