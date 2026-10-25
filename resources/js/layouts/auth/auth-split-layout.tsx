import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Hero Sidebar: FSTI Royal Cobalt Blue */}
            <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-primary-700 p-10 text-white lg:flex" style={{ backgroundColor: '#2f4dd3' }}>
                <div className="pola-titik absolute inset-0 opacity-40 pointer-events-none" />

                <div className="relative z-20">
                    <Link href={route('home')} className="inline-flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-white/95 p-2 shadow-sm backdrop-blur">
                            <img src="/images/logotut.png" alt="Tut Wuri Handayani" className="h-7 w-auto object-contain" />
                            <img src="/images/logosaintek.png" alt="Diktisaintek" className="h-7 w-auto object-contain" />
                            <img src="/images/logoitk.png" alt="ITK" className="h-7 w-auto object-contain" />
                            <img src="/images/logofsti.png" alt="FSTI ITK" className="h-7 w-auto object-contain" />
                        </div>
                    </Link>

                    <div className="mt-8 space-y-2">
                        <span className="rounded-full bg-amber-400/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-900 shadow-xs">
                            Portal Layanan Keuangan
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white">
                            Fakultas Sains dan Teknologi Informasi
                        </h2>
                        <p className="text-sm text-blue-100 max-w-md">
                            Institut Teknologi Kalimantan — Tata kelola usulan dokumen pengajuan, review Standar Biaya Masukan (SBM), dan verifikasi pertanggungjawaban anggaran.
                        </p>
                    </div>
                </div>

                <div className="relative z-20 mt-auto pt-8">
                    <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3.5 backdrop-blur border border-white/15">
                        <ShieldCheck className="size-5 text-amber-300 shrink-0" />
                        <div className="text-xs">
                            <p className="font-bold text-white">Zona Integritas Bebas Gratifikasi</p>
                            <p className="text-blue-100">Semua layanan FSTI gratis tanpa pungutan liar. Laporkan ke fsti@itk.ac.id</p>
                        </div>
                    </div>

                    {quote && (
                        <blockquote className="mt-4 space-y-1">
                            <p className="text-xs italic text-blue-200">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-[11px] font-medium text-blue-300">{quote.author}</footer>
                        </blockquote>
                    )}
                </div>
            </div>

            {/* Right Form Area */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex flex-col items-center justify-center gap-2 lg:hidden text-center">
                        <div className="flex items-center gap-1.5 rounded-xl bg-white p-2 shadow-sm ring-1 ring-border dark:bg-card">
                            <img src="/images/logoitk.png" alt="ITK" className="h-7 w-auto object-contain" />
                            <img src="/images/logofsti.png" alt="FSTI ITK" className="h-7 w-auto object-contain" />
                        </div>
                        <span className="text-sm font-extrabold text-foreground">SIM-KEUANGAN FSTI</span>
                    </Link>

                    <div className="flex flex-col items-start gap-1.5 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-muted-foreground text-xs">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
