<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProvinsiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Provinsi::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('nm_prov', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $provinsi = $query->orderBy('nm_prov', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Provinsi/Index', [
            'provinsi' => $provinsi,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nm_prov' => ['required', 'string', 'max:255', 'unique:provinsi,nm_prov'],
        ], [
            'nm_prov.required' => 'Nama provinsi wajib diisi.',
            'nm_prov.unique' => 'Nama provinsi sudah ada.',
        ]);

        Provinsi::create($validated);

        return redirect()->route('admin.provinsi.index')
            ->with('success', 'Provinsi berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $provinsi = Provinsi::findOrFail($id);
        
        $validated = $request->validate([
            'nm_prov' => [
                'required',
                'string',
                'max:255',
                Rule::unique('provinsi', 'nm_prov')->ignore($provinsi->id),
            ],
        ], [
            'nm_prov.required' => 'Nama provinsi wajib diisi.',
            'nm_prov.unique' => 'Nama provinsi sudah ada.',
        ]);

        $provinsi->update($validated);

        return redirect()->route('admin.provinsi.index')
            ->with('success', 'Provinsi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $provinsi = Provinsi::findOrFail($id);
            $provinsi->delete();
            return redirect()->route('admin.provinsi.index')
                ->with('success', 'Provinsi berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.provinsi.index')
                ->with('error', 'Gagal menghapus provinsi. Provinsi mungkin masih digunakan di data lain.');
        }
    }
}

