<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProgramPendidikan extends Model
{
    use HasFactory;

    protected $table = 'program_pendidikan';

    protected $fillable = [
        'nm_prog',
        'slug',
        'kat',
        'desk',
        'tgt_pst',
        'durasi',
        'biaya',
        'is_active',
    ];

    protected $casts = [
        'biaya' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($program) {
            if (empty($program->slug)) {
                $program->slug = Str::slug($program->nm_prog);
            }
        });

        static::updating(function ($program) {
            if ($program->isDirty('nm_prog') && empty($program->slug)) {
                $program->slug = Str::slug($program->nm_prog);
            }
        });
    }

    /**
     * Get the peserta for the program pendidikan.
     */
    // public function peserta()
    // {
    //     return $this->hasMany(Peserta::class, 'prog_id');
    // }
}

