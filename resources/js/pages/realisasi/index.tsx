import { StatusBadge } from '@/components/dokumen/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DokumenPengajuan, PaginatedData, User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    Calendar,
    CheckCircle2,
    DollarSign,
    Edit3,
    FileSpreadsheet,
    FileText,
    Landmark,
    Percent,
    PieChart,
    Plus,
    Receipt,
    Search,
    TrendingUp,
    Wallet,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface RealisasiIndexProps {
    documents: PaginatedData<DokumenPengajuan>;
    filters: { search: string };
    stats: {
        total_usulan: number;
        total_realisasi: number;
        sisa_anggaran: number;
        serapan_persen: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Realisasi Anggaran', href: '/realisasi-anggaran' },
];

export default function RealisasiIndex({ documents, filters, stats }: RealisasiIndexProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const isStaffOrLeader =
        auth.user.role === 'staf_keuangan' ||
        auth.user.role === 'admin' ||
        auth.user.role === 'pimpinan';
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedDoc, setSelectedDoc] = useState<DokumenPengajuan | null>(null);

    const form = useForm({
        total_realisasi: '',
        tgl_pencairan: '',
        status_pencairan: 'Dana Cair (SP2D Selesai)',
        draf_rekap_spj: '',
    });

    const openEditDialog = (doc: DokumenPengajuan) => {
        setSelectedDoc(doc);
        form.setData({
            total_realisasi: String(doc.realisasi_anggaran?.total_realisasi ?? doc.total_usulan),
            tgl_pencairan: doc.realisasi_anggaran?.tgl_pencairan ?? new Date().toISOString().split('T')[0],
            status_pencairan: doc.realisasi_anggaran?.status_pencairan ?? 'Dana Cair (SP2D Selesai)',
            draf_rekap_spj: doc.realisasi_anggaran?.draf_rekap_spj ?? '',
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoc) return;

        form.post(route('dokumen-pengajuan.realisasi-anggaran.store', selectedDoc.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedDoc(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('realisasi-anggaran.index'), { search: searchTerm }, { preserveState: true });
    };

    const formatCurrency = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
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
            <Head title="Realisasi Anggaran & SAKTI - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                Realisasi Anggaran & Modul SAKTI
                            </h1>
                            <span className="rounded-4xl border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                SP2D & Realisasi
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Pencatatan realisasi dana SP2D Kemenkeu, pemantauan sisa pagu, dan status kelengkapan SPJ
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <Link href={route('laporan.index')}>
                                <FileSpreadsheet className="size-3.5" />
                                <span>Laporan Serapan</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Total Usulan */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-4 ring-1 ring-foreground/10 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Total Pagu Usulan</span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                <Wallet className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-xl font-medium tabular-nums text-foreground">
                                {formatCurrency(stats.total_usulan)}
                            </span>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Total komitmen usulan</p>
                        </div>
                    </div>

                    {/* Total Realisasi Cair */}
                    <div className="rounded-xl bg-linear-to-t from-teal-500/10 to-card p-4 ring-1 ring-teal-500/30 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-400">
                                Total Realisasi Cair
                            </span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                <DollarSign className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-xl font-medium tabular-nums text-teal-700 dark:text-teal-400">
                                {formatCurrency(stats.total_realisasi)}
                            </span>
                            <p className="text-[11px] text-teal-600/80 mt-0.5">SP2D telah diterbitkan</p>
                        </div>
                    </div>

                    {/* Sisa Alokasi */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-4 ring-1 ring-foreground/10 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Sisa Alokasi Pagu</span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                <Landmark className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-xl font-medium tabular-nums text-foreground">
                                {formatCurrency(stats.sisa_anggaran)}
                            </span>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Belum dicairkan</p>
                        </div>
                    </div>

                    {/* Persentase Serapan */}
                    <div className="rounded-xl bg-linear-to-t from-blue-500/10 to-card p-4 ring-1 ring-blue-500/30 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                Persentase Serapan
                            </span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <TrendingUp className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-2xl font-medium tabular-nums text-blue-700 dark:text-blue-400">
                                {stats.serapan_persen}%
                            </span>
                            <span className="text-[11px] text-muted-foreground">daya serap</span>
                        </div>
                    </div>
                </div>

                {/* Main Card with Toolbar & Table */}
                <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
                    {/* Studio Admin Toolbar */}
                    <div className="flex flex-col gap-3 p-4 border-b sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nomor pengajuan atau nama usulan..."
                                className="h-8 pl-8 pr-8 text-xs"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        router.get(route('realisasi-anggaran.index'), { search: '' });
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </form>

                        <div className="text-xs text-muted-foreground">
                            Total <strong className="text-foreground">{documents.total}</strong> dokumen anggaran
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b bg-muted/50 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Nomor & Usulan</th>
                                    <th className="px-4 py-3">Pengusul & Unit</th>
                                    <th className="px-4 py-3 text-right">Pagu Usulan</th>
                                    <th className="px-4 py-3 text-right">Realisasi Cair</th>
                                    <th className="px-4 py-3">Status SAKTI / SP2D</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {documents.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data realisasi anggaran yang sesuai pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.data.map((doc) => {
                                        const realisasi = doc.realisasi_anggaran;
                                        return (
                                            <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3.5 space-y-1 max-w-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono text-xs font-semibold text-primary">
                                                            {doc.nomor_pengajuan}
                                                        </span>
                                                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                                            {doc.jenis_anggaran}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-foreground truncate">
                                                        {doc.nama_kegiatan}
                                                    </p>
                                                    <StatusBadge status={doc.status_terkini} size="sm" />
                                                </td>

                                                <td className="px-4 py-3.5 text-muted-foreground">
                                                    <p className="font-medium text-foreground">{doc.user?.name}</p>
                                                    <p className="text-[11px]">{doc.user?.unit || '-'}</p>
                                                </td>

                                                <td className="px-4 py-3.5 text-right font-medium tabular-nums text-foreground">
                                                    {formatCurrency(doc.total_usulan)}
                                                </td>

                                                <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-teal-700 dark:text-teal-400">
                                                    {realisasi ? formatCurrency(realisasi.total_realisasi) : '-'}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    {realisasi ? (
                                                        <div className="space-y-0.5">
                                                            <span className="inline-flex rounded-4xl bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-medium text-teal-800 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300">
                                                                {realisasi.status_pencairan}
                                                            </span>
                                                            {realisasi.tgl_pencairan && (
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    Tgl Cair: {formatDate(realisasi.tgl_pencairan)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">
                                                            Menunggu SAKTI
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {isStaffOrLeader && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 gap-1 px-2 text-xs"
                                                                onClick={() => openEditDialog(doc)}
                                                            >
                                                                <Edit3 className="size-3" />
                                                                <span>{realisasi ? 'Ubah' : 'Input'}</span>
                                                            </Button>
                                                        )}
                                                        <Button asChild size="icon" variant="ghost" className="size-7">
                                                            <Link href={`/dokumen-pengajuan/${doc.id}`}>
                                                                <ArrowUpRight className="size-3.5" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {documents.links && documents.links.length > 3 && (
                        <div className="flex items-center justify-between p-3 border-t bg-muted/20 text-xs">
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
                                            <Link
                                                href={link.url}
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

                {/* Edit / Input Realisasi Dialog */}
                <Dialog open={Boolean(selectedDoc)} onOpenChange={(open) => !open && setSelectedDoc(null)}>
                    <DialogContent className="max-w-md rounded-xl">
                        <DialogHeader className="border-b pb-3">
                            <DialogTitle className="text-base font-semibold tracking-tight">
                                Input Realisasi Anggaran SAKTI
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Dokumen: <strong className="text-foreground">{selectedDoc?.nomor_pengajuan}</strong> —{' '}
                                {selectedDoc?.nama_kegiatan}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="total_realisasi" className="text-xs font-medium">
                                    Nominal Realisasi Cair (Rp) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="total_realisasi"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={form.data.total_realisasi}
                                    onChange={(e) => form.setData('total_realisasi', e.target.value)}
                                    className="h-8 text-xs"
                                    required
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Usulan semula: {selectedDoc ? formatCurrency(selectedDoc.total_usulan) : '-'}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tgl_pencairan" className="text-xs font-medium">
                                    Tanggal Terbit SP2D / Pencairan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tgl_pencairan"
                                    type="date"
                                    value={form.data.tgl_pencairan}
                                    onChange={(e) => form.setData('tgl_pencairan', e.target.value)}
                                    className="h-8 text-xs"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status_pencairan" className="text-xs font-medium">
                                    Status SAKTI / SP2D <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.status_pencairan}
                                    onValueChange={(val) => form.setData('status_pencairan', val)}
                                >
                                    <SelectTrigger id="status_pencairan" className="h-8 text-xs w-full">
                                        <SelectValue placeholder="Pilih status pencairan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dana Cair (SP2D Selesai)" className="text-xs">
                                            Dana Cair (SP2D Selesai)
                                        </SelectItem>
                                        <SelectItem value="Diproses di KPPN" className="text-xs">
                                            Diproses di KPPN
                                        </SelectItem>
                                        <SelectItem value="SPM Diterbitkan" className="text-xs">
                                            SPM Diterbitkan
                                        </SelectItem>
                                        <SelectItem value="Pending Rekonsiliasi" className="text-xs">
                                            Pending Rekonsiliasi
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="draf_rekap_spj" className="text-xs font-medium">
                                    Catatan Rekonsiliasi SPJ
                                </Label>
                                <textarea
                                    id="draf_rekap_spj"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Nomor SP2D, rekening tujuan transfer, atau catatan rekonsiliasi kas..."
                                    value={form.data.draf_rekap_spj}
                                    onChange={(e) => form.setData('draf_rekap_spj', e.target.value)}
                                />
                            </div>

                            <DialogFooter className="border-t pt-3 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => setSelectedDoc(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={form.processing}
                                    className="h-8 gap-1.5 text-xs shadow-xs"
                                >
                                    <CheckCircle2 className="size-3.5" />
                                    <span>{form.processing ? 'Menyimpan...' : 'Simpan Realisasi'}</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
