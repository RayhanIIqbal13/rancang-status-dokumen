export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold shadow-xs">
                ⌘
            </div>
            <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-foreground truncate text-sm font-semibold tracking-tight">Studio Admin</span>
                <span className="border-border/80 bg-muted/60 py-0.2 text-muted-foreground rounded-[4px] border px-1 font-mono text-[9px] font-medium uppercase">
                    SAK ITK
                </span>
            </div>
        </div>
    );
}
