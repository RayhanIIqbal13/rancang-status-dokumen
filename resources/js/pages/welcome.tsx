import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Check,
    Clock,
    ExternalLink,
    FileCheck,
    GraduationCap,
    HelpCircle,
    Landmark,
    Mail,
    MapPin,
    MessageCircle,
    Presentation,
    Search,
    Shield,
    ShieldCheck,
    Sparkles,
    Ticket,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [searchQuery, setSearchQuery] = useState('');

    const stages = [
        { num: 1, title: 'Diajukan', role: 'Pengusul', desc: 'Usulan didaftarkan melalui sistem dengan nomor pengajuan otomatis' },
        { num: 2, title: 'Verifikasi Fakultas', role: 'Staf Keuangan', desc: 'Pemeriksaan kelengkapan proposal & kepatuhan tarif SBM ITK' },
        { num: 3, title: 'Perlu Revisi', role: 'Pengusul', desc: 'Perbaikan berkas atau rincian anggaran sesuai catatan verifikator' },
        { num: 4, title: 'Menunggu SK', role: 'Staf Keuangan', desc: 'Penyusunan surat tugas dan penetapan keputusan Dekanat' },
        { num: 5, title: 'Disetujui', role: 'Pimpinan', desc: 'Persetujuan resmi Wakil Dekan/Dekan untuk pelaksanaan kegiatan' },
        { num: 6, title: 'Verifikasi SPJ', role: 'Staf Keuangan', desc: 'Pemeriksaan bukti riil kuitansi pengeluaran pasca kegiatan' },
        { num: 7, title: 'Diproses di SAKTI', role: 'Staf Keuangan', desc: 'Pencatatan nomor SPP/SPM pada modul pembayaran Kemenkeu' },
        { num: 8, title: 'Dana Cair', role: 'Staf Keuangan', desc: 'Penerbitan SP2D dan transfer dana tuntas ke rekening pelaksana' },
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
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-700 selection:text-white antialiased dark:bg-background dark:text-foreground">
            <Head title="Layanan FSTI — Portal Layanan Keuangan & Status Dokumen ITK" />

            {/* Header Sticky Navigation Matching Reference */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:border-border dark:bg-background/95">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
                    {/* Quad Logo Strip & Title */}
                    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Beranda Layanan FSTI">
                        <span className="flex items-center gap-1.5 sm:gap-2.5">
                            <img src="/images/logotut.png" alt="Tut Wuri Handayani" className="h-7 w-auto sm:h-9 object-contain" />
                            <img src="/images/logosaintek.png" alt="Diktisaintek Berdampak" className="h-7 w-auto sm:h-9 object-contain" />
                            <img src="/images/logoitk.png" alt="Institut Teknologi Kalimantan" className="h-7 w-auto sm:h-9 object-contain" />
                            <img src="/images/logofsti.png" alt="FSTI ITK" className="h-7 w-auto sm:h-9 object-contain" />
                        </span>
                        <span className="hidden border-l border-slate-300 pl-3 leading-tight xl:block dark:border-border">
                            <span className="block text-[15px] font-extrabold text-slate-900 dark:text-white">Layanan FSTI</span>
                            <span className="block text-xs font-medium text-slate-500 dark:text-muted-foreground">
                                Fakultas Sains & Teknologi Informasi · ITK
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="ml-auto hidden items-center gap-1.5 lg:flex">
                        <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 hover:text-primary-700 dark:text-slate-200">
                            Beranda
                        </Link>
                        <a href="#pintu-layanan" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            Pintu Layanan
                        </a>
                        <a href="#alur-layanan" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            Alur 8 Tahap
                        </a>
                        <a href="#zona-integritas" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            Zona Integritas
                        </a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pl-4">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hidden sm:inline-flex rounded-xl border-slate-200 text-slate-700 hover:border-primary-700 hover:text-primary-700 dark:border-border dark:text-slate-300"
                        >
                            <Link href={auth.user ? route('status-tracking.index') : route('login')}>
                                <Ticket className="mr-1.5 size-4 text-primary-700" />
                                <span>Cek Status</span>
                            </Link>
                        </Button>

                        {auth.user ? (
                            <Button asChild size="sm" className="rounded-xl bg-primary-700 hover:bg-primary-800 text-white shadow-xs" style={{ backgroundColor: '#2f4dd3' }}>
                                <Link href={route('dashboard')}>
                                    <span>Buka Dashboard</span>
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild size="sm" className="rounded-xl bg-primary-700 hover:bg-primary-800 text-white shadow-xs" style={{ backgroundColor: '#2f4dd3' }}>
                                <Link href={route('login')}>
                                    <span>Masuk ke Sistem</span>
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main id="konten" className="flex-grow">
                {/* 1. HERO SECTION - FSTI Royal Cobalt Blue */}
                <section className="relative overflow-hidden text-white" style={{ backgroundColor: '#2f4dd3' }}>
                    {/* Background Dot Matrix Pattern & Large Watermark */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                        <div className="pola-titik absolute inset-0 opacity-40"></div>
                        <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-180 select-none whitespace-nowrap font-extrabold leading-none tracking-tighter text-white/[0.08] text-[7rem] [writing-mode:vertical-rl] xl:block">
                            Layanan Keuangan FSTI
                        </span>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-36 sm:px-6 sm:pt-16 sm:pb-44 lg:px-8 lg:pt-20 lg:pb-48 grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
                        <div>
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-900 shadow-sm">
                                <Sparkles className="size-3.5" />
                                <span>Portal Layanan Administrasi & Keuangan · FSTI ITK</span>
                            </div>

                            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.35rem]">
                                Semua urusan usulan & realisasi anggaran FSTI, lewat satu pintu.
                            </h1>

                            <p className="mt-5 max-w-xl text-base text-blue-100 sm:text-lg leading-relaxed">
                                Ajukan usulan kegiatan, pantau verifikasi Standar Biaya Masukan (SBM), rekonsiliasi SPJ kuitansi, hingga pencairan SP2D modul SAKTI — untuk Mahasiswa, Dosen, dan Tendik.
                            </p>

                            {/* Search Bar Input */}
                            <div className="mt-8 max-w-xl">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari nomor pengajuan (mis. PROP/2026/0001) atau nama kegiatan..."
                                            className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-28 text-sm sm:text-base text-slate-900 shadow-lg placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-300/60"
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="absolute right-2 top-2 h-10 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-semibold px-4"
                                            style={{ backgroundColor: '#2f4dd3' }}
                                        >
                                            Lacak
                                        </Button>
                                    </div>

                                    {/* Sering Dicari Tags */}
                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                        <span className="text-blue-100 font-medium">Sering dicari:</span>
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('RAB Mahasiswa')}
                                            className="rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25 transition-colors"
                                        >
                                            RAB Mahasiswa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('PNBP Fakultas')}
                                            className="rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25 transition-colors"
                                        >
                                            PNBP Fakultas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('Honorarium SBM')}
                                            className="rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25 transition-colors"
                                        >
                                            Honorarium SBM
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('SPJ Kuitansi')}
                                            className="rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25 transition-colors"
                                        >
                                            SPJ Kuitansi
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Interactive Status Ticket Card */}
                        <div className="hidden lg:block">
                            <div className="relative mx-auto w-full max-w-sm rotate-[-2deg] transition-transform duration-300 hover:rotate-0">
                                <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[3deg] rounded-3xl bg-white/15" />

                                <div className="relative overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
                                    {/* Ticket Header */}
                                    <div className="flex items-start justify-between px-6 pb-4 pt-6">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                Cek Status · Nomor Pengajuan
                                            </p>
                                            <p className="mt-1 font-mono text-xl font-extrabold tracking-wider text-primary-700" style={{ color: '#2f4dd3' }}>
                                                PROP/2026/0018
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                                            Diproses
                                        </span>
                                    </div>

                                    {/* Ticket Perforation Dashed Line with Notches */}
                                    <div className="relative h-4">
                                        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full" style={{ backgroundColor: '#2f4dd3' }} />
                                        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full" style={{ backgroundColor: '#2f4dd3' }} />
                                        <div className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-slate-200" />
                                    </div>

                                    {/* Ticket Details */}
                                    <div className="px-6 pb-6 pt-3">
                                        <p className="text-xs font-medium text-slate-400">Nama Kegiatan</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            Bantuan Delegasi Lomba Gemastik Mahasiswa FSTI
                                        </p>

                                        <div className="mt-2 flex justify-between text-xs text-slate-500">
                                            <span>Diajukan 24 Okt 2026</span>
                                            <span className="font-semibold text-emerald-600">Pagu: Rp 12.500.000</span>
                                        </div>

                                        {/* Step Progress Indicators */}
                                        <ol className="mt-5 grid grid-cols-4 gap-1.5 text-center">
                                            <li>
                                                <span className="block h-1.5 rounded-full bg-primary-600" style={{ backgroundColor: '#2f4dd3' }} />
                                                <span className="mt-2 flex items-center justify-center gap-0.5 text-[10px] font-bold text-slate-800">
                                                    <Check className="size-3 text-primary-700" style={{ color: '#2f4dd3' }} /> Diterima
                                                </span>
                                            </li>
                                            <li>
                                                <span className="block h-1.5 rounded-full bg-primary-600" style={{ backgroundColor: '#2f4dd3' }} />
                                                <span className="mt-2 flex items-center justify-center gap-0.5 text-[10px] font-bold text-slate-800">
                                                    <Check className="size-3 text-primary-700" style={{ color: '#2f4dd3' }} /> Diverifikasi
                                                </span>
                                            </li>
                                            <li>
                                                <span className="block h-1.5 rounded-full bg-amber-400" />
                                                <span className="mt-2 block text-[10px] font-bold text-amber-700">
                                                    Diproses
                                                </span>
                                            </li>
                                            <li>
                                                <span className="block h-1.5 rounded-full bg-slate-200" />
                                                <span className="mt-2 block text-[10px] font-semibold text-slate-400">
                                                    Cair (SP2D)
                                                </span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-xs text-blue-100">
                                    Contoh kartu pelacakan status permohonan anggaran
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. PINTU LAYANAN - 3 Portals Section Overlapping Hero */}
                <section id="pintu-layanan" className="relative z-10 -mt-24 sm:-mt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Door 01: Mahasiswa */}
                        <div className="group relative flex flex-col overflow-hidden rounded-b-2xl rounded-t-[2.5rem] border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-border dark:bg-card">
                            <div className="relative h-32 overflow-hidden bg-primary-700" style={{ backgroundColor: '#2f4dd3' }}>
                                <div className="pola-titik absolute inset-0 opacity-40" />
                                <span className="absolute -bottom-6 right-4 select-none text-[6.5rem] font-extrabold leading-none text-white/10 transition-transform duration-300 group-hover:-translate-y-1">
                                    01
                                </span>
                                <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
                                    <GraduationCap className="size-6" />
                                </span>
                                <span className="absolute bottom-4 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900 shadow-xs">
                                    Pintu 01
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <p className="text-xs font-semibold text-slate-400 dark:text-muted-foreground uppercase tracking-wider">
                                    Mahasiswa & Ormawa
                                </p>
                                <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Layanan Mahasiswa
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Pengajuan proposal kegiatan ormawa, bantuan delegasi kompetisi, anggaran program kerja HIMA/BEM, dan rekonsiliasi SPJ kemahasiswaan.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Proposal Ormawa
                                    </span>
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Delegasi Lomba
                                    </span>
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        SPJ Kegiatan
                                    </span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-border/60">
                                    <span className="text-xs text-slate-500 font-medium">Standar Pagu SBM ITK 2026</span>
                                    <Link
                                        href={auth.user ? route('dokumen-pengajuan.create') : route('login')}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white"
                                        style={{ color: '#2f4dd3' }}
                                    >
                                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Door 02: Dosen & Tendik */}
                        <div className="group relative flex flex-col overflow-hidden rounded-b-2xl rounded-t-[2.5rem] border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-border dark:bg-card">
                            <div className="relative h-32 overflow-hidden bg-primary-800" style={{ backgroundColor: '#243ca8' }}>
                                <div className="pola-titik absolute inset-0 opacity-40" />
                                <span className="absolute -bottom-6 right-4 select-none text-[6.5rem] font-extrabold leading-none text-white/10 transition-transform duration-300 group-hover:-translate-y-1">
                                    02
                                </span>
                                <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
                                    <Presentation className="size-6" />
                                </span>
                                <span className="absolute bottom-4 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900 shadow-xs">
                                    Pintu 02
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <p className="text-xs font-semibold text-slate-400 dark:text-muted-foreground uppercase tracking-wider">
                                    Dosen & Tenaga Kependidikan
                                </p>
                                <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Layanan Dosen & Tendik
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Usulan kegiatan program studi, anggaran workshop, permohonan surat tugas dinas, honor narasumber eksternal, dan belanja operasional laboratorium.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Anggaran Prodi
                                    </span>
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Honor Narasumber
                                    </span>
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Perjalanan Dinas
                                    </span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-border/60">
                                    <span className="text-xs text-slate-500 font-medium">Verifikasi Cepat 1–2 Hari</span>
                                    <Link
                                        href={auth.user ? route('dokumen-pengajuan.create') : route('login')}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white"
                                        style={{ color: '#2f4dd3' }}
                                    >
                                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Door 03: Pimpinan & Verifikator */}
                        <div className="group relative flex flex-col overflow-hidden rounded-b-2xl rounded-t-[2.5rem] border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-border dark:bg-card">
                            <div className="relative h-32 overflow-hidden bg-primary-950" style={{ backgroundColor: '#121e54' }}>
                                <div className="pola-titik absolute inset-0 opacity-40" />
                                <span className="absolute -bottom-6 right-4 select-none text-[6.5rem] font-extrabold leading-none text-white/10 transition-transform duration-300 group-hover:-translate-y-1">
                                    03
                                </span>
                                <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
                                    <ShieldCheck className="size-6" />
                                </span>
                                <span className="absolute bottom-4 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900 shadow-xs">
                                    Pintu 03
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <p className="text-xs font-semibold text-slate-400 dark:text-muted-foreground uppercase tracking-wider">
                                    Pimpinan & Staf Keuangan
                                </p>
                                <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Verifikasi & SAKTI
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Review kepatuhan batas biaya masukan SBM, disposisi persetujuan Dekanat, integrasi pencairan SP2D SAKTI, dan audit pertanggungjawaban dana.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Audit Plafon SBM
                                    </span>
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Persetujuan SK
                                    </span>
                                    <span className="rounded-lg bg-slate-100 dark:bg-muted px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Sinkron SAKTI
                                    </span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-border/60">
                                    <span className="text-xs text-slate-500 font-medium">Akuntabel & Transparan</span>
                                    <Link
                                        href={auth.user ? route('verifikasi-dokumen.index') : route('login')}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white"
                                        style={{ color: '#2f4dd3' }}
                                    >
                                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. ALUR LAYANAN - 8 TAHAP SIKLUS KEAMANAN & ANGGARAN */}
                <section id="alur-layanan" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="label-kecil text-primary-700 font-bold" style={{ color: '#2f4dd3' }}>
                                Alur Standar Pelayanan
                            </p>
                            <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Delapan tahapan siklus usulan sampai pencairan dana.
                            </h2>
                        </div>
                        <Link
                            href={auth.user ? route('status-tracking.index') : route('login')}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:underline"
                            style={{ color: '#2f4dd3' }}
                        >
                            <span>Buka audit trail tracking</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stages.map((st) => (
                            <div
                                key={st.num}
                                className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-md dark:border-border dark:bg-card"
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-extrabold text-white"
                                        style={{ backgroundColor: '#2f4dd3' }}
                                    >
                                        {st.num}
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-muted dark:text-slate-300">
                                        {st.role}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{st.title}</h3>
                                <p className="mt-1 text-xs text-slate-500 leading-relaxed dark:text-slate-400">{st.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. ZONA INTEGRITAS & BANTUAN SECTION */}
                <section id="zona-integritas" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            <ShieldCheck className="size-4 text-emerald-600" />
                            <span>Zona Integritas FSTI ITK</span>
                        </div>
                        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Layanan gratis, tanpa gratifikasi.
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Fakultas Sains dan Teknologi Informasi berkomitmen mewujudkan Wilayah Bebas dari Korupsi (WBK). Mahasiswa dan pengusul dilarang memberi hadiah atau bingkisan dalam bentuk apapun.
                        </p>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-border">
                            <img
                                src="/images/zi.png"
                                alt="Zona Integritas FSTI ITK — Dilarang memberi hadiah/bingkisan"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-lg dark:border-border dark:bg-card lg:mt-10">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Butuh bantuan keuangan?</h2>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Hubungi Subbagian Keuangan & Perencanaan FSTI ITK. Sebutkan nomor pengajuan jika menanyakan status usulan.
                        </p>

                        <div className="mt-5 grid gap-2.5">
                            <a
                                href="https://wa.me/6285172312157?text=Halo%20FSTI%20ITK%2C%20saya%20ingin%20bertanya%20tentang%20keuangan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-primary-700 hover:bg-slate-50 transition-colors dark:border-border dark:bg-card dark:text-slate-200"
                            >
                                <MessageCircle className="size-5 text-emerald-600" />
                                <span>WhatsApp Keuangan FSTI</span>
                            </a>

                            <a
                                href="https://wa.me/6285172302157?text=Halo%20FSTI%20ITK%2C%20saya%20ingin%20bertanya%20tentang%20akademik"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-primary-700 hover:bg-slate-50 transition-colors dark:border-border dark:bg-card dark:text-slate-200"
                            >
                                <MessageCircle className="size-5 text-blue-600" />
                                <span>WhatsApp Akademik FSTI</span>
                            </a>

                            <a
                                href="mailto:fsti@itk.ac.id"
                                className="flex items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-primary-700 hover:bg-slate-50 transition-colors dark:border-border dark:bg-card dark:text-slate-200"
                            >
                                <Mail className="size-5 text-primary-700" style={{ color: '#2f4dd3' }} />
                                <span>fsti@itk.ac.id</span>
                            </a>
                        </div>

                        <div className="mt-6 flex items-start gap-2.5 border-t border-slate-100 dark:border-border/60 pt-4 text-xs text-slate-500">
                            <Clock className="mt-0.5 size-4 text-slate-400 shrink-0" />
                            <div>
                                <span className="block font-medium">Jam Pelayanan Subbag Keuangan:</span>
                                <span>Senin–Kamis: 08.00–16.00 WITA</span><br />
                                <span>Jumat: 08.00–16.30 WITA</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 5. FOOTER Matching Reference Site */}
            <footer className="relative mt-28 text-white" style={{ backgroundColor: '#121e54' }}>
                <div className="pola-titik absolute inset-0 opacity-30 pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Floating Yellow Banner */}
                    <div className="-translate-y-1/2 rounded-2xl bg-amber-400 px-5 py-4 text-slate-950 shadow-xl sm:flex sm:items-center sm:justify-between sm:px-7">
                        <p className="flex items-start gap-3 text-sm font-bold sm:items-center">
                            <ShieldCheck className="size-5 shrink-0 text-slate-950" />
                            Semua layanan administrasi dan keuangan FSTI gratis dan bebas gratifikasi.
                        </p>
                        <p className="mt-1 pl-8 text-xs sm:mt-0 sm:pl-0 font-medium">
                            Ada pungutan? Laporkan ke{' '}
                            <a href="mailto:fsti@itk.ac.id" className="font-extrabold underline underline-offset-2">
                                fsti@itk.ac.id
                            </a>
                        </p>
                    </div>

                    {/* Footer Columns */}
                    <div className="grid gap-10 pb-12 pt-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <img src="/images/logofsti.png" alt="FSTI ITK" className="h-8 w-auto object-contain bg-white rounded-md p-1" />
                                <span className="text-lg font-extrabold text-white">Layanan FSTI</span>
                            </div>
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Fakultas Sains dan Teknologi Informasi<br />
                                Institut Teknologi Kalimantan
                            </p>
                            <p className="mt-4 flex gap-2.5 text-xs text-blue-200">
                                <MapPin className="mt-0.5 size-4 text-blue-300 shrink-0" />
                                <span>
                                    Kampus ITK, Jl. Soekarno Hatta KM 15, Karang Joang<br />
                                    Balikpapan Utara, Kalimantan Timur 76127
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-3">
                                Hubungi Kami
                            </p>
                            <ul className="space-y-2.5 text-xs text-blue-200">
                                <li>
                                    <a href="mailto:fsti@itk.ac.id" className="hover:text-white transition-colors">
                                        fsti@itk.ac.id
                                    </a>
                                </li>
                                <li>
                                    <a href="https://wa.me/6285172312157" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                        WhatsApp Keuangan
                                    </a>
                                </li>
                                <li>
                                    <a href="https://wa.me/6285172302157" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                        WhatsApp Akademik
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-3">
                                Pintu Layanan
                            </p>
                            <ul className="space-y-2 text-xs text-blue-200">
                                <li><a href="#pintu-layanan" className="hover:text-white">Layanan Mahasiswa (01)</a></li>
                                <li><a href="#pintu-layanan" className="hover:text-white">Layanan Dosen & Tendik (02)</a></li>
                                <li><a href="#pintu-layanan" className="hover:text-white">Pimpinan & SAKTI (03)</a></li>
                                <li>
                                    <Link href={auth.user ? route('status-tracking.index') : route('login')} className="hover:text-white">
                                        Cek Status Usulan
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-3">
                                Akses Sistem
                            </p>
                            <ul className="space-y-2 text-xs text-blue-200">
                                <li><Link href={route('login')} className="hover:text-white">Masuk ke Akun</Link></li>
                                <li><Link href={route('dashboard')} className="hover:text-white">Dashboard Monitoring</Link></li>
                                <li>
                                    <a href="https://itk.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                        Portal Resmi ITK
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-blue-300 sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 Fakultas Sains dan Teknologi Informasi — Institut Teknologi Kalimantan</p>
                        <p className="text-[11px] text-blue-400">
                            Sistem Informasi Manajemen Keuangan & Standar Biaya Masukan (SBM)
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
