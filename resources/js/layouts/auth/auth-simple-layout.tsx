import { Building2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 md:p-10">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                            <Building2 className="size-5" />
                        </div>
                        <div className="text-left leading-tight">
                            <span className="block text-sm font-semibold tracking-tight">SAK ITK</span>
                            <span className="block text-[10px] text-muted-foreground">Layanan Keuangan</span>
                        </div>
                    </Link>

                    <div className="mt-2 space-y-1">
                        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-2xs">
                    {children}
                </div>
            </div>
        </div>
    );
}
