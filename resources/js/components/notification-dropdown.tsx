import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationItem, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, BellOff, CheckCheck, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NotificationDropdown() {
    const { notifications = [], auth } = usePage<SharedData>().props;
    const userRole = auth?.user?.role;

    // Track read notification IDs in localStorage so users can dismiss badge
    const [readIds, setReadIds] = useState<number[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('sak_read_notifications');
            if (stored) {
                setReadIds(JSON.parse(stored));
            }
        } catch {
            // ignore JSON error
        }
    }, []);

    const markAllAsRead = () => {
        const allIds = notifications.map((n) => n.id);
        setReadIds(allIds);
        try {
            localStorage.setItem('sak_read_notifications', JSON.stringify(allIds));
        } catch {
            // ignore
        }
    };

    const markItemAsRead = (id: number) => {
        if (!readIds.includes(id)) {
            const updated = [...readIds, id];
            setReadIds(updated);
            try {
                localStorage.setItem('sak_read_notifications', JSON.stringify(updated));
            } catch {
                // ignore
            }
        }
    };

    const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted relative flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus:outline-hidden"
                    title={unreadCount > 0 ? `${unreadCount} proposal baru membutuhkan tindakan` : 'Notifikasi Proposal'}
                >
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
                            <span className="relative">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={6}
                className="border-border/80 bg-background/95 w-[calc(100vw-2rem)] max-w-sm rounded-2xl p-0 shadow-2xl backdrop-blur-md sm:w-96"
            >
                {/* Header */}
                <div className="border-border/70 flex items-center justify-between border-b px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md">
                            <Sparkles className="size-3.5" />
                        </div>
                        <span className="text-foreground text-xs font-semibold">Notifikasi Proposal Masuk</span>
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-semibold">
                                {unreadCount} Baru
                            </Badge>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-muted-foreground hover:text-foreground h-6 gap-1 px-1.5 text-[10px]"
                        >
                            <CheckCheck className="size-3" />
                            <span>Tandai dibaca</span>
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <DropdownMenuGroup className="divide-border/30 max-h-[360px] divide-y overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                            <div className="bg-muted/60 text-muted-foreground mb-2 flex size-10 items-center justify-center rounded-full">
                                <BellOff className="size-5" />
                            </div>
                            <span className="text-foreground text-xs font-semibold">Belum Ada Proposal Masuk</span>
                            <span className="text-muted-foreground mt-0.5 text-[11px]">Tidak ada proposal baru dalam status diajukan saat ini.</span>
                        </div>
                    ) : (
                        notifications.map((item: NotificationItem) => {
                            const isUnread = !readIds.includes(item.id);

                            return (
                                <DropdownMenuItem
                                    key={`notif-${item.id}`}
                                    onClick={() => {
                                        markItemAsRead(item.id);
                                        router.visit(item.url);
                                    }}
                                    className={`focus:bg-muted/60 flex cursor-pointer items-start gap-2.5 px-3.5 py-3 transition-colors ${
                                        isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/40'
                                    }`}
                                >
                                    <div
                                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${
                                            isUnread ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <FileText className="size-4" />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                                {item.nomor_pengajuan}
                                            </span>
                                            <span className="text-muted-foreground shrink-0 text-[10px]">{item.time_ago}</span>
                                        </div>

                                        <p className="text-foreground line-clamp-1 text-xs font-semibold">{item.nama_kegiatan}</p>

                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <span className="text-muted-foreground truncate text-[10px]">
                                                {item.user_name} &bull; {item.user_unit}
                                            </span>
                                            <span className="text-foreground shrink-0 text-[10px] font-semibold">
                                                Rp {Number(item.total_usulan).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <div className="mt-1 flex items-center gap-1.5">
                                            <span className="py-0.2 inline-flex items-center rounded-md border border-blue-200 bg-blue-500/10 px-1.5 text-[9px] font-semibold text-blue-600 dark:border-blue-900 dark:text-blue-400">
                                                {item.status_terkini}
                                            </span>
                                            {isUnread && <span className="size-1.5 rounded-full bg-rose-500" title="Belum dibaca" />}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="m-0" />

                {/* Footer link to full proposals page */}
                <div className="bg-muted/30 p-2 text-center">
                    <Button asChild variant="ghost" size="sm" className="h-7 w-full justify-center gap-1 text-xs">
                        <Link href={userRole === 'admin' || userRole === 'staf_keuangan' ? '/verifikasi-dokumen' : '/dokumen-pengajuan'}>
                            <span>
                                {userRole === 'admin' || userRole === 'staf_keuangan'
                                    ? 'Buka Menu Verifikasi Dokumen'
                                    : 'Lihat Semua Dokumen Pengajuan'}
                            </span>
                            <ChevronRight className="size-3" />
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
