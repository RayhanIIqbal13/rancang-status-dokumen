import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, FileText, FileUp, Send, Sparkles } from 'lucide-react';
import React from 'react';

interface CreateProps {
    budgetTypes: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Status Dokumen', href: '/dokumen-pengajuan' },
    { title: 'Pengajuan Baru', href: '/dokumen-pengajuan/create' },
];

export default function DokumenCreate({ budgetTypes }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kegiatan: '',
        jenis_anggaran: budgetTypes[0] || 'BOPTN (Bantuan Operasional PTN)',
        uraian: '',
        tgl_pelaksanaan: '',
        total_usulan: '',
        file_proposal: null as File | null,
    });

    const formatCurrency = (val: string | number) => {
        if (!val) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dokumen-pengajuan.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Dokumen Anggaran - Studio Admin SAK ITK" />

            <div className="flex max-w-5xl flex-col gap-5 p-4 md:p-6">
                {/* Page Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" size="icon" className="size-8 rounded-lg">
                            <Link href={route('dokumen-pengajuan.index')}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                                <h1 className="text-foreground text-lg sm:text-xl font-semibold tracking-tight">Pengajuan Usulan Anggaran</h1>
                                <span className="border-primary/20 bg-primary/10 text-primary inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap">
                                    Form Baru
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Formulir pendaftaran usulan kegiatan dan anggaran fakultas/unit kerja ITK
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                            <Link href={route('dokumen-pengajuan.index')}>Batal</Link>
                        </Button>
                        <Button type="button" size="sm" onClick={submit} disabled={processing} className="h-8 gap-1.5 text-xs shadow-xs">
                            <Send className="size-3.5" />
                            <span>{processing ? 'Menyimpan...' : 'Kirim Pengajuan'}</span>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {/* Main Form (2 cols) */}
                    <form onSubmit={submit} className="space-y-5 lg:col-span-2">
                        <div className="bg-card space-y-4 rounded-xl border p-5 shadow-2xs">
                            <div className="border-b pb-3">
                                <h2 className="text-foreground text-sm font-semibold tracking-tight">Informasi Kegiatan & Anggaran</h2>
                                <p className="text-muted-foreground mt-0.5 text-xs">Rincian identitas kegiatan dan estimasi kebutuhan dana belanja</p>
                            </div>

                            {/* Nama Kegiatan */}
                            <div className="space-y-1.5">
                                <Label htmlFor="nama_kegiatan" className="text-xs font-medium">
                                    Nama Kegiatan / Usulan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nama_kegiatan"
                                    value={data.nama_kegiatan}
                                    onChange={(e) => setData('nama_kegiatan', e.target.value)}
                                    placeholder="Contoh: Workshop Penguatan Kurikulum OBE Program Studi 2026"
                                    className="h-8 text-xs"
                                    required
                                />
                                {errors.nama_kegiatan && <p className="text-destructive text-[11px]">{errors.nama_kegiatan}</p>}
                            </div>

                            {/* Jenis Anggaran */}
                            <div className="space-y-1.5">
                                <Label htmlFor="jenis_anggaran" className="text-xs font-medium">
                                    Mata Anggaran / Sumber Pendanaan <span className="text-destructive">*</span>
                                </Label>
                                <Select value={data.jenis_anggaran} onValueChange={(val) => setData('jenis_anggaran', val)}>
                                    <SelectTrigger id="jenis_anggaran" className="h-8 text-xs">
                                        <SelectValue placeholder="Pilih jenis anggaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {budgetTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="text-xs">
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.jenis_anggaran && <p className="text-destructive text-[11px]">{errors.jenis_anggaran}</p>}
                            </div>

                            {/* Tanggal Pelaksanaan & Total Usulan */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="tgl_pelaksanaan" className="text-xs font-medium">
                                        Tanggal Pelaksanaan <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="tgl_pelaksanaan"
                                        type="date"
                                        value={data.tgl_pelaksanaan}
                                        onChange={(e) => setData('tgl_pelaksanaan', e.target.value)}
                                        className="h-8 text-xs"
                                        required
                                    />
                                    {errors.tgl_pelaksanaan && <p className="text-destructive text-[11px]">{errors.tgl_pelaksanaan}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="total_usulan" className="text-xs font-medium">
                                        Estimasi Total Biaya (Rp) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="total_usulan"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={data.total_usulan}
                                        onChange={(e) => setData('total_usulan', e.target.value)}
                                        placeholder="Contoh: 15000000"
                                        className="h-8 text-xs"
                                        required
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-muted-foreground text-[11px]">Konversi nominal:</p>
                                        <p className="text-primary text-[11px] font-semibold tabular-nums">{formatCurrency(data.total_usulan)}</p>
                                    </div>
                                    {errors.total_usulan && <p className="text-destructive text-[11px]">{errors.total_usulan}</p>}
                                </div>
                            </div>

                            {/* Uraian Kegiatan */}
                            <div className="space-y-1.5">
                                <Label htmlFor="uraian" className="text-xs font-medium">
                                    Uraian Singkat & Target Luaran <span className="text-destructive">*</span>
                                </Label>
                                <textarea
                                    id="uraian"
                                    rows={4}
                                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                    placeholder="Jelaskan latar belakang, tujuan kegiatan, jumlah peserta/narasumber, dan indikator output capaian..."
                                    value={data.uraian}
                                    onChange={(e) => setData('uraian', e.target.value)}
                                    required
                                />
                                {errors.uraian && <p className="text-destructive text-[11px]">{errors.uraian}</p>}
                            </div>
                        </div>

                        {/* File Upload Card */}
                        <div className="bg-card space-y-3 rounded-xl border p-5 shadow-2xs">
                            <div className="border-b pb-3">
                                <h2 className="text-foreground text-sm font-semibold tracking-tight">Lampiran Berkas Proposal & RAB</h2>
                                <p className="text-muted-foreground mt-0.5 text-xs">Format berkas: .PDF, .DOCX, atau .ZIP (maksimal 10MB)</p>
                            </div>

                            <div className="border-input hover:border-primary/50 bg-muted/20 rounded-xl border-2 border-dashed p-6 text-center transition-colors">
                                <div className="bg-card text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-lg border">
                                    <FileUp className="size-5" />
                                </div>
                                <div className="text-muted-foreground mt-3 text-xs">
                                    <label htmlFor="file_proposal" className="text-primary cursor-pointer font-medium hover:underline">
                                        Klik untuk memilih file dokumen
                                    </label>
                                    <span className="text-muted-foreground"> atau seret ke area ini</span>
                                    <input
                                        id="file_proposal"
                                        type="file"
                                        className="sr-only"
                                        accept=".pdf,.doc,.docx,.zip"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setData('file_proposal', e.target.files[0]);
                                            }
                                        }}
                                    />
                                    {data.file_proposal ? (
                                        <div className="border-primary/20 bg-primary/5 text-primary mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium">
                                            <FileText className="size-3.5" />
                                            <span>{data.file_proposal.name}</span>
                                            <span className="text-muted-foreground text-[10px]">
                                                ({(data.file_proposal.size / 1024).toFixed(0)} KB)
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground mt-1 text-[11px]">
                                            Pastikan rincian RAB di dalam proposal telah sesuai batas SBM ITK 2026
                                        </p>
                                    )}
                                </div>
                            </div>
                            {errors.file_proposal && <p className="text-destructive text-[11px]">{errors.file_proposal}</p>}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                                <Link href={route('dokumen-pengajuan.index')}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing} size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
                                <Send className="size-3.5" />
                                <span>{processing ? 'Menyimpan...' : 'Kirimkan Usulan Dokumen'}</span>
                            </Button>
                        </div>
                    </form>

                    {/* Right Info Column (1 col) */}
                    <div className="space-y-4">
                        {/* Status Flow Information Card */}
                        <div className="from-primary/5 to-card space-y-3 rounded-xl border bg-linear-to-t p-4 shadow-2xs">
                            <div className="flex items-center gap-2">
                                <div className="bg-muted text-primary flex size-7 items-center justify-center rounded-lg border">
                                    <Sparkles className="size-3.5" />
                                </div>
                                <div>
                                    <h3 className="text-foreground text-xs font-semibold">Alur 8 Tahapan Dokumen</h3>
                                    <p className="text-muted-foreground text-[11px]">SOP Verifikasi SAK ITK</p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Dokumen yang Anda daftarkan otomatis memperoleh Nomor Registrasi dan masuk ke tahap:
                            </p>

                            <div className="bg-background/80 space-y-2 rounded-lg border p-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        1
                                    </span>
                                    <span className="text-foreground text-xs font-semibold">Tahap 1: Diajukan</span>
                                </div>
                                <p className="text-muted-foreground pl-7 text-[11px] leading-normal">
                                    Diteruskan otomatis ke Subbag Keuangan Fakultas untuk verifikasi kelengkapan berkas & kesesuaian SBM.
                                </p>
                            </div>

                            <div className="text-muted-foreground space-y-1.5 pt-2 text-[11px]">
                                <p className="text-foreground font-medium">Tahapan Berikutnya:</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <div className="bg-muted-foreground size-1.5 rounded-full" />
                                        <span>2. Verifikasi Fakultas</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <div className="bg-muted-foreground size-1.5 rounded-full" />
                                        <span>3. Perlu Revisi (bila ada koreksi)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <div className="bg-muted-foreground size-1.5 rounded-full" />
                                        <span>4. Menunggu SK Penetapan</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <div className="bg-muted-foreground size-1.5 rounded-full" />
                                        <span>5-8. Disetujui s/d Dana Cair</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checklist Guidelines Card */}
                        <div className="bg-card space-y-3 rounded-xl border p-4 shadow-2xs">
                            <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Ketentuan Pengajuan</h3>
                            <div className="text-muted-foreground space-y-2.5 text-xs">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                                    <span>RAB wajib mengacu tarif Standar Biaya Masukan (SBM) ITK 2026.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                                    <span>Usulan diajukan selambat-lambatnya 14 hari sebelum tanggal kegiatan.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                                    <span>Lampirkan susunan kepanitiaan dan rundown jadwal yang jelas.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
