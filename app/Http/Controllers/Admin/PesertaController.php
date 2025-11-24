<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use App\Models\Peserta;
use App\Models\ProgramPendidikan;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PesertaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Peserta::with(['kelurahan.kecamatan.kabKota.provinsi', 'programPendidikan']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_lengkap', 'like', '%' . $request->search . '%')
                    ->orWhere('no_induk', 'like', '%' . $request->search . '%')
                    ->orWhere('tmp_lhr', 'like', '%' . $request->search . '%')
                    ->orWhere('no_tlp', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhereHas('kelurahan', function ($q) use ($request) {
                        $q->where('nm_kel', 'like', '%' . $request->search . '%');
                    })
                    ->orWhereHas('programPendidikan', function ($q) use ($request) {
                        $q->where('nm_prog', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // Filter by program
        if ($request->has('prog_id') && $request->prog_id) {
            $query->where('prog_id', $request->prog_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by kelurahan
        if ($request->has('kel_id') && $request->kel_id) {
            $query->where('kel_id', $request->kel_id);
        }

        // Pagination
        $peserta = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        // Get data for filters and form
        $programPendidikan = ProgramPendidikan::where('is_active', true)->orderBy('nm_prog', 'asc')->get();
        $kelurahan = Kelurahan::with('kecamatan.kabKota.provinsi')->orderBy('nm_kel', 'asc')->get();
        
        // Get data for SelectChain (kelurahan)
        $provinsi = Provinsi::orderBy('nm_prov', 'asc')->get();
        $kabKota = KabKota::with('provinsi')->orderBy('nm_kab', 'asc')->get();
        $kecamatan = Kecamatan::with('kabKota.provinsi')->orderBy('nm_kec', 'asc')->get();

        return Inertia::render('Admin/Peserta/Index', [
            'peserta' => $peserta,
            'programPendidikan' => $programPendidikan,
            'kelurahan' => $kelurahan,
            'provinsi' => $provinsi,
            'kabKota' => $kabKota,
            'kecamatan' => $kecamatan,
            'filters' => $request->only(['search', 'prog_id', 'status', 'kel_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kel_id' => ['required', 'exists:kelurahan,id'],
            'prog_id' => ['required', 'exists:program_pendidikan,id'],
            'no_induk' => ['required', 'string', 'max:255', 'unique:peserta,no_induk'],
            'nm_lengkap' => ['required', 'string', 'max:255'],
            'tmp_lhr' => ['required', 'string', 'max:255'],
            'tgl_lhr' => ['required', 'date'],
            'jk' => ['required', 'in:L,P'],
            'alamat' => ['required', 'string'],
            'no_tlp' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'nm_wali' => ['nullable', 'string', 'max:255'],
            'tlp_wali' => ['nullable', 'string', 'max:255'],
            'foto' => ['nullable', 'string', 'max:255'],
            'tgl_dftr' => ['required', 'date'],
            'status' => ['required', 'in:aktif,lulus,tidak_aktif,cuti'],
        ], [
            'kel_id.required' => 'Kelurahan wajib dipilih.',
            'kel_id.exists' => 'Kelurahan yang dipilih tidak valid.',
            'prog_id.required' => 'Program pendidikan wajib dipilih.',
            'prog_id.exists' => 'Program pendidikan yang dipilih tidak valid.',
            'no_induk.required' => 'Nomor induk wajib diisi.',
            'no_induk.unique' => 'Nomor induk sudah digunakan.',
            'nm_lengkap.required' => 'Nama lengkap wajib diisi.',
            'tmp_lhr.required' => 'Tempat lahir wajib diisi.',
            'tgl_lhr.required' => 'Tanggal lahir wajib diisi.',
            'tgl_lhr.date' => 'Tanggal lahir harus berupa tanggal yang valid.',
            'jk.required' => 'Jenis kelamin wajib dipilih.',
            'jk.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',
            'alamat.required' => 'Alamat wajib diisi.',
            'no_tlp.required' => 'Nomor telepon wajib diisi.',
            'email.email' => 'Email harus berupa format email yang valid.',
            'tgl_dftr.required' => 'Tanggal daftar wajib diisi.',
            'tgl_dftr.date' => 'Tanggal daftar harus berupa tanggal yang valid.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
        ]);

        Peserta::create($validated);

        return redirect()->route('admin.peserta.index')
            ->with('success', 'Peserta berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $peserta = Peserta::findOrFail($id);

        $validated = $request->validate([
            'kel_id' => ['required', 'exists:kelurahan,id'],
            'prog_id' => ['required', 'exists:program_pendidikan,id'],
            'no_induk' => ['required', 'string', 'max:255', Rule::unique('peserta', 'no_induk')->ignore($peserta->id)],
            'nm_lengkap' => ['required', 'string', 'max:255'],
            'tmp_lhr' => ['required', 'string', 'max:255'],
            'tgl_lhr' => ['required', 'date'],
            'jk' => ['required', 'in:L,P'],
            'alamat' => ['required', 'string'],
            'no_tlp' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'nm_wali' => ['nullable', 'string', 'max:255'],
            'tlp_wali' => ['nullable', 'string', 'max:255'],
            'foto' => ['nullable', 'string', 'max:255'],
            'tgl_dftr' => ['required', 'date'],
            'status' => ['required', 'in:aktif,lulus,tidak_aktif,cuti'],
        ], [
            'kel_id.required' => 'Kelurahan wajib dipilih.',
            'kel_id.exists' => 'Kelurahan yang dipilih tidak valid.',
            'prog_id.required' => 'Program pendidikan wajib dipilih.',
            'prog_id.exists' => 'Program pendidikan yang dipilih tidak valid.',
            'no_induk.required' => 'Nomor induk wajib diisi.',
            'no_induk.unique' => 'Nomor induk sudah digunakan.',
            'nm_lengkap.required' => 'Nama lengkap wajib diisi.',
            'tmp_lhr.required' => 'Tempat lahir wajib diisi.',
            'tgl_lhr.required' => 'Tanggal lahir wajib diisi.',
            'tgl_lhr.date' => 'Tanggal lahir harus berupa tanggal yang valid.',
            'jk.required' => 'Jenis kelamin wajib dipilih.',
            'jk.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',
            'alamat.required' => 'Alamat wajib diisi.',
            'no_tlp.required' => 'Nomor telepon wajib diisi.',
            'email.email' => 'Email harus berupa format email yang valid.',
            'tgl_dftr.required' => 'Tanggal daftar wajib diisi.',
            'tgl_dftr.date' => 'Tanggal daftar harus berupa tanggal yang valid.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
        ]);

        $peserta->update($validated);

        return redirect()->route('admin.peserta.index')
            ->with('success', 'Peserta berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $peserta = Peserta::findOrFail($id);
            $peserta->delete();
            return redirect()->route('admin.peserta.index')
                ->with('success', 'Peserta berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.peserta.index')
                ->with('error', 'Gagal menghapus peserta. Peserta mungkin masih digunakan di data lain.');
        }
    }
}

