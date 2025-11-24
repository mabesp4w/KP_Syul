<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelurahan;
use App\Models\Kecamatan;
use App\Models\KabKota;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class KelurahanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Kelurahan::with(['kecamatan.kabKota.provinsi']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_kel', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kecamatan', function ($q) use ($request) {
                        $q->where('nm_kec', 'like', '%' . $request->search . '%')
                            ->orWhereHas('kabKota', function ($q) use ($request) {
                                $q->where('nm_kab', 'like', '%' . $request->search . '%')
                                    ->orWhereHas('provinsi', function ($q) use ($request) {
                                        $q->where('nm_prov', 'like', '%' . $request->search . '%');
                                    });
                            });
                    });
            });
        }

        // Filter by kecamatan
        if ($request->has('kec_id') && $request->kec_id) {
            $query->where('kec_id', $request->kec_id);
        }

        // Pagination
        $kelurahan = $query->orderBy('nm_kel', 'asc')->paginate(10)->withQueryString();

        // Get all data for select chain
        $provinsi = Provinsi::orderBy('nm_prov', 'asc')->get();
        $kabKota = KabKota::with('provinsi')->orderBy('nm_kab', 'asc')->get();
        $kecamatan = Kecamatan::with('kabKota.provinsi')->orderBy('nm_kec', 'asc')->get();

        return Inertia::render('Admin/Kelurahan/Index', [
            'kelurahan' => $kelurahan,
            'provinsi' => $provinsi,
            'kabKota' => $kabKota,
            'kecamatan' => $kecamatan,
            'filters' => $request->only(['search', 'kec_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kec_id' => ['required', 'exists:kecamatan,id'],
            'nm_kel' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kelurahan', 'nm_kel')->where('kec_id', $request->kec_id),
            ],
        ], [
            'kec_id.required' => 'Kecamatan wajib dipilih.',
            'kec_id.exists' => 'Kecamatan yang dipilih tidak valid.',
            'nm_kel.required' => 'Nama kelurahan wajib diisi.',
            'nm_kel.unique' => 'Nama kelurahan sudah ada di kecamatan tersebut.',
        ]);

        Kelurahan::create($validated);

        return redirect()->route('admin.kelurahan.index')
            ->with('success', 'Kelurahan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kelurahan = Kelurahan::findOrFail($id);
        
        $validated = $request->validate([
            'kec_id' => ['required', 'exists:kecamatan,id'],
            'nm_kel' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kelurahan', 'nm_kel')
                    ->where('kec_id', $request->kec_id)
                    ->ignore($kelurahan->id),
            ],
        ], [
            'kec_id.required' => 'Kecamatan wajib dipilih.',
            'kec_id.exists' => 'Kecamatan yang dipilih tidak valid.',
            'nm_kel.required' => 'Nama kelurahan wajib diisi.',
            'nm_kel.unique' => 'Nama kelurahan sudah ada di kecamatan tersebut.',
        ]);

        $kelurahan->update($validated);

        return redirect()->route('admin.kelurahan.index')
            ->with('success', 'Kelurahan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $kelurahan = Kelurahan::findOrFail($id);
            $kelurahan->delete();
            return redirect()->route('admin.kelurahan.index')
                ->with('success', 'Kelurahan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.kelurahan.index')
                ->with('error', 'Gagal menghapus kelurahan. Data mungkin masih digunakan di data lain.');
        }
    }
}

