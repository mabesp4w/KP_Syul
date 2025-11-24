<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ProgramPendidikan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramPendidikanController extends Controller
{
    /**
     * Display a listing of active program pendidikan.
     */
    public function index(Request $request)
    {
        $query = ProgramPendidikan::where('is_active', true);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nm_prog', 'like', '%' . $request->search . '%')
                    ->orWhere('desk', 'like', '%' . $request->search . '%')
                    ->orWhere('kat', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by kategori
        if ($request->has('kat') && $request->kat) {
            $query->where('kat', $request->kat);
        }

        // Pagination
        $programPendidikan = $query->orderBy('nm_prog', 'asc')->paginate(9)->withQueryString();

        // Get categories for filter
        $kategori = ProgramPendidikan::where('is_active', true)
            ->distinct()
            ->orderBy('kat', 'asc')
            ->pluck('kat');

        return Inertia::render('User/ProgramPendidikan/Index', [
            'programPendidikan' => $programPendidikan,
            'kategori' => $kategori,
            'filters' => $request->only(['search', 'kat']),
        ]);
    }

    /**
     * Display the specified program pendidikan.
     */
    public function show(ProgramPendidikan $programPendidikan)
    {
        // Ensure program is active
        if (!$programPendidikan->is_active) {
            abort(404);
        }

        // Program terkait (same category, limit 4)
        $programTerkait = ProgramPendidikan::where('is_active', true)
            ->where('kat', $programPendidikan->kat)
            ->where('id', '!=', $programPendidikan->id)
            ->orderBy('nm_prog', 'asc')
            ->limit(4)
            ->get();

        return Inertia::render('User/ProgramPendidikan/Show', [
            'programPendidikan' => $programPendidikan,
            'programTerkait' => $programTerkait,
        ]);
    }
}

