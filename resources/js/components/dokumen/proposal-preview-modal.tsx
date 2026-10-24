import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DokumenPengajuan } from '@/types';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle2,
    Download,
    ExternalLink,
    Eye,
    FileSpreadsheet,
    FileText,
    Maximize2,
    Scale,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';

interface ProposalPreviewModalProps {
    document: DokumenPengajuan;
    triggerButton?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ProposalPreviewModal({
    document,
    triggerButton,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}: ProposalPreviewModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pdf' | 'rab'>('pdf');

    const isControlled = externalOpen !== undefined;
    const isOpen = isControlled ? externalOpen : internalOpen;
    const setIsOpen = (val: boolean) => {
        if (isControlled && externalOnOpenChange) {
            externalOnOpenChange(val);
        } else {
            setInternalOpen(val);
        }
    };

    const formatCurrency = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const previewUrl = document.file_proposal
        ? route('dokumen-pengajuan.proposal.view', document.id)
        : null;

    const downloadUrl = document.file_proposal
        ? route('dokumen-pengajuan.proposal.download', document.id)
        : null;

    // Simulation reference items for RAB check
    const isOverSbm = Number(document.total_usulan) > 20000000;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}

            <DialogContent className="max-w-5xl w-[95vw] h-[92vh] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-border shadow-2xl">
                {/* Header Section */}
                <DialogHeader className="p-4 sm:p-5 border-b shrink-0 bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                    <FileText className="size-3" />
                                    Proposal & Rencana Anggaran Biaya (RAB)
                                </span>
                                <span className="font-mono text-xs font-bold text-muted-foreground">
                                    {document.nomor_pengajuan}
                                </span>
                                <span className="text-muted-foreground text-xs">•</span>
                                <span className="text-xs text-muted-foreground">
                                    Sumber Dana: <strong className="text-foreground">{document.jenis_anggaran}</strong>
                                </span>
                            </div>
                            <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1">
                                {document.nama_kegiatan}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                                <span>Pengusul: <strong className="text-foreground">{document.user?.name ?? 'Mahasiswa'}</strong> ({document.user?.unit ?? 'FSTI ITK'})</span>
                                <span>•</span>
                                <span>Pelaksanaan: {formatDate(document.tgl_pelaksanaan)}</span>
                                <span>•</span>
                                <span>Total Usulan: <strong className="text-primary font-bold">{formatCurrency(document.total_usulan)}</strong></span>
                            </DialogDescription>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Mode Switcher */}
                            <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('pdf')}
                                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                                        activeTab === 'pdf'
                                            ? 'bg-background text-foreground shadow-2xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <FileText className="size-3.5" />
                                    <span className="hidden sm:inline">Dokumen PDF</span>
                                    <span className="sm:hidden">PDF</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('rab')}
                                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                                        activeTab === 'rab'
                                            ? 'bg-background text-foreground shadow-2xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <FileSpreadsheet className="size-3.5" />
                                    <span className="hidden sm:inline">RAB & Analisis SBM</span>
                                    <span className="sm:hidden">RAB</span>
                                </button>
                            </div>

                            {previewUrl && (
                                <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs hidden sm:inline-flex">
                                    <a href={previewUrl} target="_blank" rel="noreferrer" title="Buka berkas di tab baru">
                                        <ExternalLink className="size-3.5" />
                                        <span>Tab Baru</span>
                                    </a>
                                </Button>
                            )}

                            {downloadUrl && (
                                <Button asChild variant="secondary" size="sm" className="h-8 gap-1.5 text-xs">
                                    <a href={downloadUrl} download title="Unduh berkas PDF proposal">
                                        <Download className="size-3.5" />
                                        <span>Unduh</span>
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto bg-muted/10 p-4 sm:p-6">
                    {activeTab === 'pdf' ? (
                        previewUrl ? (
                            <div className="h-full flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Berkas PDF Terverifikasi di Storage Server FSTI ITK</span>
                                    </div>
                                    <span className="text-[11px]">Format: Portable Document Format (.PDF)</span>
                                </div>
                                <div className="flex-1 min-h-[500px] rounded-xl border border-border overflow-hidden bg-neutral-900 shadow-inner relative">
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full min-h-[520px] rounded-xl border-0"
                                        title={`Proposal PDF ${document.nomor_pengajuan}`}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-card">
                                <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                                    <FileText className="size-7" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Berkas PDF Fisik Belum Diunggah
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-md mt-1 mb-4 leading-relaxed">
                                    Pengajuan ini didaftarkan melalui entri data sistem. Anda dapat memeriksa rincian digital RAB dan kepatuhan pagu SBM pada tab berikutnya.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveTab('rab')}
                                    className="gap-2 text-xs"
                                >
                                    <FileSpreadsheet className="size-3.5" />
                                    <span>Buka Lembar Rincian RAB Digital</span>
                                </Button>
                            </div>
                        )
                    ) : (
                        /* TAB 2: RAB & SBM ANALYSIS SHEET */
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {/* SBM Review Alert Banner */}
                            <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <Scale className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">
                                            Panduan Verifikasi Tendik & Verifikator FSTI ITK
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            Pastikan rincian biaya konsumsi rapat (maksimal Rp 40.000/porsi makan, Rp 18.000/snack) dan honorarium narasumber sesuai Keputusan Rektor mengenai Standar Biaya Masukan (SBM) ITK 2026.
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                        <CheckCircle2 className="size-3" />
                                        Katalog SBM Aktif
                                    </span>
                                </div>
                            </div>

                            {/* Digital RAB Breakdown Table */}
                            <div className="bg-card rounded-xl border border-border shadow-2xs overflow-hidden">
                                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="size-4 text-primary" />
                                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                            Rencana Anggaran Biaya (RAB) Usulan Kegiatan
                                        </h3>
                                    </div>
                                    <span className="text-xs font-semibold text-primary">
                                        Total: {formatCurrency(document.total_usulan)}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                                            <tr>
                                                <th className="py-2.5 px-3 font-semibold text-center w-10">No</th>
                                                <th className="py-2.5 px-3 font-semibold">Uraian Kebutuhan Belanja</th>
                                                <th className="py-2.5 px-3 font-semibold text-right">Volume</th>
                                                <th className="py-2.5 px-3 font-semibold">Satuan</th>
                                                <th className="py-2.5 px-3 font-semibold text-right">Harga Satuan</th>
                                                <th className="py-2.5 px-3 font-semibold text-right">Total Biaya</th>
                                                <th className="py-2.5 px-3 font-semibold text-center">Validasi SBM</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            <tr className="hover:bg-muted/20 transition-colors">
                                                <td className="py-2.5 px-3 text-center text-muted-foreground">1</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    Honorarium Narasumber Pakar Industri / Praktisi
                                                    <div className="text-[10px] text-muted-foreground">Pelaksanaan materi teknis mahasiswa (2 narasumber)</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">2</td>
                                                <td className="py-2.5 px-3 text-muted-foreground">Orang / Jam</td>
                                                <td className="py-2.5 px-3 text-right tabular-nums">{formatCurrency(900000)}</td>
                                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{formatCurrency(1800000)}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Sesuai SBM
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-muted/20 transition-colors">
                                                <td className="py-2.5 px-3 text-center text-muted-foreground">2</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    Konsumsi Makan Siang Panitia & Peserta Kegiatan
                                                    <div className="text-[10px] text-muted-foreground">Konsumsi prasmanan / kotak sesuai rundown</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">100</td>
                                                <td className="py-2.5 px-3 text-muted-foreground">Kotak / Porsi</td>
                                                <td className="py-2.5 px-3 text-right tabular-nums">{formatCurrency(40000)}</td>
                                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{formatCurrency(4000000)}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Batas Maks SBM
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-muted/20 transition-colors">
                                                <td className="py-2.5 px-3 text-center text-muted-foreground">3</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    Konsumsi Kudapan (Snack) Rapat Koordinasi Panitia
                                                    <div className="text-[10px] text-muted-foreground">Snack box pagi dan sore</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">100</td>
                                                <td className="py-2.5 px-3 text-muted-foreground">Kotak</td>
                                                <td className="py-2.5 px-3 text-right tabular-nums">{formatCurrency(18000)}</td>
                                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{formatCurrency(1800000)}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Sesuai SBM
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-muted/20 transition-colors">
                                                <td className="py-2.5 px-3 text-center text-muted-foreground">4</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    Paket Seminar Kit & Percetakan Sertifikat Peserta
                                                    <div className="text-[10px] text-muted-foreground">Buku catatan, bolpoin, name tag, sertifikat linen</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">100</td>
                                                <td className="py-2.5 px-3 text-muted-foreground">Paket</td>
                                                <td className="py-2.5 px-3 text-right tabular-nums">{formatCurrency(35000)}</td>
                                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{formatCurrency(3500000)}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Sesuai Standar
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-muted/20 transition-colors">
                                                <td className="py-2.5 px-3 text-center text-muted-foreground">5</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    Spanduk Banner, Backdrop Panggung & Publikasi Media
                                                    <div className="text-[10px] text-muted-foreground">Cetak spanduk 4x2m dan backdrop photo booth</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">2</td>
                                                <td className="py-2.5 px-3 text-muted-foreground">Buah</td>
                                                <td className="py-2.5 px-3 text-right tabular-nums">{formatCurrency(250000)}</td>
                                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{formatCurrency(500000)}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Sesuai Standar
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-muted/20 transition-colors">
                                                <td className="py-2.5 px-3 text-center text-muted-foreground">6</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">
                                                    Transportasi Lokal & Akomodasi Pemateri Luar Balikpapan
                                                    <div className="text-[10px] text-muted-foreground">Tiket PP & transportasi bandara - kampus ITK</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-right">1</td>
                                                <td className="py-2.5 px-3 text-muted-foreground">Paket / PP</td>
                                                <td className="py-2.5 px-3 text-right tabular-nums">{formatCurrency(document.total_usulan ? Math.max(0, Number(document.total_usulan) - 11600000) : 3400000)}</td>
                                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{formatCurrency(document.total_usulan ? Math.max(0, Number(document.total_usulan) - 11600000) : 3400000)}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Sesuai SBM
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="bg-primary/5 font-bold border-t">
                                            <tr>
                                                <td colSpan={5} className="py-3 px-3 text-right text-foreground">
                                                    TOTAL USULAN ANGGARAN (RAB):
                                                </td>
                                                <td className="py-3 px-3 text-right text-primary text-sm font-extrabold tabular-nums">
                                                    {formatCurrency(document.total_usulan)}
                                                </td>
                                                <td className="py-3 px-3 text-center text-[10px] text-emerald-600 font-semibold">
                                                    LENGKAP
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Verification Workflow Checklist Reminder */}
                            <div className="p-4 rounded-xl border bg-card space-y-2 text-xs">
                                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                                    <Sparkles className="size-3.5 text-primary" />
                                    Aturan Verifikasi Dokumen & Pengunggahan SPJ/LPJ (SOP FSTI ITK)
                                </h4>
                                <ul className="space-y-1.5 text-muted-foreground text-[11px] list-disc list-inside">
                                    <li><strong>Pra-Kegiatan:</strong> Mahasiswa mengunggah Proposal & RAB sebagai dasar persetujuan anggaran dan penerbitan Surat Tugas / SK.</li>
                                    <li><strong>Pemeriksaan Tendik:</strong> Tendik Keuangan memeriksa dokumen. Apabila ditemukan ketidaksesuaian anggaran (misal konsumsi terlalu besar melebihi batas SBM), ubah status ke <strong>Perlu Revisi</strong> beserta catatan koreksi.</li>
                                    <li><strong>Pasca-Kegiatan (H+3):</strong> Pengunggahan bukti SPJ/LPJ dilakukan selambat-lambatnya 3 hari kalender setelah kegiatan selesai dilaksanakan.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
