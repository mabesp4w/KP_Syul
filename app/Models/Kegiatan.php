<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Kegiatan extends Model
{
    use HasFactory;

    protected $table = 'kegiatan';

    protected $fillable = [
        'kel_id',
        'nm_kegiatan',
        'slug',
        'tgl_kegiatan',
        'jam_mulai',
        'jam_seles',
        'ket',
        'jenis',
        'status',
    ];

    protected $casts = [
        'tgl_kegiatan' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($kegiatan) {
            if (empty($kegiatan->slug)) {
                $kegiatan->slug = Str::slug($kegiatan->nm_kegiatan);
            }
        });

        static::updating(function ($kegiatan) {
            if ($kegiatan->isDirty('nm_kegiatan') && empty($kegiatan->slug)) {
                $kegiatan->slug = Str::slug($kegiatan->nm_kegiatan);
            }
        });
    }

    /**
     * Get the kelurahan that owns the kegiatan.
     */
    public function kelurahan()
    {
        return $this->belongsTo(Kelurahan::class, 'kel_id');
    }
}

