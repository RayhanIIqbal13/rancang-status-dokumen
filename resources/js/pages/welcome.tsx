import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronRight,
    Coins,
    FileCheck,
    FileSpreadsheet,
    FileText,
    Landmark,
    Layers,
    Lock,
    Receipt,
    Shield,
    Sparkles,
    UserCheck,
    Users,
} from 'lucide-react';
import React from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const stages = [
        { num: 1, title: 'Diajukan', role: 'Sistem', desc: 'Usulan didaftarkan otomatis' },
        { num: 2, title: 'Verifikasi Fakultas', role: 'Staf Keuangan', desc: 'Review kelengkapan & SBM' },
        { num: 3, title: 'Perlu Revisi', role: 'Staf Keuangan', desc: 'Perbaikan oleh pengusul' },
        { num: 4, title: 'Menunggu SK', role: 'Staf Keuangan', desc: 'Penetapan pimpinan' },
        { num: 5, title: 'Disetujui', role: 'Pimpinan', desc: 'Kegiatan dapat berjalan' },
        { num: 6, title: 'Verifikasi SPJ', role: 'Staf Keuangan', desc: 'Pemeriksaan kuitansi' },
        { num: 7, title: 'Diproses di SAKTI', role: 'Staf Keuangan', desc: 'Integrasi Kemenkeu' },
        { num: 8, title: 'Dana Cair', role: 'Staf Keuangan', desc: 'SP2D terbit tuntas' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
            <Head title="SAK ITK — Sistem Layanan Keuangan & Pelacakan Dokumen" />

            {/* Studio Admin Header Navigation */}
            <header className="sticky top-0 z-50 flex h-12 w-full items-center justify-between border-b bg-background/80 px-4 md:px-8 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                        <Building2 className="size-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs tracking-tight text-foreground">SAK ITK</span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Studio Admin
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <Button asChild size="sm" className="h-7 gap-1.5 text-xs shadow-xs">
                            <Link href={route('dashboard')}>
                                <span>Buka Dashboard</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                                <Link href={route('login')}>Masuk</Link>
                            </Button>
                            <Button asChild size="sm" className="h-7 gap-1 text-xs shadow-xs">
                                <Link href={route('login')}>
                                    <span>Demo App</span>
                                    <ChevronRight className="size-3" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="mx-auto flex max-w-6xl flex-col gap-10 p-6 md:p-12">
                <div className="flex flex-col items-center text-center space-y-4 pt-4 md:pt-8">
                    <div className="inline-flex items-center gap-2 rounded-4xl border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary shadow-xs">
                        <Sparkles className="size-3.5" />
                        <span>Sistem Informasi Layanan Keuangan ITK • TA 2026</span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl max-w-3xl leading-tight">
                        Pelacakan Status Dokumen & Realisasi Anggaran SBM
                    </h1>

                    <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Platform tata kelola dokumen usulan anggaran, verifikasi kepatuhan Standar Biaya Masukan (SBM), rekonsiliasi SPJ, dan pencatatan pencairan modul SAKTI secara transparan dan akuntabel.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        {auth.user ? (
                            <Button asChild size="default" className="h-9 gap-2 px-5 text-xs shadow-xs">
                                <Link href={route('dashboard')}>
                                    <span>Menuju Dashboard</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="default" className="h-9 gap-2 px-5 text-xs shadow-xs">
                                    <Link href={route('login')}>
                                        <span>Masuk ke Sistem</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="default" className="h-9 px-5 text-xs">
                                    <Link href={route('login')}>
                                        <span>Pilih Akun Demo</span>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* 8-Stage Interactive Visual Flow */}
                <div className="rounded-xl border bg-card p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                        <div>
                            <h2 className="text-sm font-semibold tracking-tight text-foreground">
                                Alur 8 Tahapan Siklus Dokumen Pengajuan
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Standar Operasional Prosedur (SOP) alur pengusulan kegiatan hingga pencairan dana
                            </p>
                        </div>
                        <span className="rounded-4xl border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary self-start sm:self-auto">
                            8 Tahap Terintegrasi
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 pt-2">
                        {stages.map((st) => (
                            <div
                                key={st.num}
                                className="group relative rounded-xl border bg-linear-to-t from-primary/5 to-card p-3 shadow-2xs transition-all hover:border-primary/50 hover:shadow-xs"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                        {st.num}
                                    </span>
                                    <span className="text-[9px] font-medium text-muted-foreground">
                                        {st.role}
                                    </span>
                                </div>
                                <h3 className="mt-2 text-xs font-semibold text-foreground leading-tight line-clamp-1">
                                    {st.title}
                                </h3>
                                <p className="mt-1 text-[10px] text-muted-foreground leading-normal line-clamp-2">
                                    {st.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Feature Matrix (Studio Admin Style) */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1 */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-5 ring-1 ring-foreground/10 shadow-xs space-y-2">
                        <div className="flex size-8 items-center justify-center rounded-lg border bg-muted text-primary">
                            <Activity className="size-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Pelacakan Status Real-Time</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Pantau riwayat mutasi berkas dan disposisi posisi fisik dokumen pada setiap tahapan alur secara transparan.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-5 ring-1 ring-foreground/10 shadow-xs space-y-2">
                        <div className="flex size-8 items-center justify-center rounded-lg border bg-muted text-primary">
                            <FileCheck className="size-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Validasi Kepatuhan SBM</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Pemeriksaan otomatis batas plafon belanja dan honorarium mengacu Standar Biaya Masukan ITK Tahun 2026.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-5 ring-1 ring-foreground/10 shadow-xs space-y-2">
                        <div className="flex size-8 items-center justify-center rounded-lg border bg-muted text-primary">
                            <Landmark className="size-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Sinkronisasi SP2D SAKTI</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Pencatatan realisasi dana cair dan pelaporan pertanggungjawaban SPJ yang terintegrasi dengan modul keuangan.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="rounded-xl bg-linear-to-t from-primary/5 to-card p-5 ring-1 ring-foreground/10 shadow-xs space-y-2">
                        <div className="flex size-8 items-center justify-center rounded-lg border bg-muted text-primary">
                            <Shield className="size-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Akses Multi-Role Terkendali</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Pembagian wewenang yang aman untuk Dosen/Pengusul, Tim Verifikator Keuangan, Pimpinan, dan Administrator.
                        </p>
                    </div>
                </div>

                {/* Quick Demo Accounts Banner */}
                <div className="rounded-xl border bg-muted/30 p-5 shadow-2xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Siap Mencoba Sistem?</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Gunakan salah satu akun demo yang telah disediakan (kata sandi: <code className="font-mono text-primary font-bold">password</code>)
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
                                <Link href={route('login')}>
                                    <UserCheck className="size-3.5" />
                                    <span>Buka Halaman Masuk</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t py-6 text-center text-xs text-muted-foreground">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                    <p>© 2026 Institut Teknologi Kalimantan • Sistem Informasi Layanan Keuangan (SAK ITK)</p>
                    <p className="text-[11px]">Studio Admin Design System</p>
                </div>
            </footer>
        </div>
    );
}
