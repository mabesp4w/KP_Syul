<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    /**
     * Display a listing of kegiatan.
     */
    public function index(Request $request)
    {
        $query = Kegiatan::with(['kelurahan.kecamatan.kabKota.provinsi']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_kegiatan', 'like', '%' . $request->search . '%')
                    ->orWhere('ket', 'like', '%' . $request->search . '%')
                    ->orWhere('jenis', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by jenis
        if ($request->has('jenis') && $request->jenis) {
            $query->where('jenis', $request->jenis);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('tgl_dari') && $request->tgl_dari) {
            $query->where('tgl_kegiatan', '>=', $request->tgl_dari);
        }
        if ($request->has('tgl_sampai') && $request->tgl_sampai) {
            $query->where('tgl_kegiatan', '<=', $request->tgl_sampai);
        }

        // Pagination
        $kegiatan = $query->orderBy('tgl_kegiatan', 'desc')->orderBy('jam_mulai', 'asc')->paginate(9)->withQueryString();

        // Get unique jenis for filter
        $jenisList = Kegiatan::distinct()->orderBy('jenis', 'asc')->pluck('jenis');

        return Inertia::render('User/Kegiatan/Index', [
            'kegiatan' => $kegiatan,
            'jenisList' => $jenisList,
            'filters' => $request->only(['search', 'jenis', 'status', 'tgl_dari', 'tgl_sampai']),
        ]);
    }

    /**
     * Display the specified kegiatan.
     */
    public function show(Kegiatan $kegiatan)
    {
        $kegiatan->load(['kelurahan.kecamatan.kabKota.provinsi']);

        // Kegiatan terkait (same jenis, limit 4)
        $kegiatanTerkait = Kegiatan::where('jenis', $kegiatan->jenis)
            ->where('id', '!=', $kegiatan->id)
            ->orderBy('tgl_kegiatan', 'desc')
            ->limit(4)
            ->get();

        return Inertia::render('User/Kegiatan/Show', [
            'kegiatan' => $kegiatan,
            'kegiatanTerkait' => $kegiatanTerkait,
        ]);
    }
}

