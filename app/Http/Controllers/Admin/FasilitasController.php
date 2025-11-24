<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class FasilitasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Fasilitas::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_fasilitas', 'like', '%' . $request->search . '%')
                    ->orWhere('ket', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by availability
        if ($request->has('tersedia') && $request->tersedia !== '') {
            $query->where('tersedia', $request->tersedia === '1' || $request->tersedia === 'true');
        }

        // Pagination
        $fasilitas = $query->orderBy('nm_fasilitas', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Fasilitas/Index', [
            'fasilitas' => $fasilitas,
            'filters' => $request->only(['search', 'tersedia']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nm_fasilitas' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:fasilitas,slug'],
            'ket' => ['nullable', 'string'],
            'kapasitas' => ['nullable', 'integer', 'min:0'],
            'tersedia' => ['boolean'],
        ], [
            'nm_fasilitas.required' => 'Nama fasilitas wajib diisi.',
            'kapasitas.integer' => 'Kapasitas harus berupa angka.',
            'kapasitas.min' => 'Kapasitas tidak boleh negatif.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['nm_fasilitas']);
            $slug = $baseSlug;
            $counter = 1;
            while (Fasilitas::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        // Set default tersedia if not provided
        if (!isset($validated['tersedia'])) {
            $validated['tersedia'] = true;
        }

        Fasilitas::create($validated);

        return redirect()->route('admin.fasilitas.index')
            ->with('success', 'Fasilitas berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $fasilitas = Fasilitas::findOrFail($id);

        $validated = $request->validate([
            'nm_fasilitas' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('fasilitas', 'slug')->ignore($fasilitas->id)],
            'ket' => ['nullable', 'string'],
            'kapasitas' => ['nullable', 'integer', 'min:0'],
            'tersedia' => ['boolean'],
        ], [
            'nm_fasilitas.required' => 'Nama fasilitas wajib diisi.',
            'kapasitas.integer' => 'Kapasitas harus berupa angka.',
            'kapasitas.min' => 'Kapasitas tidak boleh negatif.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Generate slug if not provided and name changed
        if (empty($validated['slug']) && $fasilitas->nm_fasilitas !== $validated['nm_fasilitas']) {
            $baseSlug = Str::slug($validated['nm_fasilitas']);
            $slug = $baseSlug;
            $counter = 1;
            while (Fasilitas::where('slug', $slug)->where('id', '!=', $fasilitas->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        } elseif (empty($validated['slug'])) {
            // Keep existing slug if name hasn't changed
            $validated['slug'] = $fasilitas->slug;
        }

        // Set default tersedia if not provided
        if (!isset($validated['tersedia'])) {
            $validated['tersedia'] = $fasilitas->tersedia;
        }

        $fasilitas->update($validated);

        return redirect()->route('admin.fasilitas.index')
            ->with('success', 'Fasilitas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $fasilitas = Fasilitas::findOrFail($id);
            $fasilitas->delete();
            return redirect()->route('admin.fasilitas.index')
                ->with('success', 'Fasilitas berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.fasilitas.index')
                ->with('error', 'Gagal menghapus fasilitas. Fasilitas mungkin masih digunakan di data lain.');
        }
    }
}

