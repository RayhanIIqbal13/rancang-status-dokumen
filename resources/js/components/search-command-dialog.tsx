import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { router } from '@inertiajs/react';
import {
    BarChart3,
    CheckSquare,
    Clock,
    FileText,
    GitCommitHorizontal,
    Landmark,
    LayoutGrid,
    Loader2,
    Moon,
    PlusCircle,
    Receipt,
    Scale,
    Search,
    Sun,
    Users,
    X,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface DocumentResult {
    id: number;
    nomor_pengajuan: string;
    nama_kegiatan: string;
    jenis_anggaran: string;
    total_usulan: number;
    status_terkini: string;
    user_name: string | null;
    url: string;
}

interface SbmResult {
    id: number;
    kategori: string;
    uraian_belanja: string;
    satuan: string;
    batas_tarif: number;
    tahun: number;
    url: string;
}

interface SearchCommandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchCommandDialog({ open, onOpenChange }: SearchCommandDialogProps) {
    const [query, setQuery] = useState('');
    const [documents, setDocuments] = useState<DocumentResult[]>([]);
    const [sbmList, setSbmList] = useState<SbmResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial / recent static navigation items matching the template
    const dashboardItems = useMemo(
        () => [
            {
                title: 'Default Dashboard',
                subtitle: 'Ringkasan KPI, Alur Dokumen & Analitik',
                url: '/dashboard',
                icon: LayoutGrid,
                category: 'Dashboards',
            },
            {
                title: 'Status Tracking (8 Tahap)',
                subtitle: 'Pelacakan linimasa & posisi berkas real-time',
                url: '/status-tracking',
                icon: GitCommitHorizontal,
                badge: '8 Tahap',
                category: 'Dashboards',
            },
            {
                title: 'Verifikasi Dokumen',
                subtitle: 'Verifikasi usulan & kepatuhan Standar Biaya Masukan',
                url: '/verifikasi-dokumen',
                icon: CheckSquare,
                badge: 'Admin/Staf',
                category: 'Dashboards',
            },
            {
                title: 'Dokumen Pengajuan',
                subtitle: 'Daftar & arsip seluruh proposal usulan kegiatan',
                url: '/dokumen-pengajuan',
                icon: FileText,
                category: 'Layanan & SPJ',
            },
            {
                title: 'Realisasi Anggaran',
                subtitle: 'Pencairan dana SP2D & serapan pagu',
                url: '/realisasi-anggaran',
                icon: Landmark,
                category: 'Layanan & SPJ',
            },
            {
                title: 'Bukti Pengeluaran (SPJ)',
                subtitle: 'Arsip bukti kuitansi, faktur & nota belanja',
                url: '/bukti-pengeluaran',
                icon: Receipt,
                category: 'Layanan & SPJ',
            },
            {
                title: 'Standar Biaya (SBM)',
                subtitle: 'Pedoman plafon tarif honorarium & akomodasi resmi',
                url: '/standar-biaya',
                icon: Scale,
                badge: '2026',
                category: 'Layanan & SPJ',
            },
            {
                title: 'Laporan Keuangan',
                subtitle: 'Rekapitulasi realisasi anggaran & audit SAKTI',
                url: '/laporan',
                icon: BarChart3,
                category: 'Laporan & Pengguna',
            },
            {
                title: 'Manajemen Pengguna',
                subtitle: 'Direktori akun pengusul, staf verifikator, & pimpinan',
                url: '/pengguna',
                icon: Users,
                category: 'Laporan & Pengguna',
            },
        ],
        [],
    );

    // Quick Actions
    const quickActions = useMemo(
        () => [
            {
                title: 'Buat Usulan Proposal Baru',
                subtitle: 'Daftarkan kegiatan baru dengan rincian anggaran',
                action: () => {
                    onOpenChange(false);
                    router.visit('/dokumen-pengajuan/create');
                },
                icon: PlusCircle,
                category: 'Tindakan Cepat',
            },
            {
                title: 'Ganti Mode Tampilan (Light / Dark)',
                subtitle: 'Alihkan kontras antarmuka sistem',
                action: () => {
                    const isDark = document.documentElement.classList.contains('dark');
                    if (isDark) {
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('appearance', 'light');
                    } else {
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('appearance', 'dark');
                    }
                    onOpenChange(false);
                },
                icon: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? Sun : Moon,
                category: 'Tindakan Cepat',
            },
        ],
        [onOpenChange],
    );

    // Filter static dashboards and actions by query
    const filteredDashboards = useMemo(() => {
        if (!query.trim()) return dashboardItems;
        const q = query.toLowerCase();
        return dashboardItems.filter((item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q));
    }, [dashboardItems, query]);

    const filteredActions = useMemo(() => {
        if (!query.trim()) return quickActions;
        const q = query.toLowerCase();
        return quickActions.filter((item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q));
    }, [quickActions, query]);

    // Fetch dynamic search results from backend (DokumenPengajuan & SBM)
    useEffect(() => {
        if (!open) return;

        setIsLoading(true);
        const timer = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
                .then((res) => (res.ok ? res.json() : { documents: [], sbm: [] }))
                .then((data) => {
                    setDocuments(data.documents || []);
                    setSbmList(data.sbm || []);
                })
                .catch(() => {
                    setDocuments([]);
                    setSbmList([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 180);

        return () => clearTimeout(timer);
    }, [query, open]);

    // Flatten all active list items for keyboard navigation
    interface SelectableItem {
        id: string;
        onSelect: () => void;
    }

    const flatItems: SelectableItem[] = useMemo(() => {
        const list: SelectableItem[] = [];

        filteredDashboards.forEach((d) => {
            list.push({
                id: `dashboard-${d.url}`,
                onSelect: () => {
                    onOpenChange(false);
                    router.visit(d.url);
                },
            });
        });

        filteredActions.forEach((a, idx) => {
            list.push({
                id: `action-${idx}`,
                onSelect: a.action,
            });
        });

        documents.forEach((doc) => {
            list.push({
                id: `doc-${doc.id}`,
                onSelect: () => {
                    onOpenChange(false);
                    router.visit(doc.url);
                },
            });
        });

        sbmList.forEach((s) => {
            list.push({
                id: `sbm-${s.id}`,
                onSelect: () => {
                    onOpenChange(false);
                    router.visit(s.url);
                },
            });
        });

        return list;
    }, [filteredDashboards, filteredActions, documents, sbmList, onOpenChange]);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation handler
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (flatItems.length > 0 ? (prev + 1) % flatItems.length : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (flatItems.length > 0 ? (prev - 1 + flatItems.length) % flatItems.length : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (flatItems[selectedIndex]) {
                flatItems[selectedIndex].onSelect();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onOpenChange(false);
        }
    };

    // Helper status badge color
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Diajukan':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900';
            case 'Verifikasi Fakultas':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900';
            case 'Perlu Revisi':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900';
            case 'Menunggu SK / Penetapan Universitas':
                return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900';
            case 'Disetujui, Kegiatan Berjalan':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
            case 'SPJ Diterima & Diverifikasi':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900';
            case 'Diproses di SAKTI':
                return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900';
            case 'Dana Cair':
                return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    // Running index calculator for flat list
    let runningIndex = 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                hideCloseButton={true}
                overlayClassName="backdrop-blur-md bg-black/60 dark:bg-black/75"
                className="border-border/80 bg-background/95 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] w-[95vw] max-w-2xl overflow-hidden rounded-2xl p-0 shadow-2xl backdrop-blur-xl transition-all sm:rounded-2xl"
                onKeyDown={handleKeyDown}
            >
                <DialogTitle className="sr-only">Search documents, dashboards, and SBM</DialogTitle>

                {/* Top Search Input Box */}
                <div className="border-border/70 relative flex items-center border-b px-4 py-3">
                    <Search className="text-muted-foreground mr-3 size-4.5 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                onOpenChange(false);
                            }
                        }}
                        placeholder="Search dashboards, documents, SBM, and more..."
                        className="placeholder:text-muted-foreground/60 text-foreground flex-1 bg-transparent text-sm outline-hidden"
                        autoFocus
                    />
                    {isLoading && <Loader2 className="text-muted-foreground/80 mr-2 size-4 animate-spin shrink-0" />}

                    {/* Right-side Action Group: Clear query button (if typed), ESC badge button, and X close button */}
                    <div className="flex items-center gap-1.5 shrink-0 pl-1">
                        {query && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    inputRef.current?.focus();
                                }}
                                title="Hapus teks pencarian"
                                aria-label="Hapus teks pencarian"
                                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            title="Tutup dialog (Esc)"
                            aria-label="Tutup dialog pencarian (Esc)"
                            className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border/80 bg-muted/60 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground shadow-2xs transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                            <span>ESC</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            title="Tutup pencarian"
                            aria-label="Tutup dialog pencarian"
                            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Results List Container */}
                <div className="max-h-[min(52vh,440px)] overflow-y-auto px-2 py-2 text-xs">
                    {/* 1. Dashboards & Pages */}
                    {filteredDashboards.length > 0 && (
                        <div className="mb-3">
                            <div className="text-muted-foreground/80 px-2 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                                Dashboards & Halaman
                            </div>
                            <div className="space-y-0.5">
                                {filteredDashboards.map((item) => {
                                    const currentIndex = runningIndex++;
                                    const isSelected = selectedIndex === currentIndex;
                                    const IconComponent = item.icon;

                                    return (
                                        <div
                                            key={item.url}
                                            onClick={() => {
                                                onOpenChange(false);
                                                router.visit(item.url);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 transition-colors ${
                                                isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/60 text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`flex size-7 items-center justify-center rounded-lg ${
                                                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <IconComponent className="size-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold">{item.title}</span>
                                                    <span className="text-muted-foreground text-[10px] font-normal">{item.subtitle}</span>
                                                </div>
                                            </div>
                                            {item.badge && (
                                                <Badge variant="outline" className="text-[10px] font-normal">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 2. Tindakan Cepat */}
                    {filteredActions.length > 0 && (
                        <div className="mb-3">
                            <div className="text-muted-foreground/80 px-2 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                                Tindakan Cepat
                            </div>
                            <div className="space-y-0.5">
                                {filteredActions.map((action, idx) => {
                                    const currentIndex = runningIndex++;
                                    const isSelected = selectedIndex === currentIndex;
                                    const IconComponent = action.icon;

                                    return (
                                        <div
                                            key={`action-${idx}`}
                                            onClick={action.action}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 transition-colors ${
                                                isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/60 text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`flex size-7 items-center justify-center rounded-lg ${
                                                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <IconComponent className="size-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold">{action.title}</span>
                                                    <span className="text-muted-foreground text-[10px] font-normal">{action.subtitle}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 3. Dokumen Pengajuan (Live Search & Recent) */}
                    {documents.length > 0 && (
                        <div className="mb-3">
                            <div className="text-muted-foreground/80 flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                                <span>Dokumen Pengajuan</span>
                                <span className="text-[10px] font-normal capitalize">
                                    {query ? `Hasil pencarian (${documents.length})` : 'Dokumen Terkini'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {documents.map((doc) => {
                                    const currentIndex = runningIndex++;
                                    const isSelected = selectedIndex === currentIndex;

                                    return (
                                        <div
                                            key={`doc-${doc.id}`}
                                            onClick={() => {
                                                onOpenChange(false);
                                                router.visit(doc.url);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 transition-colors ${
                                                isSelected
                                                    ? 'bg-primary/10 text-foreground ring-primary/20 ring-1'
                                                    : 'hover:bg-muted/60 text-foreground'
                                            }`}
                                        >
                                            <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                                <div className="bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                                                    <FileText className="size-4" />
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                                            {doc.nomor_pengajuan}
                                                        </span>
                                                        <span className="text-muted-foreground/60">&bull;</span>
                                                        <span className="text-muted-foreground truncate text-[10px]">{doc.jenis_anggaran}</span>
                                                    </div>
                                                    <span className="text-foreground truncate text-xs font-medium">{doc.nama_kegiatan}</span>
                                                    {doc.user_name && (
                                                        <span className="text-muted-foreground/80 text-[10px]">Oleh: {doc.user_name}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                                                <span
                                                    className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${getStatusBadgeVariant(
                                                        doc.status_terkini,
                                                    )}`}
                                                >
                                                    {doc.status_terkini}
                                                </span>
                                                <span className="text-foreground text-[11px] font-semibold">
                                                    Rp {Number(doc.total_usulan).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 4. Standar Biaya Masukan (SBM) */}
                    {sbmList.length > 0 && (
                        <div className="mb-2">
                            <div className="text-muted-foreground/80 flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
                                <span>Standar Biaya Masukan (SBM 2026)</span>
                                <span className="text-[10px] font-normal capitalize">{sbmList.length} Item</span>
                            </div>
                            <div className="space-y-0.5">
                                {sbmList.map((sbm) => {
                                    const currentIndex = runningIndex++;
                                    const isSelected = selectedIndex === currentIndex;

                                    return (
                                        <div
                                            key={`sbm-${sbm.id}`}
                                            onClick={() => {
                                                onOpenChange(false);
                                                router.visit(sbm.url);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 transition-colors ${
                                                isSelected
                                                    ? 'bg-primary/10 text-foreground ring-primary/20 ring-1'
                                                    : 'hover:bg-muted/60 text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg">
                                                    <Scale className="size-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-foreground text-xs font-medium">{sbm.uraian_belanja}</span>
                                                    <span className="text-muted-foreground text-[10px]">{sbm.kategori}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-foreground text-xs font-semibold">
                                                    Rp {Number(sbm.batas_tarif).toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-muted-foreground block text-[9px]">/ {sbm.satuan}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {flatItems.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="bg-muted/60 mb-2 flex size-10 items-center justify-center rounded-full">
                                <Search className="text-muted-foreground size-5" />
                            </div>
                            <p className="text-foreground text-xs font-semibold">Tidak ada hasil ditemukan</p>
                            <p className="text-muted-foreground mt-0.5 text-[11px]">
                                Tidak ditemukan data yang cocok dengan &quot;<span className="text-foreground font-medium">{query}</span>&quot;
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer keyboard hints */}
                <div className="border-border/60 bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-3.5 py-2 text-[10px]">
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:flex items-center gap-1">
                            <Kbd className="text-[9px]">↑</Kbd>
                            <Kbd className="text-[9px]">↓</Kbd>
                            <span>navigasi</span>
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                            <Kbd className="text-[9px]">↵</Kbd>
                            <span>buka</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            title="Tutup dialog (Esc)"
                            className="flex items-center gap-1 transition-colors hover:text-foreground cursor-pointer"
                        >
                            <Kbd className="text-[9px]">esc</Kbd>
                            <span>tutup</span>
                        </button>
                    </div>
                    <div className="hidden items-center gap-1 sm:flex">
                        <Clock className="size-3" />
                        <span>FSTI ITK Quick Search</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
