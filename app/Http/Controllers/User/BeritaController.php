<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Display a listing of published berita.
     */
    public function index(Request $request)
    {
        $query = Berita::with('kegiatan')->where('is_published', true);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->search . '%')
                    ->orWhere('isi', 'like', '%' . $request->search . '%')
                    ->orWhere('penulis', 'like', '%' . $request->search . '%')
                    ->orWhere('kat', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by kategori
        if ($request->has('kat') && $request->kat) {
            $query->where('kat', $request->kat);
        }

        // Pagination
        $berita = $query->orderBy('tgl_pub', 'desc')->orderBy('created_at', 'desc')->paginate(9)->withQueryString();

        // Get categories for filter
        $kategori = Berita::where('is_published', true)
            ->distinct()
            ->orderBy('kat', 'asc')
            ->pluck('kat');

        return Inertia::render('User/Berita/Index', [
            'berita' => $berita,
            'kategori' => $kategori,
            'filters' => $request->only(['search', 'kat']),
        ]);
    }

    /**
     * Display the specified berita.
     */
    public function show(Berita $berita)
    {
        // Ensure berita is published
        if (!$berita->is_published) {
            abort(404);
        }

        $berita->load('kegiatan');

        // Berita terkait (same category, limit 4)
        $beritaTerkait = Berita::where('is_published', true)
            ->where('kat', $berita->kat)
            ->where('id', '!=', $berita->id)
            ->orderBy('tgl_pub', 'desc')
            ->limit(4)
            ->get();

        return Inertia::render('User/Berita/Show', [
            'berita' => $berita,
            'beritaTerkait' => $beritaTerkait,
        ]);
    }
}

