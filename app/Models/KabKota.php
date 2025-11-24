<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KabKota extends Model
{
    use HasFactory;

    protected $table = 'kab_kota';

    protected $fillable = [
        'prov_id',
        'nm_kab',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the provinsi that owns the kabupaten/kota.
     */
    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'prov_id');
    }

    /**
     * Get the kecamatan for the kabupaten/kota.
     */
    public function kecamatan()
    {
        return $this->hasMany(Kecamatan::class, 'kab_id');
    }
}

