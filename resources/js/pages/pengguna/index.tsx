import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    CheckCircle2,
    FileText,
    GraduationCap,
    Info,
    Mail,
    Search,
    Shield,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface UserWithCount extends User {
    dokumen_pengajuans_count?: number;
}

interface PenggunaIndexProps {
    users: PaginatedData<UserWithCount>;
    filters: {
        search: string;
        role: string;
    };
    stats: {
        total_users: number;
        total_pengusul: number;
        total_staf: number;
        total_pimpinan: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daftar Pengguna', href: '/pengguna' },
];

export default function PenggunaIndex({ users, filters, stats }: PenggunaIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('pengguna.index'),
            { search: searchTerm, role: filters.role },
            { preserveState: true }
        );
    };

    const handleRoleFilter = (role: string) => {
        router.get(
            route('pengguna.index'),
            { search: searchTerm, role },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearchTerm('');
        router.get(route('pengguna.index'));
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'pengusul':
                return (
                    <span className="rounded-4xl border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
                        Pengusul
                    </span>
                );
            case 'staf_keuangan':
                return (
                    <span className="rounded-4xl border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                        Staf Keuangan
                    </span>
                );
            case 'pimpinan':
                return (
                    <span className="rounded-4xl border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Pimpinan / Pejabat
                    </span>
                );
            case 'admin':
                return (
                    <span className="rounded-4xl border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
                        Administrator
                    </span>
                );
            default:
                return (
                    <span className="rounded-4xl border border-muted bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {role}
                    </span>
                );
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Direktori Pengguna Sistem - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                Direktori Pengguna Sistem
                            </h1>
                            <span className="rounded-4xl border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                {stats.total_users} Akun Aktif
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Manajemen peran pengusul kegiatan, verifikator keuangan fakultas, dan otorisator anggaran ITK
                        </p>
                    </div>
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Total Pengguna */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-4 ring-1 ring-foreground/10 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Total Pengguna</span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                <Users className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-medium tabular-nums text-foreground">
                                {stats.total_users}
                            </span>
                            <span className="text-[11px] text-muted-foreground">akun terdaftar</span>
                        </div>
                    </div>

                    {/* Pengusul */}
                    <div className="rounded-xl bg-linear-to-t from-sky-500/10 to-card p-4 ring-1 ring-sky-500/30 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-sky-700 dark:text-sky-400">
                                Pengusul
                            </span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <GraduationCap className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-medium tabular-nums text-sky-700 dark:text-sky-400">
                                {stats.total_pengusul}
                            </span>
                            <span className="text-[11px] text-sky-600/80">Dosen & Tendik</span>
                        </div>
                    </div>

                    {/* Verifikator */}
                    <div className="rounded-xl bg-linear-to-t from-indigo-500/10 to-card p-4 ring-1 ring-indigo-500/30 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                Verifikator Keuangan
                            </span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Briefcase className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-medium tabular-nums text-indigo-700 dark:text-indigo-400">
                                {stats.total_staf}
                            </span>
                            <span className="text-[11px] text-indigo-600/80">Tim SBM & SAKTI</span>
                        </div>
                    </div>

                    {/* Pimpinan */}
                    <div className="rounded-xl bg-linear-to-t from-emerald-500/10 to-card p-4 ring-1 ring-emerald-500/30 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                Pimpinan / Pejabat
                            </span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Shield className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                                {stats.total_pimpinan}
                            </span>
                            <span className="text-[11px] text-emerald-600/80">Otorisator SK</span>
                        </div>
                    </div>
                </div>

                {/* Main Card with Toolbar & Table */}
                <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
                    {/* Studio Admin Toolbar */}
                    <div className="flex flex-col gap-3 p-4 border-b">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, NIP/NIM, email, atau unit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-8 pl-8 pr-8 text-xs"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </form>

                            <div className="text-xs text-muted-foreground">
                                Menampilkan <strong className="text-foreground">{users.data.length}</strong> dari{' '}
                                <strong className="text-foreground">{stats.total_users}</strong> pengguna
                            </div>
                        </div>

                        {/* Role filter buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {[
                                { id: 'all', label: `Semua (${stats.total_users})` },
                                { id: 'pengusul', label: `Pengusul (${stats.total_pengusul})` },
                                { id: 'staf_keuangan', label: `Staf Keuangan (${stats.total_staf})` },
                                { id: 'pimpinan', label: `Pimpinan (${stats.total_pimpinan})` },
                                { id: 'admin', label: 'Admin' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleRoleFilter(tab.id)}
                                    className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                        filters.role === tab.id || (!filters.role && tab.id === 'all')
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b bg-muted/50 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Pengguna</th>
                                    <th className="px-4 py-3">NIP / Identitas</th>
                                    <th className="px-4 py-3">Unit Kerja</th>
                                    <th className="px-4 py-3 text-center">Peran</th>
                                    <th className="px-4 py-3 text-center">Total Usulan</th>
                                    <th className="px-4 py-3 text-right">Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data pengguna yang sesuai pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar className="size-7 rounded-lg border">
                                                        <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                                                            {getInitials(u.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-foreground">{u.name}</p>
                                                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                            <Mail className="size-3" />
                                                            <span>{u.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                                                {u.nip_nim || '-'}
                                            </td>

                                            <td className="px-4 py-3 text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="size-3 text-muted-foreground/70" />
                                                    <span>{u.unit || '-'}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {getRoleBadge(u.role)}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted font-medium tabular-nums">
                                                    <FileText className="size-3 text-muted-foreground" />
                                                    {u.dokumen_pengajuans_count || 0}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-right text-[11px] text-muted-foreground">
                                                {new Date(u.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="flex items-center justify-between p-3 border-t bg-muted/20 text-xs">
                            <span className="text-muted-foreground">
                                Halaman {users.current_page} dari {users.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        asChild={Boolean(link.url)}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        className="h-7 min-w-7 px-2 text-xs"
                                    >
                                        {link.url ? (
                                            <span
                                                onClick={() => router.get(link.url!, {}, { preserveState: true })}
                                                className="cursor-pointer"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
