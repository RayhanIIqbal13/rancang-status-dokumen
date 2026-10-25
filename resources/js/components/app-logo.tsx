interface AppLogoProps {
    className?: string;
    showSubtitle?: boolean;
}

export default function AppLogo({ className = '', showSubtitle = true }: AppLogoProps) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-1.5 py-1 shadow-xs ring-1 ring-border dark:bg-card">
                <img
                    src="/images/logoitk.png"
                    alt="Institut Teknologi Kalimantan"
                    className="h-6 w-auto object-contain"
                />
                <img
                    src="/images/logofsti.png"
                    alt="FSTI ITK"
                    className="h-6 w-auto object-contain"
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
