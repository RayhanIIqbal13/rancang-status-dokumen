import { ProposalPreviewModal } from '@/components/dokumen/proposal-preview-modal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentStatusType, DokumenPengajuan, StatusStageInfo, User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Eye, FileText, FileUp, RefreshCw, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatusUpdateDialogProps {
    document: DokumenPengajuan;
    stages: StatusStageInfo[];
    triggerButton?: React.ReactNode;
}

export function StatusUpdateDialog({ document, stages, triggerButton }: StatusUpdateDialogProps) {
    const [open, setOpen] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentUser = auth.user;

    const isApplicant = currentUser.role === 'pengusul';
    const isRevision = document.status_terkini === 'Perlu Revisi';

    // Determine default target stage based on current status and user role
    const getInitialStage = (): DocumentStatusType => {
        if (isApplicant && isRevision) {
            return 'Verifikasi Fakultas';
        }

        switch (document.status_terkini) {
            case 'Diajukan':
                return 'Verifikasi Fakultas';
            case 'Verifikasi Fakultas':
                return 'Menunggu SK / Penetapan Universitas';
            case 'Perlu Revisi':
                return 'Verifikasi Fakultas';
            case 'Menunggu SK / Penetapan Universitas':
                return 'Disetujui, Kegiatan Berjalan';
            case 'Disetujui, Kegiatan Berjalan':
                return 'SPJ Diterima & Diverifikasi';
            case 'SPJ Diterima & Diverifikasi':
                return 'Diproses di SAKTI';
            case 'Diproses di SAKTI':
                return 'Dana Cair';
            default:
                return 'Verifikasi Fakultas';
        }
    };

    const initialStage = getInitialStage();
    const stageMeta = stages.find((s) => s.value === initialStage);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        tahap: initialStage,
        posisi_berkas: stageMeta?.default_posisi || document.latest_status_tracking?.posisi_berkas || '',
        catatan: '',
        file_proposal: null as File | null,
    });

    // Update suggested default document position when stage changes
    const handleStageChange = (newStage: DocumentStatusType) => {
        const found = stages.find((s) => s.value === newStage);
        setData((prev) => ({
            ...prev,
            tahap: newStage,
            posisi_berkas: found?.default_posisi || prev.posisi_berkas,
        }));
    };

    // Filter which stages are selectable based on role
    const selectableStages = stages.filter((stage) => {
        if (currentUser.role === 'admin') return true;

        if (currentUser.role === 'staf_keuangan') {
            return [
                'Verifikasi Fakultas',
                'Perlu Revisi',
                'Menunggu SK / Penetapan Universitas',
                'Disetujui, Kegiatan Berjalan',
                'SPJ Diterima & Diverifikasi',
                'Diproses di SAKTI',
                'Dana Cair',
            ].includes(stage.value);
        }

        if (currentUser.role === 'pimpinan') {
            return ['Disetujui, Kegiatan Berjalan', 'Menunggu SK / Penetapan Universitas'].includes(stage.value);
        }

        if (currentUser.role === 'pengusul' && isRevision) {
            // Applicant submitting revision
            return stage.value === 'Verifikasi Fakultas';
        }

        return false;
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dokumen-pengajuan.status.store', document.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset('catatan', 'file_proposal');
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('dokumen-pengajuan.destroy', document.id), {
            onBefore: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setDeleteConfirmOpen(false);
                setOpen(false);
            },
        });
    };

    useEffect(() => {
        if (!open) {
            clearErrors();
        }
    }, [open, clearErrors]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {triggerButton ? (
                        triggerButton
                    ) : (
                        <Button size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
                            {isApplicant && isRevision ? (
                                <>
                                    <RefreshCw className="size-3.5" />
                                    <span>Kirimkan Revisi</span>
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="size-3.5" />
                                    <span>Perbarui Status</span>
                                </>
                            )}
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-xl">
                    <DialogHeader className="border-b pb-3">
                        <DialogTitle className="text-base font-semibold tracking-tight">
                            {isApplicant && isRevision ? 'Kirimkan Revisi Dokumen' : 'Perbarui Status Dokumen'}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-xs">
                            Dokumen: <strong className="text-foreground">{document.nomor_pengajuan}</strong> — {document.nama_kegiatan}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Prominent Proposal & RAB Inspection Bar for Reviewer / Tendik */}
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-primary/5 border-primary/20 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-foreground truncate">Dokumen Proposal & RAB Mahasiswa</div>
                                <div className="text-[11px] text-muted-foreground">Periksa rincian konsumsi & kesesuaian SBM</div>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setOpenPreview(true)}
                            className="h-7 text-xs gap-1.5 shrink-0 bg-background font-medium hover:bg-muted"
                        >
                            <Eye className="size-3 text-primary" />
                            <span>Lihat Berkas (PDF)</span>
                        </Button>
                    </div>

                    <form onSubmit={submit} className="space-y-4 pt-1">
                        {/* If student is submitting revision, provide file re-upload field */}
                        {isApplicant && isRevision && (
                            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
                                <Label htmlFor="file_proposal_revisi" className="text-xs font-semibold flex items-center gap-1.5">
                                    <FileUp className="size-3.5 text-primary" />
                                    <span>Unggah Berkas Proposal & RAB yang Telah Direvisi (PDF)</span>
                                </Label>
                                <input
                                    id="file_proposal_revisi"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.zip"
                                    className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer w-full"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('file_proposal', e.target.files[0]);
                                        }
                                    }}
                                />
                                {data.file_proposal && (
                                    <p className="text-[11px] text-primary font-medium mt-1">
                                        Berkas perbaikan: {data.file_proposal.name} ({(data.file_proposal.size / 1024).toFixed(0)} KB)
                                    </p>
                                )}
                                {errors.file_proposal && <p className="text-destructive text-[11px]">{errors.file_proposal}</p>}
                            </div>
                        )}
                    {/* Stage Selection */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tahap" className="text-xs font-medium">
                            Tahap / Status Alur <span className="text-destructive">*</span>
                        </Label>
                        <Select value={data.tahap} onValueChange={(val: DocumentStatusType) => handleStageChange(val)}>
                            <SelectTrigger id="tahap" className="h-8 w-full text-xs">
                                <SelectValue placeholder="Pilih status alur" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectableStages.map((stage) => (
                                    <SelectItem key={stage.value} value={stage.value} className="text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{stage.label}</span>
                                            <span className="text-muted-foreground text-[10px]">(Oleh: {stage.updated_by})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.tahap && <p className="text-destructive text-[11px]">{errors.tahap}</p>}
                        <p className="text-muted-foreground text-[11px]">{stages.find((s) => s.value === data.tahap)?.description}</p>
                    </div>

                    {/* Document Position */}
                    <div className="space-y-1.5">
                        <Label htmlFor="posisi_berkas" className="text-xs font-medium">
                            Posisi Berkas Saat Ini <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="posisi_berkas"
                            value={data.posisi_berkas}
                            onChange={(e) => setData('posisi_berkas', e.target.value)}
                            placeholder="Contoh: Subbag Keuangan Fakultas, Biro Perencanaan, PPK..."
                            className="h-8 text-xs"
                        />
                        {errors.posisi_berkas && <p className="text-destructive text-[11px]">{errors.posisi_berkas}</p>}
                        <p className="text-muted-foreground text-[11px]">Lokasi fisik atau unit kerja penanggung jawab berkas saat ini.</p>
                    </div>

                    {/* Notes / Revision Remarks */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="catatan" className="text-xs font-medium">
                                {data.tahap === 'Perlu Revisi' ? (
                                    <span className="text-destructive flex items-center gap-1 font-semibold">
                                        <AlertCircle className="size-3.5" />
                                        Catatan Revisi Dokumen *
                                    </span>
                                ) : (
                                    'Catatan / Keterangan Verifikasi'
                                )}
                            </Label>
                            {data.tahap === 'Perlu Revisi' && <span className="text-destructive text-[10px] font-medium">Wajib diisi</span>}
                        </div>
                        <textarea
                            id="catatan"
                            rows={3}
                            className={`placeholder:text-muted-foreground w-full rounded-md border bg-transparent px-3 py-2 text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-none ${
                                errors.catatan ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-ring'
                            }`}
                            placeholder={
                                data.tahap === 'Perlu Revisi'
                                    ? 'Tuliskan secara jelas poin-poin yang harus diperbaiki oleh pengusul...'
                                    : isApplicant && isRevision
                                      ? 'Jelaskan rincian revisi yang telah Anda lakukan...'
                                      : 'Tambahkan catatan verifikasi, nomor agenda, atau instruksi tindak lanjut...'
                            }
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                        />
                        {errors.catatan && <p className="text-destructive text-[11px]">{errors.catatan}</p>}
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 border-t pt-3">
                        <div>
                            {document.can_delete && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 w-full sm:w-auto font-medium"
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    disabled={processing || isDeleting}
                                    title="Hapus / Batalkan usulan pengajuan ini"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Hapus Pengajuan</span>
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setOpen(false)}
                                disabled={processing || isDeleting}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing || isDeleting} size="sm" className="h-8 gap-1.5 text-xs shadow-xs font-semibold">
                                <Send className="size-3.5" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Status Baru'}</span>
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Dedicated PDF & RAB Viewer Modal for live inspection */}
        <ProposalPreviewModal
            open={openPreview}
            onOpenChange={setOpenPreview}
            document={document}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <Trash2 className="size-6" />
                    </div>
                    <DialogTitle className="text-center text-lg font-bold">
                        Hapus Dokumen Pengajuan?
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs text-muted-foreground pt-1.5 space-y-2">
                        <span>
                            Anda akan menghapus pengajuan <strong className="text-foreground">{document.nomor_pengajuan}</strong> (<span className="text-foreground">{document.nama_kegiatan}</span>).
                        </span>
                        <span className="block text-[11px] bg-destructive/10 text-destructive p-2.5 rounded-lg border border-destructive/20 text-left mt-2">
                            <strong>Perhatian:</strong> Dokumen yang berstatus <strong>{document.status_terkini}</strong> dapat dibatalkan atau dihapus. Seluruh data usulan, riwayat tracking, dan berkas proposal PDF akan dihapus secara permanen dari sistem dan tidak dapat dipulihkan.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => setDeleteConfirmOpen(false)}
                        className="text-xs"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="text-xs font-semibold gap-1.5"
                    >
                        {isDeleting ? (
                            <span>Menghapus...</span>
                        ) : (
                            <>
                                <Trash2 className="size-3.5" />
                                <span>Ya, Hapus Pengajuan</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
