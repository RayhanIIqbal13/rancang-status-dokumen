import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    ChevronRight,
    FileCheck,
    Landmark,
    MessageCircle,
    Search,
    ShieldCheck,
    Sparkles,
    Ticket,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [searchQuery, setSearchQuery] = useState('');

    const stages = [
        { num: 1, title: 'Diajukan', role: 'Pengusul', desc: 'Usulan didaftarkan otomatis dengan nomor pengajuan unik' },
        { num: 2, title: 'Verifikasi Fakultas', role: 'Staf Keuangan', desc: 'Pemeriksaan kelengkapan proposal & standar tarif SBM' },
        { num: 3, title: 'Perlu Revisi', role: 'Pengusul', desc: 'Perbaikan berkas atau nominal oleh pengusul' },
        { num: 4, title: 'Menunggu SK', role: 'Staf Keuangan', desc: 'Penyusunan surat tugas dan penetapan keputusan Dekanat' },
        { num: 5, title: 'Disetujui', role: 'Pimpinan', desc: 'Persetujuan resmi Wakil Dekan/Dekan untuk kegiatan' },
        { num: 6, title: 'Verifikasi SPJ', role: 'Staf Keuangan', desc: 'Pemeriksaan bukti riil kuitansi pengeluaran belanja' },
        { num: 7, title: 'Diproses di SAKTI', role: 'Staf Keuangan', desc: 'Pencatatan nomor SPP/SPM pada modul Kemenkeu' },
        { num: 8, title: 'Dana Cair', role: 'Staf Keuangan', desc: 'Penerbitan SP2D dan transfer dana tuntas' },
    ];

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (auth.user) {
            window.location.href = `/status-tracking?q=${encodeURIComponent(searchQuery)}`;
        } else {
            window.location.href = `/login?redirect=${encodeURIComponent('/status-tracking')}`;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground antialiased">
            <Head title="SIM-KEUANGAN FSTI — Pelacakan Dokumen & Realisasi SBM ITK" />

            {/* Header Navigation with ONLY ITK and FSTI Logos */}
            <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md md:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-2 py-1 shadow-xs ring-1 ring-border dark:bg-card">
                        <img
                            src="/images/logoitk.png"
                            alt="Institut Teknologi Kalimantan"
                            className="h-6 w-auto sm:h-7 object-contain"
                        />
                        <img
                            src="/images/logofsti.png"
                            alt="FSTI ITK"
                            className="h-6 w-auto sm:h-7 object-contain"
                        />
                    </div>
                    <div className="hidden sm:block border-l border-border pl-3 leading-tight">
                        <span className="block text-xs font-extrabold tracking-tight text-foreground">
                            SIM-KEUANGAN FSTI
                        </span>
                        <span className="block text-[10px] text-muted-foreground">
                            Fakultas Sains & Teknologi Informasi · ITK
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs rounded-lg border-border hover:border-primary"
                    >
                        <Link href={auth.user ? route('status-tracking.index') : route('login')}>
                            <Ticket className="size-3.5 text-primary" />
                            <span>Cek Status</span>
                        </Link>
                    </Button>

                    {auth.user ? (
                        <Button asChild size="sm" className="h-8 gap-1.5 text-xs shadow-xs rounded-lg">
                            <Link href={route('dashboard')}>
                                <span>Buka Dashboard</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
                                <Link href={route('login')}>Pilih Akun Demo</Link>
                            </Button>
                            <Button asChild size="sm" className="h-8 gap-1 text-xs shadow-xs rounded-lg">
                                <Link href={route('login')}>
                                    <span>Masuk</span>
                                    <ChevronRight className="size-3" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto flex max-w-6xl flex-col gap-10 p-6 md:p-12">
                {/* Hero Section */}
                <div className="relative flex flex-col items-center space-y-4 pt-4 text-center md:pt-8">
                    {/* Subtle dot pattern ambient */}
                    <div className="pointer-events-none absolute inset-0 -top-8 overflow-hidden opacity-30" aria-hidden="true">
                        <div className="pola-titik-dark absolute inset-0" />
                    </div>

                    <div className="relative z-10 border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-xs">
                        <Sparkles className="size-3.5" />
                        <span>Portal Layanan Keuangan · FSTI ITK • TA 2026</span>
                    </div>

                    <h1 className="relative z-10 text-foreground max-w-3xl text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
                        Pelacakan Status Dokumen & Realisasi Anggaran SBM
                    </h1>

                    <p className="relative z-10 text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
                        Platform tata kelola dokumen usulan anggaran, verifikasi kepatuhan Standar Biaya Masukan (SBM),
                        rekonsiliasi bukti SPJ, dan integrasi pencairan modul SAKTI di lingkungan Fakultas Sains dan
                        Teknologi Informasi (FSTI ITK).
                    </p>

                    {/* Action Buttons */}
                    <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
                        {auth.user ? (
                            <Button asChild size="default" className="h-9 gap-2 px-5 text-xs shadow-xs rounded-lg">
                                <Link href={route('dashboard')}>
                                    <span>Menuju Dashboard</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="default" className="h-9 gap-2 px-5 text-xs shadow-xs rounded-lg">
                                    <Link href={route('login')}>
                                        <span>Masuk ke Sistem</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="default" className="h-9 px-5 text-xs rounded-lg">
                                    <Link href={route('login')}>
                                        <span>Pilih Akun Demo</span>
                                    </Link>
                                </Button>
                            </>
                        )}
                        <Button asChild variant="outline" size="default" className="h-9 gap-1.5 px-4 text-xs rounded-lg">
                            <Link href={auth.user ? route('status-tracking.index') : route('login')}>
                                <Ticket className="size-3.5 text-primary" />
                                <span>Lacak Usulan (8 Tahap)</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Sleek FSTI Search Bar for Tracking */}
                    <div className="relative z-10 w-full max-w-xl pt-4">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Lacak nomor pengajuan (mis. PROP/2026/0001) atau nama kegiatan..."
                                className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-24 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="absolute right-1.5 top-1.5 h-7 rounded-lg px-3 text-xs"
                            >
                                Lacak
                            </Button>
                        </form>

                        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                            <span>Sering dicari:</span>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('RAB Mahasiswa')}
                                className="rounded-md bg-muted px-2 py-0.5 hover:text-foreground transition-colors"
                            >
                                RAB Mahasiswa
                            </button>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('PNBP Fakultas')}
                                className="rounded-md bg-muted px-2 py-0.5 hover:text-foreground transition-colors"
                            >
                                PNBP Fakultas
                            </button>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('Honorarium SBM')}
                                className="rounded-md bg-muted px-2 py-0.5 hover:text-foreground transition-colors"
                            >
                                Honorarium SBM
                            </button>
                        </div>
                    </div>
                </div>

                {/* 8-Stage Interactive Visual Flow */}
                <div className="bg-card space-y-4 rounded-xl border p-6 shadow-2xs">
                    <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-foreground text-sm font-semibold tracking-tight">
                                Alur 8 Tahapan Siklus Dokumen Pengajuan
                            </h2>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Standar Operasional Prosedur (SOP) alur pengusulan kegiatan hingga pencairan dana FSTI ITK
                            </p>
                        </div>
                        <span className="border-primary/20 bg-primary/10 text-primary self-start rounded-full border px-2.5 py-0.5 text-[10px] font-semibold sm:self-auto">
                            8 Tahap Terintegrasi
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4 lg:grid-cols-8">
                        {stages.map((st) => (
                            <div
                                key={st.num}
                                className="group from-primary/5 to-card hover:border-primary/50 relative rounded-xl border bg-linear-to-t p-3 shadow-2xs transition-all hover:shadow-xs"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                                        {st.num}
                                    </span>
                                    <span className="text-muted-foreground text-[9px] font-medium">{st.role}</span>
                                </div>
                                <h3 className="text-foreground mt-2 line-clamp-1 text-xs leading-tight font-semibold">
                                    {st.title}
                                </h3>
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-[10px] leading-normal">
                                    {st.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Feature Matrix */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1 */}
                    <div className="from-primary/5 to-card ring-foreground/10 space-y-2 rounded-xl bg-linear-to-t p-5 shadow-xs ring-1">
                        <div className="bg-muted text-primary flex size-8 items-center justify-center rounded-lg border">
                            <Activity className="size-4" />
                        </div>
                        <h3 className="text-foreground text-sm font-semibold">Pelacakan Status Real-Time</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Pantau riwayat mutasi berkas dan disposisi posisi fisik dokumen pada setiap tahapan alur secara transparan.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="from-primary/5 to-card ring-foreground/10 space-y-2 rounded-xl bg-linear-to-t p-5 shadow-xs ring-1">
                        <div className="bg-muted text-primary flex size-8 items-center justify-center rounded-lg border">
                            <FileCheck className="size-4" />
                        </div>
                        <h3 className="text-foreground text-sm font-semibold">Validasi Kepatuhan SBM</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Pemeriksaan otomatis batas tarif belanja dan honorarium mengacu Standar Biaya Masukan ITK Tahun 2026.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="from-primary/5 to-card ring-foreground/10 space-y-2 rounded-xl bg-linear-to-t p-5 shadow-xs ring-1">
                        <div className="bg-muted text-primary flex size-8 items-center justify-center rounded-lg border">
                            <Landmark className="size-4" />
                        </div>
                        <h3 className="text-foreground text-sm font-semibold">Sinkronisasi SP2D SAKTI</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Pencatatan realisasi dana cair dan pelaporan pertanggungjawaban SPJ kuitansi terintegrasi modul Kemenkeu.
                        </p>
                    </div>

                    {/* Card 4 - Zona Integritas FSTI */}
                    <div className="from-primary/5 to-card ring-foreground/10 space-y-2 rounded-xl bg-linear-to-t p-5 shadow-xs ring-1">
                        <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex size-8 items-center justify-center rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="size-4" />
                        </div>
                        <h3 className="text-foreground text-sm font-semibold">Zona Integritas Bebas Gratifikasi</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Semua pelayanan keuangan FSTI ITK gratis tanpa biaya perantara. Laporkan jika ada pungutan ke fsti@itk.ac.id.
                        </p>
                    </div>
                </div>

                {/* Quick Demo Accounts Banner with Contact Support */}
                <div className="bg-muted/30 rounded-xl border p-5 shadow-2xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-foreground text-sm font-semibold">Siap Mencoba Sistem?</h3>
                                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                    Demo Siap Pakai
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Masuk sebagai Pengusul (Mahasiswa/Dosen), Staf Keuangan (Tendik), atau Pimpinan (kata sandi:{' '}
                                <code className="text-primary font-mono font-bold">password</code>)
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://wa.me/6285172312157?text=Halo%20FSTI%20ITK%2C%20saya%20ingin%20bertanya%20tentang%20layanan%20keuangan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-muted dark:text-slate-300"
                            >
                                <MessageCircle className="size-3.5 text-emerald-600" />
                                <span>WA Keuangan</span>
                            </a>
                            <Button asChild size="sm" className="h-8 gap-1.5 text-xs shadow-xs rounded-lg">
                                <Link href={route('login')}>
                                    <UserCheck className="size-3.5" />
                                    <span>Buka Halaman Masuk</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer with ONLY ITK and FSTI Logos */}
            <footer className="mt-12 border-t py-8 text-xs text-muted-foreground">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-md bg-white p-1 ring-1 ring-border dark:bg-card">
                            <img src="/images/logoitk.png" alt="ITK" className="h-6 w-auto object-contain" />
                            <img src="/images/logofsti.png" alt="FSTI ITK" className="h-6 w-auto object-contain" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">
                                Fakultas Sains dan Teknologi Informasi — ITK
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Kampus ITK, Jl. Soekarno Hatta KM 15, Balikpapan · fsti@itk.ac.id
                            </p>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        <p>© 2026 Institut Teknologi Kalimantan · Layanan Bebas Gratifikasi</p>
                        <p className="text-[11px] text-muted-foreground">
                            Sistem Informasi Manajemen Keuangan & Standar Biaya Masukan (SBM)
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
