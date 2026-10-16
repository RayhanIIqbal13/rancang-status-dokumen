import { StatusBadge } from '@/components/dokumen/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DocumentStatusType, DokumenPengajuan } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    CheckCircle2,
    DollarSign,
    FileText,
    Layers,
    LayoutDashboard,
    Percent,
    PieChart,
    Printer,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface AnggaranByType {
    jenis_anggaran: string;
    count: number;
    total_usulan: string | number;
}

interface StatusDistItem {
    status: DocumentStatusType;
    label: string;
    color: string;
    count: number;
    percentage: number;
}

interface LaporanIndexProps {
    summary: {
        total_dokumen: number;
        total_usulan: number;
        total_realisasi: number;
        serapan_persen: number;
    };
    anggaranByType: AnggaranByType[];
    statusDistribution: StatusDistItem[];
    recentDisbursed: DokumenPengajuan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Keuangan', href: '/laporan' },
];

export default function LaporanIndex({ summary, anggaranByType, statusDistribution, recentDisbursed }: LaporanIndexProps) {
    const [viewMode, setViewMode] = useState<'dashboard' | 'report'>('dashboard');
    const [currentDate] = useState(() => new Date());

    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    const formatIndonesianDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Layanan Keuangan & Realisasi Dokumen - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6 print:p-0">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                            <h1 className="text-foreground text-lg sm:text-xl font-semibold tracking-tight">
                                Laporan Realisasi & Pelacakan Dokumen
                            </h1>
                            <span className="border-primary/20 bg-primary/10 text-primary inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap">
                                TA 2026
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Ringkasan eksekutif alokasi pagu usulan, serapan SP2D, dan sebaran 8 tahapan alur berkas
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={viewMode === 'report' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode(viewMode === 'dashboard' ? 'report' : 'dashboard')}
                            className="h-8 gap-1.5 text-xs shadow-xs"
                        >
                            {viewMode === 'dashboard' ? (
                                <>
                                    <FileText className="size-3.5" />
                                    <span>Pratinjau Format Cetak</span>
                                </>
                            ) : (
                                <>
                                    <LayoutDashboard className="size-3.5" />
                                    <span>Tampilan Dashboard</span>
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 gap-1.5 text-xs shadow-xs">
                            <Printer className="size-3.5" />
                            <span>Cetak Laporan</span>
                        </Button>
                    </div>
                </div>

                {/* --- 1. INTERACTIVE DASHBOARD VIEW (Visible on screen when viewMode === 'dashboard') --- */}
                {viewMode === 'dashboard' && (
                    <div className="space-y-5 print:hidden">
                        {/* Studio Admin KPI Stat Tiles */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Total Usulan */}
                            <div className="from-primary/5 to-card ring-foreground/10 overflow-hidden rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-muted-foreground text-xs font-medium truncate">Total Pagu Usulan</span>
                                    <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                        <Wallet className="size-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="text-foreground text-xl sm:text-2xl font-bold tabular-nums tracking-tight truncate block">
                                        {formatCurrency(summary.total_usulan)}
                                    </span>
                                    <p className="text-muted-foreground mt-0.5 text-[11px] truncate">
                                        Dari {summary.total_dokumen} berkas kegiatan
                                    </p>
                                </div>
                            </div>

                            {/* Total Realisasi Cair */}
                            <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-emerald-500/10 p-4 shadow-xs ring-1 ring-emerald-500/30">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 truncate">Total Realisasi Cair</span>
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <DollarSign className="size-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums tracking-tight dark:text-emerald-400 truncate block">
                                        {formatCurrency(summary.total_realisasi)}
                                    </span>
                                    <p className="mt-0.5 text-[11px] text-emerald-600/80 truncate">Status Dana Cair (SP2D Selesai)</p>
                                </div>
                            </div>

                            {/* Daya Serap */}
                            <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-blue-500/10 p-4 shadow-xs ring-1 ring-blue-500/30">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400 truncate">Daya Serap Pagu</span>
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <Percent className="size-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-bold text-blue-700 tabular-nums tracking-tight dark:text-blue-400">
                                            {summary.serapan_persen}%
                                        </span>
                                        <span className="text-muted-foreground text-[11px]">terserap</span>
                                    </div>
                                    <div className="bg-muted/60 mt-2 h-1 w-full overflow-hidden rounded-full">
                                        <div
                                            className="h-1 rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-400"
                                            style={{ width: `${Math.min(summary.serapan_persen, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Total Dokumen */}
                            <div className="from-primary/5 to-card ring-foreground/10 overflow-hidden rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-muted-foreground text-xs font-medium truncate">Total Dokumen</span>
                                    <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                        <Layers className="size-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2 flex items-baseline justify-between">
                                    <span className="text-foreground text-2xl font-bold tabular-nums tracking-tight">
                                        {summary.total_dokumen}
                                    </span>
                                    <span className="text-muted-foreground text-[11px]">berkas aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* 2-Column Section */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                            {/* Status Distribution (7 cols) */}
                            <div className="bg-card space-y-4 rounded-xl border p-5 shadow-2xs lg:col-span-7">
                                <div className="flex items-center justify-between border-b pb-3">
                                    <div>
                                        <h2 className="text-foreground text-sm font-semibold tracking-tight">Distribusi Berkas 8 Tahapan Alur</h2>
                                        <p className="text-muted-foreground mt-0.5 text-xs">Sebaran dokumen pada alur verifikasi & pelacakan resmi</p>
                                    </div>
                                    <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                        <Activity className="size-3.5" />
                                    </div>
                                </div>

                                <div className="space-y-3.5 pt-1">
                                    {statusDistribution.map((item, idx) => (
                                        <div key={item.status} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground w-4 font-mono text-[10px]">{idx + 1}.</span>
                                                    <span className="text-foreground font-medium">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-foreground font-medium tabular-nums">{item.count} berkas</span>
                                                    <span className="text-muted-foreground w-10 text-right tabular-nums">{item.percentage}%</span>
                                                </div>
                                            </div>
                                            <div className="bg-muted/60 h-1.5 w-full overflow-hidden rounded-full">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        item.status === 'Dana Cair'
                                                            ? 'bg-emerald-500'
                                                            : item.status === 'Perlu Revisi'
                                                              ? 'bg-rose-500'
                                                              : item.status === 'Disetujui, Kegiatan Berjalan'
                                                                ? 'bg-teal-500'
                                                                : item.status === 'Verifikasi Fakultas'
                                                                  ? 'bg-blue-500'
                                                                  : 'bg-primary'
                                                    }`}
                                                    style={{ width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Breakdown by Budget Type (5 cols) */}
                            <div className="bg-card space-y-4 rounded-xl border p-5 shadow-2xs lg:col-span-5">
                                <div className="flex items-center justify-between border-b pb-3">
                                    <div>
                                        <h2 className="text-foreground text-sm font-semibold tracking-tight">Usulan Menurut Sumber Anggaran</h2>
                                        <p className="text-muted-foreground mt-0.5 text-xs">Proporsi alokasi pagu menurut klaster belanja</p>
                                    </div>
                                    <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                        <PieChart className="size-3.5" />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-1">
                                    {anggaranByType.length === 0 ? (
                                        <p className="text-muted-foreground py-8 text-center text-xs">Belum ada data anggaran tercatat.</p>
                                    ) : (
                                        anggaranByType.map((item) => {
                                            const percentOfTotal =
                                                summary.total_usulan > 0 ? Math.round((Number(item.total_usulan) / summary.total_usulan) * 100) : 0;

                                            return (
                                                <div key={item.jenis_anggaran} className="bg-muted/20 space-y-1.5 rounded-lg border p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-foreground text-xs font-medium">{item.jenis_anggaran}</span>
                                                        <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                                                            {item.count} usulan
                                                        </span>
                                                    </div>
                                                    <div className="flex items-baseline justify-between text-xs">
                                                        <span className="text-foreground text-sm font-semibold tabular-nums">
                                                            {formatCurrency(item.total_usulan)}
                                                        </span>
                                                        <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
                                                            {percentOfTotal}% dari total
                                                        </span>
                                                    </div>
                                                    <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
                                                        <div className="bg-primary h-1 rounded-full" style={{ width: `${percentOfTotal}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Completed Disbursements Table Card */}
                        <div className="bg-card overflow-hidden rounded-xl border shadow-2xs">
                            <div className="flex items-center justify-between border-b p-4">
                                <div>
                                    <h2 className="text-foreground text-sm font-semibold tracking-tight">
                                        Realisasi Pencairan Terakhir (Siklus Selesai)
                                    </h2>
                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                        Dokumen yang telah menyelesaikan verifikasi SPJ dan pencairan dana di aplikasi SAKTI
                                    </p>
                                </div>
                                <div className="flex size-7 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="size-3.5" />
                                </div>
                            </div>

                            <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full min-w-[700px] text-left text-xs">
                                    <thead className="bg-muted/50 text-muted-foreground border-b text-[11px] font-medium tracking-wider uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Nama Usulan Kegiatan</th>
                                            <th className="px-4 py-3">Pengusul / Unit</th>
                                            <th className="px-4 py-3">Sumber Anggaran</th>
                                            <th className="px-4 py-3 text-right">Pagu Usulan</th>
                                            <th className="px-4 py-3 text-right">Realisasi Cair</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentDisbursed.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-muted-foreground px-4 py-8 text-center text-xs">
                                                    Belum ada dokumen yang mencapai status pencairan dana.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentDisbursed.map((doc) => (
                                                <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="text-foreground max-w-xs px-4 py-3.5 font-medium">
                                                        <p className="truncate">{doc.nama_kegiatan}</p>
                                                        <span className="text-primary font-mono text-[11px]">{doc.nomor_pengajuan}</span>
                                                    </td>

                                                    <td className="text-muted-foreground px-4 py-3.5 text-xs">
                                                        <p className="text-foreground font-medium">{doc.user?.name}</p>
                                                        <p className="text-[11px]">{doc.user?.unit || '-'}</p>
                                                    </td>

                                                    <td className="text-muted-foreground px-4 py-3.5 text-xs">
                                                        <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-medium">
                                                            {doc.jenis_anggaran}
                                                        </span>
                                                    </td>

                                                    <td className="text-foreground px-4 py-3.5 text-right font-medium tabular-nums">
                                                        {formatCurrency(doc.total_usulan)}
                                                    </td>

                                                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">
                                                        {doc.realisasi_anggaran?.total_realisasi
                                                            ? formatCurrency(doc.realisasi_anggaran.total_realisasi)
                                                            : formatCurrency(doc.total_usulan)}
                                                    </td>

                                                    <td className="px-4 py-3.5 text-center">
                                                        <StatusBadge status={doc.status_terkini} size="sm" />
                                                    </td>

                                                    <td className="px-4 py-3.5 text-right">
                                                        <Button asChild size="icon" variant="ghost" className="size-7">
                                                            <Link href={route('dokumen-pengajuan.show', doc.id)}>
                                                                <ArrowUpRight className="size-3.5" />
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- 2. REPORT PREVIEW BANNER (Visible on screen when viewMode === 'report') --- */}
                {viewMode === 'report' && (
                    <div className="print:hidden">
                        <div className="border-primary/20 bg-primary/5 mb-5 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border">
                                    <FileText className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-foreground text-sm font-semibold">Pratinjau Format Cetak Dokumen Resmi</h3>
                                    <p className="text-muted-foreground text-xs">
                                        Standar format surat dinas dan laporan pertanggungjawaban Institut Teknologi Kalimantan (Siap Cetak A4)
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setViewMode('dashboard')} className="h-8 gap-1.5 text-xs">
                                    <LayoutDashboard className="size-3.5" />
                                    <span>Kembali ke Dashboard</span>
                                </Button>
                                <Button size="sm" onClick={handlePrint} className="h-8 gap-1.5 text-xs shadow-xs">
                                    <Printer className="size-3.5" />
                                    <span>Cetak Sekarang</span>
                                </Button>
                            </div>
                        </div>

                        {/* On-screen A4 Paper Container */}
                        <div className="border-border/60 mx-auto max-w-4xl rounded-lg border bg-white p-6 sm:p-10 text-black shadow-xl">
                            <FormalReportDocument
                                summary={summary}
                                anggaranByType={anggaranByType}
                                statusDistribution={statusDistribution}
                                recentDisbursed={recentDisbursed}
                                formatCurrency={formatCurrency}
                                formatIndonesianDate={formatIndonesianDate}
                                currentDate={currentDate}
                            />
                        </div>
                    </div>
                )}

                {/* --- 3. DEDICATED OFFICIAL PRINT DOCUMENT (Active whenever window.print() is executed) --- */}
                <div className="hidden print:block print:w-full print:bg-white print:text-black">
                    <FormalReportDocument
                        summary={summary}
                        anggaranByType={anggaranByType}
                        statusDistribution={statusDistribution}
                        recentDisbursed={recentDisbursed}
                        formatCurrency={formatCurrency}
                        formatIndonesianDate={formatIndonesianDate}
                        currentDate={currentDate}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

/**
 * Authentic Institutional Report Document for Institut Teknologi Kalimantan (ITK)
 * Formatted following official government / higher education report standards.
 */
function FormalReportDocument({
    summary,
    anggaranByType,
    statusDistribution,
    recentDisbursed,
    formatCurrency,
    formatIndonesianDate,
    currentDate,
}: {
    summary: LaporanIndexProps['summary'];
    anggaranByType: AnggaranByType[];
    statusDistribution: StatusDistItem[];
    recentDisbursed: DokumenPengajuan[];
    formatCurrency: (val: string | number) => string;
    formatIndonesianDate: (date: Date) => string;
    currentDate: Date;
}) {
    const sisaPagu = summary.total_usulan - summary.total_realisasi;
    const sisaPersen = summary.total_usulan > 0 ? ((sisaPagu / summary.total_usulan) * 100).toFixed(1) : '0';

    const stageUnitMap: Record<string, string> = {
        'Diajukan': 'Staf Pengusul / Unit Pemohon',
        'Verifikasi Fakultas': 'Subbag Keuangan Fakultas',
        'Perlu Revisi': 'Pengusul (Perbaikan Berkas/SBM)',
        'Menunggu SK / Penetapan Universitas': 'Bagian Keuangan & Perencanaan Rektorat',
        'Disetujui, Kegiatan Berjalan': 'Pengusul / Pimpinan Unit Pelaksana',
        'SPJ Diterima & Diverifikasi': 'Tim Verifikator Kuitansi SPJ Fakultas',
        'Diproses di SAKTI': 'Operator Modul Keuangan SAKTI',
        'Dana Cair': 'KPPN / Rekening Penyalur Selesai',
    };

    return (
        <div className="w-full bg-white text-black font-sans leading-relaxed text-xs">
            {/* KOP SURAT RESMI ITK */}
            <div className="flex items-center justify-between pb-2">
                <div className="flex w-full items-center gap-4">
                    {/* ITK Official Seal / Crest */}
                    <div className="size-18 shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="size-full text-black" fill="currentColor">
                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" />
                            <path d="M50 15 L58 35 L80 35 L62 48 L69 70 L50 56 L31 70 L38 48 L20 35 L42 35 Z" fill="currentColor" opacity="0.12" />
                            <path d="M50 20 L56 36 L73 36 L59 47 L64 64 L50 53 L36 64 L41 47 L27 36 L44 36 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <text x="50" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill="currentColor" fontFamily="sans-serif">
                                ITK
                            </text>
                            <text x="50" y="86" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="currentColor" letterSpacing="1">
                                BALIKPAPAN
                            </text>
                        </svg>
                    </div>

                    {/* University Letterhead Heading */}
                    <div className="flex-1 text-center">
                        <h3 className="text-xs sm:text-[13px] font-semibold tracking-wider uppercase text-black">
                            KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
                        </h3>
                        <h2 className="text-sm sm:text-base font-extrabold tracking-tight uppercase text-black">
                            INSTITUT TEKNOLOGI KALIMANTAN
                        </h2>
                        <h4 className="text-xs font-bold tracking-wide uppercase text-black">
                            BAGIAN PERENCANAAN DAN KEUANGAN
                        </h4>
                        <p className="text-[10px] text-neutral-800 mt-0.5">
                            Jalan Soekarno-Hatta Km. 15, Karang Joang, Balikpapan, Kalimantan Timur 76127
                        </p>
                        <p className="text-[10px] text-neutral-800">
                            Laman: https://itk.ac.id | Pos-el: keuangan@itk.ac.id | Narahubung: (0542) 8530801
                        </p>
                    </div>
                </div>
            </div>

            {/* Double Border Line khas Kop Surat Resmi */}
            <div className="border-b-[2.5px] border-black mt-1"></div>
            <div className="border-b-[1px] border-black mt-[1.5px] mb-5"></div>

            {/* Judul & Nomor Laporan Resmi */}
            <div className="my-4 text-center space-y-1">
                <h1 className="text-sm sm:text-base font-extrabold tracking-wider uppercase underline text-black">
                    LAPORAN REALISASI ANGGARAN & PELACAKAN STATUS DOKUMEN
                </h1>
                <p className="text-xs font-bold text-neutral-900 uppercase">
                    TAHUN ANGGARAN 2026 — PERIODE BERJALAN
                </p>
                <p className="text-[11px] font-mono text-neutral-700">
                    Nomor: 042/ITK/KEU-LAPS/X/2026
                </p>
            </div>

            {/* Metadata Ringkasan */}
            <div className="mb-5 border border-black bg-neutral-50 p-2.5 text-[11px] text-black">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                        <span className="font-semibold text-neutral-700">Sumber Integrasi:</span> SAK ITK & SAKTI Kemenkeu
                    </div>
                    <div>
                        <span className="font-semibold text-neutral-700">Tanggal Penyusunan:</span> {formatIndonesianDate(currentDate)}
                    </div>
                    <div>
                        <span className="font-semibold text-neutral-700">Klasifikasi Dokumen:</span> Eksekutif / Resmi
                    </div>
                </div>
            </div>

            {/* BAGIAN I: REKAPITULASI REALISASI ALOKASI ANGGARAN */}
            <div className="mb-5 space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <span>I.</span>
                    <span>REKAPITULASI REALISASI ALOKASI ANGGARAN (EXECUTIVE SUMMARY)</span>
                </h2>
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full min-w-[580px] print:min-w-0 border-collapse border border-black text-xs text-black">
                        <thead>
                            <tr className="bg-neutral-100 font-bold">
                                <th className="border border-black p-2 text-center w-10">No</th>
                                <th className="border border-black p-2 text-left">Indikator Pos Keuangan</th>
                                <th className="border border-black p-2 text-right">Nilai Nominal (Rp) / Kuantitas</th>
                                <th className="border border-black p-2 text-center w-24">Rasio (%)</th>
                                <th className="border border-black p-2 text-left">Keterangan Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-2 text-center">1</td>
                                <td className="border border-black p-2 font-medium">Total Pagu Usulan Anggaran Komitmen</td>
                                <td className="border border-black p-2 text-right font-bold tabular-nums">
                                    {formatCurrency(summary.total_usulan)}
                                </td>
                                <td className="border border-black p-2 text-center font-semibold">100,0%</td>
                                <td className="border border-black p-2 text-neutral-800">
                                    Total usulan terdaftar dari {summary.total_dokumen} berkas kegiatan
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 text-center">2</td>
                                <td className="border border-black p-2 font-medium">Total Realisasi Pencairan Selesai (SP2D)</td>
                                <td className="border border-black p-2 text-right font-bold tabular-nums">
                                    {formatCurrency(summary.total_realisasi)}
                                </td>
                                <td className="border border-black p-2 text-center font-bold">
                                    {summary.serapan_persen}%
                                </td>
                                <td className="border border-black p-2 text-neutral-800">
                                    Telah terbit SP2D Kemenkeu & dana cair ke rekening
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 text-center">3</td>
                                <td className="border border-black p-2 font-medium">Sisa Alokasi Pagu Belum Dicairkan</td>
                                <td className="border border-black p-2 text-right font-bold tabular-nums">
                                    {formatCurrency(sisaPagu)}
                                </td>
                                <td className="border border-black p-2 text-center font-semibold">
                                    {sisaPersen}%
                                </td>
                                <td className="border border-black p-2 text-neutral-800">
                                    Berkas dalam antrean verifikasi fakultas, SK, atau SPJ
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 text-center">4</td>
                                <td className="border border-black p-2 font-medium">Tingkat Penyerapan Anggaran (Daya Serap)</td>
                                <td className="border border-black p-2 text-right font-bold tabular-nums">
                                    {summary.serapan_persen}% dari komitmen
                                </td>
                                <td className="border border-black p-2 text-center font-bold">
                                    {summary.serapan_persen}%
                                </td>
                                <td className="border border-black p-2 text-neutral-800">
                                    Rasio serapan terhadap total alokasi komitmen
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 text-center">5</td>
                                <td className="border border-black p-2 font-medium">Total Berkas Usulan Terdaftar</td>
                                <td className="border border-black p-2 text-right font-bold tabular-nums">
                                    {summary.total_dokumen} Berkas Aktif
                                </td>
                                <td className="border border-black p-2 text-center font-semibold">-</td>
                                <td className="border border-black p-2 text-neutral-800">
                                    Dokumen dalam pengawasan siklus 8 alur SAK ITK
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BAGIAN II: SEBARAN 8 TAHAPAN ALUR DOKUMEN PENGAJUAN */}
            <div className="mb-5 space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <span>II.</span>
                    <span>DISTRIBUSI DOKUMEN PADA 8 TAHAPAN ALUR VERIFIKASI RESMI</span>
                </h2>
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full min-w-[580px] print:min-w-0 border-collapse border border-black text-xs text-black">
                        <thead>
                            <tr className="bg-neutral-100 font-bold">
                                <th className="border border-black p-2 text-center w-10">Tahap</th>
                                <th className="border border-black p-2 text-left">Nama Tahapan Alur SAK ITK</th>
                                <th className="border border-black p-2 text-left">Posisi Berkas Fisik / Penanggung Jawab</th>
                                <th className="border border-black p-2 text-center w-28">Jumlah Berkas</th>
                                <th className="border border-black p-2 text-center w-24">Persentase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusDistribution.map((item, idx) => (
                                <tr key={item.status}>
                                    <td className="border border-black p-2 text-center font-mono font-semibold">{idx + 1}</td>
                                    <td className="border border-black p-2 font-medium">{item.label}</td>
                                    <td className="border border-black p-2 text-neutral-800">{stageUnitMap[item.status] || 'Subbag Keuangan'}</td>
                                    <td className="border border-black p-2 text-center font-bold tabular-nums">{item.count} berkas</td>
                                    <td className="border border-black p-2 text-center tabular-nums">{item.percentage}%</td>
                                </tr>
                            ))}
                            <tr className="bg-neutral-100 font-bold">
                                <td colSpan={3} className="border border-black p-2 text-center">
                                    TOTAL DOKUMEN DALAM SIKLUS ALUR
                                </td>
                                <td className="border border-black p-2 text-center font-bold tabular-nums">
                                    {summary.total_dokumen} berkas
                                </td>
                                <td className="border border-black p-2 text-center font-bold tabular-nums">100,0%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BAGIAN III: REKAPITULASI MENURUT SUMBER ANGGARAN */}
            <div className="mb-5 space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <span>III.</span>
                    <span>REKAPITULASI ALOKASI PAGU MENURUT SUMBER ANGGARAN (KLASTER BELANJA)</span>
                </h2>
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full min-w-[580px] print:min-w-0 border-collapse border border-black text-xs text-black">
                        <thead>
                            <tr className="bg-neutral-100 font-bold">
                                <th className="border border-black p-2 text-center w-10">No</th>
                                <th className="border border-black p-2 text-left">Sumber Anggaran / Klaster Belanja</th>
                                <th className="border border-black p-2 text-center w-28">Jumlah Usulan</th>
                                <th className="border border-black p-2 text-right">Alokasi Pagu (Rp)</th>
                                <th className="border border-black p-2 text-center w-24">Proporsi (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anggaranByType.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="border border-black p-3 text-center text-neutral-600">
                                        Belum ada data anggaran tercatat.
                                    </td>
                                </tr>
                            ) : (
                                anggaranByType.map((item, idx) => {
                                    const percentOfTotal =
                                        summary.total_usulan > 0
                                            ? ((Number(item.total_usulan) / summary.total_usulan) * 100).toFixed(1)
                                            : '0';

                                    return (
                                        <tr key={item.jenis_anggaran}>
                                            <td className="border border-black p-2 text-center font-mono">{idx + 1}</td>
                                            <td className="border border-black p-2 font-medium">{item.jenis_anggaran}</td>
                                            <td className="border border-black p-2 text-center tabular-nums">{item.count} usulan</td>
                                            <td className="border border-black p-2 text-right font-bold tabular-nums">
                                                {formatCurrency(item.total_usulan)}
                                            </td>
                                            <td className="border border-black p-2 text-center tabular-nums">{percentOfTotal}%</td>
                                        </tr>
                                    );
                                })
                            )}
                            <tr className="bg-neutral-100 font-bold">
                                <td colSpan={2} className="border border-black p-2 text-center">
                                    TOTAL ALOKASI PAGU
                                </td>
                                <td className="border border-black p-2 text-center tabular-nums">{summary.total_dokumen} usulan</td>
                                <td className="border border-black p-2 text-right tabular-nums">{formatCurrency(summary.total_usulan)}</td>
                                <td className="border border-black p-2 text-center tabular-nums">100,0%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BAGIAN IV: DAFTAR DOKUMEN REALISASI PENCAIRAN TERAKHIR */}
            <div className="mb-6 space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <span>IV.</span>
                    <span>DAFTAR DOKUMEN REALISASI PENCAIRAN DANA SELESAI (SP2D TERBIT)</span>
                </h2>
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full min-w-[650px] print:min-w-0 border-collapse border border-black text-xs text-black">
                        <thead>
                            <tr className="bg-neutral-100 font-bold">
                                <th className="border border-black p-2 text-center w-8">No</th>
                                <th className="border border-black p-2 text-left w-24">No. Pengajuan</th>
                                <th className="border border-black p-2 text-left">Nama Usulan Kegiatan</th>
                                <th className="border border-black p-2 text-left w-36">Pengusul / Unit</th>
                                <th className="border border-black p-2 text-left w-28">Sumber Dana</th>
                                <th className="border border-black p-2 text-right w-28">Pagu Usulan</th>
                                <th className="border border-black p-2 text-right w-28">Realisasi Cair</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDisbursed.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="border border-black p-3 text-center text-neutral-600">
                                        Belum ada dokumen yang menyelesaikan siklus pencairan dana.
                                    </td>
                                </tr>
                            ) : (
                                recentDisbursed.map((doc, idx) => (
                                    <tr key={doc.id}>
                                        <td className="border border-black p-2 text-center font-mono">{idx + 1}</td>
                                        <td className="border border-black p-2 font-mono font-bold text-[11px]">{doc.nomor_pengajuan}</td>
                                        <td className="border border-black p-2 font-medium">{doc.nama_kegiatan}</td>
                                        <td className="border border-black p-2">
                                            <div className="font-medium">{doc.user?.name}</div>
                                            <div className="text-[10px] text-neutral-600">{doc.user?.unit || '-'}</div>
                                        </td>
                                        <td className="border border-black p-2">{doc.jenis_anggaran}</td>
                                        <td className="border border-black p-2 text-right tabular-nums">{formatCurrency(doc.total_usulan)}</td>
                                        <td className="border border-black p-2 text-right font-bold tabular-nums">
                                            {doc.realisasi_anggaran?.total_realisasi
                                                ? formatCurrency(doc.realisasi_anggaran.total_realisasi)
                                                : formatCurrency(doc.total_usulan)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BAGIAN V: LEMBAR PENGESAHAN & TANDA TANGAN RESMI */}
            <div className="mt-8 pt-4 break-inside-avoid text-xs text-black">
                <div className="flex justify-between items-start">
                    <div className="text-center w-64 space-y-1">
                        <p className="font-medium">Mengetahui,</p>
                        <p className="font-bold uppercase">Pejabat Pembuat Komitmen (PPK)</p>
                        <p className="text-[11px] text-neutral-800">Institut Teknologi Kalimantan</p>
                        <div className="h-20 flex items-end justify-center">
                            <div className="border-b border-black w-48 mx-auto"></div>
                        </div>
                        <p className="font-bold underline text-xs mt-1">Prof. Dr. Ir. Budi Santosa, M.Sc.</p>
                        <p className="text-[10px] font-mono text-neutral-700">NIP. 196905121994031001</p>
                    </div>

                    <div className="text-center w-64 space-y-1">
                        <p className="font-medium">Balikpapan, {formatIndonesianDate(currentDate)}</p>
                        <p className="font-bold uppercase">Petugas Verifikasi & Pelaporan</p>
                        <p className="text-[11px] text-neutral-800">Subbag Keuangan ITK</p>
                        <div className="h-20 flex items-end justify-center">
                            <div className="border-b border-black w-48 mx-auto"></div>
                        </div>
                        <p className="font-bold underline text-xs mt-1">Ahmad Khaidir, S.E., M.Ak.</p>
                        <p className="text-[10px] font-mono text-neutral-700">NIP. 198803152014041002</p>
                    </div>
                </div>
            </div>

            {/* FOOTER RESMI DOKUMEN CETAK */}
            <div className="mt-8 pt-3 border-t border-neutral-400 flex justify-between items-center text-[10px] text-neutral-600">
                <div>
                    SIM-KEUANGAN SAK ITK — Dicetak secara elektronik pada {currentDate.toLocaleString('id-ID')} WITA
                </div>
                <div>
                    Dokumen Resmi Institusi — Halaman 1
                </div>
            </div>
        </div>
    );
}
