import { Command } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shadow-xs">
                <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-foreground truncate font-semibold tracking-tight">SIM-KEUANGAN SBM</span>
                <span className="text-muted-foreground truncate text-xs">Pelacakan Dokumen & SAKTI</span>
            </div>
        </div>
    );
}
