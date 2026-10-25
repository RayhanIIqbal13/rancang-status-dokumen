import { PerformanceOverview, type PerformanceChartPoint } from '@/components/dashboard/performance-overview';
import { StatusBadge } from '@/components/dokumen/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DokumenPengajuan, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, DollarSign, Download, Search, TrendingDown, TrendingUp, UserPlus, Users, Waves } from 'lucide-react';
import { useState } from 'react';

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
    actionRequired: _actionRequired = [],
    recentDisbursements: _recentDisbursements = [],
    latestDisbursement = null,
    stats,
    performanceChartData = [],
}: DashboardProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, _setStatusFilter] = useState('all');
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

        const matchesStatus = statusFilter === 'all' || doc.status_terkini === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalNominal = stats.total_nominal ?? recentDocuments.reduce((acc, curr) => acc + (Number(curr.total_usulan) || 0), 0);

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(filteredDocuments.map((d) => d.id));
        } else {
            setSelectedRows([]);
        }
    };

    const toggleSelectRow = (id: number) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Default Dashboard — Studio Admin" />

            <div className="@container/main flex w-full flex-col gap-4 p-4 md:gap-6 md:p-6">
                {/* FSTI Characteristic Header Banner */}
                <div
                    className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-md"
                    style={{ backgroundColor: '#2f4dd3' }}
                >
                    <div className="pola-titik pointer-events-none absolute inset-0 opacity-35" />

                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3.5 sm:gap-4">
                            <div className="flex h-12 w-auto shrink-0 items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 shadow-sm">
                                <img src="/images/logoitk.png" alt="Institut Teknologi Kalimantan" className="h-full w-auto object-contain" />
                                <img src="/images/logofsti.png" alt="FSTI ITK" className="h-full w-auto object-contain" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                                        SIM-Keuangan FSTI ITK
                                    </span>
                                    <span className="text-xs text-blue-100">
                                        TA 2026 · Standar Biaya Masukan
                                    </span>
                                </div>
                                <h1 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                                    Selamat Datang, {user.name}
                                </h1>
                                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                                    Unit: {user.unit || 'Fakultas Sains dan Teknologi Informasi'} · Peran:{' '}
                                    <span className="font-semibold capitalize">{user.role?.replace('_', ' ')}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                asChild
                                size="sm"
                                className="rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-semibold shadow-xs"
                            >
                                <Link href="/dokumen-pengajuan/create">
                                    + Ajukan Usulan Baru
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur"
                            >
                                <Link href="/status-tracking">
                                    Lacak 8 Tahap
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 1. MetricCards - Exact match with next-shadcn-admin-dashboard */}
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4">
                    {/* Card 1: Total Revenue / Pagu Usulan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                    <DollarSign className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Total Pagu Usulan</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">
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
                                <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                    <UserPlus className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Total Berkas Masuk</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">{stats.total_pengajuan}</div>
                                <Badge variant="destructive">
                                    <TrendingDown className="size-3" />
                                    -20%
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{stats.perlu_revisi} berkas perlu revisi pengusul</p>
                        </CardContent>
                    </Card>

                    {/* Card 3: Active Accounts / Menunggu Verifikasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                    <Users className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Antrean Verifikasi Fakultas</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">{stats.menunggu_verifikasi}</div>
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
                                <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                    <Waves className="size-4" />
                                </div>
                            </CardTitle>
                            <CardDescription>Pencairan Selesai (SAKTI)</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-foreground text-2xl leading-none font-semibold tracking-tight tabular-nums">
                                    {latestDisbursement
                                        ? formatCurrency(latestDisbursement.total_usulan)
                                        : stats.total_cair_nominal && stats.total_cair_nominal > 0
                                          ? formatCurrency(stats.total_cair_nominal)
                                          : 'Rp 28.500.000'}
                                </div>
                                <Badge className="border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400">
                                    <TrendingUp className="mr-1 size-3" />
                                    {stats.dana_cair} Berkas Cair
                                </Badge>
                            </div>
                            <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
                                <span
                                    className="text-foreground line-clamp-1 truncate font-medium"
                                    title={
                                        latestDisbursement?.nama_kegiatan ?? 'Penyusunan Rencana Strategis (Renstra) Penelitian Fakultas 2026-2030'
                                    }
                                >
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
                        <CardTitle className="leading-none">{recentDocuments.length} Dokumen Pengajuan Terkini</CardTitle>
                        <CardDescription>
                            Daftar berkas usulan kegiatan, status tahapan verifikasi, unit kerja pengusul, dan pagu anggaran.
                        </CardDescription>
                        <CardAction className="w-full sm:w-auto">
                            <div className="flex w-full flex-wrap sm:flex-nowrap items-center gap-2">
                                <div className="relative flex-1 sm:flex-initial">
                                    <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                                    <Input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari kegiatan..."
                                        className="h-8 w-full sm:w-44 pl-8 text-xs lg:w-56"
                                    />
                                </div>

                                <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs shrink-0">
                                    <Link href="/laporan">
                                        <Download className="size-3" />
                                        <span>Export</span>
                                    </Link>
                                </Button>
                            </div>
                        </CardAction>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <Table className="min-w-[700px]">
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="w-10">
                                            <Checkbox
                                                checked={selectedRows.length === filteredDocuments.length && filteredDocuments.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Nama Kegiatan & Nomor</TableHead>
                                        <TableHead>Status Dokumen (8 Tahap)</TableHead>
                                        <TableHead>Pengusul & Unit</TableHead>
                                        <TableHead className="text-right">Pagu Usulan</TableHead>
                                        <TableHead>Tanggal Pelaksanaan</TableHead>
                                        <TableHead className="w-12 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-muted-foreground h-28 text-center text-xs">
                                                Tidak ada dokumen pengajuan yang cocok dengan pencarian.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDocuments.map((doc) => (
                                            <TableRow
                                                key={doc.id}
                                                data-state={selectedRows.includes(doc.id) ? 'selected' : undefined}
                                                className="hover:bg-muted/40 transition-colors"
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
                                                        className="text-foreground line-clamp-1 text-xs font-medium hover:underline"
                                                    >
                                                        {doc.nama_kegiatan}
                                                    </Link>
                                                    <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 font-mono text-[10px]">
                                                        <span>{doc.nomor_pengajuan}</span>
                                                        <span>•</span>
                                                        <span>{doc.jenis_anggaran}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={doc.status_terkini} size="sm" />
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <span className="text-foreground block font-medium">{doc.user?.name}</span>
                                                    <span className="text-muted-foreground block text-[10px]">{doc.user?.unit || '-'}</span>
                                                </TableCell>
                                                <TableCell className="text-foreground text-right text-xs font-medium tabular-nums">
                                                    {formatCurrency(doc.total_usulan)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">{formatDate(doc.tgl_pelaksanaan)}</TableCell>
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
