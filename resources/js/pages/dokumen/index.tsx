import { StatusBadge } from '@/components/dokumen/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DokumenPengajuan, PaginatedData, StatusStageInfo } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Clock, FileText, Filter, Layers, MapPin, PlusCircle, Search, Wallet, X } from 'lucide-react';
import React, { useState } from 'react';

interface IndexProps {
    documents: PaginatedData<DokumenPengajuan>;
    filters: {
        search: string;
        status: string;
    };
    stats: {
        total: number;
        diajukan: number;
        verifikasi: number;
        perlu_revisi: number;
        disetujui: number;
        spj_sakti: number;
        dana_cair: number;
    };
    stages: StatusStageInfo[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboards', href: '/dashboard' },
    { title: 'Layanan Dokumen', href: '/dokumen-pengajuan' },
    { title: 'Pengajuan Dokumen', href: '/dokumen-pengajuan' },
];

export default function DokumenIndex({ documents, filters, stats, stages: _stages }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('dokumen-pengajuan.index'), { search: searchTerm, status: filters.status }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        router.get(route('dokumen-pengajuan.index'), { search: searchTerm, status }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        router.get(route('dokumen-pengajuan.index'));
    };

    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Dokumen Keuangan — SAK ITK" />

            <div className="@container/main mx-auto flex w-full max-w-screen-2xl flex-col gap-4 p-4 md:gap-6 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-foreground font-heading text-xl font-bold tracking-tight md:text-2xl">Pengajuan Dokumen Keuangan</h1>
                            <Badge variant="outline" className="border-border bg-muted/40 text-xs font-medium">
                                Total: {stats.total}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs md:text-sm">
                            Daftar proposal usulan anggaran, kelengkapan berkas fisik, dan disposisi verifikasi fakultas
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" className="h-8 gap-1.5 rounded-lg text-xs shadow-xs">
                            <Link href="/dokumen-pengajuan/create">
                                <PlusCircle className="size-3.5" />
                                <span>Buat Pengajuan Baru</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* KPI Stat Tiles */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <Card className="border-border/80 rounded-xl border p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[11px] font-medium">Semua Dokumen</span>
                            <FileText className="text-muted-foreground size-3.5" />
                        </div>
                        <div className="text-foreground mt-1 text-xl font-bold tabular-nums">{stats.total}</div>
                    </Card>

                    <Card className="border-border/80 rounded-xl border p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[11px] font-medium">Diajukan</span>
                            <Clock className="size-3.5 text-blue-600" />
                        </div>
                        <div className="text-foreground mt-1 text-xl font-bold tabular-nums">{stats.diajukan}</div>
                    </Card>

                    <Card className="border-border/80 rounded-xl border p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[11px] font-medium">Verifikasi SBM</span>
                            <Layers className="size-3.5 text-amber-600" />
                        </div>
                        <div className="text-foreground mt-1 text-xl font-bold tabular-nums">{stats.verifikasi}</div>
                    </Card>

                    <Card className="border-border/80 rounded-xl border p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-rose-600">Perlu Revisi</span>
                            <AlertTriangle className="size-3.5 text-rose-600" />
                        </div>
                        <div className="mt-1 text-xl font-bold text-rose-600 tabular-nums dark:text-rose-400">{stats.perlu_revisi}</div>
                    </Card>

                    <Card className="border-border/80 rounded-xl border p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[11px] font-medium">Disetujui</span>
                            <CheckCircle2 className="size-3.5 text-teal-600" />
                        </div>
                        <div className="text-foreground mt-1 text-xl font-bold tabular-nums">{stats.disetujui}</div>
                    </Card>

                    <Card className="border-border/80 rounded-xl border p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-emerald-600">Dana Cair</span>
                            <Wallet className="size-3.5 text-emerald-600" />
                        </div>
                        <div className="mt-1 text-xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">{stats.dana_cair}</div>
                    </Card>
                </div>

                {/* Data Table Card matching next-shadcn-admin-dashboard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="leading-none">Berkas Pengajuan Dokumen</CardTitle>
                        <CardDescription>Kelola usulan, cek posisi berkas fisik, dan pantau status realisasi anggaran SBM</CardDescription>
                        <CardAction>
                            <form onSubmit={handleSearch} className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari kegiatan atau pengusul..."
                                        className="border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-8 w-44 rounded-lg border pr-2.5 pl-8 text-xs focus:ring-1 focus:outline-none lg:w-56"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" size="sm" className="h-8 gap-1 text-xs">
                                    <Filter className="size-3" />
                                    Cari
                                </Button>
                                {(filters.search || filters.status !== 'all') && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReset}
                                        className="text-muted-foreground hover:text-foreground h-8 gap-1 text-xs"
                                    >
                                        <X className="size-3" />
                                        Reset
                                    </Button>
                                )}
                            </form>
                        </CardAction>
                    </CardHeader>

                    {/* Filter Pills */}
                    <div className="border-border/60 border-b px-4 pb-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-muted-foreground mr-1 text-[11px]">Filter Status:</span>
                            {[
                                { id: 'all', label: 'Semua' },
                                { id: 'Diajukan', label: 'Diajukan' },
                                { id: 'Verifikasi Fakultas', label: 'Verifikasi' },
                                { id: 'Perlu Revisi', label: 'Perlu Revisi' },
                                { id: 'Disetujui, Kegiatan Berjalan', label: 'Disetujui' },
                                { id: 'Diproses di SAKTI', label: 'SAKTI' },
                                { id: 'Dana Cair', label: 'Dana Cair' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleFilterStatus(tab.id)}
                                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                        filters.status === tab.id
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <CardContent className="pt-0">
                        <div className="border-border/70 overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead>Nomor & Nama Kegiatan</TableHead>
                                        <TableHead>Pengusul / Unit</TableHead>
                                        <TableHead>Sumber Anggaran</TableHead>
                                        <TableHead className="text-right">Total Usulan</TableHead>
                                        <TableHead className="text-center">Status Terkini</TableHead>
                                        <TableHead>Posisi Berkas</TableHead>
                                        <TableHead className="w-24 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-muted-foreground h-28 text-center text-xs">
                                                Tidak ada dokumen pengajuan ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        documents.data.map((doc) => (
                                            <TableRow key={doc.id} className="hover:bg-muted/40 transition-colors">
                                                <TableCell className="max-w-xs">
                                                    <div className="text-primary font-mono text-xs font-bold">{doc.nomor_pengajuan}</div>
                                                    <Link
                                                        href={route('dokumen-pengajuan.show', doc.id)}
                                                        className="text-foreground hover:text-primary mt-0.5 line-clamp-1 block text-xs font-medium transition-colors"
                                                    >
                                                        {doc.nama_kegiatan}
                                                    </Link>
                                                    <span className="text-muted-foreground font-mono text-[10px]">
                                                        Diajukan: {formatDate(doc.created_at)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <div className="text-foreground font-medium">{doc.user?.name || '-'}</div>
                                                    <div className="text-muted-foreground text-[10px]">{doc.user?.unit || '-'}</div>
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <span className="bg-muted text-muted-foreground inline-block rounded px-2 py-0.5 text-[11px] font-medium">
                                                        {doc.jenis_anggaran}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-foreground text-right text-xs font-bold tabular-nums">
                                                    {formatCurrency(doc.total_usulan)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <StatusBadge status={doc.status_terkini} size="sm" />
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <div className="text-foreground flex items-center gap-1 font-medium">
                                                        <MapPin className="text-primary size-3 shrink-0" />
                                                        <span className="max-w-[140px] truncate">
                                                            {doc.latest_status_tracking?.posisi_berkas || 'Subbag Keuangan Fakultas'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button asChild variant="outline" size="sm" className="h-7 rounded-lg px-2.5 text-xs">
                                                            <Link href={route('status-tracking.show', doc.id)}>Lacak</Link>
                                                        </Button>
                                                        <Button asChild size="sm" className="h-7 rounded-lg px-2.5 text-xs">
                                                            <Link href={route('dokumen-pengajuan.show', doc.id)}>Detail</Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                    {/* Pagination Footer */}
                    {documents.links && documents.links.length > 3 && (
                        <div className="border-border/60 bg-muted/20 text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
                            <div>
                                Menampilkan <span className="text-foreground font-medium">{documents.from || 0}</span>-
                                <span className="text-foreground font-medium">{documents.to || 0}</span> dari{' '}
                                <span className="text-foreground font-medium">{documents.total}</span> data
                            </div>
                            <div className="flex gap-1">
                                {documents.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`h-7 min-w-7 rounded-lg px-2 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                                : link.url
                                                  ? 'hover:bg-muted text-foreground'
                                                  : 'text-muted-foreground/40 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
