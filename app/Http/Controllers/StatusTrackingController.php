<?php

namespace App\Http\Controllers;

use App\Enums\DocumentStatus;
use App\Http\Requests\UpdateStatusTrackingRequest;
use App\Models\DokumenPengajuan;
use App\Models\StatusTracking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StatusTrackingController extends Controller
{
    /**
     * Display a listing of all status tracking audit trail entries and active document tracker.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Accessible documents for selector
        $accessibleDocuments = DokumenPengajuan::query()
            ->accessibleBy($user)
            ->with('user:id,name,unit,nip_nim')
            ->latest('updated_at')
            ->get(['id', 'user_id', 'nomor_pengajuan', 'nama_kegiatan', 'jenis_anggaran', 'total_usulan', 'status_terkini', 'created_at', 'updated_at']);

        // Determine which document to track
        $selectedDocId = $request->query('dokumen_id');
        $activeDocument = null;

        if ($selectedDocId) {
            $activeDocument = DokumenPengajuan::query()
                ->where('id', $selectedDocId)
                ->accessibleBy($user)
                ->with([
                    'user:id,name,unit,nip_nim,email',
                    'statusTrackings' => fn ($q) => $q->with('user:id,name,role,unit')->orderBy('waktu_update', 'asc'),
                    'realisasiAnggaran',
                    'buktiPengeluarans.standarBiaya',
                ])
                ->first();
        }

        if (! $activeDocument && $accessibleDocuments->isNotEmpty()) {
            $firstDoc = $accessibleDocuments->first();
            $activeDocument = DokumenPengajuan::query()
                ->where('id', $firstDoc->id)
                ->with([
                    'user:id,name,unit,nip_nim,email',
                    'statusTrackings' => fn ($q) => $q->with('user:id,name,role,unit')->orderBy('waktu_update', 'asc'),
                    'realisasiAnggaran',
                    'buktiPengeluarans.standarBiaya',
                ])
                ->first();
        }

        // Global / Filtered Audit Trail Query
        $query = StatusTracking::query()
            ->with([
                'user:id,name,role,unit',
                'dokumenPengajuan' => function ($q) {
                    $q->select('id', 'user_id', 'nomor_pengajuan', 'nama_kegiatan', 'jenis_anggaran', 'status_terkini', 'total_usulan')
                        ->with('user:id,name,unit');
                },
            ])
            ->whereHas('dokumenPengajuan', function ($q) use ($user) {
                $q->accessibleBy($user);
            })
            ->latest('waktu_update');

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $query->where('tahap', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('posisi_berkas', 'like', "%{$search}%")
                    ->orWhere('catatan', 'like', "%{$search}%")
                    ->orWhereHas('dokumenPengajuan', function ($docQ) use ($search) {
                        $docQ->where('nomor_pengajuan', 'like', "%{$search}%")
                            ->orWhere('nama_kegiatan', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($uQ) use ($search) {
                        $uQ->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $trackings = $query->paginate(15)->withQueryString();

        return Inertia::render('status-tracking/index', [
            'activeDocument' => $activeDocument,
            'accessibleDocuments' => $accessibleDocuments,
            'trackings' => $trackings,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', 'all'),
                'dokumen_id' => $activeDocument ? (string) $activeDocument->id : '',
            ],
            'stages' => DocumentStatus::stages(),
        ]);
    }

    /**
     * Show tracking for a specific document.
     */
    public function show(DokumenPengajuan $dokumenPengajuan, Request $request): RedirectResponse
    {
        $this->authorize('view', $dokumenPengajuan);

        return redirect()->route('status-tracking.index', ['dokumen_id' => $dokumenPengajuan->id]);
    }

    /**
     * Store a new status tracking entry for a document.
     */
    public function store(DokumenPengajuan $dokumenPengajuan, UpdateStatusTrackingRequest $request): RedirectResponse
    {
        $this->authorize('updateStatus', $dokumenPengajuan);

        $user = $request->user();
        $validated = $request->validated();
        $targetStatus = DocumentStatus::from($validated['tahap']);

        // Check if the user's role is permitted to perform this transition
        if (! $user->role->canTransitionTo($targetStatus)) {
            throw ValidationException::withMessages([
                'tahap' => "Peran Anda ({$user->role->label()}) tidak memiliki wewenang untuk mengubah status menjadi '{$targetStatus->label()}'.",
            ]);
        }

        DB::transaction(function () use ($dokumenPengajuan, $user, $targetStatus, $validated) {
            StatusTracking::create([
                'dokumen_pengajuan_id' => $dokumenPengajuan->id,
                'user_id' => $user->id,
                'tahap' => $targetStatus,
                'posisi_berkas' => $validated['posisi_berkas'],
                'catatan' => $validated['catatan'] ?? null,
                'waktu_update' => now(),
            ]);

            $dokumenPengajuan->update([
                'status_terkini' => $targetStatus,
            ]);
        });

        return back()->with('success', "Status dokumen berhasil diperbarui menjadi: {$targetStatus->label()}.");
    }
}
