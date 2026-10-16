import { RevisionAlertBanner } from '@/components/dokumen/revision-alert-banner';
import { StatusBadge } from '@/components/dokumen/status-badge';
import { StatusTimeline } from '@/components/dokumen/status-timeline';
import { StatusUpdateDialog } from '@/components/dokumen/status-update-dialog';
import { WorkflowStepper } from '@/components/dokumen/workflow-stepper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DocumentStatusType, DokumenPengajuan, PaginatedData, SharedData, StatusStageInfo, StatusTracking } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    Calendar,
    ChevronRight,
    Clock,
    CreditCard,
    FileText,
    Filter,
    FolderSearch,
    History,
    Layers,
    MapPin,
    Search,
    User as UserIcon,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface AccessibleDocSummary {
    id: number;
    user_id: number;
    nomor_pengajuan: string;
    nama_kegiatan: string;
    jenis_anggaran: string;
    total_usulan: number | string;
    status_terkini: DocumentStatusType;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        unit: string | null;
        nip_nim?: string | null;
    };
}

interface StatusTrackingIndexProps {
    activeDocument?: DokumenPengajuan | null;
    accessibleDocuments: AccessibleDocSummary[];
    trackings: PaginatedData<StatusTracking>;
    filters: {
        search: string;
        status: string;
        dokumen_id?: string;
    };
    stages: StatusStageInfo[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Status Tracking Dokumen', href: '/status-tracking' },
];

export default function StatusTrackingIndex({ activeDocument, accessibleDocuments, trackings, filters, stages }: StatusTrackingIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const currentUser = auth.user;

    const [viewMode, setViewMode] = useState<'tracker' | 'global_audit'>('tracker');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectorModalOpen, setSelectorModalOpen] = useState(false);

