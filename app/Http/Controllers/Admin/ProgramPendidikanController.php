<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramPendidikan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class ProgramPendidikanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProgramPendidikan::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_prog', 'like', '%' . $request->search . '%')
                    ->orWhere('kat', 'like', '%' . $request->search . '%')
                    ->orWhere('tgt_pst', 'like', '%' . $request->search . '%')
                    ->orWhere('desk', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by category
        if ($request->has('kat') && $request->kat) {
            $query->where('kat', $request->kat);
        }

        // Filter by active status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->is_active === '1' || $request->is_active === 'true');
        }

        // Pagination
        $programPendidikan = $query->orderBy('nm_prog', 'asc')->paginate(10)->withQueryString();

        // Get unique categories for filter
        $kategori = ProgramPendidikan::distinct()->orderBy('kat', 'asc')->pluck('kat');

        return Inertia::render('Admin/ProgramPendidikan/Index', [
            'programPendidikan' => $programPendidikan,
            'kategori' => $kategori,
            'filters' => $request->only(['search', 'kat', 'is_active']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nm_prog' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:program_pendidikan,slug'],
            'kat' => ['required', 'string', 'max:255'],
            'desk' => ['required', 'string'],
            'tgt_pst' => ['required', 'string', 'max:255'],
            'durasi' => ['required', 'string', 'max:255'],
            'biaya' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ], [
            'nm_prog.required' => 'Nama program wajib diisi.',
            'kat.required' => 'Kategori wajib dipilih.',
            'desk.required' => 'Deskripsi wajib diisi.',
            'tgt_pst.required' => 'Target peserta wajib diisi.',
            'durasi.required' => 'Durasi wajib diisi.',
            'biaya.numeric' => 'Biaya harus berupa angka.',
            'biaya.min' => 'Biaya tidak boleh negatif.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['nm_prog']);
            $slug = $baseSlug;
            $counter = 1;
            while (ProgramPendidikan::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        // Set default is_active if not provided
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        ProgramPendidikan::create($validated);

        return redirect()->route('admin.program-pendidikan.index')
            ->with('success', 'Program pendidikan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $programPendidikan = ProgramPendidikan::findOrFail($id);

        $validated = $request->validate([
            'nm_prog' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('program_pendidikan', 'slug')->ignore($programPendidikan->id)],
            'kat' => ['required', 'string', 'max:255'],
            'desk' => ['required', 'string'],
            'tgt_pst' => ['required', 'string', 'max:255'],
            'durasi' => ['required', 'string', 'max:255'],
            'biaya' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ], [
            'nm_prog.required' => 'Nama program wajib diisi.',
            'kat.required' => 'Kategori wajib dipilih.',
            'desk.required' => 'Deskripsi wajib diisi.',
            'tgt_pst.required' => 'Target peserta wajib diisi.',
            'durasi.required' => 'Durasi wajib diisi.',
            'biaya.numeric' => 'Biaya harus berupa angka.',
            'biaya.min' => 'Biaya tidak boleh negatif.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Generate slug if not provided and name changed
        if (empty($validated['slug']) && $programPendidikan->nm_prog !== $validated['nm_prog']) {
            $baseSlug = Str::slug($validated['nm_prog']);
            $slug = $baseSlug;
            $counter = 1;
            while (ProgramPendidikan::where('slug', $slug)->where('id', '!=', $programPendidikan->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        } elseif (empty($validated['slug'])) {
            // Keep existing slug if name hasn't changed
            $validated['slug'] = $programPendidikan->slug;
        }

        // Set default is_active if not provided
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = $programPendidikan->is_active;
        }

        $programPendidikan->update($validated);

        return redirect()->route('admin.program-pendidikan.index')
            ->with('success', 'Program pendidikan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $programPendidikan = ProgramPendidikan::findOrFail($id);
            $programPendidikan->delete();
            return redirect()->route('admin.program-pendidikan.index')
                ->with('success', 'Program pendidikan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.program-pendidikan.index')
                ->with('error', 'Gagal menghapus program pendidikan. Program mungkin masih digunakan di data lain.');
        }
    }
}

