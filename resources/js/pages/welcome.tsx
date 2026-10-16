import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, ArrowRight, ChevronRight, Command, FileCheck, Landmark, Shield, Sparkles, UserCheck } from 'lucide-react';

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
        <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground min-h-screen antialiased">
            <Head title="SIM-KEUANGAN SBM — Pelacakan Dokumen & SAKTI" />

            {/* Header Navigation */}
            <header className="bg-background/80 sticky top-0 z-50 flex h-12 w-full items-center justify-between border-b px-4 backdrop-blur-md md:px-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg shadow-xs">
                        <Command className="size-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-foreground text-xs font-semibold tracking-tight">SIM-KEUANGAN SBM</span>
                        <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium">SAK ITK</span>
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
                <div className="flex flex-col items-center space-y-4 pt-4 text-center md:pt-8">
                    <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-4xl border px-3 py-1 text-xs font-medium shadow-xs">
                        <Sparkles className="size-3.5" />
                        <span>Sistem Informasi Layanan Keuangan ITK • TA 2026</span>
                    </div>

                    <h1 className="text-foreground max-w-3xl text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
                        Pelacakan Status Dokumen & Realisasi Anggaran SBM
                    </h1>

                    <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
                        Platform tata kelola dokumen usulan anggaran, verifikasi kepatuhan Standar Biaya Masukan (SBM), rekonsiliasi SPJ, dan
                        pencatatan pencairan modul SAKTI secara transparan dan akuntabel.
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
                <div className="bg-card space-y-4 rounded-xl border p-6 shadow-2xs">
                    <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-foreground text-sm font-semibold tracking-tight">Alur 8 Tahapan Siklus Dokumen Pengajuan</h2>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Standar Operasional Prosedur (SOP) alur pengusulan kegiatan hingga pencairan dana
                            </p>
                        </div>
                        <span className="border-primary/20 bg-primary/10 text-primary self-start rounded-4xl border px-2 py-0.5 text-[10px] font-medium sm:self-auto">
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
                                <h3 className="text-foreground mt-2 line-clamp-1 text-xs leading-tight font-semibold">{st.title}</h3>
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-[10px] leading-normal">{st.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Feature Matrix (Studio Admin Style) */}
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
                            Pemeriksaan otomatis batas plafon belanja dan honorarium mengacu Standar Biaya Masukan ITK Tahun 2026.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="from-primary/5 to-card ring-foreground/10 space-y-2 rounded-xl bg-linear-to-t p-5 shadow-xs ring-1">
                        <div className="bg-muted text-primary flex size-8 items-center justify-center rounded-lg border">
                            <Landmark className="size-4" />
                        </div>
                        <h3 className="text-foreground text-sm font-semibold">Sinkronisasi SP2D SAKTI</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Pencatatan realisasi dana cair dan pelaporan pertanggungjawaban SPJ yang terintegrasi dengan modul keuangan.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="from-primary/5 to-card ring-foreground/10 space-y-2 rounded-xl bg-linear-to-t p-5 shadow-xs ring-1">
                        <div className="bg-muted text-primary flex size-8 items-center justify-center rounded-lg border">
                            <Shield className="size-4" />
                        </div>
                        <h3 className="text-foreground text-sm font-semibold">Akses Multi-Role Terkendali</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Pembagian wewenang yang aman untuk Dosen/Pengusul, Tim Verifikator Keuangan, Pimpinan, dan Administrator.
                        </p>
                    </div>
                </div>

                {/* Quick Demo Accounts Banner */}
                <div className="bg-muted/30 rounded-xl border p-5 shadow-2xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-foreground text-sm font-semibold">Siap Mencoba Sistem?</h3>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Gunakan salah satu akun demo yang telah disediakan (kata sandi:{' '}
                                <code className="text-primary font-mono font-bold">password</code>)
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
            <footer className="text-muted-foreground mt-12 border-t py-6 text-center text-xs">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                    <p>© 2026 Institut Teknologi Kalimantan • Sistem Informasi Layanan Keuangan (SAK ITK)</p>
                    <p className="text-[11px]">Studio Admin Design System</p>
                </div>
            </footer>
        </div>
    );
}
