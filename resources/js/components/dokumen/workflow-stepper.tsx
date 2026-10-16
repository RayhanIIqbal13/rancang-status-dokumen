import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DocumentStatusType, StatusStageInfo } from '@/types';
import { AlertTriangle, Check, CheckCircle2, Clock, FileCheck, FileSearch, Landmark, Send, Sparkles } from 'lucide-react';

interface WorkflowStepperProps {
    currentStatus: DocumentStatusType;
    stages: StatusStageInfo[];
    className?: string;
}

// All 8 official stages in chronological order
const allStages: DocumentStatusType[] = [
    'Diajukan',
    'Verifikasi Fakultas',
    'Perlu Revisi',
    'Menunggu SK / Penetapan Universitas',
    'Disetujui, Kegiatan Berjalan',
    'SPJ Diterima & Diverifikasi',
    'Diproses di SAKTI',
    'Dana Cair',
];

export function WorkflowStepper({ currentStatus, stages, className = '' }: WorkflowStepperProps) {
    const isRevision = currentStatus === 'Perlu Revisi';
    const currentIdx = allStages.indexOf(currentStatus);

    const stageIcons: Record<string, typeof Send> = {
        Diajukan: Send,
        'Verifikasi Fakultas': FileSearch,
        'Perlu Revisi': AlertTriangle,
        'Menunggu SK / Penetapan Universitas': Clock,
        'Disetujui, Kegiatan Berjalan': Sparkles,
        'SPJ Diterima & Diverifikasi': FileCheck,
        'Diproses di SAKTI': Landmark,
        'Dana Cair': Check,
    };

    // Cleanly formats each stage label across 1 or 2 lines so words never get cut off
    const renderStageTitle = (name: DocumentStatusType) => {
        switch (name) {
            case 'Menunggu SK / Penetapan Universitas':
                return (
                    <>
                        <span className="block whitespace-nowrap">Menunggu SK /</span>
                        <span className="block whitespace-nowrap">Penetapan Universitas</span>
                    </>
                );
            case 'Disetujui, Kegiatan Berjalan':
                return (
                    <>
                        <span className="block whitespace-nowrap">Disetujui,</span>
                        <span className="block whitespace-nowrap">Kegiatan Berjalan</span>
                    </>
                );
            case 'SPJ Diterima & Diverifikasi':
                return (
                    <>
                        <span className="block whitespace-nowrap">SPJ Diterima &amp;</span>
                        <span className="block whitespace-nowrap">Diverifikasi</span>
                    </>
                );
            case 'Verifikasi Fakultas':
                return (
                    <>
                        <span className="block whitespace-nowrap">Verifikasi</span>
                        <span className="block whitespace-nowrap">Fakultas</span>
                    </>
                );
            case 'Diproses di SAKTI':
                return (
                    <>
                        <span className="block whitespace-nowrap">Diproses di</span>
                        <span className="block whitespace-nowrap">SAKTI</span>
                    </>
                );
            default:
                return <span className="block whitespace-nowrap">{name}</span>;
        }
    };

    return (
        <TooltipProvider delayDuration={250}>
            <div className={`border-border/80 bg-card rounded-xl border p-4 shadow-xs transition-all sm:p-5 ${className}`}>
                {/* Header section with calm, slow-animated status indicator */}
                <div className="border-border/60 mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-3.5">
                    <div>
                        <h3 className="text-foreground text-sm font-bold tracking-tight">Alur Status Dokumen Keuangan SAK ITK</h3>
                        <p className="text-muted-foreground mt-0.5 text-xs">Siklus 8 tahap proses pengelolaan dokumen dan pencairan dana</p>
                    </div>

                    {/* Animated current status pill with calm, slow pulse matching StatusTimeline */}
                    <div className="flex items-center gap-2">
                        <span className="md:hidden inline-flex items-center gap-1 rounded-md bg-muted/70 border border-border/80 px-2 py-0.5 text-[10px] text-muted-foreground font-medium">
                            Geser alur ➔
                        </span>
                        {isRevision ? (
                            <Badge
                                variant="destructive"
                                className="animate-slow-pulse gap-1.5 bg-rose-600 text-xs font-semibold text-white shadow-xs"
                            >
                                <AlertTriangle className="size-3.5" />
                                <span>Status Saat Ini: Perlu Revisi Dokumen</span>
                            </Badge>
                        ) : currentStatus === 'Dana Cair' ? (
                            <Badge
                                variant="outline"
                                className="gap-1.5 border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            >
                                <CheckCircle2 className="size-3.5" />
                                <span>Semua Tahap Selesai (Dana Cair)</span>
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="border-primary/30 bg-primary/10 text-primary animate-slow-pulse gap-1.5 text-xs font-semibold"
                            >
                                <Clock className="size-3.5" />
                                <span>
                                    Tahap {currentIdx >= 0 ? currentIdx + 1 : 1}: {currentStatus}
                                </span>
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Stepper Horizontal Trail with Increased Width & Calming Smooth Animations */}
                <div className="scrollbar-thin touch-pan-x relative overflow-x-auto pt-2 pb-4">
                    <ol className="relative flex w-full min-w-[1040px] items-start justify-between px-2">
                        {allStages.map((stepName, index) => {
                            const stageInfo = stages.find((s) => s.value === stepName);
                            const isCurrent = currentStatus === stepName;
                            const isPast = currentStatus === 'Dana Cair' ? true : isRevision ? index < 2 : currentIdx > index;

                            const StepIcon = stageIcons[stepName] || Send;

                            // Horizontal connector progress logic
                            const isLinePassed = currentStatus === 'Dana Cair' ? true : isRevision ? index < 1 : currentIdx > index;
                            const isLineConnectingToCurrent = !isLinePassed && (currentIdx === index + 1 || (isRevision && index === 1));

                            // Node styling matching StatusTimeline with slow, elegant pulse
                            let circleStyle = 'bg-muted/40 text-muted-foreground border-border/80';
                            let ringStyle = '';

                            if (isPast) {
                                circleStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
                                ringStyle =
                                    'ring-4 ring-emerald-50 dark:ring-emerald-950/60 group-hover:ring-emerald-100 dark:group-hover:ring-emerald-900 group-hover:scale-105';
                            } else if (isCurrent) {
                                if (isRevision) {
                                    circleStyle = 'bg-rose-600 text-white border-rose-600 shadow-xs animate-slow-pulse';
                                    ringStyle = 'ring-4 ring-rose-200 dark:ring-rose-950/80 shadow-md';
                                } else if (stepName === 'Dana Cair') {
                                    circleStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-xs animate-slow-pulse';
                                    ringStyle = 'ring-4 ring-emerald-100 dark:ring-emerald-950/80 shadow-md';
                                } else {
                                    circleStyle = 'bg-primary text-primary-foreground border-primary shadow-xs animate-slow-pulse';
                                    ringStyle = 'ring-4 ring-primary/25 dark:ring-primary/40 shadow-md';
                                }
                            } else {
                                circleStyle =
                                    'border-2 border-dashed border-border/80 bg-muted/30 text-muted-foreground/60 group-hover:border-primary/40 group-hover:text-foreground';
                                ringStyle = 'group-hover:ring-4 group-hover:ring-primary/10';
                            }

                            return (
                                <li key={stepName} className="group relative flex min-w-[125px] flex-1 flex-col items-center px-1 text-center">
                                    {/* Horizontal Connector Line between this step and the next */}
                                    {index < allStages.length - 1 && (
                                        <div className="pointer-events-none absolute top-5 left-1/2 z-0 w-full -translate-y-1/2" aria-hidden="true">
                                            <div className="bg-border/70 dark:bg-muted/60 relative h-1 w-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-700 ease-in-out ${
                                                        isLinePassed
                                                            ? 'w-full bg-emerald-500'
                                                            : isLineConnectingToCurrent
                                                              ? isRevision
                                                                  ? 'animate-slow-flow w-full bg-gradient-to-r from-emerald-500 to-rose-500'
                                                                  : 'via-primary/80 to-primary animate-slow-flow w-full bg-gradient-to-r from-emerald-500'
                                                              : 'w-0'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Node Circle with Tooltip only attached to the circle pin */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative cursor-pointer">
                                                {/* Gentle, calm breathing glow for active stage (3.5s smooth cycle) */}
                                                {isCurrent && (
                                                    <span
                                                        className={`animate-slow-glow pointer-events-none absolute -inset-1.5 rounded-full ${
                                                            isRevision
                                                                ? 'bg-rose-500/25 ring-2 ring-rose-400/30'
                                                                : 'bg-primary/20 ring-primary/25 ring-2'
                                                        }`}
                                                    />
                                                )}

                                                <div
                                                    className={`relative z-10 flex size-10 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300 ${circleStyle} ${ringStyle}`}
                                                >
                                                    {isPast ? (
                                                        <Check className="size-4 stroke-[3]" />
                                                    ) : isCurrent && isRevision ? (
                                                        <AlertTriangle className="size-4" />
                                                    ) : (
                                                        <StepIcon className="size-4" />
                                                    )}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" sideOffset={8} className="max-w-xs space-y-1.5 p-3 text-xs shadow-lg">
                                            <div className="border-border/50 flex items-center justify-between gap-2 border-b pb-1 font-semibold">
                                                <span>
                                                    Tahap {index + 1}: {stepName}
                                                </span>
                                                <span className="text-muted-foreground text-[10px]">
                                                    {isPast ? 'Selesai' : isCurrent ? 'Sedang Berjalan' : 'Menunggu'}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                                                {stageInfo?.description || 'Proses tahapan pengelolaan dokumen dan pencairan dana.'}
                                            </p>
                                            <div className="text-muted-foreground flex items-center justify-between pt-1 text-[10px]">
                                                <span>
                                                    Petugas: <strong className="text-foreground">{stageInfo?.updated_by ?? 'Staf Keuangan'}</strong>
                                                </span>
                                                <span>
                                                    Posisi:{' '}
                                                    <strong className="text-foreground">{stageInfo?.default_posisi ?? 'Subbag Keuangan'}</strong>
                                                </span>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>

                                    {/* Label & Details: Never cut off, ample spacing and aligned baseline */}
                                    <div className="mt-2.5 flex w-full flex-col items-center">
                                        <span className="text-muted-foreground block font-mono text-[10px]">Tahap {index + 1}</span>

                                        {/* Step Title: Explicit 2-line formatting prevents clipping and overlapping */}
                                        <div className="mt-1 flex min-h-[42px] w-full flex-col items-center justify-center px-0.5">
                                            <p
                                                className={`text-center text-[11px] leading-snug font-semibold transition-colors sm:text-xs ${
                                                    isCurrent
                                                        ? isRevision
                                                            ? 'font-bold text-rose-600 dark:text-rose-400'
                                                            : 'text-primary font-bold'
                                                        : isPast
                                                          ? 'text-foreground group-hover:text-primary font-semibold'
                                                          : 'text-muted-foreground/75 group-hover:text-foreground'
                                                }`}
                                            >
                                                {renderStageTitle(stepName)}
                                            </p>
                                        </div>

                                        {/* Responsible Officer */}
                                        <p className="text-muted-foreground mt-1 text-center text-[10px] leading-normal">
                                            {stageInfo?.updated_by ?? 'Staf Keuangan'}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </TooltipProvider>
    );
}
