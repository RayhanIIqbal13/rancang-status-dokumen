import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FlashBanner } from '@/components/flash-banner';
import { PreferencesProvider, usePreferences } from '@/hooks/use-preferences';
import { type BreadcrumbItem } from '@/types';
import * as React from 'react';

function AppSidebarLayoutContent({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { preferences } = usePreferences();

    return (
        <AppShell variant="sidebar">
            <AppSidebar variant={preferences.sidebarVariant} collapsible={preferences.sidebarCollapsible} />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <FlashBanner />
                <div className={preferences.contentLayout === 'centered' ? 'mx-auto w-full max-w-7xl' : 'w-full'}>
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}

export default function AppSidebarLayout(props: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    return (
        <PreferencesProvider>
            <AppSidebarLayoutContent {...props} />
        </PreferencesProvider>
    );
}
