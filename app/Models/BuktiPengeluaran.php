<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuktiPengeluaran extends Model
{
    use HasFactory;

    protected $table = 'bukti_pengeluarans';

    protected $fillable = [
        'dokumen_pengajuan_id',
        'standar_biaya_id',
        'jenis_bukti',
        'nominal',
        'file_digital',
        'status_fisik',
        'status_validasi_sbm',
    ];

    protected $appends = [
        'id_bukti',
        'id_dokumen',
        'id_sbm',
    ];

    protected function casts(): array
    {
        return [
            'nominal' => 'decimal:2',
        ];
    }

    public function getIdBuktiAttribute(): int
    {
        return $this->id;
    }

    public function getIdDokumenAttribute(): int
    {
        return $this->dokumen_pengajuan_id;
    }

    public function getIdSbmAttribute(): ?int
    {
        return $this->standar_biaya_id;
    }

    /**
     * @return BelongsTo<DokumenPengajuan, $this>
     */
    public function dokumenPengajuan(): BelongsTo
    {
        return $this->belongsTo(DokumenPengajuan::class, 'dokumen_pengajuan_id');
    }

    /**
     * @return BelongsTo<StandarBiaya, $this>
     */
    public function standarBiaya(): BelongsTo
    {
        return $this->belongsTo(StandarBiaya::class, 'standar_biaya_id');
    }
}
