<?php

use App\Enums\DocumentStatus;
use App\Http\Controllers\BuktiPengeluaranController;
use App\Http\Controllers\DokumenPengajuanController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\RealisasiAnggaranController;
use App\Http\Controllers\StandarBiayaController;
use App\Http\Controllers\StatusTrackingController;
use App\Http\Controllers\VerifikasiDokumenController;
use App\Models\DokumenPengajuan;
use App\Models\StandarBiaya;
use App\Services\DashboardAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    // 1. Dashboard SAK ITK
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();
        $query = DokumenPengajuan::query()->accessibleBy($user);

        $recentDocuments = (clone $query)
            ->with(['user:id,name,unit', 'latestStatusTracking'])
            ->latest()
            ->limit(5)
            ->get();

        $actionRequired = (clone $query)
            ->whereIn('status_terkini', [
                DocumentStatus::Diajukan->value,
                DocumentStatus::VerifikasiFakultas->value,
                DocumentStatus::PerluRevisi->value,
            ])
            ->with(['user:id,name,unit', 'latestStatusTracking'])
            ->latest()
            ->limit(5)
            ->get();

        $recentDisbursements = (clone $query)
            ->where('status_terkini', DocumentStatus::DanaCair->value)
            ->with(['user:id,name,unit', 'realisasiAnggaran'])
            ->latest('updated_at')
            ->limit(4)
            ->get();

        $latestDisbursement = (clone $query)
            ->where('status_terkini', DocumentStatus::DanaCair->value)
            ->with(['user:id,name,unit', 'realisasiAnggaran'])
            ->latest('updated_at')
            ->first() ?? (clone $query)->with(['user:id,name,unit'])->latest('updated_at')->first();

        $stats = [
            'total_pengajuan' => (clone $query)->count(),
            'total_nominal' => (float) (clone $query)->sum('total_usulan'),
            'total_cair_nominal' => (float) (clone $query)->where('status_terkini', DocumentStatus::DanaCair->value)->sum('total_usulan'),
            'menunggu_verifikasi' => (clone $query)->whereIn('status_terkini', [
                DocumentStatus::Diajukan->value,
                DocumentStatus::VerifikasiFakultas->value,
            ])->count(),
            'perlu_revisi' => (clone $query)->where('status_terkini', DocumentStatus::PerluRevisi->value)->count(),
            'sedang_diproses' => (clone $query)->whereIn('status_terkini', [
                DocumentStatus::MenungguSK->value,
                DocumentStatus::SpjDiverifikasi->value,
                DocumentStatus::DiprosesSakti->value,
            ])->count(),
            'disetujui' => (clone $query)->where('status_terkini', DocumentStatus::Disetujui->value)->count(),
            'dana_cair' => (clone $query)->where('status_terkini', DocumentStatus::DanaCair->value)->count(),
        ];

        $analyticsService = app(DashboardAnalyticsService::class);
        $performanceChartData = $analyticsService->getPerformanceChartData($user, 90);

        return Inertia::render('dashboard', [
            'recentDocuments' => $recentDocuments,
            'actionRequired' => $actionRequired,
            'recentDisbursements' => $recentDisbursements,
            'latestDisbursement' => $latestDisbursement,
            'stats' => $stats,
            'performanceChartData' => $performanceChartData,
        ]);
    })->name('dashboard');

    // 2. Pengajuan Dokumen
    Route::resource('dokumen-pengajuan', DokumenPengajuanController::class)
        ->parameters(['dokumen-pengajuan' => 'dokumenPengajuan'])
        ->except(['edit', 'update']);

    // Status Tracking update action
    Route::post('dokumen-pengajuan/{dokumenPengajuan}/status', [StatusTrackingController::class, 'store'])
        ->name('dokumen-pengajuan.status.store');

    // Bukti Pengeluaran & Realisasi sub-actions
    Route::post('dokumen-pengajuan/{dokumenPengajuan}/bukti-pengeluaran', [BuktiPengeluaranController::class, 'store'])
        ->name('dokumen-pengajuan.bukti-pengeluaran.store');

    Route::delete('dokumen-pengajuan/{dokumenPengajuan}/bukti-pengeluaran/{buktiPengeluaran}', [BuktiPengeluaranController::class, 'destroy'])
        ->name('dokumen-pengajuan.bukti-pengeluaran.destroy');

    Route::post('dokumen-pengajuan/{dokumenPengajuan}/realisasi-anggaran', [RealisasiAnggaranController::class, 'store'])
        ->name('dokumen-pengajuan.realisasi-anggaran.store');

    // 3. Status Tracking Dedicated Audit Trail Page
    Route::get('status-tracking', [StatusTrackingController::class, 'index'])->name('status-tracking.index');
    Route::get('status-tracking/{dokumenPengajuan}', [StatusTrackingController::class, 'show'])->name('status-tracking.show');

    // 4. Verifikasi Dokumen
    Route::get('verifikasi-dokumen', [VerifikasiDokumenController::class, 'index'])->name('verifikasi-dokumen.index');

    // 5. Realisasi Anggaran
    Route::get('realisasi-anggaran', [RealisasiAnggaranController::class, 'index'])->name('realisasi-anggaran.index');

    // 6. Bukti Pengeluaran
    Route::get('bukti-pengeluaran', [BuktiPengeluaranController::class, 'index'])->name('bukti-pengeluaran.index');

    // 7. Standar Biaya Masukan (SBM)
    Route::get('standar-biaya', [StandarBiayaController::class, 'index'])->name('standar-biaya.index');
    Route::post('standar-biaya', [StandarBiayaController::class, 'store'])->name('standar-biaya.store');

    // 8. Users / Pengguna
    Route::get('pengguna', [PenggunaController::class, 'index'])->name('pengguna.index');

    // 9. Reports / Laporan
    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');

    // 10. Global Search API for Command Palette
    Route::get('api/search', function (Request $request) {
        $q = trim((string) $request->input('q', ''));
        $user = $request->user();

        $documentsQuery = DokumenPengajuan::query()
            ->accessibleBy($user)
            ->with(['user:id,name,unit']);

        if ($q !== '') {
            $documentsQuery->search($q);
        }

        $documents = $documentsQuery->latest()->limit(8)->get([
            'id',
            'nomor_pengajuan',
            'nama_kegiatan',
            'jenis_anggaran',
            'total_usulan',
            'status_terkini',
            'user_id',
        ])->map(function ($doc) {
            return [
                'id' => $doc->id,
                'nomor_pengajuan' => $doc->nomor_pengajuan,
                'nama_kegiatan' => $doc->nama_kegiatan,
                'jenis_anggaran' => $doc->jenis_anggaran,
                'total_usulan' => (float) $doc->total_usulan,
                'status_terkini' => $doc->status_terkini->value ?? (string) $doc->status_terkini,
                'user_name' => $doc->user->name ?? null,
                'url' => route('status-tracking.show', $doc->id),
            ];
        });

        $sbmQuery = StandarBiaya::query();
        if ($q !== '') {
            $sbmQuery->where(function ($sq) use ($q) {
                $sq->where('uraian_belanja', 'like', "%{$q}%")
                    ->orWhere('kategori', 'like', "%{$q}%");
            });
        }
        $sbm = $sbmQuery->orderBy('kategori')->limit(8)->get([
            'id',
            'kategori',
            'uraian_belanja',
            'satuan',
            'batas_tarif',
            'tahun',
        ])->map(function ($item) {
            return [
                'id' => $item->id,
                'kategori' => $item->kategori,
                'uraian_belanja' => $item->uraian_belanja,
                'satuan' => $item->satuan,
                'batas_tarif' => (float) $item->batas_tarif,
                'tahun' => $item->tahun,
                'url' => route('standar-biaya.index'),
            ];
        });

        return response()->json([
            'documents' => $documents,
            'sbm' => $sbm,
        ]);
    })->name('api.search');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
