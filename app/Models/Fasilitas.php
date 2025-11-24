<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Fasilitas extends Model
{
    use HasFactory;

    protected $table = 'fasilitas';

    protected $fillable = [
        'nm_fasilitas',
        'slug',
        'ket',
        'kapasitas',
        'tersedia',
    ];

    protected $casts = [
        'kapasitas' => 'integer',
        'tersedia' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($fasilitas) {
            if (empty($fasilitas->slug)) {
                $fasilitas->slug = Str::slug($fasilitas->nm_fasilitas);
            }
        });

        static::updating(function ($fasilitas) {
            if ($fasilitas->isDirty('nm_fasilitas') && empty($fasilitas->slug)) {
                $fasilitas->slug = Str::slug($fasilitas->nm_fasilitas);
            }
        });
    }
}

