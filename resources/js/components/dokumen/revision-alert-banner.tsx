import { Button } from '@/components/ui/button';
import { DokumenPengajuan, StatusStageInfo, User } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { StatusUpdateDialog } from './status-update-dialog';

interface RevisionAlertBannerProps {
    document: DokumenPengajuan;
    stages: StatusStageInfo[];
    className?: string;
}

export function RevisionAlertBanner({ document, stages, className = '' }: RevisionAlertBannerProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentUser = auth.user;

    if (document.status_terkini !== 'Perlu Revisi') {
        return null;
    }

    const latestTracking = document.latest_status_tracking;
    const isOwner = document.user_id === currentUser.id;

    return (
        <div className={`rounded-xl border-2 border-rose-400 bg-rose-50/90 p-5 shadow-xs dark:border-rose-800 dark:bg-rose-950/40 ${className}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs">
                        <AlertTriangle className="size-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-rose-900 dark:text-rose-100">Dokumen Memerlukan Revisi & Perbaikan</h4>
                            <span className="rounded-full bg-rose-200/80 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-800 uppercase dark:bg-rose-900 dark:text-rose-200">
                                Tindakan Diperlukan
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
                            Staf keuangan telah memeriksa berkas Anda dan memberikan catatan perbaikan berikut:
                        </p>

                        {/* Revision Notes Box */}
                        <div className="mt-3 rounded-lg border border-rose-300 bg-white/80 p-3.5 text-xs leading-relaxed text-rose-950 shadow-2xs dark:border-rose-800 dark:bg-neutral-900/80 dark:text-rose-100">
                            <p className="mb-1 font-semibold text-rose-800 dark:text-rose-400">
                                Catatan Pemeriksa ({latestTracking?.updater_name ?? 'Staf Keuangan'}):
                            </p>
                            <p className="font-medium whitespace-pre-line">
                                {latestTracking?.catatan ||
                                    'Harap periksa kembali kelengkapan lampiran usulan dan kepatuhan terhadap Standar Biaya Masukan (SBM).'}
                            </p>
                            {latestTracking?.waktu_update && (
                                <p className="text-muted-foreground mt-2 flex items-center gap-1 text-[11px]">
                                    <Clock className="size-3" />
                                    <span>
                                        Dicatat pada:{' '}
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(latestTracking.waktu_update))}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resubmission Action */}
                {isOwner && (
                    <div className="sm:shrink-0">
                        <StatusUpdateDialog
                            document={document}
                            stages={stages}
                            triggerButton={
                                <Button className="w-full gap-2 bg-rose-600 text-white shadow-sm hover:bg-rose-700 sm:w-auto">
                                    <RefreshCw className="size-4" />
                                    <span>Kirimkan Revisi Dokumen</span>
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
