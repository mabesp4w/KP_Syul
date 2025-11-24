<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class KegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get beberapa kelurahan untuk kegiatan
        $kelurahan = DB::table('kelurahan')->limit(20)->get();

        if ($kelurahan->isEmpty()) {
            $this->command->warn('Tidak ada kelurahan yang tersedia. Pastikan seeder kelurahan sudah dijalankan.');
            return;
        }

        $kegiatan = [];

        foreach ($kelurahan as $index => $kel) {
            // Kegiatan Pembelajaran
            $kegiatan[] = [
                'kel_id' => $kel->id,
                'nm_kegiatan' => 'Pembelajaran Paket A',
                'slug' => Str::slug('Pembelajaran Paket A ' . $kel->nm_kel . ' ' . $index) . '-' . time() . '-' . $index,
                'tgl_kegiatan' => Carbon::now()->addDays($index + 1)->format('Y-m-d'),
                'jam_mulai' => '08:00:00',
                'jam_seles' => '12:00:00',
                'ket' => 'Kegiatan pembelajaran paket A untuk warga belajar di ' . $kel->nm_kel,
                'jenis' => 'pembelajaran',
                'status' => 'terjadwal',
            ];

            // Kegiatan Sosial
            $kegiatan[] = [
                'kel_id' => $kel->id,
                'nm_kegiatan' => 'Gotong Royong Bersih Desa',
                'slug' => Str::slug('Gotong Royong Bersih Desa ' . $kel->nm_kel . ' ' . $index) . '-' . time() . '-' . ($index + 1000),
                'tgl_kegiatan' => Carbon::now()->addDays($index + 5)->format('Y-m-d'),
                'jam_mulai' => '07:00:00',
                'jam_seles' => '11:00:00',
                'ket' => 'Kegiatan gotong royong membersihkan lingkungan desa di ' . $kel->nm_kel,
                'jenis' => 'sosial',
                'status' => 'terjadwal',
            ];

            // Kegiatan Produktif
            $kegiatan[] = [
                'kel_id' => $kel->id,
                'nm_kegiatan' => 'Pelatihan Menjahit',
                'slug' => Str::slug('Pelatihan Menjahit ' . $kel->nm_kel . ' ' . $index) . '-' . time() . '-' . ($index + 2000),
                'tgl_kegiatan' => Carbon::now()->addDays($index + 10)->format('Y-m-d'),
                'jam_mulai' => '09:00:00',
                'jam_seles' => '15:00:00',
                'ket' => 'Pelatihan keterampilan menjahit untuk meningkatkan kemampuan warga di ' . $kel->nm_kel,
                'jenis' => 'produktif',
                'status' => 'terjadwal',
            ];

            // Kegiatan Seni
            if ($index % 3 === 0) {
                $kegiatan[] = [
                    'kel_id' => $kel->id,
                    'nm_kegiatan' => 'Pentas Seni Budaya',
                    'slug' => Str::slug('Pentas Seni Budaya ' . $kel->nm_kel . ' ' . $index) . '-' . time() . '-' . ($index + 3000),
                    'tgl_kegiatan' => Carbon::now()->addDays($index + 15)->format('Y-m-d'),
                    'jam_mulai' => '18:00:00',
                    'jam_seles' => '21:00:00',
                    'ket' => 'Pentas seni budaya untuk melestarikan budaya lokal di ' . $kel->nm_kel,
                    'jenis' => 'seni',
                    'status' => 'terjadwal',
                ];
            }

            // Kegiatan Lainnya
            if ($index % 4 === 0) {
                $kegiatan[] = [
                    'kel_id' => $kel->id,
                    'nm_kegiatan' => 'Workshop Kewirausahaan',
                    'slug' => Str::slug('Workshop Kewirausahaan ' . $kel->nm_kel . ' ' . $index) . '-' . time() . '-' . ($index + 4000),
                    'tgl_kegiatan' => Carbon::now()->addDays($index + 20)->format('Y-m-d'),
                    'jam_mulai' => '10:00:00',
                    'jam_seles' => '16:00:00',
                    'ket' => 'Workshop kewirausahaan untuk mengembangkan kemampuan berwirausaha di ' . $kel->nm_kel,
                    'jenis' => 'lainnya',
                    'status' => 'terjadwal',
                ];
            }
        }

        // Tambahkan beberapa kegiatan yang sudah selesai
        $kegiatanSelesai = [
            [
                'kel_id' => $kelurahan->first()->id,
                'nm_kegiatan' => 'Pembelajaran Keaksaraan Dasar',
                'slug' => Str::slug('Pembelajaran Keaksaraan Dasar ' . $kelurahan->first()->nm_kel . ' selesai') . '-' . time() . '-selesai-1',
                'tgl_kegiatan' => Carbon::now()->subDays(30)->format('Y-m-d'),
                'jam_mulai' => '08:00:00',
                'jam_seles' => '12:00:00',
                'ket' => 'Kegiatan pembelajaran keaksaraan dasar yang telah selesai dilaksanakan',
                'jenis' => 'pembelajaran',
                'status' => 'selesai',
            ],
            [
                'kel_id' => $kelurahan->skip(1)->first()->id,
                'nm_kegiatan' => 'Pelatihan Komputer',
                'slug' => Str::slug('Pelatihan Komputer ' . $kelurahan->skip(1)->first()->nm_kel . ' selesai') . '-' . time() . '-selesai-2',
                'tgl_kegiatan' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'jam_mulai' => '09:00:00',
                'jam_seles' => '15:00:00',
                'ket' => 'Pelatihan komputer dasar yang telah selesai dilaksanakan',
                'jenis' => 'produktif',
                'status' => 'selesai',
            ],
        ];

        $kegiatan = array_merge($kegiatan, $kegiatanSelesai);

        // Tambahkan beberapa kegiatan yang sedang berlangsung
        $kegiatanBerlangsung = [
            [
                'kel_id' => $kelurahan->skip(2)->first()->id,
                'nm_kegiatan' => 'Pembelajaran Paket B',
                'slug' => Str::slug('Pembelajaran Paket B ' . $kelurahan->skip(2)->first()->nm_kel . ' berlangsung') . '-' . time() . '-berlangsung-1',
                'tgl_kegiatan' => Carbon::now()->format('Y-m-d'),
                'jam_mulai' => '08:00:00',
                'jam_seles' => '12:00:00',
                'ket' => 'Kegiatan pembelajaran paket B yang sedang berlangsung',
                'jenis' => 'pembelajaran',
                'status' => 'berlangsung',
            ],
        ];

        $kegiatan = array_merge($kegiatan, $kegiatanBerlangsung);

        DB::table('kegiatan')->insert($kegiatan);
    }
}