    const handleSelectDocument = (docId: string | number) => {
        router.get(
            route('status-tracking.index'),
            {
                dokumen_id: docId,
                search: filters.search,
                status: filters.status,
            },
            { preserveState: true },
        );
        setSelectorModalOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('status-tracking.index'),
            {
                search: searchTerm,
                status: filters.status,
                dokumen_id: activeDocument?.id,
            },
            { preserveState: true },
        );
    };

    const handleStatusFilter = (statusVal: string) => {
        router.get(
            route('status-tracking.index'),
            {
                search: filters.search,
                status: statusVal,
                dokumen_id: activeDocument?.id,
            },
            { preserveState: true },
        );
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
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(new Date(dateStr));
    };

    const isFinanceOrLeader = currentUser.role === 'staf_keuangan' || currentUser.role === 'pimpinan' || currentUser.role === 'admin';

    const latestTracking = activeDocument?.status_trackings?.[activeDocument.status_trackings.length - 1] || activeDocument?.latest_status_tracking;
    const isRevision = activeDocument?.status_terkini === 'Perlu Revisi';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status Tracking Dokumen — SAK ITK" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* 1. Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-foreground text-2xl font-bold tracking-tight">Status Tracking Dokumen</h1>
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                                Pelacakan Berkas
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Pantau tahapan proses verifikasi, disposisi berkas, persetujuan pimpinan, dan pencairan dana usulan secara real-time
                        </p>
                    </div>

                    {/* View mode toggle (Focused tracker vs Global audit) */}
                    <div className="flex items-center gap-2">
                        <div className="border-border/80 bg-muted/40 inline-flex rounded-lg border p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('tracker')}
                                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                                    viewMode === 'tracker' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Pelacakan Dokumen
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('global_audit')}
                                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                                    viewMode === 'global_audit'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Seluruh Log Audit
                            </button>
                        </div>

                        {activeDocument && isFinanceOrLeader && <StatusUpdateDialog document={activeDocument} stages={stages} />}
                    </div>
                </div>

                {viewMode === 'tracker' ? (
                    <>
                        {/* Document Switcher Toolbar */}
                        {accessibleDocuments.length > 0 && (
                            <div className="border-border/80 bg-card flex flex-col items-stretch justify-between gap-3 rounded-xl border p-3 shadow-xs sm:flex-row sm:items-center">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <FolderSearch className="text-primary size-4 shrink-0" />
                                    <span className="text-muted-foreground text-xs font-semibold whitespace-nowrap">Dokumen Dilacak:</span>
                                    <div className="min-w-0 truncate">
                                        <span className="text-primary mr-2 font-mono text-xs font-bold">{activeDocument?.nomor_pengajuan}</span>
                                        <span className="text-foreground hidden truncate text-xs font-medium md:inline">
                                            — {activeDocument?.nama_kegiatan}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Dialog open={selectorModalOpen} onOpenChange={setSelectorModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                                <Layers className="size-3.5" />
                                                Pilih Dokumen Lain ({accessibleDocuments.length})
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
                                            <DialogHeader>
                                                <DialogTitle>Pilih Dokumen Pengajuan</DialogTitle>
                                                <DialogDescription>
                                                    Pilih berkas pengajuan keuangan yang ingin dipantau siklus statusnya.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                                                {accessibleDocuments.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        onClick={() => handleSelectDocument(doc.id)}
                                                        className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-all sm:flex-row sm:items-center sm:justify-between ${
                                                            activeDocument?.id === doc.id
                                                                ? 'border-primary bg-primary/5 shadow-xs'
                                                                : 'border-border/70 hover:border-border hover:bg-muted/30'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-primary font-mono text-xs font-bold">
                                                                    {doc.nomor_pengajuan}
                                                                </span>
                                                                <span className="text-muted-foreground text-xs">•</span>
                                                                <span className="text-muted-foreground text-xs">
                                                                    {doc.user?.name} ({doc.user?.unit})
                                                                </span>
                                                            </div>
                                                            <h5 className="text-foreground mt-0.5 text-sm font-semibold">{doc.nama_kegiatan}</h5>
                                                            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                                                                <span>{doc.jenis_anggaran}</span>
                                                                <span>•</span>
                                                                <span className="text-foreground font-semibold">
                                                                    {formatCurrency(doc.total_usulan)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                                                            <StatusBadge status={doc.status_terkini} size="sm" />
                                                            <ChevronRight className="text-muted-foreground size-4" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {activeDocument && (
                                        <Button asChild variant="secondary" size="sm" className="gap-1.5 text-xs">
                                            <Link href={route('dokumen-pengajuan.show', activeDocument.id)}>
                                                Detail Lengkap
                                                <ArrowUpRight className="size-3.5" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeDocument ? (
                            <>
                                {/* 2. Document Summary Card */}
                                <Card className="border-border/80 overflow-hidden shadow-xs">
                                    <CardHeader className="border-border/60 bg-muted/20 border-b p-5 pb-3">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-primary bg-primary/10 rounded px-2 py-0.5 font-mono text-xs font-bold">
                                                        {activeDocument.nomor_pengajuan}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        Diajukan pada {formatDate(activeDocument.created_at)}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-foreground mt-1.5 text-lg font-bold">
                                                    {activeDocument.nama_kegiatan}
                                                </CardTitle>
                                                <CardDescription className="mt-0.5 line-clamp-2 text-xs">
                                                    {activeDocument.uraian || 'Tidak ada uraian kegiatan tambahan.'}
                                                </CardDescription>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                                                <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                                                    Status Saat Ini
                                                </span>
                                                <StatusBadge status={activeDocument.status_terkini} size="lg" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {/* Applicant */}
                                            <div className="border-border/60 bg-muted/10 flex items-start gap-3 rounded-lg border p-3">
                                                <UserIcon className="text-primary mt-0.5 size-4 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="text-muted-foreground block text-[11px] font-semibold tracking-wider uppercase">
                                                        Pengusul
                                                    </span>
                                                    <p className="text-foreground truncate text-sm font-bold">{activeDocument.user?.name || '-'}</p>
                                                    <p className="text-muted-foreground truncate text-xs">
                                                        {activeDocument.user?.unit || '-'}{' '}
                                                        {activeDocument.user?.nip_nim ? `• ${activeDocument.user.nip_nim}` : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Activity & Date */}
                                            <div className="border-border/60 bg-muted/10 flex items-start gap-3 rounded-lg border p-3">
                                                <Calendar className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                                                <div className="min-w-0">
                                                    <span className="text-muted-foreground block text-[11px] font-semibold tracking-wider uppercase">
                                                        Pelaksanaan
                                                    </span>
                                                    <p className="text-foreground text-sm font-bold">{formatDate(activeDocument.tgl_pelaksanaan)}</p>
                                                    <p className="text-muted-foreground truncate text-xs">Jadwal Kegiatan</p>
                                                </div>
                                            </div>

                                            {/* Budget Type */}
                                            <div className="border-border/60 bg-muted/10 flex items-start gap-3 rounded-lg border p-3">
                                                <CreditCard className="mt-0.5 size-4 shrink-0 text-purple-600" />
                                                <div className="min-w-0">
                                                    <span className="text-muted-foreground block text-[11px] font-semibold tracking-wider uppercase">
                                                        Sumber Anggaran
                                                    </span>
                                                    <p className="text-foreground truncate text-sm font-bold">{activeDocument.jenis_anggaran}</p>
                                                    <p className="text-muted-foreground text-xs">Alokasi Pagu Kampus</p>
                                                </div>
                                            </div>

                                            {/* Proposed Amount */}
                                            <div className="border-border/60 bg-muted/10 flex items-start gap-3 rounded-lg border p-3">
                                                <Wallet className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                                <div className="min-w-0">
                                                    <span className="text-muted-foreground block text-[11px] font-semibold tracking-wider uppercase">
                                                        Total Usulan
                                                    </span>
                                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(activeDocument.total_usulan)}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">Pagu Diajukan</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Physical Location Badge */}
                                        <div className="border-border/60 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <MapPin className="text-primary size-4 shrink-0" />
                                                <span>Posisi Berkas Fisik:</span>
                                                <span className="text-foreground bg-muted rounded px-2 py-0.5 font-bold">
                                                    {latestTracking?.posisi_berkas || 'Subbag Keuangan Fakultas'}
                                                </span>
                                            </div>

                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <Clock className="text-muted-foreground size-3.5 shrink-0" />
                                                <span>Pembaruan Terakhir:</span>
                                                <span className="text-foreground font-medium">{formatDate(latestTracking?.waktu_update)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 5. Revision State Prominent Alert Banner */}
                                {isRevision && <RevisionAlertBanner document={activeDocument} stages={stages} className="shadow-xs" />}

                                {/* Horizontal 8-Stage Workflow Stepper */}
                                <WorkflowStepper currentStatus={activeDocument.status_terkini} stages={stages} />

                                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                                    {/* 3 & 4. Status Timeline (All 8 stages in chronological order with visual states) */}
                                    <div className="space-y-4 lg:col-span-7">
                                        <Card className="border-border/80 shadow-xs">
                                            <CardHeader className="border-border/60 border-b p-5 pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base font-bold">Timeline 8 Tahap Siklus Dokumen</CardTitle>
                                                        <CardDescription className="mt-0.5 text-xs">
                                                            Pelacakan berurutan dari pengajuan awal hingga pencairan dana SP2D
                                                        </CardDescription>
                                                    </div>
                                                    <Activity className="text-primary size-4" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-5">
                                                <StatusTimeline document={activeDocument} stages={stages} />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* 6. Status History Table (Audit Trail of this document) */}
                                    <div className="space-y-4 lg:col-span-5">
                                        <Card className="border-border/80 shadow-xs">
                                            <CardHeader className="border-border/60 border-b p-5 pb-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base font-bold">Histori & Jejak Audit</CardTitle>
                                                        <CardDescription className="mt-0.5 text-xs">
                                                            Catatan perubahan status yang tidak dapat diubah (immutable log)
                                                        </CardDescription>
                                                    </div>
                                                    <History className="text-muted-foreground size-4" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                {activeDocument.status_trackings && activeDocument.status_trackings.length > 0 ? (
                                                    <div className="divide-border/60 divide-y">
                                                        {activeDocument.status_trackings.map((log, logIdx) => (
                                                            <div key={log.id || logIdx} className="hover:bg-muted/20 space-y-2 p-4 transition-colors">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <StatusBadge status={log.tahap} size="sm" />
                                                                    <span className="text-muted-foreground font-mono text-[11px]">
                                                                        {formatDate(log.waktu_update)}
                                                                    </span>
                                                                </div>

                                                                <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                                                    <span className="text-foreground font-medium">Oleh: {log.updater_name}</span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="text-muted-foreground size-3" />
                                                                        {log.posisi_berkas}
                                                                    </span>
                                                                </div>

                                                                {log.catatan && (
                                                                    <p className="bg-muted/50 text-foreground border-border/50 rounded border p-2 font-mono text-xs">
                                                                        {log.catatan}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted-foreground p-8 text-center text-xs">
                                                        Belum ada riwayat audit tercatat untuk dokumen ini.
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Card className="border-border/80 p-12 text-center shadow-xs">
                                <FileText className="text-muted-foreground mx-auto mb-3 size-10 opacity-50" />
                                <h3 className="text-foreground text-base font-semibold">Tidak Ada Dokumen yang Dipilih</h3>
                                <p className="text-muted-foreground mx-auto mt-1 mb-4 max-w-md text-xs">
                                    Belum ada berkas pengajuan keuangan yang dapat ditampilkan, atau akun Anda belum memiliki usulan aktif.
                                </p>
                                <Button asChild size="sm">
                                    <Link href={route('dokumen-pengajuan.create')}>Buat Pengajuan Baru</Link>
                                </Button>
                            </Card>
                        )}
                    </>
                ) : (
                    /* Global Audit Trail Mode (All documents history log) */
                    <Card className="border-border/80 shadow-xs">
                        <CardHeader className="border-border/60 border-b p-5 pb-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-base font-bold">Log Jejak Audit Seluruh Dokumen</CardTitle>
                                    <CardDescription className="mt-0.5 text-xs">
                                        Catatan riwayat setiap mutasi status, petugas pelaksana, dan waktu update
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Search and filter bar */}
                        <CardContent className="border-border/60 bg-muted/10 space-y-3 border-b p-4">
                            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari nomor dokumen, kegiatan, posisi berkas, atau catatan..."
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="gap-2">
                                    <Filter className="size-4" />
                                    Filter
                                </Button>
                            </form>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-muted-foreground mr-1 text-xs">Status:</span>
                                <button
                                    type="button"
                                    onClick={() => handleStatusFilter('all')}
                                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                        filters.status === 'all'
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    Semua
                                </button>
                                {stages.map((stg) => (
                                    <button
                                        key={stg.value}
                                        type="button"
                                        onClick={() => handleStatusFilter(stg.value)}
                                        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                            filters.status === stg.value
                                                ? 'bg-primary text-primary-foreground shadow-xs'
                                                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        {stg.value}
                                    </button>
                                ))}
                            </div>
                        </CardContent>

                        {/* Audit Trail Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/40 border-border/60 text-muted-foreground border-b text-xs font-medium uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Dokumen</th>
                                        <th className="px-4 py-3 text-center">Tahap Status</th>
                                        <th className="px-4 py-3">Posisi Berkas</th>
                                        <th className="px-4 py-3">Petugas Pembaruan</th>
                                        <th className="px-4 py-3">Catatan / Catatan Revisi</th>
                                        <th className="px-4 py-3 text-right">Waktu Update</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-border/60 divide-y">
                                    {trackings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-muted-foreground px-4 py-12 text-center text-xs">
                                                Tidak ada rekaman jejak audit ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        trackings.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="text-primary font-mono text-xs font-bold">
                                                        {item.dokumen_pengajuan?.nomor_pengajuan || '-'}
                                                    </div>
                                                    <div className="text-foreground line-clamp-1 max-w-xs text-xs font-medium">
                                                        {item.dokumen_pengajuan?.nama_kegiatan || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <StatusBadge status={item.tahap} size="sm" />
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div className="text-foreground flex items-center gap-1 font-semibold">
                                                        <MapPin className="text-primary size-3.5 shrink-0" />
                                                        {item.posisi_berkas}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div className="text-foreground font-medium">{item.updater_name}</div>
                                                    <div className="text-muted-foreground text-[11px]">{item.updater_role}</div>
                                                </td>
                                                <td className="max-w-xs px-4 py-3 text-xs">
                                                    {item.catatan ? (
                                                        <span className="bg-muted/60 text-foreground line-clamp-2 rounded px-1.5 py-0.5 font-mono text-[11px]">
                                                            {item.catatan}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground/60">-</span>
                                                    )}
                                                </td>
                                                <td className="text-muted-foreground px-4 py-3 text-right font-mono text-xs whitespace-nowrap">
                                                    {formatDate(item.waktu_update)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {item.dokumen_pengajuan?.id && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleSelectDocument(item.dokumen_pengajuan!.id);
                                                                setViewMode('tracker');
                                                            }}
                                                            className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                                                        >
                                                            Lacak
                                                            <ArrowUpRight className="size-3" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {trackings.links && trackings.links.length > 3 && (
                            <div className="border-border/60 bg-muted/20 text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
                                <div>
                                    Menampilkan <span className="text-foreground font-medium">{trackings.from || 0}</span> sampai{' '}
                                    <span className="text-foreground font-medium">{trackings.to || 0}</span> dari{' '}
                                    <span className="text-foreground font-medium">{trackings.total}</span> log
                                </div>
                                <div className="flex gap-1">
                                    {trackings.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground shadow-xs'
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
                )}
            </div>
        </AppLayout>
    );
}
