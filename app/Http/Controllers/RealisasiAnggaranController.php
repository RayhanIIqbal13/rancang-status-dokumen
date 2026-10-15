<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRealisasiAnggaranRequest;
use App\Models\DokumenPengajuan;
use App\Models\RealisasiAnggaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RealisasiAnggaranController extends Controller
{
    /**
     * Display a listing of budget disbursement realizations.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = DokumenPengajuan::query()
            ->accessibleBy($user)
            ->with([
                'user:id,name,unit',
                'realisasiAnggaran',
            ])
            ->whereNotNull('status_terkini')
            ->latest();

        if ($request->filled('search')) {
            $query->search($request->query('search'));
        }

        $documents = $query->paginate(12)->withQueryString();

        $totalUsulan = (float) DokumenPengajuan::accessibleBy($user)->sum('total_usulan');
        $totalRealisasi = (float) RealisasiAnggaran::whereHas('dokumenPengajuan', function ($q) use ($user) {
            $q->accessibleBy($user);
        })->sum('total_realisasi');

        $stats = [
            'total_usulan' => $totalUsulan,
            'total_realisasi' => $totalRealisasi,
            'sisa_anggaran' => max(0, $totalUsulan - $totalRealisasi),
            'serapan_persen' => $totalUsulan > 0 ? round(($totalRealisasi / $totalUsulan) * 100, 1) : 0,
        ];

        return Inertia::render('realisasi/index', [
            'documents' => $documents,
            'filters' => [
                'search' => $request->query('search', ''),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Store or update budget disbursement realization for a document.
     */
    public function store(DokumenPengajuan $dokumenPengajuan, StoreRealisasiAnggaranRequest $request): RedirectResponse
    {
        $this->authorize('view', $dokumenPengajuan);

        $validated = $request->validated();

        RealisasiAnggaran::updateOrCreate(
            ['dokumen_pengajuan_id' => $dokumenPengajuan->id],
            [
                'total_realisasi' => $validated['total_realisasi'],
                'tgl_pencairan' => $validated['tgl_pencairan'] ?? null,
                'status_pencairan' => $validated['status_pencairan'],
                'draf_rekap_spj' => $validated['draf_rekap_spj'] ?? null,
            ]
        );

        return back()->with('success', 'Data realisasi anggaran / pencairan SAKTI berhasil disimpan.');
    }
}
