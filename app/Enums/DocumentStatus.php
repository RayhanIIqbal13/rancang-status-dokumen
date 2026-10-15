<?php

namespace App\Enums;

enum DocumentStatus: string
{
    case Diajukan = 'Diajukan';
    case VerifikasiFakultas = 'Verifikasi Fakultas';
    case PerluRevisi = 'Perlu Revisi';
    case MenungguSK = 'Menunggu SK / Penetapan Universitas';
    case Disetujui = 'Disetujui, Kegiatan Berjalan';
    case SpjDiverifikasi = 'SPJ Diterima & Diverifikasi';
    case DiprosesSakti = 'Diproses di SAKTI';
    case DanaCair = 'Dana Cair';

    /**
     * Get human-readable Indonesian label.
     */
    public function label(): string
    {
        return $this->value;
    }

    /**
     * Order sequence of the workflow stage.
     */
    public function order(): int
    {
        return match ($this) {
            self::Diajukan => 1,
            self::VerifikasiFakultas => 2,
            self::PerluRevisi => 3,
            self::MenungguSK => 4,
            self::Disetujui => 5,
            self::SpjDiverifikasi => 6,
            self::DiprosesSakti => 7,
            self::DanaCair => 8,
        };
    }

    /**
     * Official description per Table 3.2.
     */
    public function description(): string
    {
        return match ($this) {
            self::Diajukan => 'Usulan dan proposal telah dikirim pengusul.',
            self::VerifikasiFakultas => 'Kelengkapan dan kepatuhan SBM sedang diperiksa.',
            self::PerluRevisi => 'Terdapat catatan perbaikan; pengusul menerima notifikasi.',
            self::MenungguSK => 'Berkas diteruskan ke universitas; status diperbarui manual.',
            self::Disetujui => 'SK terbit atau alokasi disetujui; pengusul dapat melaksanakan kegiatan.',
            self::SpjDiverifikasi => 'Bukti digital dan berkas fisik diperiksa.',
            self::DiprosesSakti => 'Data dicatat manual ke SAKTI dan menunggu persetujuan PPK/BPP.',
            self::DanaCair => 'Realisasi pencairan dicatat; siklus selesai.',
        };
    }

    /**
     * Designated actor per Table 3.2.
     */
    public function updatedByDescription(): string
    {
        return match ($this) {
            self::Diajukan => 'Sistem (otomatis)',
            self::VerifikasiFakultas => 'Staf Keuangan',
            self::PerluRevisi => 'Staf Keuangan',
            self::MenungguSK => 'Staf Keuangan',
            self::Disetujui => 'Staf / Pimpinan',
            self::SpjDiverifikasi => 'Staf Keuangan',
            self::DiprosesSakti => 'Staf Keuangan',
            self::DanaCair => 'Staf Keuangan',
        };
    }

    /**
     * Default document holder position for this stage.
     */
    public function defaultPosisiBerkas(): string
    {
        return match ($this) {
            self::Diajukan => 'Subbag Keuangan Fakultas',
            self::VerifikasiFakultas => 'Subbag Keuangan Fakultas',
            self::PerluRevisi => 'Pengusul',
            self::MenungguSK => 'Biro Perencanaan & Keuangan Universitas',
            self::Disetujui => 'Pelaksana Kegiatan / Pengusul',
            self::SpjDiverifikasi => 'Subbag Keuangan Fakultas',
            self::DiprosesSakti => 'PPK / BPP (Operator SAKTI)',
            self::DanaCair => 'Selesai (Bendahara Pengeluaran)',
        };
    }

    /**
     * Semantic color theme for UI badges and timeline items.
     */
    public function color(): string
    {
        return match ($this) {
            self::Diajukan => 'blue',
            self::VerifikasiFakultas => 'amber',
            self::PerluRevisi => 'rose',
            self::MenungguSK => 'indigo',
            self::Disetujui => 'emerald',
            self::SpjDiverifikasi => 'purple',
            self::DiprosesSakti => 'orange',
            self::DanaCair => 'teal',
        };
    }

    /**
     * Checks if this status is the terminal state.
     */
    public function isCompleted(): bool
    {
        return $this === self::DanaCair;
    }

    /**
     * Checks if this status indicates a revision is required.
     */
    public function isRevision(): bool
    {
        return $this === self::PerluRevisi;
    }

    /**
     * Return list of all stages with metadata for client consumption.
     *
     * @return array<int, array{value: string, label: string, order: int, description: string, updated_by: string, default_posisi: string, color: string}>
     */
    public static function stages(): array
    {
        return array_map(fn (self $status) => [
            'value' => $status->value,
            'label' => $status->label(),
            'order' => $status->order(),
            'description' => $status->description(),
            'updated_by' => $status->updatedByDescription(),
            'default_posisi' => $status->defaultPosisiBerkas(),
            'color' => $status->color(),
        ], self::cases());
    }
}
