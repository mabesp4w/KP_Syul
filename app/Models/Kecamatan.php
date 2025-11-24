<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    use HasFactory;

    protected $table = 'kecamatan';

    protected $fillable = [
        'kab_id',
        'nm_kec',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the kabupaten/kota that owns the kecamatan.
     */
    public function kabKota()
    {
        return $this->belongsTo(KabKota::class, 'kab_id');
    }

    /**
     * Get the kelurahan for the kecamatan.
     */
    public function kelurahan()
    {
        return $this->hasMany(Kelurahan::class, 'kec_id');
    }
}

