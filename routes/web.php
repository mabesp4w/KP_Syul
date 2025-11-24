<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public/User Routes
Route::get('/', [\App\Http\Controllers\User\HomeController::class, 'index'])->name('home');

// Berita Routes (Public)
Route::get('/berita', [\App\Http\Controllers\User\BeritaController::class, 'index'])->name('berita.index');
Route::get('/berita/{berita:slug}', [\App\Http\Controllers\User\BeritaController::class, 'show'])->name('berita.show');

// Galeri Routes (Public)
Route::get('/galeri', [\App\Http\Controllers\User\GaleriController::class, 'index'])->name('galeri.index');

// Kegiatan Routes (Public)
Route::get('/kegiatan', [\App\Http\Controllers\User\KegiatanController::class, 'index'])->name('kegiatan.index');
Route::get('/kegiatan/{kegiatan:slug}', [\App\Http\Controllers\User\KegiatanController::class, 'show'])->name('kegiatan.show');

// Program Pendidikan Routes (Public)
Route::get('/program-pendidikan', [\App\Http\Controllers\User\ProgramPendidikanController::class, 'index'])->name('program-pendidikan.index');
Route::get('/program-pendidikan/{programPendidikan:slug}', [\App\Http\Controllers\User\ProgramPendidikanController::class, 'show'])->name('program-pendidikan.show');

// Formulir Routes (Public)
Route::get('/formulir', [\App\Http\Controllers\User\FormulirController::class, 'index'])->name('formulir.index');
Route::get('/formulir/download', [\App\Http\Controllers\User\FormulirController::class, 'download'])->name('formulir.download');


