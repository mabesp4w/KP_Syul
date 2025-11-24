<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BeritaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Berita::with('kegiatan');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->search . '%')
                    ->orWhere('isi', 'like', '%' . $request->search . '%')
                    ->orWhere('penulis', 'like', '%' . $request->search . '%')
                    ->orWhere('kat', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kegiatan', function ($q) use ($request) {
                        $q->where('nm_kegiatan', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // Filter by kategori
        if ($request->has('kat') && $request->kat) {
            $query->where('kat', $request->kat);
        }

        // Filter by published status
        if ($request->has('is_published') && $request->is_published !== '') {
            $query->where('is_published', $request->is_published === '1' || $request->is_published === 'true');
        }

        // Filter by kegiatan
        if ($request->has('kegiatan_id') && $request->kegiatan_id) {
            $query->where('kegiatan_id', $request->kegiatan_id);
        }

        // Pagination
        $berita = $query->orderBy('tgl_pub', 'desc')->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        // Get data for filters and form
        $kegiatan = Kegiatan::orderBy('tgl_kegiatan', 'desc')->get();

        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita,
            'kegiatan' => $kegiatan,
            'filters' => $request->only(['search', 'kat', 'is_published', 'kegiatan_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kegiatan_id' => ['nullable', 'exists:kegiatan,id'],
            'judul' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:berita,slug'],
            'isi' => ['required', 'string'],
            'tgl_pub' => ['required', 'date'],
            'penulis' => ['required', 'string', 'max:255'],
            'kat' => ['required', 'string', 'in:pengumuman,acara,prestasi,info_umum'],
            'foto_utama' => ['nullable', 'image', 'max:2048'], // Max 2MB
            'is_published' => ['boolean'],
        ], [
            'judul.required' => 'Judul wajib diisi.',
            'isi.required' => 'Isi berita wajib diisi.',
            'tgl_pub.required' => 'Tanggal publish wajib diisi.',
            'tgl_pub.date' => 'Tanggal publish harus berupa tanggal yang valid.',
            'penulis.required' => 'Penulis wajib diisi.',
            'kat.required' => 'Kategori wajib dipilih.',
            'kat.in' => 'Kategori tidak valid.',
            'kegiatan_id.exists' => 'Kegiatan yang dipilih tidak valid.',
            'foto_utama.image' => 'Foto utama harus berupa gambar.',
            'foto_utama.max' => 'Ukuran foto utama maksimal 2MB.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Handle file upload
        if ($request->hasFile('foto_utama')) {
            $file = $request->file('foto_utama');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('berita', $filename, 'public');
            $validated['foto_utama'] = $path;
        }

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['judul']);
            $slug = $baseSlug;
            $counter = 1;
            while (Berita::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        // Set default is_published if not provided
        if (!isset($validated['is_published'])) {
            $validated['is_published'] = false;
        }

        Berita::create($validated);

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'kegiatan_id' => ['nullable', 'exists:kegiatan,id'],
            'judul' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('berita', 'slug')->ignore($berita->id)],
            'isi' => ['required', 'string'],
            'tgl_pub' => ['required', 'date'],
            'penulis' => ['required', 'string', 'max:255'],
            'kat' => ['required', 'string', 'in:pengumuman,acara,prestasi,info_umum'],
            'foto_utama' => ['nullable', 'image', 'max:2048'], // Max 2MB
            'is_published' => ['boolean'],
        ], [
            'judul.required' => 'Judul wajib diisi.',
            'isi.required' => 'Isi berita wajib diisi.',
            'tgl_pub.required' => 'Tanggal publish wajib diisi.',
            'tgl_pub.date' => 'Tanggal publish harus berupa tanggal yang valid.',
            'penulis.required' => 'Penulis wajib diisi.',
            'kat.required' => 'Kategori wajib dipilih.',
            'kat.in' => 'Kategori tidak valid.',
            'kegiatan_id.exists' => 'Kegiatan yang dipilih tidak valid.',
            'foto_utama.image' => 'Foto utama harus berupa gambar.',
            'foto_utama.max' => 'Ukuran foto utama maksimal 2MB.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Handle file upload
        if ($request->hasFile('foto_utama')) {
            // Delete old file if exists
            if ($berita->foto_utama) {
                Storage::disk('public')->delete($berita->foto_utama);
            }
            $file = $request->file('foto_utama');
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('berita', $filename, 'public');
            $validated['foto_utama'] = $path;
        }

        // Generate slug if not provided and title changed
        if (empty($validated['slug']) && $berita->judul !== $validated['judul']) {
            $baseSlug = Str::slug($validated['judul']);
            $slug = $baseSlug;
            $counter = 1;
            while (Berita::where('slug', $slug)->where('id', '!=', $berita->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        } elseif (empty($validated['slug'])) {
            // Keep existing slug if title hasn't changed
            $validated['slug'] = $berita->slug;
        }

        // Set default is_published if not provided
        if (!isset($validated['is_published'])) {
            $validated['is_published'] = $berita->is_published;
        }

        $berita->update($validated);

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $berita = Berita::findOrFail($id);
            
            // Delete foto_utama if exists
            if ($berita->foto_utama) {
                Storage::disk('public')->delete($berita->foto_utama);
            }
            
            $berita->delete();
            return redirect()->route('admin.berita.index')
                ->with('success', 'Berita berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.berita.index')
                ->with('error', 'Gagal menghapus berita. ' . $e->getMessage());
        }
    }
}

