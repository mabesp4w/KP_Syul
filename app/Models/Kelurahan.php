<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelurahan extends Model
{
    use HasFactory;

    protected $table = 'kelurahan';

    protected $fillable = [
        'kec_id',
        'nm_kel',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the kecamatan that owns the kelurahan.
     */
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kec_id');
    }
}

