<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GaleriController extends Controller
{
    /**
     * Display a listing of galeri.
     */
    public function index(Request $request)
    {
        $query = Galeri::with(['kegiatan', 'fasilitas']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->search . '%')
                    ->orWhere('desk', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kegiatan', function ($q) use ($request) {
                        $q->where('nm_kegiatan', 'like', '%' . $request->search . '%');
                    })
                    ->orWhereHas('fasilitas', function ($q) use ($request) {
                        $q->where('nm_fasilitas', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // Filter by tipe
        if ($request->has('tipe') && $request->tipe) {
            if ($request->tipe === 'kegiatan') {
                $query->whereHas('kegiatan');
            } elseif ($request->tipe === 'fasilitas') {
                $query->whereHas('fasilitas');
            } elseif ($request->tipe === 'umum') {
                $query->whereDoesntHave('kegiatan')->whereDoesntHave('fasilitas');
            }
        }

        // Pagination
        $galeri = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('User/Galeri/Index', [
            'galeri' => $galeri,
            'filters' => $request->only(['search', 'tipe']),
        ]);
    }
}

