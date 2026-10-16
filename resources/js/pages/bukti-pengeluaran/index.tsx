import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, BuktiPengeluaran, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowUpRight, FileText, Receipt, Scale, Search, ShieldCheck, X } from 'lucide-react';
import React, { useState } from 'react';

interface BuktiIndexProps {
    buktiList: PaginatedData<BuktiPengeluaran>;
    filters: {
        search: string;
        status_validasi: string;
    };
    stats: {
        total_bukti: number;
        total_nominal: number;
        sesuai_sbm: number;
        perlu_verifikasi: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bukti Pengeluaran', href: '/bukti-pengeluaran' },
];

export default function BuktiPengeluaranIndex({ buktiList, filters, stats }: BuktiIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('bukti-pengeluaran.index'), { search: searchTerm, status_validasi: filters.status_validasi }, { preserveState: true });
    };

    const handleStatusFilter = (val: string) => {
        router.get(route('bukti-pengeluaran.index'), { search: filters.search, status_validasi: val }, { preserveState: true });
    };

    const formatCurrency = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bukti Pengeluaran & SPJ - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">Bukti Pengeluaran & Validasi SBM</h1>
                            <span className="border-primary/20 bg-primary/10 text-primary rounded-4xl border px-2 py-0.5 text-[11px] font-medium">
                                SPJ Keuangan
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Arsip kuitansi, faktur belanja, dan rekonsiliasi kesesuaian pagu terhadap Standar Biaya Masukan (SBM) ITK
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <Link href={route('dokumen-pengajuan.index')}>
                                <FileText className="size-3.5" />
                                <span>Daftar Dokumen</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Bukti */}
                    <div className="from-primary/5 to-card ring-foreground/10 overflow-hidden rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs font-medium truncate">Total Bukti SPJ</span>
                            <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                <Receipt className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-foreground text-2xl font-bold tabular-nums tracking-tight">{stats.total_bukti}</span>
                            <span className="text-muted-foreground text-[11px]">kuitansi</span>
                        </div>
                    </div>

                    {/* Total Nominal */}
                    <div className="from-primary/5 to-card ring-foreground/10 overflow-hidden rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs font-medium truncate">Total Nominal Bukti</span>
                            <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                <Scale className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-foreground text-xl sm:text-2xl font-bold tabular-nums tracking-tight truncate block">
                                {formatCurrency(stats.total_nominal)}
                            </span>
                            <p className="text-muted-foreground mt-0.5 text-[11px] truncate">Seluruh kuitansi SPJ</p>
                        </div>
                    </div>

                    {/* Sesuai Standar SBM */}
                    <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-emerald-500/10 p-4 shadow-xs ring-1 ring-emerald-500/30">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 truncate">Sesuai Standar SBM</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight dark:text-emerald-400">
                                {stats.sesuai_sbm}
                            </span>
                            <span className="text-[11px] text-emerald-600/80">valid 100%</span>
                        </div>
                    </div>

                    {/* Perlu Verifikasi */}
                    <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-amber-500/10 p-4 shadow-xs ring-1 ring-amber-500/30">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 truncate">Perlu Verifikasi</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <AlertCircle className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight dark:text-amber-400">
                                {stats.perlu_verifikasi}
                            </span>
                            <span className="text-[11px] text-amber-600/80">dalam review</span>
                        </div>
                    </div>
                </div>

                {/* Main Card with Toolbar & Table */}
                <div className="bg-card overflow-hidden rounded-xl border shadow-2xs">
                    {/* Studio Admin Toolbar */}
                    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari jenis bukti, nomor dokumen, uraian..."
                                className="h-8 pr-8 pl-8 text-xs"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        router.get(
                                            route('bukti-pengeluaran.index'),
                                            { search: '', status_validasi: filters.status_validasi },
                                            { preserveState: true },
                                        );
                                    }}
                                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </form>

                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('all')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status_validasi === 'all' || !filters.status_validasi
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Semua ({stats.total_bukti})
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('Sesuai SBM')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status_validasi === 'Sesuai SBM'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Sesuai SBM
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('Perlu Verifikasi')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status_validasi === 'Perlu Verifikasi'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Perlu Verifikasi
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-thin">
                        <table className="w-full min-w-[720px] text-left text-xs">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-[11px] font-medium tracking-wider uppercase">
                                <tr>
                                    <th className="px-4 py-3">Uraian Bukti SPJ</th>
                                    <th className="px-4 py-3">Terkait Dokumen Pengajuan</th>
                                    <th className="px-4 py-3 text-right">Nominal Kuitansi</th>
                                    <th className="px-4 py-3">Acuan Batas SBM</th>
                                    <th className="px-4 py-3">Status Fisik & Validasi</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {buktiList.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground p-8 text-center">
                                            Tidak ada bukti pengeluaran yang sesuai filter.
                                        </td>
                                    </tr>
                                ) : (
                                    buktiList.data.map((b) => (
                                        <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="text-foreground max-w-xs px-4 py-3.5 font-medium">
                                                <div className="line-clamp-2">{b.jenis_bukti}</div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {b.dokumen_pengajuan ? (
                                                    <div className="space-y-0.5">
                                                        <span className="text-primary font-mono text-xs font-semibold">
                                                            {b.dokumen_pengajuan.nomor_pengajuan}
                                                        </span>
                                                        <p className="text-muted-foreground max-w-xs truncate text-[11px]">
                                                            {b.dokumen_pengajuan.nama_kegiatan}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>

                                            <td className="text-foreground px-4 py-3.5 text-right font-medium tabular-nums">
                                                {formatCurrency(b.nominal)}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {b.standar_biaya ? (
                                                    <div className="space-y-0.5 text-[11px]">
                                                        <p className="text-foreground font-medium">{b.standar_biaya.uraian_belanja}</p>
                                                        <p className="text-muted-foreground">Maks: {formatCurrency(b.standar_biaya.batas_tarif)}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">-</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium">
                                                        {b.status_fisik}
                                                    </span>
                                                    <span
                                                        className={`rounded-4xl px-2 py-0.5 text-[10px] font-medium ${
                                                            b.status_validasi_sbm === 'Sesuai SBM'
                                                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                : 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                                        }`}
                                                    >
                                                        {b.status_validasi_sbm}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5 text-right">
                                                {b.dokumen_pengajuan && (
                                                    <Button asChild size="icon" variant="ghost" className="size-7">
                                                        <Link href={`/dokumen-pengajuan/${b.dokumen_pengajuan.id}`}>
                                                            <ArrowUpRight className="size-3.5" />
                                                        </Link>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {buktiList.links && buktiList.links.length > 3 && (
                        <div className="bg-muted/20 flex items-center justify-between border-t p-3 text-xs">
                            <span className="text-muted-foreground">
                                Halaman {buktiList.current_page} dari {buktiList.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {buktiList.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        asChild={Boolean(link.url)}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        className="h-7 min-w-7 px-2 text-xs"
                                    >
                                        {link.url ? (
                                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
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
