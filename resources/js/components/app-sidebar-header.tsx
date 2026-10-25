import { LayoutControls } from '@/components/layout-controls';
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
import { usePreferences } from '@/hooks/use-preferences';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Check,
    ChevronDown,
    Crown,
    GraduationCap,
    LogOut,
    Moon,
    Search,
    Shield,
    Sun,
    UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({ breadcrumbs: _breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const { preferences } = usePreferences();

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

    // Role display mappings (Addressing item 4 from simulation)
    const getRoleInfo = (role?: string) => {
        switch (role) {
            case 'pengusul':
                return {
                    label: 'Mahasiswa (Pengaju)',
                    fullTitle: 'Raihan Iqbal (Mahasiswa SI FSTI)',
                    badgeColor: 'bg-emerald-500',
                    textColor: 'text-emerald-700 dark:text-emerald-400',
                    icon: GraduationCap,
                };
            case 'staf_keuangan':
                return {
                    label: 'Tendik (Verifikator)',
                    fullTitle: 'Dwitami, S.E. (Tendik Verifikator FSTI)',
                    badgeColor: 'bg-amber-500',
                    textColor: 'text-amber-700 dark:text-amber-400',
                    icon: UserCheck,
                };
            case 'pimpinan':
                return {
                    label: 'Pimpinan / Dekan',
                    fullTitle: 'Prof. Dr. Ir. Dekan FSTI ITK',
                    badgeColor: 'bg-purple-500',
                    textColor: 'text-purple-700 dark:text-purple-400',
                    icon: Crown,
                };
            case 'admin':
            default:
                return {
                    label: 'Admin Sistem',
                    fullTitle: 'Administrator Sistem SAK ITK',
                    badgeColor: 'bg-blue-500',
                    textColor: 'text-blue-700 dark:text-blue-400',
                    icon: Shield,
                };
        }
    };

    const currentRoleInfo = getRoleInfo(user?.role);

    const switchRole = (roleKey: string, email?: string) => {
        router.post(
            '/demo-switch-user',
            { role: roleKey, email },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <header
            className={`border-border/80 bg-background/50 flex h-12 shrink-0 items-center border-b px-4 backdrop-blur-md transition-[width,height] ease-linear lg:px-6 ${
                preferences.navbarStyle === 'sticky' ? 'sticky top-0 z-40' : 'relative z-10'
            }`}
        >
            <div className="flex w-full items-center justify-between">
                {/* Left section: Sidebar Trigger, Separator, Search Dialog Button */}
                <div className="flex items-center gap-1 lg:gap-2">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 size-7" />
                    <Separator orientation="vertical" className="mx-1 sm:mx-2 h-4 self-center" />

                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="border-border/80 bg-background/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex h-8 cursor-pointer items-center gap-1.5 sm:gap-2 rounded-lg border px-2 sm:px-3 text-xs shadow-2xs transition-all"
                        title="Cari Dokumen, Halaman & SBM (⌘K)"
                    >
                        <Search className="size-3.5" />
                        <span className="hidden sm:inline">Search documents, SBM, SPJ...</span>
                        <span className="sm:hidden text-xs">Search</span>
                        <Kbd className="hidden sm:inline-flex ml-1 gap-1 px-1.5 text-[10px]">
                            <span className="text-xs leading-none">⌘</span>
                            <span className="leading-none">K</span>
                        </Kbd>
                    </button>
                </div>

                {/* Right section: Role Quick Switcher, Theme Switcher, Account Switcher */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Live Role Switcher Dropdown in Header */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="border-border/70 bg-muted/40 hover:bg-muted/70 hidden sm:flex items-center gap-2 rounded-full border px-3 py-1 text-xs cursor-pointer transition-colors shadow-2xs"
                                title="Klik untuk beralih peran demo simulasi (Mahasiswa, Tendik, Admin)"
                            >
                                <span className={`size-2 animate-pulse rounded-full ${currentRoleInfo.badgeColor}`} />
                                <span className="text-muted-foreground font-normal">Peran:</span>
                                <strong className="text-foreground font-semibold">{currentRoleInfo.label}</strong>
                                <ChevronDown className="size-3 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-1.5 rounded-xl shadow-lg">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                                Simulasi Peran (Live Switcher)
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => switchRole('mahasiswa', 'mahasiswa@itk.ac.id')}
                                className="flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                        <GraduationCap className="size-4" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">1. Mahasiswa (Pengaju)</div>
                                        <div className="text-[10px] text-muted-foreground">Raihan Iqbal (NIM: 10211068)</div>
                                    </div>
                                </div>
                                {user?.role === 'pengusul' && <Check className="size-4 text-emerald-600 shrink-0" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => switchRole('tendik', 'tendik@itk.ac.id')}
                                className="flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                        <UserCheck className="size-4" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">2. Tendik (Verifikator FSTI)</div>
                                        <div className="text-[10px] text-muted-foreground">Dwitami, S.E. (Subbag Keuangan)</div>
                                    </div>
                                </div>
                                {user?.role === 'staf_keuangan' && <Check className="size-4 text-amber-600 shrink-0" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => switchRole('admin', 'admin@itk.ac.id')}
                                className="flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                        <Shield className="size-4" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">3. Admin Sistem SAK</div>
                                        <div className="text-[10px] text-muted-foreground">Administrator SAK ITK</div>
                                    </div>
                                </div>
                                {user?.role === 'admin' && <Check className="size-4 text-blue-600 shrink-0" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => switchRole('pimpinan', 'pimpinan@itk.ac.id')}
                                className="flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                        <Crown className="size-4" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">4. Pimpinan / Dekan</div>
                                        <div className="text-[10px] text-muted-foreground">Dekanat FSTI ITK</div>
                                    </div>
                                </div>
                                {user?.role === 'pimpinan' && <Check className="size-4 text-purple-600 shrink-0" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications Dropdown for Newly Submitted Proposals */}
                    <NotificationDropdown />

                    {/* Preferences Controls (Theme, Font, Layout, Sidebar style) */}
                    <LayoutControls />

                    {/* Theme Switcher Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted size-8 rounded-lg cursor-pointer"
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
                                            {user?.unit || 'Fakultas'} &bull; {currentRoleInfo.label}
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
                                <DropdownMenuItem
                                    onClick={() => switchRole('mahasiswa', 'mahasiswa@itk.ac.id')}
                                    className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-xs"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <GraduationCap className="size-3.5 text-emerald-500" />
                                        <span>Raihan Iqbal (Mahasiswa)</span>
                                    </div>
                                    {user?.role === 'pengusul' && <Check className="text-primary size-3.5" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => switchRole('tendik', 'tendik@itk.ac.id')}
                                    className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-xs"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <UserCheck className="size-3.5 text-amber-500" />
                                        <span>Dwitami, S.E. (Tendik Verifikator)</span>
                                    </div>
                                    {user?.role === 'staf_keuangan' && <Check className="text-primary size-3.5" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => switchRole('admin', 'admin@itk.ac.id')}
                                    className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-xs"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <Shield className="size-3.5 text-blue-500" />
                                        <span>Admin Sistem SAK ITK</span>
                                    </div>
                                    {user?.role === 'admin' && <Check className="text-primary size-3.5" />}
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
