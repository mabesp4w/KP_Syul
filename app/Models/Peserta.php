<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peserta extends Model
{
    use HasFactory;

    protected $table = 'peserta';

    protected $fillable = [
        'kel_id',
        'prog_id',
        'no_induk',
        'nm_lengkap',
        'tmp_lhr',
        'tgl_lhr',
        'jk',
        'alamat',
        'no_tlp',
        'email',
        'nm_wali',
        'tlp_wali',
        'foto',
        'tgl_dftr',
        'status',
    ];

    protected $casts = [
        'tgl_lhr' => 'date',
        'tgl_dftr' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the kelurahan that owns the peserta.
     */
    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'kel_id');
    }

    /**
     * Get the program pendidikan that owns the peserta.
     */
    public function programPendidikan()
    {
        return $this->belongsTo(ProgramPendidikan::class, 'prog_id');
    }
}

