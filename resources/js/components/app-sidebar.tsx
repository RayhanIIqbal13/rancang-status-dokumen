import { NavUser } from '@/components/nav-user';
import { SupportCard } from '@/components/support-card';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePreferences } from '@/hooks/use-preferences';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CheckSquare,
    Command,
    FileText,
    GitCommitHorizontal,
    Landmark,
    LayoutGrid,
    Mail,
    PlusCircle,
    Receipt,
    Scale,
    Users,
} from 'lucide-react';
import * as React from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const page = usePage<SharedData>();
    const currentUrl = page.url;
    const userRole = page.props.auth?.user?.role;
    const { preferences } = usePreferences();

    const variant = props.variant || preferences.sidebarVariant;
    const collapsible = props.collapsible || preferences.sidebarCollapsible;

    const navGroups = [
        {
            label: 'Dashboards',
            items: [
                {
                    title: 'Default',
                    url: '/dashboard',
                    icon: LayoutGrid,
                    active: currentUrl === '/dashboard',
                },
                {
                    title: 'Status Tracking',
                    url: '/status-tracking',
                    icon: GitCommitHorizontal,
                    active: currentUrl.startsWith('/status-tracking'),
                    badge: '8 Tahap',
                },
                {
                    title: 'Verifikasi Dokumen',
                    url: '/verifikasi-dokumen',
                    icon: CheckSquare,
                    active: currentUrl.startsWith('/verifikasi-dokumen'),
                    show: userRole === 'admin' || userRole === 'staf_keuangan' || userRole === 'pimpinan',
                    badge: 'Admin',
                },
            ],
        },
        {
            label: 'Layanan & SPJ',
            items: [
                {
                    title: 'Dokumen Pengajuan',
                    url: '/dokumen-pengajuan',
                    icon: FileText,
                    active: currentUrl.startsWith('/dokumen-pengajuan') && !currentUrl.includes('/create'),
                },
                {
                    title: 'Realisasi Anggaran',
                    url: '/realisasi-anggaran',
                    icon: Landmark,
                    active: currentUrl.startsWith('/realisasi-anggaran'),
                },
                {
                    title: 'Bukti Pengeluaran',
                    url: '/bukti-pengeluaran',
                    icon: Receipt,
                    active: currentUrl.startsWith('/bukti-pengeluaran'),
                },
                {
                    title: 'Standar Biaya (SBM)',
                    url: '/standar-biaya',
                    icon: Scale,
                    active: currentUrl.startsWith('/standar-biaya'),
                    badge: '2026',
                },
            ],
        },
        {
            label: 'Laporan & Pengguna',
            items: [
                {
                    title: 'Laporan Keuangan',
                    url: '/laporan',
                    icon: BarChart3,
                    active: currentUrl.startsWith('/laporan'),
                },
                {
                    title: 'Data Pengguna',
                    url: '/pengguna',
                    icon: Users,
                    active: currentUrl.startsWith('/pengguna'),
                    show: userRole === 'admin',
                    badge: 'Admin',
                },
            ],
        },
    ];

    return (
        <Sidebar {...props} variant={variant} collapsible={collapsible}>
            {/* Header Brand */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent transition-colors">
                            <Link href="/dashboard">
                                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shadow-xs">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="text-foreground truncate font-semibold text-base tracking-tight">Studio Admin</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Quick Create Group matching next-shadcn-admin-dashboard */}
                <SidebarGroup className="pt-0">
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2">
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Quick Create"
                                    className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground font-medium rounded-lg"
                                >
                                    <Link href="/dokumen-pengajuan/create">
                                        <PlusCircle className="size-4 shrink-0" />
                                        <span>Quick Create</span>
                                    </Link>
                                </SidebarMenuButton>
                                <Button
                                    size="icon"
                                    className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:hidden rounded-lg border-border"
                                    variant="outline"
                                    asChild
                                    title="Semua Dokumen"
                                >
                                    <Link href="/dokumen-pengajuan">
                                        <Mail className="size-4 text-muted-foreground" />
                                        <span className="sr-only">Semua Dokumen</span>
                                    </Link>
                                </Button>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Nav Groups */}
                {navGroups.map((group) => {
                    const visibleItems = group.items.filter((item) => item.show !== false);
                    if (visibleItems.length === 0) return null;

                    return (
                        <SidebarGroup key={group.label}>
                            {group.label && (
                                <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none text-muted-foreground text-xs font-normal">
                                    {group.label}
                                </SidebarGroupLabel>
                            )}
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {visibleItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={item.active}
                                                    tooltip={item.title}
                                                >
                                                    <Link href={item.url}>
                                                        <IconComponent className="size-4 shrink-0" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                                {item.badge && (
                                                    <SidebarMenuBadge className="border-border bg-muted/60 text-muted-foreground rounded-full border px-1.5 py-0 text-[10px] font-medium group-data-[collapsible=icon]:hidden">
                                                        {item.badge}
                                                    </SidebarMenuBadge>
                                                )}
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            <SidebarFooter>
                <SupportCard />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
