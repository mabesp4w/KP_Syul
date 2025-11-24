<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Kegiatan;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Kegiatan::with(['kelurahan.kecamatan.kabKota.provinsi']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_kegiatan', 'like', '%' . $request->search . '%')
                    ->orWhere('ket', 'like', '%' . $request->search . '%')
                    ->orWhere('jenis', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kelurahan', function ($q) use ($request) {
                        $q->where('nm_kel', 'like', '%' . $request->search . '%');
                    });
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

        // Filter by kelurahan
        if ($request->has('kel_id') && $request->kel_id) {
            $query->where('kel_id', $request->kel_id);
        }

        // Filter by date range
        if ($request->has('tgl_dari') && $request->tgl_dari) {
            $query->where('tgl_kegiatan', '>=', $request->tgl_dari);
        }
        if ($request->has('tgl_sampai') && $request->tgl_sampai) {
            $query->where('tgl_kegiatan', '<=', $request->tgl_sampai);
        }

        // Pagination
        $kegiatan = $query->orderBy('tgl_kegiatan', 'desc')->orderBy('jam_mulai', 'asc')->paginate(10)->withQueryString();

        // Get data for filters and form
        $kelurahan = Kelurahan::with('kecamatan.kabKota.provinsi')->orderBy('nm_kel', 'asc')->get();
        
        // Get data for SelectChain (kelurahan)
        $provinsi = Provinsi::orderBy('nm_prov', 'asc')->get();
        $kabKota = KabKota::with('provinsi')->orderBy('nm_kab', 'asc')->get();
        $kecamatan = Kecamatan::with('kabKota.provinsi')->orderBy('nm_kec', 'asc')->get();

        // Get unique jenis for filter
        $jenisList = Kegiatan::distinct()->orderBy('jenis', 'asc')->pluck('jenis');

        return Inertia::render('Admin/Kegiatan/Index', [
            'kegiatan' => $kegiatan,
            'kelurahan' => $kelurahan,
            'provinsi' => $provinsi,
            'kabKota' => $kabKota,
            'kecamatan' => $kecamatan,
            'jenisList' => $jenisList,
            'filters' => $request->only(['search', 'jenis', 'status', 'kel_id', 'tgl_dari', 'tgl_sampai']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kel_id' => ['required', 'exists:kelurahan,id'],
            'nm_kegiatan' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:kegiatan,slug'],
            'tgl_kegiatan' => ['required', 'date'],
            'jam_mulai' => ['nullable', 'date_format:H:i'],
            'jam_seles' => ['nullable', 'date_format:H:i', 'after:jam_mulai'],
            'ket' => ['nullable', 'string'],
            'jenis' => ['required', 'string', 'in:pembelajaran,sosial,produktif,seni,lainnya'],
            'status' => ['required', 'string', 'in:terjadwal,berlangsung,selesai'],
        ], [
            'kel_id.required' => 'Kelurahan wajib dipilih.',
            'kel_id.exists' => 'Kelurahan yang dipilih tidak valid.',
            'nm_kegiatan.required' => 'Nama kegiatan wajib diisi.',
            'tgl_kegiatan.required' => 'Tanggal kegiatan wajib diisi.',
            'tgl_kegiatan.date' => 'Tanggal kegiatan harus berupa tanggal yang valid.',
            'jam_mulai.date_format' => 'Jam mulai harus berupa format waktu (HH:mm).',
            'jam_seles.date_format' => 'Jam selesai harus berupa format waktu (HH:mm).',
            'jam_seles.after' => 'Jam selesai harus setelah jam mulai.',
            'jenis.required' => 'Jenis kegiatan wajib dipilih.',
            'jenis.in' => 'Jenis kegiatan tidak valid.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['nm_kegiatan']);
            $slug = $baseSlug;
            $counter = 1;
            while (Kegiatan::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        Kegiatan::create($validated);

        return redirect()->route('admin.kegiatan.index')
            ->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);

        $validated = $request->validate([
            'kel_id' => ['required', 'exists:kelurahan,id'],
            'nm_kegiatan' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('kegiatan', 'slug')->ignore($kegiatan->id)],
            'tgl_kegiatan' => ['required', 'date'],
            'jam_mulai' => ['nullable', 'date_format:H:i'],
            'jam_seles' => ['nullable', 'date_format:H:i', 'after:jam_mulai'],
            'ket' => ['nullable', 'string'],
            'jenis' => ['required', 'string', 'in:pembelajaran,sosial,produktif,seni,lainnya'],
            'status' => ['required', 'string', 'in:terjadwal,berlangsung,selesai'],
        ], [
            'kel_id.required' => 'Kelurahan wajib dipilih.',
            'kel_id.exists' => 'Kelurahan yang dipilih tidak valid.',
            'nm_kegiatan.required' => 'Nama kegiatan wajib diisi.',
            'tgl_kegiatan.required' => 'Tanggal kegiatan wajib diisi.',
            'tgl_kegiatan.date' => 'Tanggal kegiatan harus berupa tanggal yang valid.',
            'jam_mulai.date_format' => 'Jam mulai harus berupa format waktu (HH:mm).',
            'jam_seles.date_format' => 'Jam selesai harus berupa format waktu (HH:mm).',
            'jam_seles.after' => 'Jam selesai harus setelah jam mulai.',
            'jenis.required' => 'Jenis kegiatan wajib dipilih.',
            'jenis.in' => 'Jenis kegiatan tidak valid.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);

        // Generate slug if not provided and name changed
        if (empty($validated['slug']) && $kegiatan->nm_kegiatan !== $validated['nm_kegiatan']) {
            $baseSlug = Str::slug($validated['nm_kegiatan']);
            $slug = $baseSlug;
            $counter = 1;
            while (Kegiatan::where('slug', $slug)->where('id', '!=', $kegiatan->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        } elseif (empty($validated['slug'])) {
            // Keep existing slug if name hasn't changed
            $validated['slug'] = $kegiatan->slug;
        }

        $kegiatan->update($validated);

        return redirect()->route('admin.kegiatan.index')
            ->with('success', 'Kegiatan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $kegiatan = Kegiatan::findOrFail($id);
            $kegiatan->delete();
            return redirect()->route('admin.kegiatan.index')
                ->with('success', 'Kegiatan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.kegiatan.index')
                ->with('error', 'Gagal menghapus kegiatan. Kegiatan mungkin masih digunakan di data lain.');
        }
    }
}

