import React from 'react';
import { Link } from '@inertiajs/react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SupportCard() {
    return (
        <Card size="sm" className="overflow-hidden shadow-none border-border/80 group-data-[collapsible=icon]:hidden bg-muted/40">
            <CardHeader className="min-w-0 px-3.5 py-3">
                <CardTitle className="truncate text-xs font-semibold flex items-center gap-1.5 text-foreground">
                    <HelpCircle className="size-3.5 text-primary" />
                    Panduan SBM 2026
                </CardTitle>
                <CardDescription className="line-clamp-2 text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    Pelajari tata cara verifikasi berkas dan batas tarif standar biaya masukan.
                </CardDescription>
                <div className="pt-2">
                    <Link
                        href="/status-tracking"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                    >
                        <span>Lihat Alur 8 Tahap</span>
                        <ExternalLink className="size-2.5" />
                    </Link>
                </div>
            </CardHeader>
        </Card>
    );
}
