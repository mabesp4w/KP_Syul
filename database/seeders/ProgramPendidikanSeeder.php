<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProgramPendidikanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'nm_prog' => 'Pendidikan Anak Usia Dini (PAUD)',
                'slug' => 'pendidikan-anak-usia-dini-paud',
                'kat' => 'PAUD',
                'desk' => 'Program pendidikan untuk anak usia dini yang bertujuan untuk mengembangkan potensi anak secara optimal melalui bermain sambil belajar.',
                'tgt_pst' => 'Anak usia 0-6 tahun',
                'durasi' => '2 tahun',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Paket A Setara SD',
                'slug' => 'paket-a-setara-sd',
                'kat' => 'Paket A',
                'desk' => 'Program pendidikan kesetaraan untuk memperoleh ijazah setara Sekolah Dasar (SD) bagi warga belajar yang tidak dapat mengikuti pendidikan formal.',
                'tgt_pst' => 'Warga belajar usia 15 tahun ke atas',
                'durasi' => '3 tahun',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Paket B Setara SMP',
                'slug' => 'paket-b-setara-smp',
                'kat' => 'Paket B',
                'desk' => 'Program pendidikan kesetaraan untuk memperoleh ijazah setara Sekolah Menengah Pertama (SMP) bagi warga belajar yang tidak dapat mengikuti pendidikan formal.',
                'tgt_pst' => 'Warga belajar usia 17 tahun ke atas',
                'durasi' => '3 tahun',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Paket C Setara SMA',
                'slug' => 'paket-c-setara-sma',
                'kat' => 'Paket C',
                'desk' => 'Program pendidikan kesetaraan untuk memperoleh ijazah setara Sekolah Menengah Atas (SMA) bagi warga belajar yang tidak dapat mengikuti pendidikan formal.',
                'tgt_pst' => 'Warga belajar usia 21 tahun ke atas',
                'durasi' => '3 tahun',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Keaksaraan Dasar',
                'slug' => 'keaksaraan-dasar',
                'kat' => 'Keaksaraan Dasar',
                'desk' => 'Program pemberantasan buta aksara untuk meningkatkan kemampuan membaca, menulis, dan berhitung dasar.',
                'tgt_pst' => 'Warga belajar usia 15 tahun ke atas yang buta aksara',
                'durasi' => '6 bulan',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Keaksaraan Usaha Mandiri',
                'slug' => 'keaksaraan-usaha-mandiri',
                'kat' => 'Keaksaraan Usaha Mandiri',
                'desk' => 'Program peningkatan kemampuan keaksaraan yang diintegrasikan dengan keterampilan usaha mandiri untuk meningkatkan kesejahteraan masyarakat.',
                'tgt_pst' => 'Warga belajar lulusan keaksaraan dasar',
                'durasi' => '1 tahun',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Kursus Komputer Dasar',
                'slug' => 'kursus-komputer-dasar',
                'kat' => 'Kursus',
                'desk' => 'Program kursus untuk meningkatkan kemampuan menggunakan komputer dan aplikasi office dasar.',
                'tgt_pst' => 'Masyarakat umum',
                'durasi' => '3 bulan',
                'biaya' => 500000,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Kursus Menjahit',
                'slug' => 'kursus-menjahit',
                'kat' => 'Kursus',
                'desk' => 'Program kursus keterampilan menjahit untuk meningkatkan kemampuan dan menciptakan peluang usaha.',
                'tgt_pst' => 'Masyarakat umum, khususnya perempuan',
                'durasi' => '6 bulan',
                'biaya' => 750000,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Kursus Pertanian Organik',
                'slug' => 'kursus-pertanian-organik',
                'kat' => 'Kursus',
                'desk' => 'Program kursus untuk meningkatkan pengetahuan dan keterampilan dalam pertanian organik yang ramah lingkungan.',
                'tgt_pst' => 'Petani dan masyarakat umum',
                'durasi' => '4 bulan',
                'biaya' => 600000,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Pendidikan Perempuan',
                'slug' => 'pendidikan-perempuan',
                'kat' => 'Pendidikan Perempuan',
                'desk' => 'Program khusus untuk pemberdayaan perempuan melalui pendidikan dan pelatihan keterampilan.',
                'tgt_pst' => 'Perempuan usia produktif',
                'durasi' => '1 tahun',
                'biaya' => 0,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Kursus Bahasa Inggris',
                'slug' => 'kursus-bahasa-inggris',
                'kat' => 'Kursus',
                'desk' => 'Program kursus bahasa Inggris untuk meningkatkan kemampuan komunikasi dalam bahasa internasional.',
                'tgt_pst' => 'Masyarakat umum',
                'durasi' => '6 bulan',
                'biaya' => 800000,
                'is_active' => true,
            ],
            [
                'nm_prog' => 'Kursus Kewirausahaan',
                'slug' => 'kursus-kewirausahaan',
                'kat' => 'Kursus',
                'desk' => 'Program kursus untuk mengembangkan jiwa kewirausahaan dan kemampuan mengelola usaha.',
                'tgt_pst' => 'Masyarakat umum yang ingin berwirausaha',
                'durasi' => '3 bulan',
                'biaya' => 500000,
                'is_active' => true,
            ],
        ];

        DB::table('program_pendidikan')->insert($programs);
    }
}

