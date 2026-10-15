<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBuktiPengeluaranRequest;
use App\Models\BuktiPengeluaran;
use App\Models\DokumenPengajuan;
use App\Models\StandarBiaya;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BuktiPengeluaranController extends Controller
{
    /**
     * Display a listing of expenditure receipts across applications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = BuktiPengeluaran::query()
            ->with([
                'standarBiaya',
                'dokumenPengajuan' => function ($q) {
                    $q->select('id', 'user_id', 'nomor_pengajuan', 'nama_kegiatan', 'status_terkini')
                        ->with('user:id,name,unit');
                },
            ])
            ->whereHas('dokumenPengajuan', function ($q) use ($user) {
                $q->accessibleBy($user);
            })
            ->latest();

        if ($request->filled('status_validasi') && $request->query('status_validasi') !== 'all') {
            $query->where('status_validasi_sbm', $request->query('status_validasi'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('jenis_bukti', 'like', "%{$search}%")
                    ->orWhereHas('dokumenPengajuan', function ($docQ) use ($search) {
                        $docQ->where('nomor_pengajuan', 'like', "%{$search}%")
                            ->orWhere('nama_kegiatan', 'like', "%{$search}%");
                    });
            });
        }

        $buktiList = $query->paginate(15)->withQueryString();

        $stats = [
            'total_bukti' => BuktiPengeluaran::whereHas('dokumenPengajuan', fn ($q) => $q->accessibleBy($user))->count(),
            'total_nominal' => (float) BuktiPengeluaran::whereHas('dokumenPengajuan', fn ($q) => $q->accessibleBy($user))->sum('nominal'),
            'sesuai_sbm' => BuktiPengeluaran::whereHas('dokumenPengajuan', fn ($q) => $q->accessibleBy($user))->where('status_validasi_sbm', 'Sesuai SBM')->count(),
            'perlu_verifikasi' => BuktiPengeluaran::whereHas('dokumenPengajuan', fn ($q) => $q->accessibleBy($user))->where('status_validasi_sbm', 'Perlu Verifikasi')->count(),
        ];

        return Inertia::render('bukti-pengeluaran/index', [
            'buktiList' => $buktiList,
            'filters' => [
                'search' => $request->query('search', ''),
                'status_validasi' => $request->query('status_validasi', 'all'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Store a new proof of expenditure / SPJ receipt item.
     */
    public function store(DokumenPengajuan $dokumenPengajuan, StoreBuktiPengeluaranRequest $request): RedirectResponse
    {
        $this->authorize('view', $dokumenPengajuan);

        $validated = $request->validated();

        $filePath = null;
        if ($request->hasFile('file_digital')) {
            $filePath = $request->file('file_digital')->store('bukti_pengeluaran', 'public');
        }

        // Automatic SBM compliance validation check if SBM standard is linked
        $validasiSbm = $validated['status_validasi_sbm'] ?? 'Belum Divalidasi';
        if (! empty($validated['standar_biaya_id'])) {
            $sbm = StandarBiaya::find($validated['standar_biaya_id']);
            if ($sbm) {
                if ((float) $validated['nominal'] <= (float) $sbm->batas_tarif) {
                    $validasiSbm = 'Sesuai SBM';
                } else {
                    $validasiSbm = 'Melebihi SBM';
                }
            }
        }

        BuktiPengeluaran::create([
            'dokumen_pengajuan_id' => $dokumenPengajuan->id,
            'standar_biaya_id' => $validated['standar_biaya_id'] ?? null,
            'jenis_bukti' => $validated['jenis_bukti'],
            'nominal' => $validated['nominal'],
            'file_digital' => $filePath,
            'status_fisik' => $validated['status_fisik'] ?? 'Lengkap & Asli',
            'status_validasi_sbm' => $validasiSbm,
        ]);

        return back()->with('success', 'Bukti pengeluaran SPJ berhasil ditambahkan.');
    }

    /**
     * Remove the specified expense item.
     */
    public function destroy(DokumenPengajuan $dokumenPengajuan, BuktiPengeluaran $buktiPengeluaran): RedirectResponse
    {
        $this->authorize('view', $dokumenPengajuan);

        if ($buktiPengeluaran->file_digital) {
            Storage::disk('public')->delete($buktiPengeluaran->file_digital);
        }

        $buktiPengeluaran->delete();

        return back()->with('success', 'Bukti pengeluaran berhasil dihapus.');
    }
}
