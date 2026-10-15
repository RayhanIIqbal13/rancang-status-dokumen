import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DokumenPengajuan, DocumentStatusType, StatusStageInfo, User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowRight, RefreshCw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatusUpdateDialogProps {
    document: DokumenPengajuan;
    stages: StatusStageInfo[];
    triggerButton?: React.ReactNode;
}

export function StatusUpdateDialog({ document, stages, triggerButton }: StatusUpdateDialogProps) {
    const [open, setOpen] = useState(false);
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
            return [
                'Disetujui, Kegiatan Berjalan',
                'Menunggu SK / Penetapan Universitas',
            ].includes(stage.value);
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
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset('catatan');
            },
        });
    };

    useEffect(() => {
        if (!open) {
            clearErrors();
        }
    }, [open]);

    return (
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
                    <DialogDescription className="text-xs text-muted-foreground">
                        Dokumen: <strong className="text-foreground">{document.nomor_pengajuan}</strong> —{' '}
                        {document.nama_kegiatan}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 pt-2">
                    {/* Stage Selection */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tahap" className="text-xs font-medium">
                            Tahap / Status Alur <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.tahap}
                            onValueChange={(val: DocumentStatusType) => handleStageChange(val)}
                        >
                            <SelectTrigger id="tahap" className="h-8 text-xs w-full">
                                <SelectValue placeholder="Pilih status alur" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectableStages.map((stage) => (
                                    <SelectItem key={stage.value} value={stage.value} className="text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{stage.label}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                (Oleh: {stage.updated_by})
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.tahap && (
                            <p className="text-[11px] text-destructive">{errors.tahap}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            {stages.find((s) => s.value === data.tahap)?.description}
                        </p>
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
                        {errors.posisi_berkas && (
                            <p className="text-[11px] text-destructive">{errors.posisi_berkas}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            Lokasi fisik atau unit kerja penanggung jawab berkas saat ini.
                        </p>
                    </div>

                    {/* Notes / Revision Remarks */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="catatan" className="text-xs font-medium">
                                {data.tahap === 'Perlu Revisi' ? (
                                    <span className="flex items-center gap-1 text-destructive font-semibold">
                                        <AlertCircle className="size-3.5" />
                                        Catatan Revisi Dokumen *
                                    </span>
                                ) : (
                                    'Catatan / Keterangan Verifikasi'
                                )}
                            </Label>
                            {data.tahap === 'Perlu Revisi' && (
                                <span className="text-[10px] font-medium text-destructive">Wajib diisi</span>
                            )}
                        </div>
                        <textarea
                            id="catatan"
                            rows={3}
                            className={`w-full rounded-md border bg-transparent px-3 py-2 text-xs shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 ${
                                errors.catatan
                                    ? 'border-destructive focus-visible:ring-destructive'
                                    : 'border-input focus-visible:ring-ring'
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
                        {errors.catatan && (
                            <p className="text-[11px] text-destructive">{errors.catatan}</p>
                        )}
                    </div>

                    <DialogFooter className="border-t pt-3 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
                            <Send className="size-3.5" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Status Baru'}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
