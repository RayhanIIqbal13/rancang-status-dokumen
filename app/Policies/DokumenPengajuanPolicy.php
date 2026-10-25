<?php

namespace App\Policies;

use App\Enums\DocumentStatus;
use App\Models\DokumenPengajuan;
use App\Models\User;

class DokumenPengajuanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, DokumenPengajuan $dokumenPengajuan): bool
    {
        if ($user->isAdmin() || $user->isStafKeuangan() || $user->isPimpinan()) {
            return true;
        }

        return $dokumenPengajuan->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DokumenPengajuan $dokumenPengajuan): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Applicant can edit proposal details when freshly submitted or marked as revision required
        if ($dokumenPengajuan->user_id === $user->id) {
            return in_array($dokumenPengajuan->status_terkini, [
                DocumentStatus::Diajukan,
                DocumentStatus::PerluRevisi,
            ]);
        }

        return false;
    }

    /**
     * Determine whether the user can update status for this model.
     */
    public function updateStatus(User $user, DokumenPengajuan $dokumenPengajuan): bool
    {
        if ($user->isAdmin() || $user->isStafKeuangan() || $user->isPimpinan()) {
            return true;
        }

        // Applicant can only update status when resubmitting a revised document
        if ($dokumenPengajuan->user_id === $user->id && $dokumenPengajuan->status_terkini === DocumentStatus::PerluRevisi) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DokumenPengajuan $dokumenPengajuan): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Tendik (Staf Keuangan) can delete/cancel a document when in initial submitted stage (Diajukan)
        if ($user->isStafKeuangan() && $dokumenPengajuan->status_terkini === DocumentStatus::Diajukan) {
            return true;
        }

        return $dokumenPengajuan->user_id === $user->id && in_array($dokumenPengajuan->status_terkini, [
            DocumentStatus::Diajukan,
            DocumentStatus::PerluRevisi,
        ]);
    }
}
