<?php

namespace App\Http\Controllers;

use App\Enums\DocumentStatus;
use App\Models\DokumenPengajuan;
use App\Models\RealisasiAnggaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Display financial service and document status tracking reports.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // 1. Overview aggregates
        $totalUsulan = (float) DokumenPengajuan::accessibleBy($user)->sum('total_usulan');
        $totalRealisasi = (float) RealisasiAnggaran::whereHas('dokumenPengajuan', fn ($q) => $q->accessibleBy($user))->sum('total_realisasi');
        $totalDokumen = DokumenPengajuan::accessibleBy($user)->count();

        // 2. Breakdown by budget type
        $anggaranByType = DokumenPengajuan::accessibleBy($user)
            ->select('jenis_anggaran', DB::raw('count(*) as count'), DB::raw('sum(total_usulan) as total_usulan'))
            ->groupBy('jenis_anggaran')
            ->orderByDesc('total_usulan')
            ->get();

        // 3. Status distribution
        $statusDistribution = [];
        foreach (DocumentStatus::cases() as $status) {
            $count = DokumenPengajuan::accessibleBy($user)->where('status_terkini', $status->value)->count();
            $percentage = $totalDokumen > 0 ? round(($count / $totalDokumen) * 100, 1) : 0;
            $statusDistribution[] = [
                'status' => $status->value,
                'label' => $status->label(),
                'color' => $status->color(),
                'count' => $count,
                'percentage' => $percentage,
            ];
        }

        // 4. Recent completed disbursements
        $recentDisbursed = DokumenPengajuan::accessibleBy($user)
            ->where('status_terkini', DocumentStatus::DanaCair->value)
            ->with(['user:id,name,unit', 'realisasiAnggaran'])
            ->latest('updated_at')
            ->limit(5)
            ->get();

        return Inertia::render('laporan/index', [
            'summary' => [
                'total_dokumen' => $totalDokumen,
                'total_usulan' => $totalUsulan,
                'total_realisasi' => $totalRealisasi,
                'serapan_persen' => $totalUsulan > 0 ? round(($totalRealisasi / $totalUsulan) * 100, 1) : 0,
            ],
            'anggaranByType' => $anggaranByType,
            'statusDistribution' => $statusDistribution,
            'recentDisbursed' => $recentDisbursed,
        ]);
    }
}
