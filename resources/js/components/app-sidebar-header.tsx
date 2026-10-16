import { NotificationDropdown } from '@/components/notification-dropdown';
import { SearchCommandDialog } from '@/components/search-command-dialog';
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
import { Link, usePage } from '@inertiajs/react';
import { BadgeCheck, Check, LogOut, Moon, Search, Shield, Sun, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({ breadcrumbs: _breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const [isDark, setIsDark] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
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
        <header className="border-border/80 bg-background/50 sticky top-0 z-50 flex h-12 shrink-0 items-center border-b px-4 backdrop-blur-md transition-[width,height] ease-linear lg:px-6">
            <div className="flex w-full items-center justify-between">
                {/* Left section: Sidebar Trigger, Separator, Search Dialog Button */}
                <div className="flex items-center gap-1 lg:gap-2">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 size-7" />
                    <Separator orientation="vertical" className="mx-2 h-4 self-center" />

                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="border-border/80 bg-background/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs shadow-2xs transition-all"
                        title="Cari Dokumen, Halaman & SBM (⌘K)"
                    >
                        <Search className="size-3.5" />
                        <span className="hidden sm:inline">Search documents, SBM, SPJ...</span>
                        <span className="sm:hidden">Search</span>
                        <Kbd className="ml-1 text-[10px]">⌘K</Kbd>
                    </button>
                </div>

                {/* Right section: Theme Switcher, GitHub, Account Switcher */}
                <div className="flex items-center gap-2">
                    {/* Role Indicator Badge */}
                    <div className="border-border/70 bg-muted/30 hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs md:flex">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground font-normal">Role:</span>
                        <strong className="text-foreground font-semibold">
                            {user?.role === 'admin' || user?.role === 'staf_keuangan'
                                ? 'Admin Keuangan'
                                : user?.role === 'pimpinan'
                                  ? 'Pimpinan'
                                  : 'Pengaju (Dosen)'}
                        </strong>
                    </div>

                    {/* Notifications Dropdown for Newly Submitted Proposals */}
                    <NotificationDropdown />

                    {/* Theme Switcher Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted size-8 rounded-lg"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>

                    {/* Account Switcher Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="hover:bg-muted/60 flex items-center gap-2 rounded-lg p-1 transition-colors focus:outline-hidden"
                            >
                                <Avatar className="ring-border size-8 rounded-lg ring-1">
                                    <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="border-border min-w-64 space-y-1 rounded-xl p-1.5 shadow-lg"
                            side="bottom"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-2 font-normal">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="ring-border size-9 rounded-lg ring-1">
                                        <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-xs font-bold">
                                            {getInitials(user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid min-w-0 flex-1 text-left text-xs leading-tight">
                                        <span className="text-foreground truncate text-sm font-semibold">{user?.name}</span>
                                        <span className="text-muted-foreground truncate text-[11px]">{user?.email}</span>
                                        <span className="text-primary mt-0.5 truncate text-[11px] font-medium">
                                            {user?.unit || 'Fakultas'} &bull; {user?.role}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Demo Account Switcher Options */}
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[10px] font-bold uppercase">
                                    Beralih Peran (Demo Switcher)
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="flex cursor-pointer items-center justify-between px-2 py-1.5">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Shield className="size-3.5 text-indigo-500" />
                                            <span>Budi Pratama (Admin Keuangan)</span>
                                        </div>
                                        {(user?.role === 'admin' || user?.role === 'staf_keuangan') && <Check className="text-primary size-3.5" />}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="flex cursor-pointer items-center justify-between px-2 py-1.5">
                                        <div className="flex items-center gap-2 text-xs">
                                            <UserIcon className="size-3.5 text-emerald-500" />
                                            <span>Dr. Siti Rahmawati (Pengaju)</span>
                                        </div>
                                        {user?.role === 'pengusul' && <Check className="text-primary size-3.5" />}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className="cursor-pointer gap-2 text-xs">
                                        <BadgeCheck className="text-muted-foreground size-4" />
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
                                    className="text-destructive hover:text-destructive w-full cursor-pointer gap-2 text-xs"
                                >
                                    <LogOut className="size-4" />
                                    <span>Keluar (Log out)</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Global Command Palette & Search Dialog */}
            <SearchCommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </header>
    );
}
