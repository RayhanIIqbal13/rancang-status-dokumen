<?php

namespace App\Http\Controllers;

use App\Enums\DocumentStatus;
use App\Http\Requests\StoreDokumenPengajuanRequest;
use App\Models\DokumenPengajuan;
use App\Models\StandarBiaya;
use App\Models\StatusTracking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DokumenPengajuanController extends Controller
{
    /**
     * Display a listing of documents.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = DokumenPengajuan::query()
            ->accessibleBy($user)
            ->with([
                'user:id,name,email,unit,role',
                'latestStatusTracking',
            ])
            ->search($request->query('search'))
            ->withStatus($request->query('status'))
            ->latest();

        $documents = $query->paginate(10)->withQueryString();

        // Calculate statistics for dashboard summary cards
        $statsBase = DokumenPengajuan::query()->accessibleBy($user);

        $stats = [
            'total' => (clone $statsBase)->count(),
            'diajukan' => (clone $statsBase)->where('status_terkini', DocumentStatus::Diajukan->value)->count(),
            'verifikasi' => (clone $statsBase)->whereIn('status_terkini', [
                DocumentStatus::VerifikasiFakultas->value,
                DocumentStatus::MenungguSK->value,
            ])->count(),
            'perlu_revisi' => (clone $statsBase)->where('status_terkini', DocumentStatus::PerluRevisi->value)->count(),
            'disetujui' => (clone $statsBase)->where('status_terkini', DocumentStatus::Disetujui->value)->count(),
            'spj_sakti' => (clone $statsBase)->whereIn('status_terkini', [
                DocumentStatus::SpjDiverifikasi->value,
                DocumentStatus::DiprosesSakti->value,
            ])->count(),
            'dana_cair' => (clone $statsBase)->where('status_terkini', DocumentStatus::DanaCair->value)->count(),
        ];

        return Inertia::render('dokumen/index', [
            'documents' => $documents,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', 'all'),
            ],
            'stats' => $stats,
            'stages' => DocumentStatus::stages(),
        ]);
    }

    /**
     * Show the form for creating a new document submission.
     */
    public function create(): Response
    {
        return Inertia::render('dokumen/create', [
            'budgetTypes' => [
                'BOPTN (Bantuan Operasional PTN)',
                'PNBP Fakultas',
                'RKA-K/L Universitas',
                'Hibah Pengabdian Masyarakat',
                'Dana Riset & Publikasi',
                'Kegiatan Kemahasiswaan',
            ],
        ]);
    }

    /**
     * Store a newly created document and record the initial "Diajukan" status tracking.
     */
    public function store(StoreDokumenPengajuanRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // Generate sequential reference number
        $year = now()->format('Y');
        $countThisYear = DokumenPengajuan::whereYear('created_at', now()->year)->count() + 1;
        $nomorPengajuan = sprintf('PROP/%s/%04d', $year, $countThisYear);

        $filePath = null;
        if ($request->hasFile('file_proposal')) {
            $filePath = $request->file('file_proposal')->store('proposals', 'public');
        }

        $document = DB::transaction(function () use ($user, $validated, $nomorPengajuan, $filePath) {
            $doc = DokumenPengajuan::create([
                'user_id' => $user->id,
                'nomor_pengajuan' => $nomorPengajuan,
                'nama_kegiatan' => $validated['nama_kegiatan'],
                'jenis_anggaran' => $validated['jenis_anggaran'],
                'uraian' => $validated['uraian'],
                'tgl_pelaksanaan' => $validated['tgl_pelaksanaan'],
                'total_usulan' => $validated['total_usulan'],
                'file_proposal' => $filePath,
                'status_terkini' => DocumentStatus::Diajukan,
            ]);

            // Stage 1: Submitted (Diajukan) - Updated by: Sistem (otomatis)
            StatusTracking::create([
                'dokumen_pengajuan_id' => $doc->id,
                'user_id' => null, // Sistem (otomatis)
                'tahap' => DocumentStatus::Diajukan,
                'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
                'catatan' => DocumentStatus::Diajukan->description(),
                'waktu_update' => now(),
            ]);

            return $doc;
        });

        return redirect()->route('dokumen-pengajuan.show', $document)
            ->with('success', 'Dokumen pengajuan berhasil dikirim. Status saat ini: Diajukan (Sistem otomatis).');
    }

    /**
     * Display the specified document, its status tracking timeline, and financial details.
     */
    public function show(DokumenPengajuan $dokumenPengajuan, Request $request): Response
    {
        $this->authorize('view', $dokumenPengajuan);

        $dokumenPengajuan->load([
            'user:id,name,email,unit,nip_nim,role',
            'statusTimeline.user:id,name,role,unit',
            'buktiPengeluarans.standarBiaya',
            'realisasiAnggaran',
        ]);

        $standarBiayaList = StandarBiaya::query()
            ->orderBy('kategori')
            ->orderBy('uraian_belanja')
            ->get();

        $canUpdateStatus = $request->user()->can('updateStatus', $dokumenPengajuan);

        return Inertia::render('dokumen/show', [
            'document' => $dokumenPengajuan,
            'stages' => DocumentStatus::stages(),
            'standarBiayaList' => $standarBiayaList,
            'canUpdateStatus' => $canUpdateStatus,
        ]);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy(DokumenPengajuan $dokumenPengajuan): RedirectResponse
    {
        $this->authorize('delete', $dokumenPengajuan);

        if ($dokumenPengajuan->file_proposal) {
            Storage::disk('public')->delete($dokumenPengajuan->file_proposal);
        }

        $dokumenPengajuan->delete();

        return redirect()->route('dokumen-pengajuan.index')
            ->with('success', 'Dokumen pengajuan berhasil dihapus.');
    }

    /**
     * View/stream the uploaded proposal & RAB document inline in browser.
     */
    public function viewProposal(DokumenPengajuan $dokumenPengajuan)
    {
        $this->authorize('view', $dokumenPengajuan);

        if (! $dokumenPengajuan->file_proposal || ! Storage::disk('public')->exists($dokumenPengajuan->file_proposal)) {
            abort(404, 'Berkas proposal tidak ditemukan.');
        }

        $fullPath = Storage::disk('public')->path($dokumenPengajuan->file_proposal);
        $mime = Storage::disk('public')->mimeType($dokumenPengajuan->file_proposal) ?? 'application/pdf';
        $safeFileName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $dokumenPengajuan->nomor_pengajuan).'_Proposal_RAB.pdf';

        return response()->file($fullPath, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="'.$safeFileName.'"',
        ]);
    }

    /**
     * Download the uploaded proposal & RAB document.
     */
    public function downloadProposal(DokumenPengajuan $dokumenPengajuan)
    {
        $this->authorize('view', $dokumenPengajuan);

        if (! $dokumenPengajuan->file_proposal || ! Storage::disk('public')->exists($dokumenPengajuan->file_proposal)) {
            abort(404, 'Berkas proposal tidak ditemukan.');
        }

        $safeFileName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $dokumenPengajuan->nomor_pengajuan).'_Proposal_RAB.pdf';

        return Storage::disk('public')->download($dokumenPengajuan->file_proposal, $safeFileName);
    }
}
