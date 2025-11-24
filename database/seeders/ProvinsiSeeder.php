<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinsiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinsi = [
            ['nm_prov' => 'Papua'],
            ['nm_prov' => 'Papua Barat'],
            ['nm_prov' => 'Papua Selatan'],
            ['nm_prov' => 'Papua Tengah'],
            ['nm_prov' => 'Papua Pegunungan'],
            ['nm_prov' => 'Papua Barat Daya'],
        ];

        DB::table('provinsi')->insert($provinsi);
    }
}

