<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenggunaController extends Controller
{
    /**
     * Display a directory of registered system users.
     */
    public function index(Request $request): Response
    {
        $query = User::query()
            ->withCount('dokumenPengajuans')
            ->orderBy('name');

        if ($request->filled('role') && $request->query('role') !== 'all') {
            $query->where('role', $request->query('role'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nip_nim', 'like', "%{$search}%")
                    ->orWhere('unit', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15)->withQueryString();

        $stats = [
            'total_users' => User::count(),
            'total_pengusul' => User::where('role', 'pengusul')->count(),
            'total_staf' => User::where('role', 'staf_keuangan')->count(),
            'total_pimpinan' => User::where('role', 'pimpinan')->count(),
        ];

        return Inertia::render('pengguna/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->query('search', ''),
                'role' => $request->query('role', 'all'),
            ],
            'stats' => $stats,
        ]);
    }
}
