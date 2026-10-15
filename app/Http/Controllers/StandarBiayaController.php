<?php

namespace App\Http\Controllers;

use App\Models\StandarBiaya;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StandarBiayaController extends Controller
{
    /**
     * Display a listing of Standar Biaya Masukan (SBM).
     */
    public function index(Request $request): Response
    {
        $query = StandarBiaya::query();

        if ($request->filled('kategori') && $request->query('kategori') !== 'all') {
            $query->where('kategori', $request->query('kategori'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where('uraian_belanja', 'like', "%{$search}%");
        }

        $items = $query->orderBy('kategori')->orderBy('uraian_belanja')->paginate(15)->withQueryString();

        $categories = StandarBiaya::select('kategori')->distinct()->pluck('kategori');

        $stats = [
            'total_items' => StandarBiaya::count(),
            'total_kategori' => $categories->count(),
            'tahun_aktif' => 2026,
        ];

        return Inertia::render('standar-biaya/index', [
            'items' => $items,
            'categories' => $categories,
            'filters' => [
                'search' => $request->query('search', ''),
                'kategori' => $request->query('kategori', 'all'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created SBM item.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kategori' => ['required', 'string', 'max:100'],
            'uraian_belanja' => ['required', 'string', 'max:255'],
            'satuan' => ['required', 'string', 'max:50'],
            'batas_tarif' => ['required', 'numeric', 'min:0'],
            'tahun' => ['required', 'integer', 'min:2020', 'max:2030'],
        ]);

        StandarBiaya::create($validated);

        return back()->with('success', 'Standar Biaya Masukan berhasil ditambahkan.');
    }
}
