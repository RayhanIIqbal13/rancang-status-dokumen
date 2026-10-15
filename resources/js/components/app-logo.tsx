import { Command } from 'lucide-react';
import React from 'react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background shadow-xs shrink-0 font-semibold text-xs">
                ⌘
            </div>
            <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="font-semibold text-sm tracking-tight text-foreground truncate">
                    Studio Admin
                </span>
                <span className="rounded-[4px] border border-border/80 bg-muted/60 px-1 py-0.2 text-[9px] font-mono font-medium text-muted-foreground uppercase">
                    SAK ITK
                </span>
            </div>
        </div>
    );
}
