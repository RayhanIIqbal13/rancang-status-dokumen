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
            <AppSidebar variant={preferences.sidebarVariant} collapsible={preferences.sidebarCollapsible} className="print:hidden" />
            <AppContent variant="sidebar" className="print:p-0 print:m-0 print:border-none print:w-full print:bg-white print:shadow-none">
                <div className="print:hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <FlashBanner />
                </div>
                <div className={preferences.contentLayout === 'centered' ? 'mx-auto w-full max-w-7xl print:max-w-none print:w-full' : 'w-full print:max-w-none'}>
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
