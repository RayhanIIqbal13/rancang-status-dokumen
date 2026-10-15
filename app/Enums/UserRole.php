<?php

namespace App\Enums;

enum UserRole: string
{
    case Pengusul = 'pengusul';
    case StafKeuangan = 'staf_keuangan';
    case Pimpinan = 'pimpinan';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Pengusul => 'Pengusul / Pemohon',
            self::StafKeuangan => 'Staf Keuangan Fakultas',
            self::Pimpinan => 'Pimpinan / Dekan',
            self::Admin => 'Administrator Sistem',
        };
    }

    /**
     * Determine if this role can transition a document to the given status.
     */
    public function canTransitionTo(DocumentStatus $status): bool
    {
        if ($this === self::Admin) {
            return true;
        }

        return match ($status) {
            DocumentStatus::Diajukan => true, // Initial system status or resubmission
            DocumentStatus::VerifikasiFakultas => in_array($this, [self::StafKeuangan, self::Pengusul]), // Staff can verify; applicant can resubmit revision
            DocumentStatus::PerluRevisi => $this === self::StafKeuangan,
            DocumentStatus::MenungguSK => $this === self::StafKeuangan,
            DocumentStatus::Disetujui => in_array($this, [self::Pimpinan, self::StafKeuangan]),
            DocumentStatus::SpjDiverifikasi => $this === self::StafKeuangan,
            DocumentStatus::DiprosesSakti => $this === self::StafKeuangan,
            DocumentStatus::DanaCair => $this === self::StafKeuangan,
        };
    }
}
