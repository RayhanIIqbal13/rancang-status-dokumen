import { ProposalPreviewModal } from '@/components/dokumen/proposal-preview-modal';
import { StatusBadge } from '@/components/dokumen/status-badge';
import { StatusUpdateDialog } from '@/components/dokumen/status-update-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DokumenPengajuan, PaginatedData, StandarBiaya, StatusStageInfo } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Building2, Calendar, Eye, FileCheck, FileSearch, Inbox, MapPin, Receipt, Search, Trash2, User, X } from 'lucide-react';
import React, { useState } from 'react';

interface VerifikasiIndexProps {
    documents: PaginatedData<DokumenPengajuan>;
    filters: {
        search: string;
        status: string;
    };
    stats: {
        total_queue: number;
        menunggu_verifikasi: number;
        perlu_revisi: number;
        menunggu_sk: number;
        spj_masuk: number;
    };
    stages: StatusStageInfo[];
    standarBiayaList: StandarBiaya[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Verifikasi Dokumen', href: '/verifikasi-dokumen' },
];

export default function VerifikasiIndex({ documents, filters, stats, stages }: VerifikasiIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [documentToDelete, setDocumentToDelete] = useState<DokumenPengajuan | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!documentToDelete) return;
        router.delete(route('dokumen-pengajuan.destroy', documentToDelete.id), {
            preserveScroll: true,
            onBefore: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setDocumentToDelete(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('verifikasi-dokumen.index'), { search: searchTerm, status: filters.status }, { preserveState: true });
    };

    const handleStatusFilter = (statusVal: string) => {
        router.get(route('verifikasi-dokumen.index'), { search: filters.search, status: statusVal }, { preserveState: true });
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meja Verifikasi Dokumen Keuangan - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                            <h1 className="text-foreground text-lg sm:text-xl font-semibold tracking-tight">Meja Verifikasi Dokumen & SBM</h1>
                            <span className="border-primary/20 bg-primary/10 text-primary inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap">
                                Staf Keuangan
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Pemeriksaan kelengkapan berkas usulan, kepatuhan pagu SBM ITK 2026, dan penetapan status alur
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <Link href={route('standar-biaya.index')}>
                                <FileSearch className="size-3.5" />
                                <span>Katalog SBM</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* All queue */}
                    <div
                        onClick={() => handleStatusFilter('all')}
                        className={`cursor-pointer overflow-hidden rounded-xl p-4 transition-all ${
                            filters.status === 'all' || !filters.status
                                ? 'from-primary/10 to-card ring-primary bg-linear-to-t shadow-xs ring-2'
                                : 'from-primary/5 to-card ring-foreground/10 hover:ring-primary/40 bg-linear-to-t ring-1'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs font-medium truncate">Total Antrean</span>
                            <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                <Inbox className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-foreground text-2xl font-bold tabular-nums tracking-tight">{stats.total_queue}</span>
                            <span className="text-muted-foreground text-[11px]">berkas aktif</span>
                        </div>
                    </div>

                    {/* Menunggu Verifikasi */}
                    <div
                        onClick={() => handleStatusFilter('Verifikasi Fakultas')}
                        className={`cursor-pointer overflow-hidden rounded-xl p-4 transition-all ${
                            filters.status === 'Verifikasi Fakultas'
                                ? 'to-card bg-linear-to-t from-amber-500/10 shadow-xs ring-2 ring-amber-500'
                                : 'from-primary/5 to-card ring-foreground/10 bg-linear-to-t ring-1 hover:ring-amber-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 truncate">Verifikasi Fakultas</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <FileCheck className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-amber-700 tabular-nums tracking-tight dark:text-amber-400">
                                {stats.menunggu_verifikasi}
                            </span>
                            <span className="text-[11px] text-amber-600/80">perlu diperiksa</span>
                        </div>
                    </div>

                    {/* Perlu Revisi */}
                    <div
                        onClick={() => handleStatusFilter('Perlu Revisi')}
                        className={`cursor-pointer overflow-hidden rounded-xl p-4 transition-all ${
                            filters.status === 'Perlu Revisi'
                                ? 'to-card bg-linear-to-t from-rose-500/10 shadow-xs ring-2 ring-rose-500'
                                : 'from-primary/5 to-card ring-foreground/10 bg-linear-to-t ring-1 hover:ring-rose-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-rose-700 dark:text-rose-400 truncate">Perlu Revisi</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-rose-700 tabular-nums tracking-tight dark:text-rose-400">
                                {stats.perlu_revisi}
                            </span>
                            <span className="text-[11px] text-rose-600/80">di pengusul</span>
                        </div>
                    </div>

                    {/* SPJ Masuk */}
                    <div
                        onClick={() => handleStatusFilter('SPJ Diterima & Diverifikasi')}
                        className={`cursor-pointer overflow-hidden rounded-xl p-4 transition-all ${
                            filters.status === 'SPJ Diterima & Diverifikasi'
                                ? 'to-card bg-linear-to-t from-purple-500/10 shadow-xs ring-2 ring-purple-500'
                                : 'from-primary/5 to-card ring-foreground/10 bg-linear-to-t ring-1 hover:ring-purple-500/40'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-purple-700 dark:text-purple-400 truncate">Verifikasi SPJ</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Receipt className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-purple-700 tabular-nums tracking-tight dark:text-purple-400">
                                {stats.spj_masuk}
                            </span>
                            <span className="text-[11px] text-purple-600/80">kuitansi masuk</span>
                        </div>
                    </div>
                </div>

                {/* Main Card with Toolbar & Table */}
                <div className="bg-card overflow-hidden rounded-xl border shadow-2xs">
                    {/* Studio Admin Toolbar */}
                    <div className="flex flex-col gap-3 border-b p-4">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari nomor pengajuan, nama usulan, pengusul..."
                                    className="h-8 pr-8 pl-8 text-xs"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm('');
                                            router.get(
                                                route('verifikasi-dokumen.index'),
                                                { search: '', status: filters.status },
                                                { preserveState: true },
                                            );
                                        }}
                                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </form>

                            <div className="text-muted-foreground text-xs">
                                Menampilkan <strong className="text-foreground">{documents.data.length}</strong> dari{' '}
                                <strong className="text-foreground">{stats.total_queue}</strong> antrean
                            </div>
                        </div>

                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('all')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status === 'all' || !filters.status
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Semua Antrean ({stats.total_queue})
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('Diajukan')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status === 'Diajukan'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Diajukan Baru
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('Verifikasi Fakultas')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status === 'Verifikasi Fakultas'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Verifikasi Fakultas
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('Perlu Revisi')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status === 'Perlu Revisi'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Perlu Revisi
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('Menunggu SK / Penetapan Universitas')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status === 'Menunggu SK / Penetapan Universitas'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Menunggu SK
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusFilter('SPJ Diterima & Diverifikasi')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.status === 'SPJ Diterima & Diverifikasi'
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Verifikasi SPJ
                            </button>
                        </div>
                    </div>

                    {/* Queue Items */}
                    {documents.data.length === 0 ? (
                        <div className="text-muted-foreground p-12 text-center">
                            <div className="bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-lg border">
                                <FileCheck className="size-5" />
                            </div>
                            <h3 className="text-foreground mt-3 text-sm font-semibold">Antrean Bersih</h3>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Tidak ada dokumen yang memerlukan verifikasi pada kriteria filter saat ini.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {documents.data.map((doc) => (
                                <div key={doc.id} className="hover:bg-muted/30 p-4 transition-colors">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1 space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-primary font-mono text-xs font-semibold">{doc.nomor_pengajuan}</span>
                                                <span className="text-muted-foreground text-xs">•</span>
                                                <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                                                    {doc.jenis_anggaran}
                                                </span>
                                                <StatusBadge status={doc.status_terkini} size="sm" />
                                            </div>

                                            <h3 className="text-foreground text-sm font-semibold">
                                                <Link href={`/dokumen-pengajuan/${doc.id}`} className="hover:text-primary transition-colors">
                                                    {doc.nama_kegiatan}
                                                </Link>
                                            </h3>

                                            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="size-3" />
                                                    <span>{doc.user?.name}</span>
                                                </div>
                                                {doc.user?.unit && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 className="size-3" />
                                                        <span>{doc.user.unit}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="size-3" />
                                                    <span>Pelaksanaan: {formatDate(doc.tgl_pelaksanaan)}</span>
                                                </div>
                                                {doc.latest_status_tracking?.posisi_berkas && (
                                                    <div className="text-primary/80 flex items-center gap-1.5">
                                                        <MapPin className="size-3" />
                                                        <span>Posisi: {doc.latest_status_tracking.posisi_berkas}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {doc.latest_status_tracking?.catatan && (
                                                <div className="border-muted bg-muted/30 text-muted-foreground mt-1.5 rounded-md border px-2.5 py-1 text-[11px] italic">
                                                    Catatan: "{doc.latest_status_tracking.catatan}"
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions and Amount */}
                                        <div className="flex shrink-0 flex-col items-start gap-2.5 border-t pt-2.5 sm:flex-row lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                                            <div className="text-left lg:text-right">
                                                <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                                                    Usulan Anggaran
                                                </span>
                                                <p className="text-foreground text-sm font-semibold tabular-nums">
                                                    {formatCurrency(doc.total_usulan)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <ProposalPreviewModal
                                                    document={doc}
                                                    triggerButton={
                                                        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-primary/30 text-primary hover:bg-primary/5">
                                                            <Eye className="size-3" />
                                                            <span>Lihat Proposal</span>
                                                        </Button>
                                                    }
                                                />

                                                <StatusUpdateDialog
                                                    document={doc}
                                                    stages={stages}
                                                    triggerButton={
                                                        <Button size="sm" className="h-7 gap-1 text-xs shadow-xs">
                                                            <FileCheck className="size-3" />
                                                            <span>Verifikasi</span>
                                                        </Button>
                                                    }
                                                />

                                                <Button asChild size="sm" variant="outline" className="h-7 gap-1 text-xs">
                                                    <Link href={`/dokumen-pengajuan/${doc.id}`}>
                                                        <span>Detail</span>
                                                        <ArrowUpRight className="size-3" />
                                                    </Link>
                                                </Button>

                                                {doc.can_delete && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setDocumentToDelete(doc)}
                                                        className="h-7 w-7 p-0 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                                                        title="Hapus / Batalkan Pengajuan"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {documents.links && documents.links.length > 3 && (
                        <div className="bg-muted/20 flex items-center justify-between border-t p-3 text-xs">
                            <span className="text-muted-foreground">
                                Halaman {documents.current_page} dari {documents.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {documents.links.map((link, idx) => (
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={Boolean(documentToDelete)} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <Trash2 className="size-6" />
                        </div>
                        <DialogTitle className="text-center text-lg font-bold">
                            Hapus Dokumen Pengajuan?
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs text-muted-foreground pt-1.5 space-y-2">
                            <span>
                                Anda akan menghapus pengajuan <strong className="text-foreground">{documentToDelete?.nomor_pengajuan}</strong> (<span className="text-foreground">{documentToDelete?.nama_kegiatan}</span>).
                            </span>
                            <span className="block text-[11px] bg-destructive/10 text-destructive p-2.5 rounded-lg border border-destructive/20 text-left mt-2">
                                <strong>Perhatian:</strong> Dokumen yang berstatus <strong>{documentToDelete?.status_terkini}</strong> dapat dibatalkan atau dihapus oleh verifikator/pengusul. Seluruh riwayat dan berkas proposal PDF terkait akan dihapus secara permanen.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => setDocumentToDelete(null)}
                            className="text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={handleDelete}
                            className="text-xs font-semibold gap-1.5"
                        >
                            {isDeleting ? (
                                <span>Menghapus...</span>
                            ) : (
                                <>
                                    <Trash2 className="size-3.5" />
                                    <span>Ya, Hapus Pengajuan</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
