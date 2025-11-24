<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        // Statistik Pengguna
        $totalUsers = DB::table('users')->count();
        $totalAdmins = DB::table('users')->where('role', 'admin')->count();
        $totalPetugas = DB::table('users')->where('role', 'petugas')->count();
        $totalRegularUsers = DB::table('users')->where('role', 'user')->count();

        // Statistik Peserta
        $totalPeserta = DB::table('peserta')->count();
        $pesertaAktif = DB::table('peserta')->where('status', 'aktif')->count();
        $pesertaLulus = DB::table('peserta')->where('status', 'lulus')->count();
        $pesertaTidakAktif = DB::table('peserta')->where('status', 'tidak_aktif')->count();

        // Statistik Program Pendidikan
        $totalProgram = DB::table('program_pendidikan')->count();
        $programAktif = DB::table('program_pendidikan')->where('is_active', true)->count();

        // Statistik Kegiatan
        $totalKegiatan = DB::table('kegiatan')->count();
        $kegiatanTerjadwal = DB::table('kegiatan')->where('status', 'terjadwal')->count();
        $kegiatanBerlangsung = DB::table('kegiatan')->where('status', 'berlangsung')->count();
        $kegiatanSelesai = DB::table('kegiatan')->where('status', 'selesai')->count();

        // Statistik Fasilitas
        $totalFasilitas = DB::table('fasilitas')->count();
        $fasilitasTersedia = DB::table('fasilitas')->where('tersedia', true)->count();

        // Statistik Berita
        $totalBerita = DB::table('berita')->count();
        $beritaPublished = DB::table('berita')->where('is_published', true)->count();

        // Statistik Galeri
        $totalGaleri = DB::table('galeri')->count();

        // Kegiatan Terbaru (5 terakhir)
        $kegiatanTerbaru = DB::table('kegiatan')
            ->join('kelurahan', 'kegiatan.kel_id', '=', 'kelurahan.id')
            ->select('kegiatan.*', 'kelurahan.nm_kel as nama_kelurahan')
            ->orderBy('kegiatan.created_at', 'desc')
            ->limit(5)
            ->get();

        // Peserta Terbaru (5 terakhir)
        $pesertaTerbaru = DB::table('peserta')
            ->join('program_pendidikan', 'peserta.prog_id', '=', 'program_pendidikan.id')
            ->join('kelurahan', 'peserta.kel_id', '=', 'kelurahan.id')
            ->select('peserta.*', 'program_pendidikan.nm_prog as nama_program', 'kelurahan.nm_kel as nama_kelurahan')
            ->orderBy('peserta.created_at', 'desc')
            ->limit(5)
            ->get();

        // Statistik berdasarkan Program Pendidikan
        $statistikProgram = DB::table('peserta')
            ->join('program_pendidikan', 'peserta.prog_id', '=', 'program_pendidikan.id')
            ->select('program_pendidikan.nm_prog as nama_program', DB::raw('COUNT(peserta.id) as total'))
            ->groupBy('program_pendidikan.id', 'program_pendidikan.nm_prog')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'statistics' => [
                'users' => [
                    'total' => $totalUsers,
                    'admins' => $totalAdmins,
                    'petugas' => $totalPetugas,
                    'regular' => $totalRegularUsers,
                ],
                'peserta' => [
                    'total' => $totalPeserta,
                    'aktif' => $pesertaAktif,
                    'lulus' => $pesertaLulus,
                    'tidak_aktif' => $pesertaTidakAktif,
                ],
                'program' => [
                    'total' => $totalProgram,
                    'aktif' => $programAktif,
                ],
                'kegiatan' => [
                    'total' => $totalKegiatan,
                    'terjadwal' => $kegiatanTerjadwal,
                    'berlangsung' => $kegiatanBerlangsung,
                    'selesai' => $kegiatanSelesai,
                ],
                'fasilitas' => [
                    'total' => $totalFasilitas,
                    'tersedia' => $fasilitasTersedia,
                ],
                'berita' => [
                    'total' => $totalBerita,
                    'published' => $beritaPublished,
                ],
                'galeri' => [
                    'total' => $totalGaleri,
                ],
            ],
            'recent' => [
                'kegiatan' => $kegiatanTerbaru,
                'peserta' => $pesertaTerbaru,
            ],
            'statistikProgram' => $statistikProgram,
        ]);
    }
}

