<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use App\Models\Kegiatan;
use App\Models\Fasilitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GaleriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Galeri::with(['kegiatan', 'fasilitas']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->search . '%')
                    ->orWhere('desk', 'like', '%' . $request->search . '%')
                    ->orWhere('nm_file', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kegiatan', function ($q) use ($request) {
                        $q->where('nm_kegiatan', 'like', '%' . $request->search . '%');
                    })
                    ->orWhereHas('fasilitas', function ($q) use ($request) {
                        $q->where('nm_fasilitas', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // Pagination
        $galeri = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        // Get data for form
        $kegiatan = Kegiatan::orderBy('nm_kegiatan', 'asc')->get();
        $fasilitas = Fasilitas::orderBy('nm_fasilitas', 'asc')->get();

        return Inertia::render('Admin/Galeri/Index', [
            'galeri' => $galeri,
            'kegiatan' => $kegiatan,
            'fasilitas' => $fasilitas,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => ['nullable', 'string', 'max:255'],
            'desk' => ['nullable', 'string'],
            'gambar' => ['required', 'image', 'max:5120'], // Max 5MB
            'tipe' => ['nullable', 'string', 'in:kegiatan,fasilitas,umum'],
            'kegiatan_id' => ['nullable', 'required_if:tipe,kegiatan', 'exists:kegiatan,id'],
            'fasilitas_id' => ['nullable', 'required_if:tipe,fasilitas', 'exists:fasilitas,id'],
        ], [
            'gambar.required' => 'Gambar wajib diupload.',
            'gambar.image' => 'File harus berupa gambar.',
            'gambar.max' => 'Ukuran gambar maksimal 5MB.',
            'tipe.in' => 'Tipe tidak valid.',
            'kegiatan_id.required_if' => 'Kegiatan wajib dipilih jika tipe adalah kegiatan.',
            'kegiatan_id.exists' => 'Kegiatan yang dipilih tidak valid.',
            'fasilitas_id.required_if' => 'Fasilitas wajib dipilih jika tipe adalah fasilitas.',
            'fasilitas_id.exists' => 'Fasilitas yang dipilih tidak valid.',
        ]);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = time() . '_' . \Illuminate\Support\Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('galeri', $filename, 'public');
            $validated['gambar'] = $path;
            $validated['nm_file'] = $file->getClientOriginalName();
        }

        // Convert null or 'null' string to empty string for judul
        if (isset($validated['judul'])) {
            if ($validated['judul'] === null || $validated['judul'] === 'null' || trim($validated['judul']) === '') {
                $validated['judul'] = '';
            }
        }

        $galeri = Galeri::create($validated);

        // Attach to kegiatan or fasilitas
        if ($request->tipe === 'kegiatan' && $request->kegiatan_id) {
            $galeri->kegiatan()->sync([$request->kegiatan_id]);
        } elseif ($request->tipe === 'fasilitas' && $request->fasilitas_id) {
            $galeri->fasilitas()->sync([$request->fasilitas_id]);
        }

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Galeri berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $galeri = Galeri::findOrFail($id);

        $validated = $request->validate([
            'judul' => ['nullable', 'string', 'max:255'],
            'desk' => ['nullable', 'string'],
            'gambar' => ['nullable', 'image', 'max:5120'], // Max 5MB
            'tipe' => ['nullable', 'string', 'in:kegiatan,fasilitas,umum'],
            'kegiatan_id' => ['nullable', 'required_if:tipe,kegiatan', 'exists:kegiatan,id'],
            'fasilitas_id' => ['nullable', 'required_if:tipe,fasilitas', 'exists:fasilitas,id'],
        ], [
            'gambar.image' => 'File harus berupa gambar.',
            'gambar.max' => 'Ukuran gambar maksimal 5MB.',
            'tipe.in' => 'Tipe tidak valid.',
            'kegiatan_id.required_if' => 'Kegiatan wajib dipilih jika tipe adalah kegiatan.',
            'kegiatan_id.exists' => 'Kegiatan yang dipilih tidak valid.',
            'fasilitas_id.required_if' => 'Fasilitas wajib dipilih jika tipe adalah fasilitas.',
            'fasilitas_id.exists' => 'Fasilitas yang dipilih tidak valid.',
        ]);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            // Delete old file if exists
            if ($galeri->gambar) {
                Storage::disk('public')->delete($galeri->gambar);
            }
            $file = $request->file('gambar');
            $filename = time() . '_' . \Illuminate\Support\Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('galeri', $filename, 'public');
            $validated['gambar'] = $path;
            $validated['nm_file'] = $file->getClientOriginalName();
        }

        // Convert null or 'null' string to empty string for judul
        if (isset($validated['judul'])) {
            if ($validated['judul'] === null || $validated['judul'] === 'null' || trim($validated['judul']) === '') {
                $validated['judul'] = '';
            }
        }

        $galeri->update($validated);

        // Sync relationships
        if ($request->tipe === 'kegiatan' && $request->kegiatan_id) {
            $galeri->kegiatan()->sync([$request->kegiatan_id]);
            $galeri->fasilitas()->sync([]);
        } elseif ($request->tipe === 'fasilitas' && $request->fasilitas_id) {
            $galeri->fasilitas()->sync([$request->fasilitas_id]);
            $galeri->kegiatan()->sync([]);
        } else {
            // Umum - remove all relationships
            $galeri->kegiatan()->sync([]);
            $galeri->fasilitas()->sync([]);
        }

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Galeri berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $galeri = Galeri::findOrFail($id);
            
            // Delete gambar if exists
            if ($galeri->gambar) {
                Storage::disk('public')->delete($galeri->gambar);
            }
            
            $galeri->delete();
            return redirect()->route('admin.galeri.index')
                ->with('success', 'Galeri berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.galeri.index')
                ->with('error', 'Gagal menghapus galeri. ' . $e->getMessage());
        }
    }
}

