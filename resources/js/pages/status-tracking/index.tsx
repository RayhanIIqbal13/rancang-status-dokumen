import { RevisionAlertBanner } from '@/components/dokumen/revision-alert-banner';
import { StatusBadge } from '@/components/dokumen/status-badge';
import { StatusTimeline } from '@/components/dokumen/status-timeline';
import { StatusUpdateDialog } from '@/components/dokumen/status-update-dialog';
import { WorkflowStepper } from '@/components/dokumen/workflow-stepper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    DokumenPengajuan,
    DocumentStatusType,
    PaginatedData,
    SharedData,
    StatusStageInfo,
    StatusTracking,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowUpRight,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    FileCheck,
    FileText,
    Filter,
    FolderSearch,
    GitCommitHorizontal,
    History,
    IdCard,
    Layers,
    MapPin,
    Search,
    Shield,
    Sparkles,
    User as UserIcon,
    Wallet,
    X,
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

export default function StatusTrackingIndex({
    activeDocument,
    accessibleDocuments,
    trackings,
    filters,
    stages,
}: StatusTrackingIndexProps) {
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
            { preserveState: true }
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
            { preserveState: true }
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
            { preserveState: true }
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

    const isFinanceOrLeader =
        currentUser.role === 'staf_keuangan' ||
        currentUser.role === 'pimpinan' ||
        currentUser.role === 'admin';

    const latestTracking = activeDocument?.status_trackings?.[activeDocument.status_trackings.length - 1] || activeDocument?.latest_status_tracking;
    const isRevision = activeDocument?.status_terkini === 'Perlu Revisi';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status Tracking Dokumen — SAK ITK" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* 1. Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Status Tracking Dokumen
                            </h1>
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                                Pelacakan Berkas
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pantau tahapan proses verifikasi, disposisi berkas, persetujuan pimpinan, dan pencairan dana usulan secara real-time
                        </p>
                    </div>

                    {/* View mode toggle (Focused tracker vs Global audit) */}
                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('tracker')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                                    viewMode === 'tracker'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Pelacakan Dokumen
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('global_audit')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                                    viewMode === 'global_audit'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Seluruh Log Audit
                            </button>
                        </div>

                        {activeDocument && isFinanceOrLeader && (
                            <StatusUpdateDialog document={activeDocument} stages={stages} />
                        )}
                    </div>
                </div>

                {viewMode === 'tracker' ? (
                    <>
                        {/* Document Switcher Toolbar */}
                        {accessibleDocuments.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card shadow-xs">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <FolderSearch className="size-4 text-primary shrink-0" />
                                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                                        Dokumen Dilacak:
                                    </span>
                                    <div className="min-w-0 truncate">
                                        <span className="font-mono text-xs font-bold text-primary mr-2">
                                            {activeDocument?.nomor_pengajuan}
                                        </span>
                                        <span className="text-xs font-medium text-foreground truncate hidden md:inline">
                                            — {activeDocument?.nama_kegiatan}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Dialog open={selectorModalOpen} onOpenChange={setSelectorModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                                <Layers className="size-3.5" />
                                                Pilih Dokumen Lain ({accessibleDocuments.length})
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                                            <DialogHeader>
                                                <DialogTitle>Pilih Dokumen Pengajuan</DialogTitle>
                                                <DialogDescription>
                                                    Pilih berkas pengajuan keuangan yang ingin dipantau siklus statusnya.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="overflow-y-auto space-y-2 pr-1 max-h-[55vh]">
                                                {accessibleDocuments.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        onClick={() => handleSelectDocument(doc.id)}
                                                        className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                                                            activeDocument?.id === doc.id
                                                                ? 'border-primary bg-primary/5 shadow-xs'
                                                                : 'border-border/70 hover:border-border hover:bg-muted/30'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs font-bold text-primary">
                                                                    {doc.nomor_pengajuan}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">•</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {doc.user?.name} ({doc.user?.unit})
                                                                </span>
                                                            </div>
                                                            <h5 className="text-sm font-semibold text-foreground mt-0.5">
                                                                {doc.nama_kegiatan}
                                                            </h5>
                                                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                                <span>{doc.jenis_anggaran}</span>
                                                                <span>•</span>
                                                                <span className="font-semibold text-foreground">
                                                                    {formatCurrency(doc.total_usulan)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                                            <StatusBadge status={doc.status_terkini} size="sm" />
                                                            <ChevronRight className="size-4 text-muted-foreground" />
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
                                <Card className="shadow-xs border-border/80 overflow-hidden">
                                    <CardHeader className="p-5 pb-3 border-b border-border/60 bg-muted/20">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {activeDocument.nomor_pengajuan}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Diajukan pada {formatDate(activeDocument.created_at)}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-lg font-bold text-foreground mt-1.5">
                                                    {activeDocument.nama_kegiatan}
                                                </CardTitle>
                                                <CardDescription className="text-xs mt-0.5 line-clamp-2">
                                                    {activeDocument.uraian || 'Tidak ada uraian kegiatan tambahan.'}
                                                </CardDescription>
                                            </div>

                                            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                    Status Saat Ini
                                                </span>
                                                <StatusBadge status={activeDocument.status_terkini} size="lg" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Applicant */}
                                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/10">
                                                <UserIcon className="size-4 text-primary mt-0.5 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                                        Pengusul
                                                    </span>
                                                    <p className="text-sm font-bold text-foreground truncate">
                                                        {activeDocument.user?.name || '-'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {activeDocument.user?.unit || '-'} {activeDocument.user?.nip_nim ? `• ${activeDocument.user.nip_nim}` : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Activity & Date */}
                                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/10">
                                                <Calendar className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                                        Pelaksanaan
                                                    </span>
                                                    <p className="text-sm font-bold text-foreground">
                                                        {formatDate(activeDocument.tgl_pelaksanaan)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        Jadwal Kegiatan
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Budget Type */}
                                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/10">
                                                <CreditCard className="size-4 text-purple-600 mt-0.5 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                                        Sumber Anggaran
                                                    </span>
                                                    <p className="text-sm font-bold text-foreground truncate">
                                                        {activeDocument.jenis_anggaran}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Alokasi Pagu Kampus
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Proposed Amount */}
                                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/10">
                                                <Wallet className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                                        Total Usulan
                                                    </span>
                                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(activeDocument.total_usulan)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Pagu Diajukan
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Physical Location Badge */}
                                        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="size-4 text-primary shrink-0" />
                                                <span>Posisi Berkas Fisik:</span>
                                                <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                                                    {latestTracking?.posisi_berkas || 'Subbag Keuangan Fakultas'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="size-3.5 text-muted-foreground shrink-0" />
                                                <span>Pembaruan Terakhir:</span>
                                                <span className="font-medium text-foreground">
                                                    {formatDate(latestTracking?.waktu_update)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 5. Revision State Prominent Alert Banner */}
                                {isRevision && (
                                    <RevisionAlertBanner
                                        document={activeDocument}
                                        stages={stages}
                                        className="shadow-xs"
                                    />
                                )}

                                {/* Horizontal 8-Stage Workflow Stepper */}
                                <WorkflowStepper
                                    currentStatus={activeDocument.status_terkini}
                                    stages={stages}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                    {/* 3 & 4. Status Timeline (All 8 stages in chronological order with visual states) */}
                                    <div className="lg:col-span-7 space-y-4">
                                        <Card className="shadow-xs border-border/80">
                                            <CardHeader className="p-5 pb-3 border-b border-border/60">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base font-bold">
                                                            Timeline 8 Tahap Siklus Dokumen
                                                        </CardTitle>
                                                        <CardDescription className="text-xs mt-0.5">
                                                            Pelacakan berurutan dari pengajuan awal hingga pencairan dana SP2D
                                                        </CardDescription>
                                                    </div>
                                                    <Activity className="size-4 text-primary" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-5">
                                                <StatusTimeline
                                                    document={activeDocument}
                                                    stages={stages}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* 6. Status History Table (Audit Trail of this document) */}
                                    <div className="lg:col-span-5 space-y-4">
                                        <Card className="shadow-xs border-border/80">
                                            <CardHeader className="p-5 pb-3 border-b border-border/60">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base font-bold">
                                                            Histori & Jejak Audit
                                                        </CardTitle>
                                                        <CardDescription className="text-xs mt-0.5">
                                                            Catatan perubahan status yang tidak dapat diubah (immutable log)
                                                        </CardDescription>
                                                    </div>
                                                    <History className="size-4 text-muted-foreground" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                {activeDocument.status_trackings && activeDocument.status_trackings.length > 0 ? (
                                                    <div className="divide-y divide-border/60">
                                                        {activeDocument.status_trackings.map((log, logIdx) => (
                                                            <div key={log.id || logIdx} className="p-4 space-y-2 hover:bg-muted/20 transition-colors">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <StatusBadge status={log.tahap} size="sm" />
                                                                    <span className="font-mono text-[11px] text-muted-foreground">
                                                                        {formatDate(log.waktu_update)}
                                                                    </span>
                                                                </div>

                                                                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                                                                    <span className="text-foreground font-medium">
                                                                        Oleh: {log.updater_name}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="size-3 text-muted-foreground" />
                                                                        {log.posisi_berkas}
                                                                    </span>
                                                                </div>

                                                                {log.catatan && (
                                                                    <p className="text-xs rounded bg-muted/50 p-2 font-mono text-foreground border border-border/50">
                                                                        {log.catatan}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center text-xs text-muted-foreground">
                                                        Belum ada riwayat audit tercatat untuk dokumen ini.
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Card className="shadow-xs border-border/80 p-12 text-center">
                                <FileText className="size-10 text-muted-foreground mx-auto opacity-50 mb-3" />
                                <h3 className="text-base font-semibold text-foreground">
                                    Tidak Ada Dokumen yang Dipilih
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                                    Belum ada berkas pengajuan keuangan yang dapat ditampilkan, atau akun Anda belum memiliki usulan aktif.
                                </p>
                                <Button asChild size="sm">
                                    <Link href={route('dokumen-pengajuan.create')}>
                                        Buat Pengajuan Baru
                                    </Link>
                                </Button>
                            </Card>
                        )}
                    </>
                ) : (
                    /* Global Audit Trail Mode (All documents history log) */
                    <Card className="shadow-xs border-border/80">
                        <CardHeader className="p-5 pb-3 border-b border-border/60">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base font-bold">
                                        Log Jejak Audit Seluruh Dokumen
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-0.5">
                                        Catatan riwayat setiap mutasi status, petugas pelaksana, dan waktu update
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Search and filter bar */}
                        <CardContent className="p-4 border-b border-border/60 bg-muted/10 space-y-3">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                                <span className="text-xs text-muted-foreground mr-1">Status:</span>
                                <button
                                    type="button"
                                    onClick={() => handleStatusFilter('all')}
                                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
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
                                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
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
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/40 border-b border-border/60 text-xs uppercase font-medium text-muted-foreground">
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
                                <tbody className="divide-y divide-border/60">
                                    {trackings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-12 text-center text-xs text-muted-foreground">
                                                Tidak ada rekaman jejak audit ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        trackings.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="font-mono text-xs font-bold text-primary">
                                                        {item.dokumen_pengajuan?.nomor_pengajuan || '-'}
                                                    </div>
                                                    <div className="text-xs text-foreground font-medium line-clamp-1 max-w-xs">
                                                        {item.dokumen_pengajuan?.nama_kegiatan || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <StatusBadge status={item.tahap} size="sm" />
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div className="flex items-center gap-1 font-semibold text-foreground">
                                                        <MapPin className="size-3.5 text-primary shrink-0" />
                                                        {item.posisi_berkas}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div className="font-medium text-foreground">{item.updater_name}</div>
                                                    <div className="text-muted-foreground text-[11px]">{item.updater_role}</div>
                                                </td>
                                                <td className="px-4 py-3 text-xs max-w-xs">
                                                    {item.catatan ? (
                                                        <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground line-clamp-2">
                                                            {item.catatan}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground/60">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-mono text-muted-foreground whitespace-nowrap">
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
                                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
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
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
                                <div>
                                    Menampilkan <span className="font-medium text-foreground">{trackings.from || 0}</span> sampai{' '}
                                    <span className="font-medium text-foreground">{trackings.to || 0}</span> dari{' '}
                                    <span className="font-medium text-foreground">{trackings.total}</span> log
                                </div>
                                <div className="flex gap-1">
                                    {trackings.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
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
