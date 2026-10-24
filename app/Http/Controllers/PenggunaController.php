<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Enum;
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
            'total_pengusul' => User::where('role', UserRole::Pengusul)->count(),
            'total_staf' => User::where('role', UserRole::StafKeuangan)->count(),
            'total_pimpinan' => User::where('role', UserRole::Pimpinan)->count(),
            'total_admin' => User::where('role', UserRole::Admin)->count(),
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

    /**
     * Register a new user in the system.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'nip_nim' => 'nullable|string|max:50',
            'unit' => 'nullable|string|max:255',
            'role' => ['required', new Enum(UserRole::class)],
            'password' => 'nullable|string|min:6|confirmed',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.unique' => 'Email ini sudah terdaftar di sistem.',
            'email.email' => 'Format email tidak valid.',
            'role.required' => 'Peran pengguna wajib dipilih.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nip_nim' => $validated['nip_nim'] ?? null,
            'unit' => $validated['unit'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password'] ?: 'password'),
        ]);

        return redirect()->route('pengguna.index')->with('success', "Pengguna {$user->name} berhasil didaftarkan ke sistem.");
    }

    /**
     * Update an existing user in the system.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$user->id,
            'nip_nim' => 'nullable|string|max:50',
            'unit' => 'nullable|string|max:255',
            'role' => ['required', new Enum(UserRole::class)],
            'password' => 'nullable|string|min:6|confirmed',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.unique' => 'Email ini sudah digunakan oleh pengguna lain.',
            'role.required' => 'Peran pengguna wajib dipilih.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nip_nim' => $validated['nip_nim'] ?? null,
            'unit' => $validated['unit'] ?? null,
            'role' => $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->route('pengguna.index')->with('success', "Data pengguna {$user->name} berhasil diperbarui.");
    }

    /**
     * Remove a user from the system.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->route('pengguna.index')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->route('pengguna.index')->with('success', "Pengguna {$name} berhasil dihapus dari sistem.");
    }
}
