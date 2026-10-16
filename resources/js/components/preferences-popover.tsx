import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FontOption,
    NavbarBehavior,
    PageLayout,
    SidebarCollapseMode,
    SidebarStyle,
    ThemeMode,
    ThemePreset,
    usePreferences,
} from '@/hooks/use-preferences';
import { Settings } from 'lucide-react';
import React from 'react';

const THEME_PRESETS: { value: ThemePreset; label: string; color: string }[] = [
    { value: 'default', label: 'Default', color: 'bg-zinc-900 dark:bg-zinc-100' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-600' },
    { value: 'violet', label: 'Violet', color: 'bg-violet-600' },
    { value: 'rose', label: 'Rose', color: 'bg-rose-600' },
    { value: 'green', label: 'Green', color: 'bg-emerald-600' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-600' },
];

const FONTS: { value: FontOption; label: string }[] = [
    { value: 'geist', label: 'Geist' },
    { value: 'inter', label: 'Inter' },
    { value: 'mono', label: 'Geist Mono' },
];

export function PreferencesPopover() {
    const { preferences, setPreference, restoreDefaults } = usePreferences();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted size-8 rounded-lg cursor-pointer"
                    title="Preferences"
                    aria-label="Dashboard Preferences"
                >
                    <Settings className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 space-y-4 rounded-xl border border-border bg-card p-4 shadow-xl text-card-foreground"
            >
                {/* Header */}
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none text-foreground">Preferences</h4>
                    <p className="text-muted-foreground text-xs leading-normal">
                        Customize your dashboard layout preferences.
                    </p>
                </div>

                <div className="space-y-3.5 text-xs">
                    {/* 1. Theme Preset */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Theme Preset</label>
                        <Select
                            value={preferences.themePreset}
                            onValueChange={(val) => setPreference('themePreset', val as ThemePreset)}
                        >
                            <SelectTrigger className="h-8 w-full rounded-lg border-input text-xs">
                                <SelectValue placeholder="Pilih preset tema" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                {THEME_PRESETS.map((preset) => (
                                    <SelectItem key={preset.value} value={preset.value} className="text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2.5 rounded-full ${preset.color}`} />
                                            <span>{preset.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 2. Fonts */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Fonts</label>
                        <Select
                            value={preferences.font}
                            onValueChange={(val) => setPreference('font', val as FontOption)}
                        >
                            <SelectTrigger className="h-8 w-full rounded-lg border-input text-xs">
                                <SelectValue placeholder="Pilih jenis font" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                {FONTS.map((f) => (
                                    <SelectItem key={f.value} value={f.value} className="text-xs">
                                        {f.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 3. Theme Mode */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Theme Mode</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border/80 bg-muted/50 p-1">
                            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                                const isActive = preferences.themeMode === mode;
                                return (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setPreference('themeMode', mode)}
                                        className={`rounded-md py-1 text-[11px] font-medium capitalize transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {mode}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4. Page Layout */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Page Layout</label>
                        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border/80 bg-muted/50 p-1">
                            {[
                                { value: 'centered', label: 'Centered' },
                                { value: 'full-width', label: 'Full Width' },
                            ].map((opt) => {
                                const isActive = preferences.pageLayout === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setPreference('pageLayout', opt.value as PageLayout)}
                                        className={`rounded-md py-1 text-[11px] font-medium transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 5. Navbar Behavior */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Navbar Behavior</label>
                        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border/80 bg-muted/50 p-1">
                            {[
                                { value: 'sticky', label: 'Sticky' },
                                { value: 'scroll', label: 'Scroll' },
                            ].map((opt) => {
                                const isActive = preferences.navbarBehavior === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setPreference('navbarBehavior', opt.value as NavbarBehavior)}
                                        className={`rounded-md py-1 text-[11px] font-medium transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 6. Sidebar Style */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Sidebar Style</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border/80 bg-muted/50 p-1">
                            {(['inset', 'sidebar', 'floating'] as SidebarStyle[]).map((style) => {
                                const isActive = preferences.sidebarStyle === style;
                                return (
                                    <button
                                        key={style}
                                        type="button"
                                        onClick={() => setPreference('sidebarStyle', style)}
                                        className={`rounded-md py-1 text-[11px] font-medium capitalize transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {style}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 7. Sidebar Collapse Mode */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-foreground">Sidebar Collapse Mode</label>
                        <div className="grid grid-cols-2 gap-1 rounded-lg border border-border/80 bg-muted/50 p-1">
                            {[
                                { value: 'icon', label: 'Icon' },
                                { value: 'offcanvas', label: 'OffCanvas' },
                            ].map((opt) => {
                                const isActive = preferences.sidebarCollapseMode === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() =>
                                            setPreference('sidebarCollapseMode', opt.value as SidebarCollapseMode)
                                        }
                                        className={`rounded-md py-1 text-[11px] font-medium transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Restore Defaults */}
                <div className="pt-1 border-t border-border/80">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={restoreDefaults}
                        className="w-full text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                        Restore Defaults
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
