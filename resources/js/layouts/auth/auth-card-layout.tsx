import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-slate-50 p-6 md:p-10 dark:bg-background">
            {/* Subtle background ambient */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="pola-titik-dark absolute inset-0 opacity-40"></div>
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex flex-col items-center gap-2 self-center text-center">
                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-sm ring-1 ring-border dark:bg-card">
                        <img src="/images/logotut.png" alt="Tut Wuri Handayani" className="h-7 w-auto object-contain" />
                        <img src="/images/logosaintek.png" alt="Diktisaintek" className="h-7 w-auto object-contain" />
                        <img src="/images/logoitk.png" alt="ITK" className="h-7 w-auto object-contain" />
                        <img src="/images/logofsti.png" alt="FSTI ITK" className="h-7 w-auto object-contain" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-sm font-extrabold tracking-tight text-foreground">SIM-KEUANGAN FSTI</span>
                        <span className="block text-[11px] text-muted-foreground">Fakultas Sains dan Teknologi Informasi · ITK</span>
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl border-border/80 shadow-md">
                        <CardHeader className="px-8 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl font-extrabold tracking-tight">{title}</CardTitle>
                            <CardDescription className="text-xs">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 py-7">{children}</CardContent>
                    </Card>
                </div>

                <div className="text-center text-[11px] text-muted-foreground">
                    Zona Integritas · Layanan Bebas Gratifikasi FSTI ITK
                </div>
            </div>
        </div>
    );
}
