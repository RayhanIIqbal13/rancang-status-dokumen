import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData, SharedData, StandarBiaya } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Layers, Plus, Search, ShieldCheck, X } from 'lucide-react';
import React, { useState } from 'react';

interface StandarBiayaIndexProps {
    items: PaginatedData<StandarBiaya>;
    categories: string[];
    filters: {
        search: string;
        kategori: string;
    };
    stats: {
        total_items: number;
        total_kategori: number;
        tahun_aktif: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Standar Biaya (SBM)', href: '/standar-biaya' },
];

export default function StandarBiayaIndex({ items, categories, filters, stats }: StandarBiayaIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const isStaffOrAdmin = auth.user.role === 'staf_keuangan' || auth.user.role === 'admin';

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        kategori: '',
        uraian_belanja: '',
        satuan: '',
        batas_tarif: '',
        tahun: stats.tahun_aktif || 2026,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('standar-biaya.index'), { search: searchTerm, kategori: filters.kategori }, { preserveState: true });
    };

    const handleCategoryFilter = (category: string) => {
        router.get(route('standar-biaya.index'), { search: searchTerm, kategori: category }, { preserveState: true });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        router.get(route('standar-biaya.index'));
    };

    const handleSubmitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('standar-biaya.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
            },
        });
    };

    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Standar Biaya Masukan (SBM) - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                            <h1 className="text-foreground text-lg sm:text-xl font-semibold tracking-tight">Standar Biaya Masukan (SBM)</h1>
                            <span className="border-primary/20 bg-primary/10 text-primary inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap">
                                TA {stats.tahun_aktif}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Katalog acuan batas tarif belanja operasional, honorarium, dan perjalanan dinas Institut Teknologi Kalimantan
                        </p>
                    </div>

                    {isStaffOrAdmin && (
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
                                    <Plus className="size-3.5" />
                                    <span>Tambah SBM</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-xl">
                                <form onSubmit={handleSubmitAdd}>
                                    <DialogHeader className="border-b pb-3">
                                        <DialogTitle className="text-base font-semibold tracking-tight">Tambah Standar Biaya Baru</DialogTitle>
                                        <DialogDescription className="text-muted-foreground text-xs">
                                            Tambahkan plafon tarif belanja baru untuk validasi proposal dan pertanggungjawaban SPJ.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-3.5 py-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="kategori" className="text-xs font-medium">
                                                Kategori Belanja <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="kategori"
                                                placeholder="Contoh: Honorarium, Konsumsi, Transportasi"
                                                value={data.kategori}
                                                onChange={(e) => setData('kategori', e.target.value)}
                                                className="h-8 text-xs"
                                                required
                                            />
                                            {errors.kategori && <p className="text-destructive text-[11px]">{errors.kategori}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="uraian_belanja" className="text-xs font-medium">
                                                Uraian Belanja <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="uraian_belanja"
                                                placeholder="Contoh: Honor Narasumber / Pakar Luar PTN"
                                                value={data.uraian_belanja}
                                                onChange={(e) => setData('uraian_belanja', e.target.value)}
                                                className="h-8 text-xs"
                                                required
                                            />
                                            {errors.uraian_belanja && <p className="text-destructive text-[11px]">{errors.uraian_belanja}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="satuan" className="text-xs font-medium">
                                                    Satuan <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="satuan"
                                                    placeholder="Contoh: Orang / Jam"
                                                    value={data.satuan}
                                                    onChange={(e) => setData('satuan', e.target.value)}
                                                    className="h-8 text-xs"
                                                    required
                                                />
                                                {errors.satuan && <p className="text-destructive text-[11px]">{errors.satuan}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="tahun" className="text-xs font-medium">
                                                    Tahun Anggaran <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="tahun"
                                                    type="number"
                                                    value={data.tahun}
                                                    onChange={(e) => setData('tahun', parseInt(e.target.value) || 2026)}
                                                    className="h-8 text-xs"
                                                    required
                                                />
                                                {errors.tahun && <p className="text-destructive text-[11px]">{errors.tahun}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="batas_tarif" className="text-xs font-medium">
                                                Batas Tarif Maksimal (Rp) <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="batas_tarif"
                                                type="number"
                                                placeholder="Contoh: 900000"
                                                value={data.batas_tarif}
                                                onChange={(e) => setData('batas_tarif', e.target.value)}
                                                className="h-8 text-xs"
                                                required
                                            />
                                            {errors.batas_tarif && <p className="text-destructive text-[11px]">{errors.batas_tarif}</p>}
                                        </div>
                                    </div>

                                    <DialogFooter className="gap-2 border-t pt-3">
                                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsAddOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing} size="sm" className="h-8 gap-1 text-xs shadow-xs">
                                            {processing ? 'Menyimpan...' : 'Simpan SBM'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* Total Acuan */}
                    <div className="from-primary/5 to-card ring-foreground/10 rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">Total Acuan SBM</span>
                            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                <BookOpen className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-foreground text-2xl font-medium tabular-nums">{stats.total_items} Item</span>
                            <span className="text-muted-foreground text-[11px]">Plafon biaya resmi</span>
                        </div>
                    </div>

                    {/* Kategori Belanja */}
                    <div className="from-primary/5 to-card ring-foreground/10 rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">Klaster Kategori</span>
                            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
                                <Layers className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-foreground text-2xl font-medium tabular-nums">{stats.total_kategori} Klaster</span>
                            <span className="text-muted-foreground text-[11px]">Kelompok pos belanja</span>
                        </div>
                    </div>

                    {/* Validasi Otomatis */}
                    <div className="to-card rounded-xl bg-linear-to-t from-emerald-500/10 p-4 shadow-xs ring-1 ring-emerald-500/30">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Validasi Otomatis</span>
                            <div className="flex size-7 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-foreground text-base font-semibold">Terhubung ke SPJ & Proposal</span>
                            <p className="text-muted-foreground mt-0.5 text-[11px]">Belanja di atas plafon otomatis terdeteksi</p>
                        </div>
                    </div>
                </div>

                {/* Main Card with Toolbar & Table */}
                <div className="bg-card overflow-hidden rounded-xl border shadow-2xs">
                    {/* Studio Admin Toolbar */}
                    <div className="flex flex-col gap-3 border-b p-4">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                                <Input
                                    placeholder="Cari uraian belanja atau standar tarif..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-8 pr-8 pl-8 text-xs"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </form>

                            <div className="text-muted-foreground text-xs">
                                Menampilkan <strong className="text-foreground">{items.data.length}</strong> dari{' '}
                                <strong className="text-foreground">{stats.total_items}</strong> acuan tarif
                            </div>
                        </div>

                        {/* Category filter pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => handleCategoryFilter('all')}
                                className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                    filters.kategori === 'all' || !filters.kategori
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                Semua ({stats.total_items})
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleCategoryFilter(cat)}
                                    className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors ${
                                        filters.kategori === cat
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-thin">
                        <table className="w-full min-w-[700px] text-left text-xs">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-[11px] font-medium tracking-wider uppercase">
                                <tr>
                                    <th className="w-12 px-4 py-3 text-center">#</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Uraian Belanja</th>
                                    <th className="px-4 py-3 text-center">Satuan</th>
                                    <th className="px-4 py-3 text-right">Batas Tarif Maksimal</th>
                                    <th className="px-4 py-3 text-center">Tahun</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground p-8 text-center">
                                            Tidak ada data Standar Biaya Masukan yang sesuai kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    items.data.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="text-muted-foreground px-4 py-3 text-center font-mono text-[11px]">
                                                {(items.current_page - 1) * items.per_page + index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[11px] font-medium">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="text-foreground px-4 py-3 font-medium">{item.uraian_belanja}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 text-[10px]">
                                                    {item.satuan}
                                                </span>
                                            </td>
                                            <td className="text-foreground px-4 py-3 text-right font-semibold tabular-nums">
                                                {formatCurrency(item.batas_tarif)}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 text-center font-mono text-[11px]">{item.tahun}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {items.links && items.links.length > 3 && (
                        <div className="bg-muted/20 flex items-center justify-between border-t p-3 text-xs">
                            <span className="text-muted-foreground">
                                Halaman {items.current_page} dari {items.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {items.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        asChild={Boolean(link.url)}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        className="h-7 min-w-7 px-2 text-xs"
                                    >
                                        {link.url ? (
                                            <span
                                                onClick={() => router.get(link.url!, {}, { preserveState: true })}
                                                className="cursor-pointer"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
