import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    ChevronDown,
    DollarSign,
    Download,
    FileCheck,
    FileText,
    Filter,
    GitCommitHorizontal,
    Search,
    TrendingDown,
    TrendingUp,
    UserPlus,
    Users,
    Waves,
} from 'lucide-react';
import { StatusBadge } from '@/components/dokumen/status-badge';
import { PerformanceOverview, type PerformanceChartPoint } from '@/components/dashboard/performance-overview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DokumenPengajuan, User } from '@/types';

interface DashboardProps {
    recentDocuments: DokumenPengajuan[];
    actionRequired: DokumenPengajuan[];
    recentDisbursements: DokumenPengajuan[];
    latestDisbursement?: DokumenPengajuan | null;
    stats: {
        total_pengajuan: number;
        total_nominal?: number;
        total_cair_nominal?: number;
        menunggu_verifikasi: number;
        perlu_revisi: number;
        sedang_diproses: number;
        disetujui: number;
        dana_cair: number;
    };
    performanceChartData?: PerformanceChartPoint[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboards',
        href: '/dashboard',
    },
    {
        title: 'Default',
        href: '/dashboard',
    },
];

export default function Dashboard({
    recentDocuments = [],
    actionRequired = [],
    recentDisbursements = [],
    latestDisbursement = null,
    stats,
    performanceChartData = [],
}: DashboardProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    const filteredDocuments = recentDocuments.filter((doc) => {
        const matchesSearch =
            !searchTerm ||
            doc.nama_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.nomor_pengajuan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || doc.status_terkini === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalNominal = stats.total_nominal ?? recentDocuments.reduce(
        (acc, curr) => acc + (Number(curr.total_usulan) || 0),
        0
    );

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(filteredDocuments.map((d) => d.id));
        } else {
            setSelectedRows([]);
        }
    };

    const toggleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Default Dashboard — Studio Admin" />

            <div className="@container/main flex flex-col gap-4 md:gap-6 p-4 md:p-6 w-full">
                {/* 1. MetricCards - Exact match with next-shadcn-admin-dashboard */}
                <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                    {/* Card 1: Total Revenue / Pagu Usulan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                    <DollarSign className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Total Pagu Usulan</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
                                    {totalNominal > 0 ? formatCurrency(totalNominal) : 'Rp 1.968.500.000'}
                                </div>
                                <Badge>
                                    <TrendingUp className="size-3" />
                                    +12.5%
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">Akumulasi pagu usulan aktif TA 2026</p>
                        </CardContent>
                    </Card>

                    {/* Card 2: New Customers / Total Berkas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                    <UserPlus className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Total Berkas Masuk</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
                                    {stats.total_pengajuan}
                                </div>
                                <Badge variant="destructive">
                                    <TrendingDown className="size-3" />
                                    -20%
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {stats.perlu_revisi} berkas perlu revisi pengusul
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 3: Active Accounts / Menunggu Verifikasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                    <Users className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Antrean Verifikasi Fakultas</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
                                    {stats.menunggu_verifikasi}
                                </div>
                                <Badge>
                                    <TrendingUp className="size-3" />
                                    +12.5%
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">Pemeriksaan kepatuhan standar tarif SBM</p>
                        </CardContent>
                    </Card>

                    {/* Card 4: Realisasi Pencairan SAKTI */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                                    <Waves className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Pencairan Selesai (SAKTI)</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="font-semibold text-2xl tabular-nums leading-none tracking-tight text-foreground">
                                    {latestDisbursement
                                        ? formatCurrency(latestDisbursement.total_usulan)
                                        : stats.total_cair_nominal && stats.total_cair_nominal > 0
                                          ? formatCurrency(stats.total_cair_nominal)
                                          : 'Rp 28.500.000'}
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
                                    <TrendingUp className="size-3 mr-1" />
                                    {stats.dana_cair} Berkas Cair
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <span className="font-medium text-foreground line-clamp-1 truncate" title={latestDisbursement?.nama_kegiatan ?? 'Penyusunan Rencana Strategis (Renstra) Penelitian Fakultas 2026-2030'}>
                                    {latestDisbursement?.nama_kegiatan ?? 'Penyusunan Rencana Strategis (Renstra) Penelitian Fakultas 2026-2030'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. PerformanceOverview Card - Interactive Chart replicating next-shadcn-admin-dashboard */}
                <PerformanceOverview initialData={performanceChartData} />

                {/* 3. SubscriberOverview / Recent Documents Table Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="leading-none">
                            {recentDocuments.length} Dokumen Pengajuan Terkini
                        </CardTitle>
                        <CardDescription>
                            Daftar berkas usulan kegiatan, status tahapan verifikasi, unit kerja pengusul, dan pagu anggaran.
                        </CardDescription>
                        <CardAction>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari kegiatan..."
                                        className="h-8 w-44 lg:w-56 pl-8 text-xs"
                                    />
                                </div>

                                <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                    <Link href="/laporan">
                                        <Download className="size-3" />
                                        <span>Export</span>
                                    </Link>
                                </Button>
                            </div>
                        </CardAction>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <div className="rounded-lg border border-border/70 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="w-10">
                                            <Checkbox
                                                checked={
                                                    selectedRows.length === filteredDocuments.length &&
                                                    filteredDocuments.length > 0
                                                }
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Nama Kegiatan & Nomor</TableHead>
                                        <TableHead>Status Dokumen (8 Tahap)</TableHead>
                                        <TableHead>Pengusul & Unit</TableHead>
                                        <TableHead className="text-right">Pagu Usulan</TableHead>
                                        <TableHead>Tanggal Pelaksanaan</TableHead>
                                        <TableHead className="text-right w-12">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-28 text-center text-xs text-muted-foreground">
                                                Tidak ada dokumen pengajuan yang cocok dengan pencarian.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDocuments.map((doc) => (
                                            <TableRow
                                                key={doc.id}
                                                data-state={selectedRows.includes(doc.id) ? 'selected' : undefined}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(doc.id)}
                                                        onCheckedChange={() => toggleSelectRow(doc.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <Link
                                                        href={`/dokumen-pengajuan/${doc.id}`}
                                                        className="font-medium text-foreground hover:underline line-clamp-1 text-xs"
                                                    >
                                                        {doc.nama_kegiatan}
                                                    </Link>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground font-mono">
                                                        <span>{doc.nomor_pengajuan}</span>
                                                        <span>•</span>
                                                        <span>{doc.jenis_anggaran}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={doc.status_terkini} size="sm" />
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <span className="font-medium text-foreground block">
                                                        {doc.user?.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground block">
                                                        {doc.user?.unit || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums text-foreground text-xs">
                                                    {formatCurrency(doc.total_usulan)}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatDate(doc.tgl_pelaksanaan)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button asChild size="icon" variant="ghost" className="size-7">
                                                        <Link href={`/dokumen-pengajuan/${doc.id}`}>
                                                            <ArrowUpRight className="size-3.5" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
