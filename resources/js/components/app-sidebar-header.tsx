import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Check,
    Github,
    LogOut,
    Moon,
    Search,
    Shield,
    Sparkles,
    Sun,
    User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('appearance', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('appearance', 'light');
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center border-b border-border/80 bg-background/50 backdrop-blur-md px-4 lg:px-6 transition-[width,height] ease-linear">
            <div className="flex w-full items-center justify-between">
                {/* Left section: Sidebar Trigger, Separator, Search Dialog Button */}
                <div className="flex items-center gap-1 lg:gap-2">
                    <SidebarTrigger className="-ml-1 size-7 text-muted-foreground hover:text-foreground" />
                    <Separator orientation="vertical" className="mx-2 h-4 self-center" />

                    <Link
                        href="/dokumen-pengajuan"
                        className="flex h-8 items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-3 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all shadow-2xs"
                    >
                        <Search className="size-3.5" />
                        <span className="hidden sm:inline">Search documents, SBM, SPJ...</span>
                        <span className="sm:hidden">Search</span>
                        <Kbd className="ml-1 text-[10px]">⌘K</Kbd>
                    </Link>
                </div>

                {/* Right section: Theme Switcher, GitHub, Account Switcher */}
                <div className="flex items-center gap-2">
                    {/* Role Indicator Badge */}
                    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/70 bg-muted/30 text-xs">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-muted-foreground font-normal">Role:</span>
                        <strong className="text-foreground font-semibold">
                            {user?.role === 'admin' || user?.role === 'staf_keuangan'
                                ? 'Admin Keuangan'
                                : user?.role === 'pimpinan'
                                  ? 'Pimpinan'
                                  : 'Pengaju (Dosen)'}
                        </strong>
                    </div>

                    {/* Theme Switcher Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>

                    {/* GitHub Link */}
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="GitHub Reference"
                    >
                        <a
                            href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="size-4" />
                        </a>
                    </Button>

                    {/* Account Switcher Dropdown matching next-shadcn-admin-dashboard */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted/60 transition-colors focus:outline-hidden"
                            >
                                <Avatar className="size-8 rounded-lg ring-1 ring-border">
                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="min-w-64 space-y-1 rounded-xl p-1.5 shadow-lg border-border"
                            side="bottom"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-2 font-normal">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="size-9 rounded-lg ring-1 ring-border">
                                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                                            {getInitials(user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid min-w-0 flex-1 text-left text-xs leading-tight">
                                        <span className="truncate font-semibold text-foreground text-sm">
                                            {user?.name}
                                        </span>
                                        <span className="truncate text-muted-foreground text-[11px]">
                                            {user?.email}
                                        </span>
                                        <span className="truncate text-primary font-medium text-[11px] mt-0.5">
                                            {user?.unit || 'Fakultas'} &bull; {user?.role}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Demo Account Switcher Options */}
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1">
                                    Beralih Peran (Demo Switcher)
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center justify-between cursor-pointer px-2 py-1.5"
                                    >
                                        <div className="flex items-center gap-2 text-xs">
                                            <Shield className="size-3.5 text-indigo-500" />
                                            <span>Budi Pratama (Admin Keuangan)</span>
                                        </div>
                                        {(user?.role === 'admin' || user?.role === 'staf_keuangan') && <Check className="size-3.5 text-primary" />}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center justify-between cursor-pointer px-2 py-1.5"
                                    >
                                        <div className="flex items-center gap-2 text-xs">
                                            <UserIcon className="size-3.5 text-emerald-500" />
                                            <span>Dr. Siti Rahmawati (Pengaju)</span>
                                        </div>
                                        {user?.role === 'pengusul' && <Check className="size-3.5 text-primary" />}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className="cursor-pointer gap-2 text-xs">
                                        <BadgeCheck className="size-4 text-muted-foreground" />
                                        <span>Profil & Pengaturan Akun</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full cursor-pointer gap-2 text-xs text-destructive hover:text-destructive"
                                >
                                    <LogOut className="size-4" />
                                    <span>Keluar (Log out)</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
