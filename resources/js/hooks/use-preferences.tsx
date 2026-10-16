import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'default' | 'blue' | 'violet' | 'emerald' | 'orange' | 'rose';
export type FontOption = 'geist' | 'inter' | 'roboto' | 'outfit';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ContentLayout = 'centered' | 'full-width';
export type NavbarStyle = 'sticky' | 'scroll';
export type SidebarVariant = 'inset' | 'sidebar' | 'floating';
export type SidebarCollapsible = 'icon' | 'offcanvas';

export interface Preferences {
    themePreset: ThemePreset;
    font: FontOption;
    themeMode: ThemeMode;
    contentLayout: ContentLayout;
    navbarStyle: NavbarStyle;
    sidebarVariant: SidebarVariant;
    sidebarCollapsible: SidebarCollapsible;
}

export const THEME_PRESET_OPTIONS: { label: string; value: ThemePreset; color: string; hslLight: string; hslDark: string }[] = [
    { label: 'Default', value: 'default', color: '#18181b', hslLight: '240 5.9% 10%', hslDark: '0 0% 98%' },
    { label: 'Blue', value: 'blue', color: '#2563eb', hslLight: '221.2 83.2% 53.3%', hslDark: '217.2 91.2% 59.8%' },
    { label: 'Violet', value: 'violet', color: '#7c3aed', hslLight: '262.1 83.3% 57.8%', hslDark: '263.4 70% 50.4%' },
    { label: 'Emerald', value: 'emerald', color: '#059669', hslLight: '142.1 76.2% 36.3%', hslDark: '142.1 70.6% 45.3%' },
    { label: 'Tangerine', value: 'orange', color: '#ea580c', hslLight: '24.6 95% 53.1%', hslDark: '20.5 90.2% 48.2%' },
    { label: 'Rose', value: 'rose', color: '#e11d48', hslLight: '346.8 77.2% 49.8%', hslDark: '346.8 77.2% 49.8%' },
];

export const FONT_OPTIONS: { label: string; value: FontOption; fontFamily: string }[] = [
    { label: 'Geist', value: 'geist', fontFamily: "'Geist', sans-serif" },
    { label: 'Inter', value: 'inter', fontFamily: "'Inter', sans-serif" },
    { label: 'Roboto', value: 'roboto', fontFamily: "'Roboto', sans-serif" },
    { label: 'Outfit', value: 'outfit', fontFamily: "'Outfit', sans-serif" },
];

export const DEFAULT_PREFERENCES: Preferences = {
    themePreset: 'default',
    font: 'geist',
    themeMode: 'system',
    contentLayout: 'full-width',
    navbarStyle: 'sticky',
    sidebarVariant: 'inset',
    sidebarCollapsible: 'icon',
};

interface PreferencesContextType {
    preferences: Preferences;
    setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
    resetPreferences: () => void;
    resolvedThemeMode: 'light' | 'dark';
}

const PreferencesContext = createContext<PreferencesContextType | null>(null);

const STORAGE_KEY = 'dashboard_preferences';

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<Preferences>(() => {
        if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
            }
        } catch {
            // fallback
        }
        return DEFAULT_PREFERENCES;
    });

    const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Listen to system theme change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, []);

    const resolvedThemeMode: 'light' | 'dark' =
        preferences.themeMode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preferences.themeMode;

    // Apply theme mode class
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        if (resolvedThemeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [resolvedThemeMode]);

    // Apply theme preset CSS variables
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        const selectedPreset = THEME_PRESET_OPTIONS.find((p) => p.value === preferences.themePreset) || THEME_PRESET_OPTIONS[0];

        if (selectedPreset.value === 'default') {
            root.style.removeProperty('--primary');
            root.style.removeProperty('--primary-foreground');
            root.style.removeProperty('--ring');
        } else {
            const hsl = resolvedThemeMode === 'dark' ? selectedPreset.hslDark : selectedPreset.hslLight;
            root.style.setProperty('--primary', hsl);
            root.style.setProperty('--ring', hsl);
            root.style.setProperty('--primary-foreground', '0 0% 100%');
        }
    }, [preferences.themePreset, resolvedThemeMode]);

    // Apply font
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const selectedFont = FONT_OPTIONS.find((f) => f.value === preferences.font) || FONT_OPTIONS[0];
        document.body.style.fontFamily = selectedFont.fontFamily;
    }, [preferences.font]);

    // Save to localStorage
    const setPreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        setPreferences((prev) => {
            const next = { ...prev, [key]: value };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    const resetPreferences = () => {
        setPreferences(DEFAULT_PREFERENCES);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
        } catch {
            // ignore
        }
    };

    return (
        <PreferencesContext.Provider
            value={{
                preferences,
                setPreference,
                resetPreferences,
                resolvedThemeMode,
            }}
        >
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
