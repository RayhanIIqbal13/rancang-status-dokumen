<?php

namespace App\Http\Controllers;

use App\Enums\DocumentStatus;
use App\Models\DokumenPengajuan;
use App\Models\StandarBiaya;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerifikasiDokumenController extends Controller
{
    /**
     * Display a verification worklist queue for Finance Staff and Management.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = DokumenPengajuan::query()
            ->with([
                'user:id,name,email,unit,nip_nim',
                'latestStatusTracking',
                'buktiPengeluarans.standarBiaya',
            ])
            ->whereIn('status_terkini', [
                DocumentStatus::Diajukan->value,
                DocumentStatus::VerifikasiFakultas->value,
                DocumentStatus::PerluRevisi->value,
                DocumentStatus::MenungguSK->value,
                DocumentStatus::SpjDiverifikasi->value,
                DocumentStatus::DiprosesSakti->value,
            ])
            ->latest();

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $query->where('status_terkini', $request->query('status'));
        }

        if ($request->filled('search')) {
            $query->search($request->query('search'));
        }

        $documents = $query->paginate(12)->withQueryString();

        $stats = [
            'total_queue' => DokumenPengajuan::whereIn('status_terkini', [
                DocumentStatus::Diajukan->value,
                DocumentStatus::VerifikasiFakultas->value,
                DocumentStatus::PerluRevisi->value,
                DocumentStatus::MenungguSK->value,
                DocumentStatus::SpjDiverifikasi->value,
                DocumentStatus::DiprosesSakti->value,
            ])->count(),
            'menunggu_verifikasi' => DokumenPengajuan::where('status_terkini', DocumentStatus::VerifikasiFakultas->value)->count(),
            'perlu_revisi' => DokumenPengajuan::where('status_terkini', DocumentStatus::PerluRevisi->value)->count(),
            'menunggu_sk' => DokumenPengajuan::where('status_terkini', DocumentStatus::MenungguSK->value)->count(),
            'spj_masuk' => DokumenPengajuan::where('status_terkini', DocumentStatus::SpjDiverifikasi->value)->count(),
        ];

        return Inertia::render('verifikasi/index', [
            'documents' => $documents,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', 'all'),
            ],
            'stats' => $stats,
            'stages' => DocumentStatus::stages(),
            'standarBiayaList' => StandarBiaya::orderBy('kategori')->get(),
        ]);
    }
}
