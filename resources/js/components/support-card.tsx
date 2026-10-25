import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export function SupportCard() {
    return (
        <Card size="sm" className="border-border/80 bg-primary/5 dark:bg-card overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
            <CardHeader className="min-w-0 px-3.5 py-3">
                <CardTitle className="text-foreground flex items-center gap-1.5 truncate text-xs font-semibold">
                    <ShieldCheck className="text-primary size-3.5" />
                    Zona Integritas FSTI
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-tight">
                    Semua layanan administrasi dan keuangan FSTI gratis & bebas gratifikasi.
                </CardDescription>
                <div className="pt-2 flex items-center justify-between text-[11px]">
                    <Link href="/status-tracking" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                        <span>Alur 8 Tahap</span>
                        <ExternalLink className="size-2.5" />
                    </Link>
                    <a
                        href="https://wa.me/6285172312157?text=Halo%20FSTI%20ITK%2C%20saya%20ingin%20bertanya%20tentang%20keuangan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground text-[10px]"
                    >
                        WA Keuangan
                    </a>
                </div>
            </CardHeader>
        </Card>
    );
}
