import { Badge } from '@/components/ui/badge';
import { DocumentStatusType } from '@/types';
import { AlertTriangle, CheckCircle2, Clock, FileCheck, FileSearch, Landmark, Send, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
    status: DocumentStatusType | string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

export function StatusBadge({ status, size = 'md', showIcon = true, className = '' }: StatusBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
        lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
    };

    const iconSize = {
        sm: 'size-3',
        md: 'size-3.5',
        lg: 'size-4',
    };

    switch (status) {
        case 'Diajukan':
            return (
                <Badge
                    variant="outline"
                    className={`border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <Send className={iconSize[size]} />}
                    <span>Diajukan</span>
                </Badge>
            );

        case 'Verifikasi Fakultas':
            return (
                <Badge
                    variant="outline"
                    className={`border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <FileSearch className={`${iconSize[size]} animate-pulse`} />}
                    <span>Verifikasi Fakultas</span>
                </Badge>
            );

        case 'Perlu Revisi':
            return (
                <Badge
                    variant="destructive"
                    className={`border-rose-300 bg-rose-600 text-white shadow-xs hover:bg-rose-700 dark:bg-rose-600 dark:text-white ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <AlertTriangle className={iconSize[size]} />}
                    <span>Perlu Revisi</span>
                </Badge>
            );

        case 'Menunggu SK / Penetapan Universitas':
            return (
                <Badge
                    variant="outline"
                    className={`border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <Clock className={iconSize[size]} />}
                    <span>Menunggu SK Universitas</span>
                </Badge>
            );

        case 'Disetujui, Kegiatan Berjalan':
            return (
                <Badge
                    variant="outline"
                    className={`border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <Sparkles className={iconSize[size]} />}
                    <span>Disetujui, Berjalan</span>
                </Badge>
            );

        case 'SPJ Diterima & Diverifikasi':
            return (
                <Badge
                    variant="outline"
                    className={`border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300 ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <FileCheck className={iconSize[size]} />}
                    <span>SPJ Diverifikasi</span>
                </Badge>
            );

        case 'Diproses di SAKTI':
            return (
                <Badge
                    variant="outline"
                    className={`border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/60 dark:text-orange-300 ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <Landmark className={`${iconSize[size]} animate-pulse`} />}
                    <span>Diproses di SAKTI</span>
                </Badge>
            );

        case 'Dana Cair':
            return (
                <Badge
                    className={`border-teal-300 bg-teal-600 text-white shadow-xs hover:bg-teal-700 dark:bg-teal-600 dark:text-white ${sizeClasses[size]} ${className}`}
                >
                    {showIcon && <CheckCircle2 className={iconSize[size]} />}
                    <span>Dana Cair (Selesai)</span>
                </Badge>
            );

        default:
            return (
                <Badge variant="secondary" className={`${sizeClasses[size]} ${className}`}>
                    {status}
                </Badge>
            );
    }
}
