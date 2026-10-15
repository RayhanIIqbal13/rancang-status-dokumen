<?php

namespace App\Services;

use App\Enums\DocumentStatus;
use App\Models\DokumenPengajuan;
use App\Models\StatusTracking;
use App\Models\User;
use Carbon\Carbon;

class DashboardAnalyticsService
{
    /**
     * Generate daily performance overview chart data for the given user.
     *
     * @param User $user
     * @param int $days Number of days to include in the time series (default 90 days = 3 months)
     * @return array<int, array{
     *     date: string,
     *     usulanMasuk: int,
     *     verifikasiSk: int,
     *     pencairanSakti: int,
     *     activityName: string,
     *     amount: float,
     *     formattedAmount: string,
     *     disbursedActivity: string,
     *     disbursedAmount: float,
     *     formattedDisbursedAmount: string,
     *     dailySubmissions: int,
     *     dailyVerifications: int,
     *     dailyPencairans: int
     * }>
     */
    public function getPerformanceChartData(User $user, int $days = 90): array
    {
        $startDate = now()->subDays($days - 1)->startOfDay();
        $endDate = now()->endOfDay();

        // Query accessible documents with details
        $documents = DokumenPengajuan::query()
            ->accessibleBy($user)
            ->where('created_at', '<=', $endDate)
            ->orderBy('created_at', 'asc')
            ->get(['id', 'nama_kegiatan', 'total_usulan', 'status_terkini', 'created_at']);

        // Query tracking events with document details
        $trackings = StatusTracking::query()
            ->whereHas('dokumenPengajuan', fn ($q) => $q->accessibleBy($user))
            ->with('dokumenPengajuan:id,nama_kegiatan,total_usulan,nomor_pengajuan,status_terkini')
            ->where('waktu_update', '<=', $endDate)
            ->orderBy('waktu_update', 'asc')
            ->get(['id', 'dokumen_pengajuan_id', 'tahap', 'waktu_update']);

        // Group by Y-m-d date
        $submissionsByDate = $documents->groupBy(fn ($d) => Carbon::parse($d->created_at)->format('Y-m-d'));

        $verifikasiTrackings = $trackings->filter(fn ($t) => in_array($t->tahap?->value ?? $t->tahap, [
            DocumentStatus::VerifikasiFakultas->value,
            DocumentStatus::MenungguSK->value,
            DocumentStatus::Disetujui->value,
        ]));
        $verificationsByDate = $verifikasiTrackings->groupBy(fn ($t) => Carbon::parse($t->waktu_update)->format('Y-m-d'));

        $pencairanTrackings = $trackings->filter(fn ($t) => in_array($t->tahap?->value ?? $t->tahap, [
            DocumentStatus::DanaCair->value,
        ]));
        $pencairansByDate = $pencairanTrackings->groupBy(fn ($t) => Carbon::parse($t->waktu_update)->format('Y-m-d'));

        // Prior base count before startDate
        $priorUsulan = $documents->filter(fn ($d) => Carbon::parse($d->created_at)->lt($startDate))->count();
        $priorVerifikasi = $verifikasiTrackings->filter(fn ($t) => Carbon::parse($t->waktu_update)->lt($startDate))->count();
        $priorPencairan = $pencairanTrackings->filter(fn ($t) => Carbon::parse($t->waktu_update)->lt($startDate))->count();

        $runningUsulan = max(1, $priorUsulan);
        $runningVerifikasi = max(1, $priorVerifikasi);
        $runningPencairan = max(0, $priorPencairan);

        // Keep track of latest known disbursed and submitted activities
        $lastDisbursedDoc = $pencairanTrackings->filter(fn ($t) => Carbon::parse($t->waktu_update)->lt($startDate))->last()?->dokumenPengajuan;
        $lastSubmittedDoc = $documents->filter(fn ($d) => Carbon::parse($d->created_at)->lt($startDate))->last();

        $dataPoints = [];

        for ($i = 0; $i < $days; $i++) {
            $currentDate = (clone $startDate)->addDays($i)->format('Y-m-d');

            $daySubmissionsList = $submissionsByDate->get($currentDate);
            $daySubmissions = $daySubmissionsList?->count() ?? 0;
            if ($daySubmissionsList && $daySubmissionsList->isNotEmpty()) {
                $lastSubmittedDoc = $daySubmissionsList->last();
            }

            $dayVerificationsList = $verificationsByDate->get($currentDate);
            $dayVerifications = $dayVerificationsList?->count() ?? 0;

            $dayPencairansList = $pencairansByDate->get($currentDate);
            $dayPencairans = $dayPencairansList?->count() ?? 0;
            if ($dayPencairansList && $dayPencairansList->isNotEmpty()) {
                $lastDisbursedDoc = $dayPencairansList->last()?->dokumenPengajuan ?? $lastDisbursedDoc;
            }

            $runningUsulan += $daySubmissions;
            $runningVerifikasi += $dayVerifications;
            $runningPencairan += $dayPencairans;

            $disbursedActivity = $lastDisbursedDoc?->nama_kegiatan ?? 'Pencairan Dana Riset & Operasional SAKTI';
            $disbursedAmount = (float) ($lastDisbursedDoc?->total_usulan ?? 28500000);

            $activityName = $lastSubmittedDoc?->nama_kegiatan ?? $disbursedActivity;
            $amount = (float) ($lastSubmittedDoc?->total_usulan ?? $disbursedAmount);

            $dataPoints[] = [
                'date' => $currentDate,
                'usulanMasuk' => $runningUsulan,
                'verifikasiSk' => $runningVerifikasi,
                'pencairanSakti' => $runningPencairan,
                'activityName' => $activityName,
                'amount' => $amount,
                'formattedAmount' => 'Rp ' . number_format($amount, 0, ',', '.'),
                'disbursedActivity' => $disbursedActivity,
                'disbursedAmount' => $disbursedAmount,
                'formattedDisbursedAmount' => 'Rp ' . number_format($disbursedAmount, 0, ',', '.'),
                'dailySubmissions' => $daySubmissions,
                'dailyVerifications' => $dayVerifications,
                'dailyPencairans' => $dayPencairans,
            ];
        }

        return $dataPoints;
    }
}
