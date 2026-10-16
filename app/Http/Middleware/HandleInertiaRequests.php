<?php

namespace App\Http\Middleware;

use App\Enums\DocumentStatus;
use App\Models\DokumenPengajuan;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => function () use ($request) {
                $user = $request->user();
                if (! $user) {
                    return [];
                }

                $query = DokumenPengajuan::query()
                    ->with(['user:id,name,unit']);

                if ($user->isPengusul()) {
                    $query->where('user_id', $user->id)
                        ->whereIn('status_terkini', [
                            DocumentStatus::Diajukan->value,
                            DocumentStatus::PerluRevisi->value,
                        ]);
                } else {
                    $query->whereIn('status_terkini', [
                        DocumentStatus::Diajukan->value,
                        DocumentStatus::VerifikasiFakultas->value,
                    ]);
                }

                return $query->latest()
                    ->limit(10)
                    ->get()
                    ->map(function ($doc) {
                        $isNew = $doc->status_terkini === DocumentStatus::Diajukan;

                        return [
                            'id' => $doc->id,
                            'type' => $isNew ? 'new_proposal' : 'status_action',
                            'title' => $isNew ? 'Proposal Baru Diajukan' : 'Verifikasi Dibutuhkan',
                            'nomor_pengajuan' => $doc->nomor_pengajuan,
                            'nama_kegiatan' => $doc->nama_kegiatan,
                            'jenis_anggaran' => $doc->jenis_anggaran,
                            'total_usulan' => (float) $doc->total_usulan,
                            'status_terkini' => $doc->status_terkini->value ?? (string) $doc->status_terkini,
                            'user_name' => $doc->user->name ?? 'Pengusul',
                            'user_unit' => $doc->user->unit ?? 'Fakultas',
                            'time_ago' => $doc->created_at ? $doc->created_at->diffForHumans() : 'Baru saja',
                            'created_at' => $doc->created_at ? $doc->created_at->toISOString() : null,
                            'url' => route('status-tracking.show', $doc->id),
                        ];
                    });
            },
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }
}
