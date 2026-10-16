import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'default' | 'blue' | 'violet' | 'rose' | 'green' | 'orange';
export type FontOption = 'geist' | 'inter' | 'mono';
export type ThemeMode = 'light' | 'dark' | 'system';
export type PageLayout = 'centered' | 'full-width';
export type NavbarBehavior = 'sticky' | 'scroll';
export type SidebarStyle = 'inset' | 'sidebar' | 'floating';
export type SidebarCollapseMode = 'icon' | 'offcanvas';

export interface PreferencesState {
    themePreset: ThemePreset;
    font: FontOption;
    themeMode: ThemeMode;
    pageLayout: PageLayout;
    navbarBehavior: NavbarBehavior;
    sidebarStyle: SidebarStyle;
    sidebarCollapseMode: SidebarCollapseMode;
}

export const defaultPreferences: PreferencesState = {
    themePreset: 'default',
    font: 'geist',
    themeMode: 'light',
    pageLayout: 'full-width',
    navbarBehavior: 'sticky',
    sidebarStyle: 'inset',
    sidebarCollapseMode: 'icon',
};

interface PreferencesContextType {
    preferences: PreferencesState;
    setPreference: <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => void;
    restoreDefaults: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PRESET_COLORS: Record<ThemePreset, { lightPrimary: string; darkPrimary: string; lightRing: string; darkRing: string }> = {
    default: {
        lightPrimary: 'oklch(0.205 0 0)',
        darkPrimary: 'oklch(0.985 0 0)',
        lightRing: 'oklch(0.708 0 0)',
        darkRing: 'oklch(0.439 0 0)',
    },
    blue: {
        lightPrimary: 'oklch(0.55 0.22 260)',
        darkPrimary: 'oklch(0.65 0.22 260)',
        lightRing: 'oklch(0.65 0.20 260)',
        darkRing: 'oklch(0.55 0.20 260)',
    },
    violet: {
        lightPrimary: 'oklch(0.55 0.25 300)',
        darkPrimary: 'oklch(0.68 0.24 300)',
        lightRing: 'oklch(0.65 0.22 300)',
        darkRing: 'oklch(0.55 0.22 300)',
    },
    rose: {
        lightPrimary: 'oklch(0.55 0.23 15)',
        darkPrimary: 'oklch(0.65 0.23 15)',
        lightRing: 'oklch(0.65 0.20 15)',
        darkRing: 'oklch(0.55 0.20 15)',
    },
    green: {
        lightPrimary: 'oklch(0.55 0.20 145)',
        darkPrimary: 'oklch(0.65 0.20 145)',
        lightRing: 'oklch(0.65 0.18 145)',
        darkRing: 'oklch(0.55 0.18 145)',
    },
    orange: {
        lightPrimary: 'oklch(0.60 0.20 45)',
        darkPrimary: 'oklch(0.68 0.20 45)',
        lightRing: 'oklch(0.68 0.18 45)',
        darkRing: 'oklch(0.58 0.18 45)',
    },
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferencesState] = useState<PreferencesState>(() => {
        if (typeof window === 'undefined') return defaultPreferences;
        try {
            const saved = localStorage.getItem('dashboard_preferences');
            if (saved) {
                return { ...defaultPreferences, ...JSON.parse(saved) };
            }
        } catch {
            // fallback
        }
        return defaultPreferences;
    });

    const setPreference = <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => {
        setPreferencesState((prev) => {
            const next = { ...prev, [key]: value };
            try {
                localStorage.setItem('dashboard_preferences', JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    const restoreDefaults = () => {
        setPreferencesState(defaultPreferences);
        try {
            localStorage.setItem('dashboard_preferences', JSON.stringify(defaultPreferences));
        } catch {
            // ignore
        }
    };

    // Apply Theme Mode (Light / Dark / System)
    useEffect(() => {
        const root = document.documentElement;
        const applyMode = (mode: ThemeMode) => {
            if (mode === 'dark') {
                root.classList.add('dark');
                localStorage.setItem('appearance', 'dark');
            } else if (mode === 'light') {
                root.classList.remove('dark');
                localStorage.setItem('appearance', 'light');
            } else {
                // system
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) root.classList.add('dark');
                else root.classList.remove('dark');
                localStorage.setItem('appearance', 'system');
            }
        };

        applyMode(preferences.themeMode);

        if (preferences.themeMode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                if (e.matches) root.classList.add('dark');
                else root.classList.remove('dark');
            };
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [preferences.themeMode]);

    // Apply Theme Preset (Colors)
    useEffect(() => {
        const root = document.documentElement;
        const isDark = root.classList.contains('dark');
        const color = PRESET_COLORS[preferences.themePreset] || PRESET_COLORS.default;

        if (preferences.themePreset === 'default') {
            root.style.removeProperty('--primary');
            root.style.removeProperty('--ring');
            root.style.removeProperty('--sidebar-primary');
        } else {
            const primaryVal = isDark ? color.darkPrimary : color.lightPrimary;
            const ringVal = isDark ? color.darkRing : color.lightRing;
            root.style.setProperty('--primary', primaryVal);
            root.style.setProperty('--ring', ringVal);
            root.style.setProperty('--sidebar-primary', primaryVal);
        }
    }, [preferences.themePreset, preferences.themeMode]);

    // Apply Font Option
    useEffect(() => {
        const root = document.documentElement;
        if (preferences.font === 'geist') {
            root.style.fontFamily = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        } else if (preferences.font === 'inter') {
            root.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        } else if (preferences.font === 'mono') {
            root.style.fontFamily = "'Geist Mono', monospace";
        }
    }, [preferences.font]);

    return (
        <PreferencesContext.Provider value={{ preferences, setPreference, restoreDefaults }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
}
