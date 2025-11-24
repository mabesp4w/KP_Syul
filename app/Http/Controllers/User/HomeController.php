<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Kegiatan;
use App\Models\Galeri;
use App\Models\ProgramPendidikan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        // Berita terbaru (published, limit 6)
        $beritaTerbaru = Berita::where('is_published', true)
            ->orderBy('tgl_pub', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        // Kegiatan terbaru (limit 6)
        $kegiatanTerbaru = Kegiatan::with('kelurahan.kecamatan.kabKota.provinsi')
            ->orderBy('tgl_kegiatan', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        // Galeri terbaru (limit 8)
        $galeriTerbaru = Galeri::orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Program Pendidikan aktif
        $programPendidikan = ProgramPendidikan::where('is_active', true)
            ->orderBy('nm_prog', 'asc')
            ->get();

        return Inertia::render('User/Home', [
            'beritaTerbaru' => $beritaTerbaru,
            'kegiatanTerbaru' => $kegiatanTerbaru,
            'galeriTerbaru' => $galeriTerbaru,
            'programPendidikan' => $programPendidikan,
        ]);
    }
}

