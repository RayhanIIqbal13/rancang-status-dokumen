interface AppLogoProps {
    className?: string;
    showSubtitle?: boolean;
}

export default function AppLogo({ className = '', showSubtitle = true }: AppLogoProps) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="flex h-9 w-auto items-center justify-center rounded-lg bg-white p-1 shadow-xs ring-1 ring-border dark:bg-card">
                <img
                    src="/images/logofsti.png"
                    alt="Logo FSTI ITK"
                    className="h-7 w-auto object-contain"
                />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-foreground truncate font-extrabold tracking-tight">SIM-KEUANGAN FSTI</span>
                {showSubtitle && (
                    <span className="text-muted-foreground truncate text-[11px] font-medium">
                        Fakultas Sains & Teknologi Informasi · ITK
                    </span>
                )}
            </div>
        </div>
    );
}