// Admin Routes - Hanya bisa diakses oleh admin
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Provinsi Routes
    Route::get('/provinsi', [\App\Http\Controllers\Admin\ProvinsiController::class, 'index'])->name('provinsi.index');
    Route::post('/provinsi', [\App\Http\Controllers\Admin\ProvinsiController::class, 'store'])->name('provinsi.store');
    Route::patch('/provinsi/{id}', [\App\Http\Controllers\Admin\ProvinsiController::class, 'update'])->name('provinsi.update');
    Route::delete('/provinsi/{id}', [\App\Http\Controllers\Admin\ProvinsiController::class, 'destroy'])->name('provinsi.destroy');

    // Kabupaten/Kota Routes
    Route::get('/kab-kota', [\App\Http\Controllers\Admin\KabKotaController::class, 'index'])->name('kab-kota.index');
    Route::post('/kab-kota', [\App\Http\Controllers\Admin\KabKotaController::class, 'store'])->name('kab-kota.store');
    Route::patch('/kab-kota/{id}', [\App\Http\Controllers\Admin\KabKotaController::class, 'update'])->name('kab-kota.update');
    Route::delete('/kab-kota/{id}', [\App\Http\Controllers\Admin\KabKotaController::class, 'destroy'])->name('kab-kota.destroy');

    // Kecamatan Routes
    Route::get('/kecamatan', [\App\Http\Controllers\Admin\KecamatanController::class, 'index'])->name('kecamatan.index');
    Route::post('/kecamatan', [\App\Http\Controllers\Admin\KecamatanController::class, 'store'])->name('kecamatan.store');
    Route::patch('/kecamatan/{id}', [\App\Http\Controllers\Admin\KecamatanController::class, 'update'])->name('kecamatan.update');
    Route::delete('/kecamatan/{id}', [\App\Http\Controllers\Admin\KecamatanController::class, 'destroy'])->name('kecamatan.destroy');

    // Kelurahan Routes
    Route::get('/kelurahan', [\App\Http\Controllers\Admin\KelurahanController::class, 'index'])->name('kelurahan.index');
    Route::post('/kelurahan', [\App\Http\Controllers\Admin\KelurahanController::class, 'store'])->name('kelurahan.store');
    Route::patch('/kelurahan/{id}', [\App\Http\Controllers\Admin\KelurahanController::class, 'update'])->name('kelurahan.update');
    Route::delete('/kelurahan/{id}', [\App\Http\Controllers\Admin\KelurahanController::class, 'destroy'])->name('kelurahan.destroy');

    // Program Pendidikan Routes
    Route::get('/program-pendidikan', [\App\Http\Controllers\Admin\ProgramPendidikanController::class, 'index'])->name('program-pendidikan.index');
    Route::post('/program-pendidikan', [\App\Http\Controllers\Admin\ProgramPendidikanController::class, 'store'])->name('program-pendidikan.store');
    Route::patch('/program-pendidikan/{id}', [\App\Http\Controllers\Admin\ProgramPendidikanController::class, 'update'])->name('program-pendidikan.update');
    Route::delete('/program-pendidikan/{id}', [\App\Http\Controllers\Admin\ProgramPendidikanController::class, 'destroy'])->name('program-pendidikan.destroy');

    // Peserta Routes
    Route::get('/peserta', [\App\Http\Controllers\Admin\PesertaController::class, 'index'])->name('peserta.index');
    Route::post('/peserta', [\App\Http\Controllers\Admin\PesertaController::class, 'store'])->name('peserta.store');
    Route::patch('/peserta/{id}', [\App\Http\Controllers\Admin\PesertaController::class, 'update'])->name('peserta.update');
    Route::delete('/peserta/{id}', [\App\Http\Controllers\Admin\PesertaController::class, 'destroy'])->name('peserta.destroy');

    // Kegiatan Routes
    Route::get('/kegiatan', [\App\Http\Controllers\Admin\KegiatanController::class, 'index'])->name('kegiatan.index');
    Route::post('/kegiatan', [\App\Http\Controllers\Admin\KegiatanController::class, 'store'])->name('kegiatan.store');
    Route::patch('/kegiatan/{id}', [\App\Http\Controllers\Admin\KegiatanController::class, 'update'])->name('kegiatan.update');
    Route::delete('/kegiatan/{id}', [\App\Http\Controllers\Admin\KegiatanController::class, 'destroy'])->name('kegiatan.destroy');

    // Fasilitas Routes
    Route::get('/fasilitas', [\App\Http\Controllers\Admin\FasilitasController::class, 'index'])->name('fasilitas.index');
    Route::post('/fasilitas', [\App\Http\Controllers\Admin\FasilitasController::class, 'store'])->name('fasilitas.store');
    Route::patch('/fasilitas/{id}', [\App\Http\Controllers\Admin\FasilitasController::class, 'update'])->name('fasilitas.update');
    Route::delete('/fasilitas/{id}', [\App\Http\Controllers\Admin\FasilitasController::class, 'destroy'])->name('fasilitas.destroy');

    // Berita Routes
    Route::get('/berita', [\App\Http\Controllers\Admin\BeritaController::class, 'index'])->name('berita.index');
    Route::post('/berita', [\App\Http\Controllers\Admin\BeritaController::class, 'store'])->name('berita.store');
    Route::patch('/berita/{id}', [\App\Http\Controllers\Admin\BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{id}', [\App\Http\Controllers\Admin\BeritaController::class, 'destroy'])->name('berita.destroy');

    // Galeri Routes
    Route::get('/galeri', [\App\Http\Controllers\Admin\GaleriController::class, 'index'])->name('galeri.index');
    Route::post('/galeri', [\App\Http\Controllers\Admin\GaleriController::class, 'store'])->name('galeri.store');
    Route::patch('/galeri/{id}', [\App\Http\Controllers\Admin\GaleriController::class, 'update'])->name('galeri.update');
    Route::delete('/galeri/{id}', [\App\Http\Controllers\Admin\GaleriController::class, 'destroy'])->name('galeri.destroy');
});

// Petugas Routes - Hanya bisa diakses oleh petugas
Route::middleware(['auth', 'verified', 'role:petugas'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Petugas/Dashboard');
    })->name('dashboard');
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__ . '/auth.php';
