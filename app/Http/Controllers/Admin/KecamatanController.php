<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\KabKota;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class KecamatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Kecamatan::with(['kabKota.provinsi']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_kec', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kabKota', function ($q) use ($request) {
                        $q->where('nm_kab', 'like', '%' . $request->search . '%')
                            ->orWhereHas('provinsi', function ($q) use ($request) {
                                $q->where('nm_prov', 'like', '%' . $request->search . '%');
                            });
                    });
            });
        }

        // Filter by kabupaten/kota
        if ($request->has('kab_id') && $request->kab_id) {
            $query->where('kab_id', $request->kab_id);
        }

        // Pagination
        $kecamatan = $query->orderBy('nm_kec', 'asc')->paginate(10)->withQueryString();

        // Get all provinsi and kabupaten/kota for select chain
        $provinsi = \App\Models\Provinsi::orderBy('nm_prov', 'asc')->get();
        $kabKota = KabKota::with('provinsi')->orderBy('nm_kab', 'asc')->get();

        return Inertia::render('Admin/Kecamatan/Index', [
            'kecamatan' => $kecamatan,
            'provinsi' => $provinsi,
            'kabKota' => $kabKota,
            'filters' => $request->only(['search', 'kab_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kab_id' => ['required', 'exists:kab_kota,id'],
            'nm_kec' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kecamatan', 'nm_kec')->where('kab_id', $request->kab_id),
            ],
        ], [
            'kab_id.required' => 'Kabupaten/Kota wajib dipilih.',
            'kab_id.exists' => 'Kabupaten/Kota yang dipilih tidak valid.',
            'nm_kec.required' => 'Nama kecamatan wajib diisi.',
            'nm_kec.unique' => 'Nama kecamatan sudah ada di kabupaten/kota tersebut.',
        ]);

        Kecamatan::create($validated);

        return redirect()->route('admin.kecamatan.index')
            ->with('success', 'Kecamatan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kecamatan = Kecamatan::findOrFail($id);
        
        $validated = $request->validate([
            'kab_id' => ['required', 'exists:kab_kota,id'],
            'nm_kec' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kecamatan', 'nm_kec')
                    ->where('kab_id', $request->kab_id)
                    ->ignore($kecamatan->id),
            ],
        ], [
            'kab_id.required' => 'Kabupaten/Kota wajib dipilih.',
            'kab_id.exists' => 'Kabupaten/Kota yang dipilih tidak valid.',
            'nm_kec.required' => 'Nama kecamatan wajib diisi.',
            'nm_kec.unique' => 'Nama kecamatan sudah ada di kabupaten/kota tersebut.',
        ]);

        $kecamatan->update($validated);

        return redirect()->route('admin.kecamatan.index')
            ->with('success', 'Kecamatan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $kecamatan = Kecamatan::findOrFail($id);
            $kecamatan->delete();
            return redirect()->route('admin.kecamatan.index')
                ->with('success', 'Kecamatan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.kecamatan.index')
                ->with('error', 'Gagal menghapus kecamatan. Data mungkin masih digunakan di data lain.');
        }
    }
}

