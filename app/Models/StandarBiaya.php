<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StandarBiaya extends Model
{
    use HasFactory;

    protected $table = 'standar_biayas';

    protected $fillable = [
        'kategori',
        'uraian_belanja',
        'satuan',
        'batas_tarif',
        'tahun',
    ];

    protected $appends = [
        'id_sbm',
    ];

    protected function casts(): array
    {
        return [
            'batas_tarif' => 'decimal:2',
            'tahun' => 'integer',
        ];
    }

    public function getIdSbmAttribute(): int
    {
        return $this->id;
    }

    /**
     * @return HasMany<BuktiPengeluaran, $this>
     */
    public function buktiPengeluarans(): HasMany
    {
        return $this->hasMany(BuktiPengeluaran::class, 'standar_biaya_id');
    }
}
