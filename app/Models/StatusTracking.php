<?php

namespace App\Models;

use App\Enums\DocumentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StatusTracking extends Model
{
    use HasFactory;

    protected $table = 'status_trackings';

    protected $fillable = [
        'dokumen_pengajuan_id',
        'user_id',
        'tahap',
        'posisi_berkas',
        'catatan',
        'waktu_update',
    ];

    protected $appends = [
        'id_status',
        'id_dokumen',
        'id_user',
        'updater_name',
        'updater_role',
    ];

    protected function casts(): array
    {
        return [
            'tahap' => DocumentStatus::class,
            'waktu_update' => 'datetime',
        ];
    }

    public function getIdStatusAttribute(): int
    {
        return $this->id;
    }

    public function getIdDokumenAttribute(): int
    {
        return $this->dokumen_pengajuan_id;
    }

    public function getIdUserAttribute(): ?int
    {
        return $this->user_id;
    }

    public function getUpdaterNameAttribute(): string
    {
        if ($this->user) {
            return $this->user->name;
        }

        return 'Sistem (Otomatis)';
    }

    public function getUpdaterRoleAttribute(): string
    {
        if ($this->user && $this->user->role) {
            return $this->user->role->label();
        }

        return 'Sistem';
    }

    /**
     * @return BelongsTo<DokumenPengajuan, $this>
     */
    public function dokumenPengajuan(): BelongsTo
    {
        return $this->belongsTo(DokumenPengajuan::class, 'dokumen_pengajuan_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
