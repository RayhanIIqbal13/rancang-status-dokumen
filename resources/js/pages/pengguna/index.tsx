import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData, SharedData, User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Briefcase,
    Building2,
    Check,
    Eye,
    EyeOff,
    FileText,
    GraduationCap,
    Info,
    Mail,
    Pencil,
    Search,
    Shield,
    Trash2,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface UserWithCount extends User {
    dokumen_pengajuans_count?: number;
}

interface PenggunaIndexProps {
    users: PaginatedData<UserWithCount>;
    filters: {
        search: string;
        role: string;
    };
    stats: {
        total_users: number;
        total_pengusul: number;
        total_staf: number;
        total_pimpinan: number;
        total_admin?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Daftar Pengguna', href: '/pengguna' },
];

export default function PenggunaIndex({ users, filters, stats }: PenggunaIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Create Modal State & Form
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showCreateConfirmPassword, setShowCreateConfirmPassword] = useState(false);
    const createForm = useForm({
        name: '',
        email: '',
        nip_nim: '',
        unit: '',
        role: 'pengusul' as 'pengusul' | 'staf_keuangan' | 'pimpinan' | 'admin',
        password: '',
        password_confirmation: '',
    });

    // Edit Modal State & Form
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserWithCount | null>(null);
    const editForm = useForm({
        name: '',
        email: '',
        nip_nim: '',
        unit: '',
        role: 'pengusul' as 'pengusul' | 'staf_keuangan' | 'pimpinan' | 'admin',
        password: '',
        password_confirmation: '',
    });

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserWithCount | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('pengguna.index'), { search: searchTerm, role: filters.role }, { preserveState: true });
    };

    const handleRoleFilter = (role: string) => {
        router.get(route('pengguna.index'), { search: searchTerm, role }, { preserveState: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        router.get(route('pengguna.index'));
    };

    const handleOpenCreate = () => {
        createForm.reset();
        createForm.clearErrors();
        setShowCreatePassword(false);
        setShowCreateConfirmPassword(false);
        setIsCreateOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side confirmation check if password is provided
        if (createForm.data.password && createForm.data.password !== createForm.data.password_confirmation) {
            createForm.setError('password_confirmation', 'Konfirmasi kata sandi tidak cocok.');
            return;
        }

        createForm.post(route('pengguna.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleOpenEdit = (user: UserWithCount) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            nip_nim: user.nip_nim || '',
            unit: user.unit || '',
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        editForm.clearErrors();
        setShowEditPassword(false);
        setShowEditConfirmPassword(false);
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        // Client-side confirmation check if password is provided
        if (editForm.data.password && editForm.data.password !== editForm.data.password_confirmation) {
            editForm.setError('password_confirmation', 'Konfirmasi kata sandi tidak cocok.');
            return;
        }

        editForm.put(route('pengguna.update', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setSelectedUser(null);
            },
        });
    };

    const handleOpenDelete = (user: UserWithCount) => {
        setUserToDelete(user);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        router.delete(route('pengguna.destroy', userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setUserToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'pengusul':
                return (
                    <span className="rounded-4xl border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
                        Pengusul
                    </span>
                );
            case 'staf_keuangan':
                return (
                    <span className="rounded-4xl border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                        Staf Keuangan
                    </span>
                );
            case 'pimpinan':
                return (
                    <span className="rounded-4xl border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Pimpinan / Pejabat
                    </span>
                );
            case 'admin':
                return (
                    <span className="rounded-4xl border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
                        Administrator
                    </span>
                );
            default:
                return (
                    <span className="border-muted bg-muted text-muted-foreground rounded-4xl border px-2 py-0.5 text-[10px] font-medium">{role}</span>
                );
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Direktori Pengguna Sistem - Studio Admin SAK ITK" />

            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header (Studio Admin style) */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                            <h1 className="text-foreground text-lg sm:text-xl font-semibold tracking-tight">Direktori Pengguna Sistem</h1>
                            <span className="border-primary/20 bg-primary/10 text-primary inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap">
                                {stats.total_users} Akun Aktif
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Manajemen peran pengusul kegiatan, verifikator keuangan fakultas, dan otorisator anggaran ITK
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleOpenCreate}
                            size="sm"
                            className="h-8 gap-1.5 text-xs shadow-xs"
                        >
                            <UserPlus className="size-3.5" />
                            <span>Tambah Pengguna</span>
                        </Button>
                    </div>
                </div>

                {/* Studio Admin KPI Stat Tiles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Pengguna */}
                    <div className="from-primary/5 to-card ring-foreground/10 overflow-hidden rounded-xl bg-linear-to-t p-4 shadow-xs ring-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs font-medium truncate">Total Pengguna</span>
                            <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border">
                                <Users className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-foreground text-2xl font-bold tabular-nums tracking-tight">{stats.total_users}</span>
                            <span className="text-muted-foreground text-[11px]">akun terdaftar</span>
                        </div>
                    </div>

                    {/* Pengusul */}
                    <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-sky-500/10 p-4 shadow-xs ring-1 ring-sky-500/30">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-sky-700 dark:text-sky-400 truncate">Pengusul</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <GraduationCap className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-sky-700 tabular-nums tracking-tight dark:text-sky-400">
                                {stats.total_pengusul}
                            </span>
                            <span className="text-[11px] text-sky-600/80">Dosen & Tendik</span>
                        </div>
                    </div>

                    {/* Verifikator */}
                    <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-indigo-500/10 p-4 shadow-xs ring-1 ring-indigo-500/30">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400 truncate">Verifikator Keuangan</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Briefcase className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-indigo-700 tabular-nums tracking-tight dark:text-indigo-400">
                                {stats.total_staf}
                            </span>
                            <span className="text-[11px] text-indigo-600/80">Tim SBM & SAKTI</span>
                        </div>
                    </div>

                    {/* Pimpinan */}
                    <div className="to-card overflow-hidden rounded-xl bg-linear-to-t from-emerald-500/10 p-4 shadow-xs ring-1 ring-emerald-500/30">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 truncate">Pimpinan / Pejabat</span>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Shield className="size-3.5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight dark:text-emerald-400">
                                {stats.total_pimpinan}
                            </span>
                            <span className="text-[11px] text-emerald-600/80">Otorisator SK</span>
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
                                    placeholder="Cari nama, NIP/NIM, email, atau unit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-8 pr-8 pl-8 text-xs"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </form>

                            <div className="text-muted-foreground text-xs">
                                Menampilkan <strong className="text-foreground">{users.data.length}</strong> dari{' '}
                                <strong className="text-foreground">{stats.total_users}</strong> pengguna
                            </div>
                        </div>

                        {/* Role filter buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {[
                                { id: 'all', label: `Semua (${stats.total_users})` },
                                { id: 'pengusul', label: `Pengusul (${stats.total_pengusul})` },
                                { id: 'staf_keuangan', label: `Staf Keuangan (${stats.total_staf})` },
                                { id: 'pimpinan', label: `Pimpinan (${stats.total_pimpinan})` },
                                { id: 'admin', label: 'Admin' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleRoleFilter(tab.id)}
                                    className={`rounded-4xl px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                                        filters.role === tab.id || (!filters.role && tab.id === 'all')
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto scrollbar-thin">
                        <table className="w-full min-w-[760px] text-left text-xs">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-[11px] font-medium tracking-wider uppercase">
                                <tr>
                                    <th className="px-4 py-3">Pengguna</th>
                                    <th className="px-4 py-3">NIP / Identitas</th>
                                    <th className="px-4 py-3">Unit Kerja</th>
                                    <th className="px-4 py-3 text-center">Peran</th>
                                    <th className="px-4 py-3 text-center">Total Usulan</th>
                                    <th className="px-4 py-3 text-center">Terdaftar</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground p-8 text-center">
                                            Tidak ada data pengguna yang sesuai pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((u) => {
                                        const isCurrentUser = auth?.user?.id === u.id;
                                        return (
                                            <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="size-7 rounded-lg border">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                                                                {getInitials(u.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="text-foreground font-medium">{u.name}</p>
                                                                {isCurrentUser && (
                                                                    <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[9px] font-medium text-primary">
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                                                <Mail className="size-3" />
                                                                <span>{u.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="text-muted-foreground px-4 py-3 font-mono text-[11px]">{u.nip_nim || '-'}</td>

                                                <td className="text-muted-foreground px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 className="text-muted-foreground/70 size-3" />
                                                        <span>{u.unit || '-'}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3 text-center">{getRoleBadge(u.role)}</td>

                                                <td className="px-4 py-3 text-center">
                                                    <span className="bg-muted inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums">
                                                        <FileText className="text-muted-foreground size-3" />
                                                        {u.dokumen_pengajuans_count || 0}
                                                    </span>
                                                </td>

                                                <td className="text-muted-foreground px-4 py-3 text-center text-[11px]">
                                                    {new Date(u.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(u)}
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                            title="Edit Pengguna"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDelete(u)}
                                                            disabled={isCurrentUser}
                                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
                                                            title={isCurrentUser ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Pengguna'}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            <span className="sr-only">Hapus</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="bg-muted/20 flex items-center justify-between border-t p-3 text-xs">
                            <span className="text-muted-foreground">
                                Halaman {users.current_page} dari {users.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
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

            {/* Modal Tambah Pengguna */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg rounded-xl">
                    <form onSubmit={handleCreateSubmit}>
                        <DialogHeader className="border-b pb-3">
                            <DialogTitle className="text-base font-semibold tracking-tight">Daftarkan Pengguna Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground text-xs">
                                Masukkan data pengguna baru dan tentukan hak akses peran dalam sistem SAK ITK.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3.5 py-4">
                            {/* Nama Lengkap */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-name" className="text-xs font-medium">
                                    Nama Lengkap & Gelar <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="create-name"
                                    placeholder="Contoh: Dr. Ir. Ahmad Dahlan, M.T."
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="h-8 text-xs"
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-destructive text-[11px]">{createForm.errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-email" className="text-xs font-medium">
                                    Alamat Email ITK / Kampus <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="create-email"
                                    type="email"
                                    placeholder="Contoh: ahmad.dahlan@itk.ac.id"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    className="h-8 text-xs"
                                    required
                                />
                                {createForm.errors.email && (
                                    <p className="text-destructive text-[11px]">{createForm.errors.email}</p>
                                )}
                            </div>

                            {/* NIP & Peran Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-nip" className="text-xs font-medium">
                                        NIP / NIDN / NIM
                                    </Label>
                                    <Input
                                        id="create-nip"
                                        placeholder="Contoh: 198507142010121002"
                                        value={createForm.data.nip_nim}
                                        onChange={(e) => createForm.setData('nip_nim', e.target.value)}
                                        className="h-8 text-xs font-mono"
                                    />
                                    {createForm.errors.nip_nim && (
                                        <p className="text-destructive text-[11px]">{createForm.errors.nip_nim}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="create-role" className="text-xs font-medium">
                                        Peran Sistem <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="create-role"
                                        value={createForm.data.role}
                                        onChange={(e) => createForm.setData('role', e.target.value as any)}
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                        required
                                    >
                                        <option value="pengusul">Pengusul (Dosen / Tendik)</option>
                                        <option value="staf_keuangan">Staf Keuangan (Verifikator)</option>
                                        <option value="pimpinan">Pimpinan / Pejabat (Otorisator)</option>
                                        <option value="admin">Administrator Keuangan Pusat</option>
                                    </select>
                                    {createForm.errors.role && (
                                        <p className="text-destructive text-[11px]">{createForm.errors.role}</p>
                                    )}
                                </div>
                            </div>

                            {/* Unit Kerja */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-unit" className="text-xs font-medium">
                                    Unit Kerja / Jurusan / Fakultas
                                </Label>
                                <Input
                                    id="create-unit"
                                    placeholder="Contoh: Fakultas Ilmu Komputer (Prodi Informatika)"
                                    value={createForm.data.unit}
                                    onChange={(e) => createForm.setData('unit', e.target.value)}
                                    className="h-8 text-xs"
                                />
                                {createForm.errors.unit && (
                                    <p className="text-destructive text-[11px]">{createForm.errors.unit}</p>
                                )}
                            </div>

                            {/* Kata Sandi & Konfirmasi Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-password" className="text-xs font-medium">
                                        Kata Sandi (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="create-password"
                                            type={showCreatePassword ? 'text' : 'password'}
                                            placeholder="Minimal 6 karakter"
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                            className="h-8 pr-8 text-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCreatePassword(!showCreatePassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer transition-colors"
                                            tabIndex={-1}
                                            title={showCreatePassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                        >
                                            {showCreatePassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                        </button>
                                    </div>
                                    {createForm.errors.password && (
                                        <p className="text-destructive text-[11px]">{createForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="create-password-confirmation" className="text-xs font-medium">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="create-password-confirmation"
                                            type={showCreateConfirmPassword ? 'text' : 'password'}
                                            placeholder="Ketik ulang kata sandi"
                                            value={createForm.data.password_confirmation}
                                            onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                            className="h-8 pr-8 text-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateConfirmPassword(!showCreateConfirmPassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer transition-colors"
                                            tabIndex={-1}
                                            title={showCreateConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                        >
                                            {showCreateConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                        </button>
                                    </div>
                                    {createForm.errors.password_confirmation && (
                                        <p className="text-destructive text-[11px]">{createForm.errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>

                            {/* Indicator if password is being typed */}
                            {createForm.data.password && (
                                <div className="text-[11px]">
                                    {createForm.data.password_confirmation ? (
                                        createForm.data.password === createForm.data.password_confirmation ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                                                <Check className="size-3" /> Kata sandi cocok
                                            </span>
                                        ) : (
                                            <span className="text-destructive flex items-center gap-1">
                                                <AlertTriangle className="size-3" /> Konfirmasi kata sandi belum sama
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-muted-foreground">Silakan ketik ulang kata sandi di bidang konfirmasi.</span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-start gap-1.5 rounded-md border border-sky-200/50 bg-sky-50/50 p-2 text-[11px] text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-300">
                                <Info className="size-3.5 shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" />
                                <span>
                                    Jika dikosongkan, kata sandi otomatis diset ke <strong className="font-mono font-semibold">password</strong>. Pengguna dapat mengubah kata sandi kapan saja di profil mereka.
                                </span>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 border-t pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                size="sm"
                                className="h-8 gap-1 text-xs shadow-xs"
                            >
                                {createForm.processing ? 'Menyimpan...' : 'Daftarkan Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Pengguna */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-lg rounded-xl">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader className="border-b pb-3">
                            <DialogTitle className="text-base font-semibold tracking-tight">Edit Data Pengguna</DialogTitle>
                            <DialogDescription className="text-muted-foreground text-xs">
                                Perbarui informasi profil, unit kerja, atau peran akses pengguna.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3.5 py-4">
                            {/* Nama Lengkap */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name" className="text-xs font-medium">
                                    Nama Lengkap & Gelar <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="h-8 text-xs"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-destructive text-[11px]">{editForm.errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-email" className="text-xs font-medium">
                                    Alamat Email ITK / Kampus <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="h-8 text-xs"
                                    required
                                />
                                {editForm.errors.email && (
                                    <p className="text-destructive text-[11px]">{editForm.errors.email}</p>
                                )}
                            </div>

                            {/* NIP & Peran Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-nip" className="text-xs font-medium">
                                        NIP / NIDN / NIM
                                    </Label>
                                    <Input
                                        id="edit-nip"
                                        value={editForm.data.nip_nim}
                                        onChange={(e) => editForm.setData('nip_nim', e.target.value)}
                                        className="h-8 text-xs font-mono"
                                    />
                                    {editForm.errors.nip_nim && (
                                        <p className="text-destructive text-[11px]">{editForm.errors.nip_nim}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-role" className="text-xs font-medium">
                                        Peran Sistem <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="edit-role"
                                        value={editForm.data.role}
                                        onChange={(e) => editForm.setData('role', e.target.value as any)}
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                        required
                                    >
                                        <option value="pengusul">Pengusul (Dosen / Tendik)</option>
                                        <option value="staf_keuangan">Staf Keuangan (Verifikator)</option>
                                        <option value="pimpinan">Pimpinan / Pejabat (Otorisator)</option>
                                        <option value="admin">Administrator Keuangan Pusat</option>
                                    </select>
                                    {editForm.errors.role && (
                                        <p className="text-destructive text-[11px]">{editForm.errors.role}</p>
                                    )}
                                </div>
                            </div>

                            {/* Unit Kerja */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-unit" className="text-xs font-medium">
                                    Unit Kerja / Jurusan / Fakultas
                                </Label>
                                <Input
                                    id="edit-unit"
                                    value={editForm.data.unit}
                                    onChange={(e) => editForm.setData('unit', e.target.value)}
                                    className="h-8 text-xs"
                                />
                                {editForm.errors.unit && (
                                    <p className="text-destructive text-[11px]">{editForm.errors.unit}</p>
                                )}
                            </div>

                            {/* Reset Password & Konfirmasi Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-password" className="text-xs font-medium">
                                        Ganti Kata Sandi (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="edit-password"
                                            type={showEditPassword ? 'text' : 'password'}
                                            placeholder="Kosongkan jika tidak diganti"
                                            value={editForm.data.password}
                                            onChange={(e) => editForm.setData('password', e.target.value)}
                                            className="h-8 pr-8 text-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowEditPassword(!showEditPassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer transition-colors"
                                            tabIndex={-1}
                                            title={showEditPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                        >
                                            {showEditPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                        </button>
                                    </div>
                                    {editForm.errors.password && (
                                        <p className="text-destructive text-[11px]">{editForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-password-confirmation" className="text-xs font-medium">
                                        Konfirmasi Kata Sandi Baru
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="edit-password-confirmation"
                                            type={showEditConfirmPassword ? 'text' : 'password'}
                                            placeholder="Ketik ulang kata sandi baru"
                                            value={editForm.data.password_confirmation}
                                            onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                            className="h-8 pr-8 text-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer transition-colors"
                                            tabIndex={-1}
                                            title={showEditConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                                        >
                                            {showEditConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                        </button>
                                    </div>
                                    {editForm.errors.password_confirmation && (
                                        <p className="text-destructive text-[11px]">{editForm.errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>

                            {/* Indicator if edit password is being typed */}
                            {editForm.data.password && (
                                <div className="text-[11px]">
                                    {editForm.data.password_confirmation ? (
                                        editForm.data.password === editForm.data.password_confirmation ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                                                <Check className="size-3" /> Kata sandi cocok
                                            </span>
                                        ) : (
                                            <span className="text-destructive flex items-center gap-1">
                                                <AlertTriangle className="size-3" /> Konfirmasi kata sandi belum sama
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-muted-foreground">Silakan ketik ulang kata sandi baru di bidang konfirmasi.</span>
                                    )}
                                </div>
                            )}

                            <p className="text-[11px] text-muted-foreground">
                                Kosongkan kedua bidang kata sandi jika tidak ingin memperbarui kata sandi pengguna.
                            </p>
                        </div>

                        <DialogFooter className="gap-2 border-t pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                size="sm"
                                className="h-8 gap-1 text-xs shadow-xs"
                            >
                                {editForm.processing ? 'Menyimpan...' : 'Perbarui Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md rounded-xl">
                    <DialogHeader className="border-b pb-3">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="size-5" />
                            <DialogTitle className="text-base font-semibold tracking-tight">Hapus Akun Pengguna</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground text-xs pt-1">
                            Tindakan ini tidak dapat dibatalkan. Menghapus akun akan mencabut seluruh akses login pengguna ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {userToDelete && (
                            <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1.5">
                                <p className="text-xs text-foreground font-semibold">{userToDelete.name}</p>
                                <p className="text-[11px] text-muted-foreground">{userToDelete.email}</p>
                                <div className="flex items-center gap-2 pt-1 text-[11px]">
                                    <span className="text-muted-foreground">Peran:</span>
                                    {getRoleBadge(userToDelete.role)}
                                </div>
                                {userToDelete.dokumen_pengajuans_count ? (
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1 font-medium">
                                        ⚠️ Pengguna ini memiliki {userToDelete.dokumen_pengajuans_count} usulan dokumen pengajuan.
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 border-t pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8 text-xs shadow-xs"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Pengguna'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
