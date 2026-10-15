<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RealisasiAnggaran extends Model
{
    use HasFactory;

    protected $table = 'realisasi_anggarans';

    protected $fillable = [
        'dokumen_pengajuan_id',
        'total_realisasi',
        'tgl_pencairan',
        'status_pencairan',
        'draf_rekap_spj',
    ];

    protected $appends = [
        'id_realisasi',
        'id_dokumen',
    ];

    protected function casts(): array
    {
        return [
            'total_realisasi' => 'decimal:2',
            'tgl_pencairan' => 'date',
        ];
    }

    public function getIdRealisasiAttribute(): int
    {
        return $this->id;
    }

    public function getIdDokumenAttribute(): int
    {
        return $this->dokumen_pengajuan_id;
    }

    /**
     * @return BelongsTo<DokumenPengajuan, $this>
     */
    public function dokumenPengajuan(): BelongsTo
    {
        return $this->belongsTo(DokumenPengajuan::class, 'dokumen_pengajuan_id');
    }
}
