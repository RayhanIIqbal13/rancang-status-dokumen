import { Button } from '@/components/ui/button';
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
        <div className="flex max-w-5xl flex-col gap-5 p-4 md:p-6">
            <div className="border-b pb-3">
                <h1 className="text-foreground text-xl font-semibold tracking-tight">Pengaturan Akun</h1>
                <p className="text-muted-foreground mt-0.5 text-xs">Kelola profil pengguna, kredensial keamanan, dan preferensi tema aplikasi</p>
            </div>

            <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8">
                <aside className="w-full shrink-0 lg:w-48">
                    <nav className="flex flex-row gap-1 lg:flex-col">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.url}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'h-8 w-full justify-start rounded-lg text-xs transition-colors',
                                    currentPath === item.url
                                        ? 'bg-accent text-accent-foreground font-medium shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground',
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
                    <div className="bg-card rounded-xl border p-5 shadow-2xs">{children}</div>
                </div>
            </div>
        </div>
    );
}
