import { StatusBadge } from '@/components/dokumen/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DokumenPengajuan, DocumentStatusType, StatusStageInfo, StatusTracking } from '@/types';
import {
    AlertTriangle,
    ArrowUpRight,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    FileCheck,
    FileEdit,
    FileSearch,
    Landmark,
    MapPin,
    MessageSquare,
    Send,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';

interface StatusTimelineProps {
    document: DokumenPengajuan;
    stages: StatusStageInfo[];
    className?: string;
    onUploadRevision?: () => void;
}

export function StatusTimeline({
    document,
    stages,
    className = '',
    onUploadRevision,
}: StatusTimelineProps) {
    const statusTrackings = document.status_trackings || document.status_timeline || [];
    const currentStatus = document.status_terkini;
    const isRevisionCurrent = currentStatus === 'Perlu Revisi';

    // The 8 stages in exact order
    const stageOrder: DocumentStatusType[] = [
        'Diajukan',
        'Verifikasi Fakultas',
        'Perlu Revisi',
        'Menunggu SK / Penetapan Universitas',
        'Disetujui, Kegiatan Berjalan',
        'SPJ Diterima & Diverifikasi',
        'Diproses di SAKTI',
        'Dana Cair',
    ];

    // Find latest index reached in the linear flow
    const currentStatusIndex = stageOrder.indexOf(currentStatus);

    const getStageState = (stageName: DocumentStatusType) => {
        const stageIndex = stageOrder.indexOf(stageName);

        // Check if there is an explicit recorded StatusTracking for this stage
        const hasRecord = statusTrackings.some((t) => t.tahap === stageName);

        if (currentStatus === stageName) {
            return stageName === 'Perlu Revisi' ? 'revision' : 'current';
        }

        if (isRevisionCurrent) {
            // When in revision, stages before 'Verifikasi Fakultas' are completed
            if (stageIndex <= 1) return 'completed';
            return 'pending';
        }

        if (currentStatus === 'Dana Cair') {
            // All completed except Perlu Revisi if it was never triggered
            if (stageName === 'Perlu Revisi' && !hasRecord) return 'skipped';
            return 'completed';
        }

        if (hasRecord) {
            return 'completed';
        }

        if (stageName === 'Perlu Revisi' && !hasRecord) {
            return 'skipped';
        }

        if (stageIndex < currentStatusIndex) {
            return 'completed';
        }

        return 'pending';
    };

    const getStageRecord = (stageName: DocumentStatusType): StatusTracking | undefined => {
        // Return the most recent tracking item for this stage
        const matches = statusTrackings.filter((t) => t.tahap === stageName);
        return matches.length > 0 ? matches[matches.length - 1] : undefined;
    };

    const getIconForStage = (stageName: DocumentStatusType) => {
        switch (stageName) {
            case 'Diajukan':
                return Send;
            case 'Verifikasi Fakultas':
                return FileSearch;
            case 'Perlu Revisi':
                return AlertTriangle;
            case 'Menunggu SK / Penetapan Universitas':
                return Clock;
            case 'Disetujui, Kegiatan Berjalan':
                return Sparkles;
            case 'SPJ Diterima & Diverifikasi':
                return FileCheck;
            case 'Diproses di SAKTI':
                return Landmark;
            case 'Dana Cair':
                return Check;
            default:
                return Clock;
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(new Date(dateStr));
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="relative pl-7 sm:pl-8 before:absolute before:left-3.5 before:top-4 before:h-[calc(100%-32px)] before:w-0.5 before:bg-border/80">
                {stageOrder.map((stageName, idx) => {
                    const stageMeta = stages.find((s) => s.value === stageName);
                    const state = getStageState(stageName);
                    const record = getStageRecord(stageName);
                    const StageIcon = getIconForStage(stageName);

                    // Skip the optional "Perlu Revisi" step if never reached and not currently in revision
                    if (state === 'skipped') {
                        return null;
                    }

                    const isCompleted = state === 'completed';
                    const isCurrent = state === 'current';
                    const isRevision = state === 'revision';
                    const isPending = state === 'pending';

                    // Node Indicator Circle styling
                    let nodeStyle = 'border-border/80 bg-background text-muted-foreground';
                    let ringStyle = '';

                    if (isCompleted) {
                        nodeStyle = 'border-emerald-600 bg-emerald-600 text-white shadow-xs';
                        ringStyle = 'ring-4 ring-emerald-50 dark:ring-emerald-950/60';
                    } else if (isCurrent) {
                        nodeStyle = 'border-primary bg-primary text-primary-foreground shadow-xs animate-pulse';
                        ringStyle = 'ring-4 ring-primary/20';
                    } else if (isRevision) {
                        nodeStyle = 'border-rose-600 bg-rose-600 text-white shadow-xs animate-bounce';
                        ringStyle = 'ring-4 ring-rose-100 dark:ring-rose-950/60';
                    } else if (isPending) {
                        nodeStyle = 'border-2 border-dashed border-border/70 bg-muted/30 text-muted-foreground/60';
                    }

                    // Card container styling
                    let cardStyle = 'border-border/80 bg-card/60 shadow-xs';
                    if (isCurrent) {
                        cardStyle = 'border-2 border-primary/50 bg-card shadow-sm ring-1 ring-primary/10';
                    } else if (isRevision) {
                        cardStyle = 'border-2 border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20 shadow-sm';
                    } else if (isPending) {
                        cardStyle = 'border border-dashed border-border/60 bg-muted/20 opacity-75';
                    }

                    return (
                        <div key={stageName} className="relative mb-6 last:mb-0">
                            {/* Step Node Pin */}
                            <div
                                className={`absolute -left-7 sm:-left-8 top-3 flex size-7 items-center justify-center rounded-full border-2 transition-all ${nodeStyle} ${ringStyle}`}
                                title={`Tahap ${idx + 1}: ${stageName}`}
                            >
                                {isCompleted ? (
                                    <Check className="size-3.5 stroke-[3]" />
                                ) : isRevision ? (
                                    <AlertTriangle className="size-3.5" />
                                ) : isCurrent ? (
                                    <StageIcon className="size-3.5" />
                                ) : (
                                    <span className="text-[10px] font-semibold">{idx + 1}</span>
                                )}
                            </div>

                            {/* Timeline Item Card */}
                            <div className={`rounded-xl p-4 transition-all ${cardStyle}`}>
                                {/* Header: Stage Name, Badge & Status Pill */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                                            Tahap {idx + 1}.
                                        </span>
                                        <h4 className="text-sm font-bold text-foreground">
                                            {stageName}
                                        </h4>
                                        <StatusBadge status={stageName} size="sm" />
                                    </div>

                                    {/* Visual State Pill */}
                                    <div className="flex items-center gap-2">
                                        {isCompleted && (
                                            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-medium gap-1">
                                                <CheckCircle2 className="size-3" />
                                                Selesai
                                            </Badge>
                                        )}
                                        {isCurrent && (
                                            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px] font-semibold gap-1 animate-pulse">
                                                <Clock className="size-3" />
                                                Sedang Berjalan
                                            </Badge>
                                        )}
                                        {isRevision && (
                                            <Badge variant="destructive" className="bg-rose-600 text-white text-[10px] font-bold gap-1 shadow-xs">
                                                <AlertTriangle className="size-3" />
                                                Tindakan Perlu Diambil
                                            </Badge>
                                        )}
                                        {isPending && (
                                            <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-normal">
                                                Menunggu Antrean
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Official SOP Description */}
                                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                    {stageMeta?.description || 'Proses tahapan administrasi dan pengelolaan dokumen.'}
                                </p>

                                {/* Metadata Footer: Actor, Date, Posisi Berkas */}
                                <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
                                    {/* Updater / Designated Actor */}
                                    <div className="flex items-center gap-1.5">
                                        <UserIcon className="size-3.5 text-muted-foreground shrink-0" />
                                        <span>Petugas:</span>
                                        <span className="font-medium text-foreground">
                                            {record?.updater_name || stageMeta?.updated_by || 'Staf Keuangan'}
                                        </span>
                                        {record?.updater_role && (
                                            <span className="text-[10px] text-muted-foreground">
                                                ({record.updater_role})
                                            </span>
                                        )}
                                    </div>

                                    {/* Posisi Berkas */}
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="size-3.5 text-primary shrink-0" />
                                        <span>Posisi Berkas:</span>
                                        <span className="font-semibold text-foreground">
                                            {record?.posisi_berkas || stageMeta?.default_posisi || 'Subbag Keuangan Fakultas'}
                                        </span>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                                        <span>Waktu:</span>
                                        <span className="font-mono text-foreground">
                                            {record ? formatDate(record.waktu_update) : 'Menunggu tahapan sebelumnya'}
                                        </span>
                                    </div>
                                </div>

                                {/* Notes section if present on this recorded stage */}
                                {record?.catatan && (
                                    <div
                                        className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
                                            isRevision
                                                ? 'border border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
                                                : 'border border-border/70 bg-muted/40 text-foreground'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <MessageSquare className={`size-4 mt-0.5 shrink-0 ${isRevision ? 'text-rose-600' : 'text-muted-foreground'}`} />
                                            <div>
                                                <span className="font-semibold block mb-0.5">
                                                    {isRevision ? 'Catatan Perbaikan dari Verifikator:' : 'Catatan Pembaruan:'}
                                                </span>
                                                <p className="whitespace-pre-line">{record.catatan}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Revision Required Quick Action Banner for Applicant */}
                                {isRevision && onUploadRevision && (
                                    <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-rose-200 dark:border-rose-900/60">
                                        <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                                            Silakan perbaiki berkas proposal sesuai catatan dan unggah revisi agar verifikasi dapat dilanjutkan.
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={onUploadRevision}
                                            className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shadow-xs shrink-0"
                                        >
                                            <FileEdit className="size-3.5" />
                                            Perbaiki Dokumen
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
