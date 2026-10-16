import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ExternalLink, HelpCircle } from 'lucide-react';

export function SupportCard() {
    return (
        <Card size="sm" className="border-border/80 bg-muted/40 overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
            <CardHeader className="min-w-0 px-3.5 py-3">
                <CardTitle className="text-foreground flex items-center gap-1.5 truncate text-xs font-semibold">
                    <HelpCircle className="text-primary size-3.5" />
                    Panduan SBM 2026
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-tight">
                    Pelajari tata cara verifikasi berkas dan batas tarif standar biaya masukan.
                </CardDescription>
                <div className="pt-2">
                    <Link href="/status-tracking" className="text-primary inline-flex items-center gap-1 text-[11px] font-medium hover:underline">
                        <span>Lihat Alur 8 Tahap</span>
                        <ExternalLink className="size-2.5" />
                    </Link>
                </div>
            </CardHeader>
        </Card>
    );
}
