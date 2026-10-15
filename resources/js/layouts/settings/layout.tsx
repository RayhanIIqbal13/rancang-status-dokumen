import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil Akun',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Kata Sandi',
        url: '/settings/password',
        icon: null,
    },
    {
        title: 'Tampilan (Tema)',
        url: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = window.location.pathname;

    return (
        <div className="flex flex-col gap-5 p-4 md:p-6 max-w-5xl">
            <div className="border-b pb-3">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Pengaturan Akun</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola profil pengguna, kredensial keamanan, dan preferensi tema aplikasi
                </p>
            </div>

            <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8">
                <aside className="w-full lg:w-48 shrink-0">
                    <nav className="flex flex-row gap-1 lg:flex-col">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.url}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'h-8 w-full justify-start text-xs rounded-lg transition-colors',
                                    currentPath === item.url
                                        ? 'bg-accent text-accent-foreground font-medium shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Link href={item.url} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1">
                    <div className="rounded-xl border bg-card p-5 shadow-2xs">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
