<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    use HasFactory;

    protected $table = 'galeri';

    protected $fillable = [
        'judul',
        'desk',
        'nm_file',
        'gambar',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the judul attribute.
     * Convert null to empty string.
     */
    public function getJudulAttribute($value)
    {
        return $value === null || $value === 'null' ? '' : $value;
    }

    /**
     * Get the kegiatan that belong to the galeri.
     */
    public function kegiatan()
    {
        return $this->belongsToMany(Kegiatan::class, 'galeri_kegiatan', 'galeri_id', 'kegiatan_id')
            ->withTimestamps();
    }

    /**
     * Get the fasilitas that belong to the galeri.
     */
    public function fasilitas()
    {
        return $this->belongsToMany(Fasilitas::class, 'galeri_fasilitas', 'galeri_id', 'fasilitas_id')
            ->withTimestamps();
    }
}

