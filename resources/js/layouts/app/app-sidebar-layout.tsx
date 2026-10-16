import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FlashBanner } from '@/components/flash-banner';
import { PreferencesProvider, usePreferences } from '@/hooks/use-preferences';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

function AppSidebarLayoutContent({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { preferences } = usePreferences();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <FlashBanner />
                <div
                    className={cn(
                        'flex-1 transition-all',
                        preferences.pageLayout === 'centered' ? 'mx-auto w-full max-w-7xl' : 'w-full',
                    )}
                >
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

