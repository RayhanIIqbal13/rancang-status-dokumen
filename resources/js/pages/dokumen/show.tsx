import { RevisionAlertBanner } from '@/components/dokumen/revision-alert-banner';
import { StatusBadge } from '@/components/dokumen/status-badge';
import { StatusTimeline } from '@/components/dokumen/status-timeline';
import { StatusUpdateDialog } from '@/components/dokumen/status-update-dialog';
import { WorkflowStepper } from '@/components/dokumen/workflow-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DokumenPengajuan, StandarBiaya, StatusStageInfo, User } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Building2, Clock, Download, Landmark, MapPin, Plus, Receipt, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface ShowProps {
    document: DokumenPengajuan;
    stages: StatusStageInfo[];
    standarBiayaList: StandarBiaya[];
    canUpdateStatus: boolean;
}

export default function DokumenShow({ document, stages, standarBiayaList, canUpdateStatus }: ShowProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const _currentUser = auth.user;
    const [activeTab, setActiveTab] = useState<'timeline' | 'spj' | 'realisasi'>('timeline');

    // SPJ Receipt form
    const [openSpjDialog, setOpenSpjDialog] = useState(false);
    const spjForm = useForm({
        standar_biaya_id: '',
        jenis_bukti: '',
        nominal: '',
        status_fisik: 'Lengkap & Asli',
        status_validasi_sbm: 'Sesuai SBM',
    });

    const handleSpjSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        spjForm.post(route('dokumen-pengajuan.bukti-pengeluaran.store', document.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpenSpjDialog(false);
                spjForm.reset();
            },
        });
    };

    // Realisasi form
    const [openRealisasiDialog, setOpenRealisasiDialog] = useState(false);
    const realisasiForm = useForm({
        total_realisasi: document.realisasi_anggaran?.total_realisasi || document.total_usulan,
        tgl_pencairan: document.realisasi_anggaran?.tgl_pencairan || new Date().toISOString().split('T')[0],
        status_pencairan: document.realisasi_anggaran?.status_pencairan || 'Dana Cair (SP2D Selesai)',
        draf_rekap_spj: document.realisasi_anggaran?.draf_rekap_spj || '',
    });

    const handleRealisasiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        realisasiForm.post(route('dokumen-pengajuan.realisasi-anggaran.store', document.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpenRealisasiDialog(false);
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Status Dokumen', href: '/dokumen-pengajuan' },
        { title: document.nomor_pengajuan, href: `/dokumen-pengajuan/${document.id}` },
    ];

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
            month: 'long',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    const latestTracking = document.latest_status_tracking;
    const _isCompleted = document.status_terkini === 'Dana Cair';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Status Dokumen ${document.nomor_pengajuan}`} />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                {/* Top Nav / Actions Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon" className="size-9">
                            <Link href={route('dokumen-pengajuan.index')}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-primary font-mono text-sm font-bold">{document.nomor_pengajuan}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground text-xs">Diajukan: {formatDate(document.created_at)}</span>
                            </div>
                            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{document.nama_kegiatan}</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={document.status_terkini} size="lg" />
                        {canUpdateStatus && <StatusUpdateDialog document={document} stages={stages} />}
                    </div>
                </div>

                {/* Revision Required Prominent Banner */}
                <RevisionAlertBanner document={document} stages={stages} />

                {/* 8-Stage Workflow Progress Stepper */}
                <WorkflowStepper currentStatus={document.status_terkini} stages={stages} />

                {/* Main Content Layout */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column (2 Cols): Tracking History & Tabs */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Current Position & Status Highlight Card */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="p-5">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Status Terkini</span>
                                        <div className="text-foreground mt-1.5 flex items-center gap-1.5 font-bold">
                                            <StatusBadge status={document.status_terkini} size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                            Posisi Berkas Fisik / Unit
                                        </span>
                                        <p className="text-foreground mt-1.5 flex items-center gap-1.5 text-sm font-bold">
                                            <MapPin className="text-primary size-4 shrink-0" />
                                            <span>{latestTracking?.posisi_berkas || 'Subbag Keuangan Fakultas'}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                            Pembaruan Terakhir
                                        </span>
                                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
                                            <Clock className="size-3.5" />
                                            <span className="text-foreground font-medium">
                                                {latestTracking
                                                    ? new Intl.DateTimeFormat('id-ID', {
                                                          dateStyle: 'medium',
                                                          timeStyle: 'short',
                                                      }).format(new Date(latestTracking.waktu_update))
                                                    : '-'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interactive Tabs Header */}
                        <div className="border-border flex border-b overflow-x-auto no-scrollbar whitespace-nowrap">
                            <button
                                type="button"
                                onClick={() => setActiveTab('timeline')}
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === 'timeline'
                                        ? 'border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground border-transparent'
                                }`}
                            >
                                <Clock className="size-4" />
                                <span>Riwayat Status ({document.status_timeline?.length ?? 0})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('spj')}
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === 'spj'
                                        ? 'border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground border-transparent'
                                }`}
                            >
                                <Receipt className="size-4" />
                                <span>Bukti SPJ & SBM ({document.bukti_pengeluarans?.length ?? 0})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('realisasi')}
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === 'realisasi'
                                        ? 'border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground border-transparent'
                                }`}
                            >
                                <Landmark className="size-4" />
                                <span>Realisasi & SAKTI</span>
                            </button>
                        </div>

                        {/* Tab Content 1: Status Tracking Timeline */}
                        {activeTab === 'timeline' && (
                            <div className="border-border/80 bg-card rounded-xl border p-5 shadow-xs">
                                <div className="border-border/60 mb-4 flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-foreground text-base font-bold">Log Riwayat Status & Catatan</h3>
                                        <p className="text-muted-foreground mt-0.5 text-xs">
                                            Rekam jejak setiap perpindahan status, petugas pemeriksa, posisi dokumen, dan catatan revisi
                                        </p>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                        <Link href={route('status-tracking.show', document.id)}>
                                            Lihat Tracking Interaktif
                                            <ArrowUpRight className="size-3.5" />
                                        </Link>
                                    </Button>
                                </div>
                                <StatusTimeline document={document} stages={stages} />
                            </div>
                        )}

                        {/* Tab Content 2: Bukti SPJ & Validasi SBM */}
                        {activeTab === 'spj' && (
                            <div className="bg-card space-y-4 rounded-xl border p-5 shadow-xs dark:border-neutral-800">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                    <div>
                                        <h3 className="text-foreground text-base font-bold">Bukti Pengeluaran & Validasi SBM</h3>
                                        <p className="text-muted-foreground text-xs">
                                            Daftar bukti kuitansi dan kesesuaian terhadap batas tarif Standar Biaya Masukan
                                        </p>
                                    </div>
                                    <Dialog open={openSpjDialog} onOpenChange={setOpenSpjDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-1.5">
                                                <Plus className="size-4" />
                                                <span>Tambah Bukti SPJ</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Tambah Bukti Pengeluaran (SPJ)</DialogTitle>
                                                <DialogDescription>
                                                    Catat kuitansi pengeluaran dan kaitkan dengan acuan Standar Biaya Masukan
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleSpjSubmit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="standar_biaya_id">Acuan Validasi SBM (Opsional)</Label>
                                                    <Select
                                                        value={spjForm.data.standar_biaya_id}
                                                        onValueChange={(val) => spjForm.setData('standar_biaya_id', val)}
                                                    >
                                                        <SelectTrigger id="standar_biaya_id">
                                                            <SelectValue placeholder="Pilih referensi standar biaya..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {standarBiayaList.map((sbm) => (
                                                                <SelectItem key={sbm.id} value={String(sbm.id)}>
                                                                    {sbm.uraian_belanja} (Maks: {formatCurrency(sbm.batas_tarif)} / {sbm.satuan})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="jenis_bukti">Jenis & Uraian Bukti *</Label>
                                                    <Input
                                                        id="jenis_bukti"
                                                        value={spjForm.data.jenis_bukti}
                                                        onChange={(e) => spjForm.setData('jenis_bukti', e.target.value)}
                                                        placeholder="Contoh: Kuitansi Konsumsi Rapat 50 Porsi"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="nominal">Nominal Pengeluaran (Rp) *</Label>
                                                    <Input
                                                        id="nominal"
                                                        type="number"
                                                        min="0"
                                                        value={spjForm.data.nominal}
                                                        onChange={(e) => spjForm.setData('nominal', e.target.value)}
                                                        placeholder="Contoh: 2400000"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="status_fisik">Status Fisik Dokumen</Label>
                                                        <Input
                                                            id="status_fisik"
                                                            value={spjForm.data.status_fisik}
                                                            onChange={(e) => spjForm.setData('status_fisik', e.target.value)}
                                                            placeholder="Lengkap & Asli"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="status_validasi_sbm">Validasi SBM</Label>
                                                        <Input
                                                            id="status_validasi_sbm"
                                                            value={spjForm.data.status_validasi_sbm}
                                                            onChange={(e) => spjForm.setData('status_validasi_sbm', e.target.value)}
                                                            placeholder="Sesuai SBM"
                                                        />
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setOpenSpjDialog(false)}>
                                                        Batal
                                                    </Button>
                                                    <Button type="submit" disabled={spjForm.processing}>
                                                        Simpan Bukti
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {!document.bukti_pengeluarans || document.bukti_pengeluarans.length === 0 ? (
                                    <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
                                        <Receipt className="mx-auto size-8 opacity-40" />
                                        <p className="mt-2 text-sm">Belum ada bukti pengeluaran SPJ yang tercatat.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y rounded-lg border">
                                        {document.bukti_pengeluarans.map((bukti) => (
                                            <div
                                                key={bukti.id}
                                                className="flex flex-col gap-2 p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div>
                                                    <p className="text-foreground text-sm font-semibold">{bukti.jenis_bukti}</p>
                                                    {bukti.standar_biaya && (
                                                        <p className="text-muted-foreground mt-0.5">
                                                            Acuan SBM: {bukti.standar_biaya.uraian_belanja} (Maks:{' '}
                                                            {formatCurrency(bukti.standar_biaya.batas_tarif)})
                                                        </p>
                                                    )}
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="bg-muted rounded px-1.5 py-0.5 font-medium">
                                                            Fisik: {bukti.status_fisik}
                                                        </span>
                                                        <span
                                                            className={`rounded px-1.5 py-0.5 font-semibold ${
                                                                bukti.status_validasi_sbm === 'Sesuai SBM'
                                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                            }`}
                                                        >
                                                            {bukti.status_validasi_sbm}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-foreground text-sm font-extrabold">{formatCurrency(bukti.nominal)}</span>
                                                    {canUpdateStatus && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-destructive hover:bg-destructive/10 size-7"
                                                            onClick={() => {
                                                                if (confirm('Hapus bukti pengeluaran ini?')) {
                                                                    spjForm.delete(
                                                                        route('dokumen-pengajuan.bukti-pengeluaran.destroy', [document.id, bukti.id]),
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content 3: Realisasi & SAKTI */}
                        {activeTab === 'realisasi' && (
                            <div className="bg-card space-y-4 rounded-xl border p-5 shadow-xs dark:border-neutral-800">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                    <div>
                                        <h3 className="text-foreground text-base font-bold">Realisasi Anggaran & Integrasi SAKTI</h3>
                                        <p className="text-muted-foreground text-xs">
                                            Pencatatan realisasi pencairan dana, status SP2D, dan verifikasi akhir
                                        </p>
                                    </div>
                                    {canUpdateStatus && (
                                        <Dialog open={openRealisasiDialog} onOpenChange={setOpenRealisasiDialog}>
                                            <DialogTrigger asChild>
                                                <Button size="sm">{document.realisasi_anggaran ? 'Ubah Realisasi' : 'Catat Realisasi'}</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Pencatatan Realisasi Anggaran</DialogTitle>
                                                    <DialogDescription>
                                                        Perbarui nominal realisasi pencairan dan status transaksi SAKTI
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleRealisasiSubmit} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="total_realisasi">Total Realisasi Pencairan (Rp) *</Label>
                                                        <Input
                                                            id="total_realisasi"
                                                            type="number"
                                                            value={realisasiForm.data.total_realisasi}
                                                            onChange={(e) => realisasiForm.setData('total_realisasi', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tgl_pencairan">Tanggal Pencairan / SP2D</Label>
                                                        <Input
                                                            id="tgl_pencairan"
                                                            type="date"
                                                            value={realisasiForm.data.tgl_pencairan}
                                                            onChange={(e) => realisasiForm.setData('tgl_pencairan', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="status_pencairan">Status Transaksi SAKTI *</Label>
                                                        <Input
                                                            id="status_pencairan"
                                                            value={realisasiForm.data.status_pencairan}
                                                            onChange={(e) => realisasiForm.setData('status_pencairan', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="draf_rekap_spj">Catatan Rekap SPJ</Label>
                                                        <textarea
                                                            id="draf_rekap_spj"
                                                            rows={3}
                                                            className="w-full rounded-md border p-2 text-sm"
                                                            value={realisasiForm.data.draf_rekap_spj}
                                                            onChange={(e) => realisasiForm.setData('draf_rekap_spj', e.target.value)}
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" variant="outline" onClick={() => setOpenRealisasiDialog(false)}>
                                                            Batal
                                                        </Button>
                                                        <Button type="submit" disabled={realisasiForm.processing}>
                                                            Simpan Realisasi
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                                {document.realisasi_anggaran ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="bg-muted/20 rounded-lg border p-4">
                                            <span className="text-muted-foreground text-xs">Total Realisasi Pencairan</span>
                                            <p className="text-foreground mt-1 text-2xl font-bold">
                                                {formatCurrency(document.realisasi_anggaran.total_realisasi)}
                                            </p>
                                        </div>
                                        <div className="bg-muted/20 rounded-lg border p-4">
                                            <span className="text-muted-foreground text-xs">Status Pencairan SAKTI</span>
                                            <p className="mt-1 text-base font-bold text-teal-700 dark:text-teal-400">
                                                {document.realisasi_anggaran.status_pencairan}
                                            </p>
                                            {document.realisasi_anggaran.tgl_pencairan && (
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    Tanggal: {formatDate(document.realisasi_anggaran.tgl_pencairan)}
                                                </p>
                                            )}
                                        </div>
                                        {document.realisasi_anggaran.draf_rekap_spj && (
                                            <div className="bg-muted/40 rounded-lg border p-4 text-xs sm:col-span-2">
                                                <p className="mb-1 font-semibold">Catatan Rekap SPJ & SAKTI:</p>
                                                <p>{document.realisasi_anggaran.draf_rekap_spj}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
                                        <Landmark className="mx-auto size-8 opacity-40" />
                                        <p className="mt-2 text-sm">
                                            Realisasi anggaran akan dicatat oleh Staf Keuangan pada Tahap 7 & 8 (SAKTI & Dana Cair).
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column (1 Col): Document Meta & Applicant Info */}
                    <div className="space-y-6">
                        {/* Financial Information Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                                    Rincian Usulan Anggaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-xs">
                                <div>
                                    <span className="text-muted-foreground">Total Usulan Dana:</span>
                                    <p className="text-foreground mt-0.5 text-2xl font-extrabold">{formatCurrency(document.total_usulan)}</p>
                                </div>

                                <div className="space-y-2 border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Jenis Anggaran:</span>
                                        <span className="text-foreground text-right font-semibold">{document.jenis_anggaran}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tanggal Pelaksanaan:</span>
                                        <span className="text-foreground text-right font-semibold">{formatDate(document.tgl_pelaksanaan)}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-3">
                                    <span className="text-muted-foreground">Uraian Kegiatan:</span>
                                    <p className="text-foreground bg-muted/30 mt-1 rounded-md border p-2.5 leading-relaxed whitespace-pre-line">
                                        {document.uraian}
                                    </p>
                                </div>

                                {document.file_proposal && (
                                    <div className="border-t pt-3">
                                        <Button asChild variant="outline" size="sm" className="w-full gap-2">
                                            <a href={`/storage/${document.file_proposal}`} target="_blank" rel="noreferrer">
                                                <Download className="size-3.5" />
                                                <span>Unduh Berkas Proposal</span>
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Applicant User Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-muted-foreground text-sm font-bold tracking-wider uppercase">Data Pengusul</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-bold">
                                        {document.user?.name?.charAt(0) ?? 'U'}
                                    </div>
                                    <div>
                                        <p className="text-foreground text-sm font-bold">{document.user?.name}</p>
                                        <p className="text-muted-foreground">NIP/NIM: {document.user?.nip_nim ?? '-'}</p>
                                    </div>
                                </div>

                                <div className="text-muted-foreground space-y-2 border-t pt-3">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="size-3.5 shrink-0" />
                                        <span>{document.user?.unit ?? 'Unit Kerja / Fakultas'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="size-3.5 shrink-0" />
                                        <span>Email: {document.user?.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
