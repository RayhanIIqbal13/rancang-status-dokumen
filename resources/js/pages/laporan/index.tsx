import { StatusBadge } from '@/components/dokumen/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DocumentStatusType, DokumenPengajuan } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowUpRight, CheckCircle2, DollarSign, Layers, Percent, PieChart, Printer, Wallet } from 'lucide-react';

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
    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
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
                        <div className="flex items-center gap-2">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">Laporan Realisasi & Pelacakan Dokumen</h1>
                            <span className="border-primary/20 bg-primary/10 text-primary rounded-4xl border px-2 py-0.5 text-[11px] font-medium">
                                TA 2026
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Ringkasan eksekutif alokasi pagu usulan, serapan SP2D, dan sebaran 8 tahapan alur berkas
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 gap-1.5 text-xs shadow-xs">
                            <Printer className="size-3.5" />
                            <span>Cetak Laporan</span>
                        </Button>
                    </div>
                </div>

                {/* Print Title Header (Visible only when printing) */}
                <div className="mb-4 hidden border-b pb-4 print:block">
                    <h2 className="text-lg font-bold">INSTITUT TEKNOLOGI KALIMANTAN</h2>
                    <h3 className="text-muted-foreground text-sm font-semibold">
                        Sistem Informasi Layanan Keuangan (SAK ITK) — Laporan Realisasi & Status Dokumen
                    </h3>
                    <p className="text-muted-foreground mt-1 text-[10px]">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Total Usulan */}
                    <div className="from-primary/5 to-card ring-foreground/10 rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">Total Pagu Usulan</span>
                            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                <Wallet className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-foreground text-xl font-medium tabular-nums">{formatCurrency(summary.total_usulan)}</span>
                            <p className="text-muted-foreground mt-0.5 text-[11px]">Dari {summary.total_dokumen} berkas kegiatan</p>
                        </div>
                    </div>

                    {/* Total Realisasi Cair */}
                    <div className="to-card rounded-xl bg-linear-to-t from-emerald-500/10 p-4 shadow-xs ring-1 ring-emerald-500/30">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Total Realisasi Cair</span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-xl font-medium text-emerald-700 tabular-nums dark:text-emerald-400">
                                {formatCurrency(summary.total_realisasi)}
                            </span>
                            <p className="mt-0.5 text-[11px] text-emerald-600/80">Status Dana Cair (SP2D Selesai)</p>
                        </div>
                    </div>

                    {/* Daya Serap */}
                    <div className="to-card rounded-xl bg-linear-to-t from-blue-500/10 p-4 shadow-xs ring-1 ring-blue-500/30">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Daya Serap Pagu</span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Percent className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-medium text-blue-700 tabular-nums dark:text-blue-400">{summary.serapan_persen}%</span>
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
                    <div className="from-primary/5 to-card ring-foreground/10 rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">Total Dokumen</span>
                            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                <Layers className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-foreground text-2xl font-medium tabular-nums">{summary.total_dokumen}</span>
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
                            <h2 className="text-foreground text-sm font-semibold tracking-tight">Realisasi Pencairan Terakhir (Siklus Selesai)</h2>
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
                                                <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-medium">{doc.jenis_anggaran}</span>
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
        </AppLayout>
    );
}
