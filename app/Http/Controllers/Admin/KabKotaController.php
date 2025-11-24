<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class KabKotaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = KabKota::with('provinsi');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_kab', 'like', '%' . $request->search . '%')
                    ->orWhereHas('provinsi', function ($q) use ($request) {
                        $q->where('nm_prov', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // Filter by provinsi
        if ($request->has('prov_id') && $request->prov_id) {
            $query->where('prov_id', $request->prov_id);
        }

        // Pagination
        $kabKota = $query->orderBy('nm_kab', 'asc')->paginate(10)->withQueryString();

        // Get all provinsi for filter dropdown
        $provinsi = Provinsi::orderBy('nm_prov', 'asc')->get();

        return Inertia::render('Admin/KabKota/Index', [
            'kabKota' => $kabKota,
            'provinsi' => $provinsi,
            'filters' => $request->only(['search', 'prov_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'prov_id' => ['required', 'exists:provinsi,id'],
            'nm_kab' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kab_kota', 'nm_kab')->where('prov_id', $request->prov_id),
            ],
        ], [
            'prov_id.required' => 'Provinsi wajib dipilih.',
            'prov_id.exists' => 'Provinsi yang dipilih tidak valid.',
            'nm_kab.required' => 'Nama kabupaten/kota wajib diisi.',
            'nm_kab.unique' => 'Nama kabupaten/kota sudah ada di provinsi tersebut.',
        ]);

        KabKota::create($validated);

        return redirect()->route('admin.kab-kota.index')
            ->with('success', 'Kabupaten/Kota berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kabKota = KabKota::findOrFail($id);
        
        $validated = $request->validate([
            'prov_id' => ['required', 'exists:provinsi,id'],
            'nm_kab' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kab_kota', 'nm_kab')
                    ->where('prov_id', $request->prov_id)
                    ->ignore($kabKota->id),
            ],
        ], [
            'prov_id.required' => 'Provinsi wajib dipilih.',
            'prov_id.exists' => 'Provinsi yang dipilih tidak valid.',
            'nm_kab.required' => 'Nama kabupaten/kota wajib diisi.',
            'nm_kab.unique' => 'Nama kabupaten/kota sudah ada di provinsi tersebut.',
        ]);

        $kabKota->update($validated);

        return redirect()->route('admin.kab-kota.index')
            ->with('success', 'Kabupaten/Kota berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $kabKota = KabKota::findOrFail($id);
            $kabKota->delete();
            return redirect()->route('admin.kab-kota.index')
                ->with('success', 'Kabupaten/Kota berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.kab-kota.index')
                ->with('error', 'Gagal menghapus kabupaten/kota. Data mungkin masih digunakan di data lain.');
        }
    }
}

