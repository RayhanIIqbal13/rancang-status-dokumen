import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    ContentLayout,
    FONT_OPTIONS,
    FontOption,
    NavbarStyle,
    SidebarCollapsible,
    SidebarVariant,
    THEME_PRESET_OPTIONS,
    ThemeMode,
    ThemePreset,
    usePreferences,
} from '@/hooks/use-preferences';
import { Settings } from 'lucide-react';

export function LayoutControls() {
    const { preferences, setPreference, resetPreferences, resolvedThemeMode } = usePreferences();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-muted hover:text-foreground size-8 rounded-lg cursor-pointer"
                    title="Dashboard Preferences"
                >
                    <Settings className="size-4" />
                    <span className="sr-only">Dashboard Preferences</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[calc(100vw-2rem)] max-w-xs sm:w-80 p-4 shadow-xl">
                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold leading-none">Preferences</h4>
                        <p className="text-muted-foreground text-xs">Customize your dashboard layout preferences.</p>
                    </div>

                    <div className="space-y-3.5">
                        {/* Theme Preset */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Theme Preset</Label>
                            <Select
                                value={preferences.themePreset}
                                onValueChange={(val) => setPreference('themePreset', val as ThemePreset)}
                            >
                                <SelectTrigger size="sm" className="w-full text-xs">
                                    <SelectValue placeholder="Preset" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {THEME_PRESET_OPTIONS.map((preset) => (
                                            <SelectItem key={preset.value} className="text-xs" value={preset.value}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="size-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                preset.value === 'default'
                                                                    ? resolvedThemeMode === 'dark'
                                                                        ? '#f4f4f5'
                                                                        : '#18181b'
                                                                    : preset.color,
                                                        }}
                                                    />
                                                    <span>{preset.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Fonts */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Fonts</Label>
                            <Select
                                value={preferences.font}
                                onValueChange={(val) => setPreference('font', val as FontOption)}
                            >
                                <SelectTrigger size="sm" className="w-full text-xs">
                                    <SelectValue placeholder="Select font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {FONT_OPTIONS.map((font) => (
                                            <SelectItem key={font.value} className="text-xs" value={font.value}>
                                                {font.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Theme Mode */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Theme Mode</Label>
                            <ToggleGroup
                                size="sm"
                                variant="outline"
                                type="single"
                                value={preferences.themeMode}
                                onValueChange={(val) => val && setPreference('themeMode', val as ThemeMode)}
                                className="w-full"
                            >
                                <ToggleGroupItem value="light" aria-label="Toggle light" className="flex-1 text-xs">
                                    Light
                                </ToggleGroupItem>
                                <ToggleGroupItem value="dark" aria-label="Toggle dark" className="flex-1 text-xs">
                                    Dark
                                </ToggleGroupItem>
                                <ToggleGroupItem value="system" aria-label="Toggle system" className="flex-1 text-xs">
                                    System
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Page Layout */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Page Layout</Label>
                            <ToggleGroup
                                size="sm"
                                variant="outline"
                                type="single"
                                value={preferences.contentLayout}
                                onValueChange={(val) => val && setPreference('contentLayout', val as ContentLayout)}
                                className="w-full"
                            >
                                <ToggleGroupItem value="centered" aria-label="Toggle centered" className="flex-1 text-xs">
                                    Centered
                                </ToggleGroupItem>
                                <ToggleGroupItem value="full-width" aria-label="Toggle full-width" className="flex-1 text-xs">
                                    Full Width
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Navbar Behavior */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Navbar Behavior</Label>
                            <ToggleGroup
                                size="sm"
                                variant="outline"
                                type="single"
                                value={preferences.navbarStyle}
                                onValueChange={(val) => val && setPreference('navbarStyle', val as NavbarStyle)}
                                className="w-full"
                            >
                                <ToggleGroupItem value="sticky" aria-label="Toggle sticky" className="flex-1 text-xs">
                                    Sticky
                                </ToggleGroupItem>
                                <ToggleGroupItem value="scroll" aria-label="Toggle scroll" className="flex-1 text-xs">
                                    Scroll
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Sidebar Style */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Sidebar Style</Label>
                            <ToggleGroup
                                size="sm"
                                variant="outline"
                                type="single"
                                value={preferences.sidebarVariant}
                                onValueChange={(val) => val && setPreference('sidebarVariant', val as SidebarVariant)}
                                className="w-full"
                            >
                                <ToggleGroupItem value="inset" aria-label="Toggle inset" className="flex-1 text-xs">
                                    Inset
                                </ToggleGroupItem>
                                <ToggleGroupItem value="sidebar" aria-label="Toggle sidebar" className="flex-1 text-xs">
                                    Sidebar
                                </ToggleGroupItem>
                                <ToggleGroupItem value="floating" aria-label="Toggle floating" className="flex-1 text-xs">
                                    Floating
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Sidebar Collapse Mode */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Sidebar Collapse Mode</Label>
                            <ToggleGroup
                                size="sm"
                                variant="outline"
                                type="single"
                                value={preferences.sidebarCollapsible}
                                onValueChange={(val) => val && setPreference('sidebarCollapsible', val as SidebarCollapsible)}
                                className="w-full"
                            >
                                <ToggleGroupItem value="icon" aria-label="Toggle icon" className="flex-1 text-xs">
                                    Icon
                                </ToggleGroupItem>
                                <ToggleGroupItem value="offcanvas" aria-label="Toggle offcanvas" className="flex-1 text-xs">
                                    OffCanvas
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Restore Defaults */}
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="w-full text-xs mt-1"
                            onClick={resetPreferences}
                        >
                            Restore Defaults
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
