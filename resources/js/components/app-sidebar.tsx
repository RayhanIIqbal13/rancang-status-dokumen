import React from 'react';
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
    Plus,
    Receipt,
    Scale,
    Shield,
    Users,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { SupportCard } from '@/components/support-card';
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
import { SharedData } from '@/types';

export function AppSidebar() {
    const page = usePage<SharedData>();
    const currentUrl = page.url;
    const userRole = page.props.auth?.user?.role;

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
                    title: 'Status Tracking (8 Tahap)',
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
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader className="p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent transition-colors">
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold tracking-tight text-foreground">
                                        SIM-KEUANGAN SBM
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Pelacakan Dokumen & SAKTI
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Quick Action Button matching next-shadcn-admin-dashboard */}
                <div className="flex items-center gap-1.5 px-0.5 pt-1 group-data-[collapsible=icon]:hidden">
                    <Link
                        href="/dokumen-pengajuan/create"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="size-3.5 shrink-0" />
                        <span className="truncate">Ajukan Dokumen</span>
                    </Link>
                    <Link
                        href="/dokumen-pengajuan"
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Semua Dokumen"
                    >
                        <Mail className="size-3.5" />
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-1 space-y-1">
                {navGroups.map((group) => {
                    const visibleItems = group.items.filter((item) => item.show !== false);
                    if (visibleItems.length === 0) return null;

                    return (
                        <SidebarGroup key={group.label} className="p-0 py-1">
                            <SidebarGroupLabel className="h-6 px-2 text-[11px] font-normal text-muted-foreground group-data-[collapsible=icon]:hidden">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {visibleItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={item.active}
                                                    tooltip={item.title}
                                                    className="h-8 text-xs px-2.5 gap-2.5 rounded-lg font-normal text-foreground/80 hover:bg-sidebar-accent hover:text-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-foreground transition-colors"
                                                >
                                                    <Link href={item.url}>
                                                        <IconComponent className="size-4 shrink-0 text-muted-foreground group-data-[active=true]:text-foreground" />
                                                        <span className="truncate">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                                {item.badge && (
                                                    <SidebarMenuBadge className="rounded-full border border-border bg-muted/60 text-[10px] font-medium px-1.5 py-0 text-muted-foreground group-data-[collapsible=icon]:hidden">
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

            <SidebarFooter className="border-t border-sidebar-border/80 p-2 space-y-2">
                <SupportCard />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
