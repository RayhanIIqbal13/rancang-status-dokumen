import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FlashBanner() {
    const { flash } = usePage<SharedData>().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const isError = Boolean(flash?.error);

    return (
        <div
            className={`animate-in slide-in-from-top-2 fixed top-14 right-4 z-50 flex max-w-md items-center gap-2.5 rounded-xl border px-4 py-3 text-xs shadow-xl backdrop-blur-md transition-all ${
                isError
                    ? 'border-rose-500/30 bg-rose-50/95 text-rose-950 dark:border-rose-500/30 dark:bg-rose-950/90 dark:text-rose-100'
                    : 'border-emerald-500/30 bg-emerald-50/95 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/90 dark:text-emerald-100'
            }`}
        >
            {isError ? (
                <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
            ) : (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="flex-1 font-medium">{flash?.success || flash?.error}</span>
            <button
                type="button"
                onClick={() => setVisible(false)}
                className={`rounded p-0.5 transition-colors ${
                    isError
                        ? 'text-rose-700 hover:text-rose-900 dark:text-rose-300 dark:hover:text-rose-100'
                        : 'text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100'
                }`}
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
}
