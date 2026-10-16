import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    id_user?: number;
    name: string;
    nama?: string;
    email: string;
    nip_nim?: string | null;
    role: 'pengusul' | 'staf_keuangan' | 'pimpinan' | 'admin';
    unit?: string | null;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export type DocumentStatusType =
    | 'Diajukan'
    | 'Verifikasi Fakultas'
    | 'Perlu Revisi'
    | 'Menunggu SK / Penetapan Universitas'
    | 'Disetujui, Kegiatan Berjalan'
    | 'SPJ Diterima & Diverifikasi'
    | 'Diproses di SAKTI'
    | 'Dana Cair';

export interface StatusStageInfo {
    value: DocumentStatusType;
    label: string;
    order: number;
    description: string;
    updated_by: string;
    default_posisi: string;
    color: string;
}

export interface StandarBiaya {
    id: number;
    id_sbm: number;
    kategori: string;
    uraian_belanja: string;
    satuan: string;
    batas_tarif: string | number;
    tahun: number;
    created_at?: string;
    updated_at?: string;
}

export interface BuktiPengeluaran {
    id: number;
    id_bukti: number;
    dokumen_pengajuan_id: number;
    id_dokumen: number;
    standar_biaya_id: number | null;
    id_sbm: number | null;
    jenis_bukti: string;
    nominal: string | number;
    file_digital: string | null;
    status_fisik: string;
    status_validasi_sbm: string;
    standar_biaya?: StandarBiaya | null;
    dokumen_pengajuan?: DokumenPengajuan | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface RealisasiAnggaran {
    id: number;
    id_realisasi: number;
    dokumen_pengajuan_id: number;
    id_dokumen: number;
    total_realisasi: string | number;
    tgl_pencairan: string | null;
    status_pencairan: string;
    draf_rekap_spj: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface StatusTracking {
    id: number;
    id_status: number;
    dokumen_pengajuan_id: number;
    id_dokumen: number;
    user_id: number | null;
    id_user: number | null;
    tahap: DocumentStatusType;
    posisi_berkas: string;
    catatan: string | null;
    waktu_update: string;
    updater_name: string;
    updater_role: string;
    user?: User | null;
    dokumen_pengajuan?: DokumenPengajuan | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface DokumenPengajuan {
    id: number;
    id_dokumen: number;
    user_id: number;
    id_user: number;
    nomor_pengajuan: string;
    nama_kegiatan: string;
    jenis_anggaran: string;
    uraian: string;
    tgl_pelaksanaan: string;
    total_usulan: string | number;
    file_proposal: string | null;
    status_terkini: DocumentStatusType;
    created_at: string;
    updated_at: string;
    user?: User;
    latest_status_tracking?: StatusTracking;
    status_timeline?: StatusTracking[];
    status_trackings?: StatusTracking[];
    bukti_pengeluarans?: BuktiPengeluaran[];
    realisasi_anggaran?: RealisasiAnggaran | null;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
