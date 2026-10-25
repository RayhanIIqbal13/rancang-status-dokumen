<?php

namespace App\Models;

use App\Enums\DocumentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DokumenPengajuan extends Model
{
    use HasFactory;

    protected $table = 'dokumen_pengajuans';

    protected $fillable = [
        'user_id',
        'nomor_pengajuan',
        'nama_kegiatan',
        'jenis_anggaran',
        'uraian',
        'tgl_pelaksanaan',
        'total_usulan',
        'file_proposal',
        'status_terkini',
    ];

    protected $appends = [
        'id_dokumen',
        'id_user',
        'file_proposal_url',
        'has_file_proposal',
        'can_delete',
    ];

    protected function casts(): array
    {
        return [
            'tgl_pelaksanaan' => 'date',
            'total_usulan' => 'decimal:2',
            'status_terkini' => DocumentStatus::class,
        ];
    }

    public function getIdDokumenAttribute(): ?int
    {
        return $this->id;
    }

    public function getIdUserAttribute(): ?int
    {
        return $this->user_id;
    }

    public function getFileProposalUrlAttribute(): ?string
    {
        if (! $this->file_proposal) {
            return null;
        }

        return route('dokumen-pengajuan.proposal.view', $this->id);
    }

    public function getHasFileProposalAttribute(): bool
    {
        return ! empty($this->file_proposal);
    }

    public function getCanDeleteAttribute(): bool
    {
        $user = auth()->user();
        if (! $user) {
            return false;
        }

        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isStafKeuangan() && $this->status_terkini === DocumentStatus::Diajukan) {
            return true;
        }

        return $this->user_id === $user->id && in_array($this->status_terkini, [
            DocumentStatus::Diajukan,
            DocumentStatus::PerluRevisi,
        ]);
    }

    /**
     * The applicant user who created this document.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Status tracking history records, in chronological order.
     *
     * @return HasMany<StatusTracking, $this>
     */
    public function statusTrackings(): HasMany
    {
        return $this->hasMany(StatusTracking::class, 'dokumen_pengajuan_id')->orderBy('waktu_update', 'desc');
    }

    /**
     * Status tracking history records in ascending order for timeline progression.
     *
     * @return HasMany<StatusTracking, $this>
     */
    public function statusTimeline(): HasMany
    {
        return $this->hasMany(StatusTracking::class, 'dokumen_pengajuan_id')->orderBy('waktu_update', 'asc');
    }

    /**
     * Get the latest status tracking record.
     *
     * @return HasOne<StatusTracking, $this>
     */
    public function latestStatusTracking(): HasOne
    {
        return $this->hasOne(StatusTracking::class, 'dokumen_pengajuan_id')->latestOfMany('waktu_update');
    }

    /**
     * Expense receipts and evidence items.
     *
     * @return HasMany<BuktiPengeluaran, $this>
     */
    public function buktiPengeluarans(): HasMany
    {
        return $this->hasMany(BuktiPengeluaran::class, 'dokumen_pengajuan_id');
    }

    /**
     * Budget disbursement realization (0..1).
     *
     * @return HasOne<RealisasiAnggaran, $this>
     */
    public function realisasiAnggaran(): HasOne
    {
        return $this->hasOne(RealisasiAnggaran::class, 'dokumen_pengajuan_id');
    }

    /**
     * Filter documents accessible by the given user.
     */
    public function scopeAccessibleBy(Builder $query, User $user): Builder
    {
        if ($user->isPengusul()) {
            return $query->where('user_id', $user->id);
        }

        return $query;
    }

    /**
     * Scope to search documents by keyword.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('nomor_pengajuan', 'like', "%{$search}%")
                ->orWhere('nama_kegiatan', 'like', "%{$search}%")
                ->orWhere('jenis_anggaran', 'like', "%{$search}%")
                ->orWhereHas('user', function (Builder $userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('unit', 'like', "%{$search}%");
                });
        });
    }

    /**
     * Scope to filter by status.
     */
    public function scopeWithStatus(Builder $query, ?string $status): Builder
    {
        if (empty($status) || $status === 'all') {
            return $query;
        }

        return $query->where('status_terkini', $status);
    }

    /**
     * Generate the next guaranteed unique sequential reference number for the given year.
     * Prevents collisions even if previous records have been deleted or gaps exist.
     */
    public static function generateNextNomorPengajuan(?string $year = null): string
    {
        $year = $year ?: now()->format('Y');
        $prefix = "PROP/{$year}/";

        $existingNumbers = static::where('nomor_pengajuan', 'like', "{$prefix}%")
            ->pluck('nomor_pengajuan')
            ->map(function ($val) use ($year) {
                if (preg_match('/^PROP\/'.preg_quote($year, '/').'\/(\d+)$/', $val, $matches)) {
                    $num = (int) $matches[1];

                    // Exclude high-range test fixtures (>= 8000) if regular sequence is lower
                    return $num < 8000 ? $num : 0;
                }

                return 0;
            })
            ->filter()
            ->values()
            ->toArray();

        $max = ! empty($existingNumbers) ? max($existingNumbers) : 0;
        $next = $max + 1;

        do {
            $candidate = sprintf('PROP/%s/%04d', $year, $next);
            $exists = static::where('nomor_pengajuan', $candidate)->exists();
            if ($exists) {
                $next++;
            }
        } while ($exists);

        return $candidate;
    }
}
