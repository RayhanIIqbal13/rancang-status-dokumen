import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

interface DatePickerInputProps {
    id?: string;
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const MONTH_NAMES = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}

function formatDateToIso(year: number, month: number, day: number): string {
    return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

export function formatIndonesianDate(isoString?: string): string {
    if (!isoString) return '';
    try {
        const parts = isoString.split('-');
        if (parts.length !== 3) return isoString;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);

        if (isNaN(date.getTime())) return isoString;

        const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
        const monthName = MONTH_NAMES[month];

        return `${dayName}, ${day} ${monthName} ${year}`;
    } catch {
        return isoString;
    }
}

export function DatePickerInput({
    id,
    value = '',
    onChange,
    min,
    max,
    required = false,
    disabled = false,
    className,
}: DatePickerInputProps) {
    const inputId = id || useId();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Parse initial date or default to current date
    const initialDate = (() => {
        if (value) {
            const parts = value.split('-');
            if (parts.length === 3) {
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                const d = parseInt(parts[2], 10);
                const date = new Date(y, m, d);
                if (!isNaN(date.getTime())) return date;
            }
        }
        return new Date();
    })();

    const [viewYear, setViewYear] = useState(initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

    // Synchronize calendar view when value changes from outside
    useEffect(() => {
        if (value) {
            const parts = value.split('-');
            if (parts.length === 3) {
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                if (!isNaN(y) && !isNaN(m) && m >= 0 && m <= 11) {
                    setViewYear(y);
                    setViewMonth(m);
                }
            }
        }
    }, [value]);

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((prev) => prev - 1);
        } else {
            setViewMonth((prev) => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((prev) => prev + 1);
        } else {
            setViewMonth((prev) => prev + 1);
        }
    };

    const handleSelectDay = (year: number, month: number, day: number) => {
        const iso = formatDateToIso(year, month, day);
        onChange(iso);
        setIsOpen(false);
    };

    const handleQuickSelect = (daysFromToday: number) => {
        const target = new Date();
        target.setDate(target.getDate() + daysFromToday);
        const iso = formatDateToIso(target.getFullYear(), target.getMonth(), target.getDate());
        onChange(iso);
        setViewYear(target.getFullYear());
        setViewMonth(target.getMonth());
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange('');
        setIsOpen(false);
    };

    const handleOpenNativePicker = () => {
        if (dateInputRef.current) {
            try {
                if (typeof dateInputRef.current.showPicker === 'function') {
                    dateInputRef.current.showPicker();
                } else {
                    dateInputRef.current.focus();
                }
            } catch {
                dateInputRef.current.focus();
            }
        }
    };

    // Calculate calendar days
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const todayIso = (() => {
        const now = new Date();
        return formatDateToIso(now.getFullYear(), now.getMonth(), now.getDate());
    })();

    // Generate year range for quick dropdown
    const currentYear = new Date().getFullYear();
    const yearOptions: number[] = [];
    for (let y = currentYear - 2; y <= currentYear + 8; y++) {
        yearOptions.push(y);
    }

    return (
        <div className={cn('relative space-y-1.5', className)}>
            <div className="flex items-center gap-2">
                {/* Segmented Native Input with "/" separator (DD/MM/YYYY) */}
                <div className="relative flex-1">
                    <Input
                        ref={dateInputRef}
                        id={inputId}
                        type="date"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        required={required}
                        disabled={disabled}
                        className="h-8 text-xs font-mono dark:[color-scheme:dark] [color-scheme:light] pr-8"
                    />

                    {/* Reset button inside input */}
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-muted-foreground hover:text-foreground absolute right-8 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded transition-colors"
                            title="Kosongkan tanggal"
                        >
                            <X className="size-3" />
                        </button>
                    )}
                </div>

                {/* Visual Popover Calendar Trigger Button */}
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={disabled}
                            className="h-8 px-2.5 text-xs gap-1.5 shrink-0 bg-card hover:bg-muted font-medium border-border shadow-2xs"
                            title="Buka Kalender Pemilih Tanggal"
                        >
                            <CalendarIcon className="size-3.5 text-primary" />
                            <span>Pilih Kalender</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-[300px] p-3 shadow-xl border bg-card text-card-foreground">
                        {/* Month / Year Header */}
                        <div className="flex items-center justify-between pb-2 border-b">
                            <div className="flex items-center gap-1">
                                <select
                                    value={viewMonth}
                                    onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                                    className="bg-background text-foreground border rounded px-1.5 py-0.5 text-xs font-medium focus:outline-hidden"
                                >
                                    {MONTH_NAMES.map((name, idx) => (
                                        <option key={name} value={idx}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={viewYear}
                                    onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                                    className="bg-background text-foreground border rounded px-1.5 py-0.5 text-xs font-medium focus:outline-hidden"
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevMonth}
                                    className="h-6 w-6 p-0"
                                    title="Bulan sebelumnya"
                                >
                                    <ChevronLeft className="size-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextMonth}
                                    className="h-6 w-6 p-0"
                                    title="Bulan berikutnya"
                                >
                                    <ChevronRight className="size-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Weekday Labels */}
                        <div className="grid grid-cols-7 pt-2 text-center text-[10px] font-semibold text-muted-foreground">
                            {DAY_NAMES.map((day, idx) => (
                                <div key={day} className={idx === 0 ? 'text-destructive' : ''}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1 pt-1.5 text-center">
                            {/* Prev month trailing days */}
                            {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
                                const dayNum = daysInPrevMonth - firstDayOfMonth + idx + 1;
                                const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
                                const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
                                return (
                                    <button
                                        type="button"
                                        key={`prev-${idx}`}
                                        onClick={() => handleSelectDay(prevYear, prevMonthIdx, dayNum)}
                                        className="h-7 w-full rounded-md text-[11px] text-muted-foreground/40 hover:bg-muted transition-colors"
                                    >
                                        {dayNum}
                                    </button>
                                );
                            })}

                            {/* Current month days */}
                            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                                const dayNum = idx + 1;
                                const dateIso = formatDateToIso(viewYear, viewMonth, dayNum);
                                const isSelected = value === dateIso;
                                const isToday = todayIso === dateIso;
                                const isSunday = new Date(viewYear, viewMonth, dayNum).getDay() === 0;

                                return (
                                    <button
                                        type="button"
                                        key={`curr-${dayNum}`}
                                        onClick={() => handleSelectDay(viewYear, viewMonth, dayNum)}
                                        className={cn(
                                            'h-7 w-full rounded-md text-xs font-medium transition-all relative',
                                            isSelected && 'bg-primary text-primary-foreground font-bold shadow-xs',
                                            !isSelected && isToday && 'ring-1 ring-primary/60 font-semibold text-primary',
                                            !isSelected && !isToday && isSunday && 'text-destructive hover:bg-destructive/10',
                                            !isSelected && !isToday && !isSunday && 'hover:bg-muted text-foreground'
                                        )}
                                    >
                                        {dayNum}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Action Shortcuts */}
                        <div className="mt-3 pt-2.5 border-t space-y-2">
                            <div className="flex flex-wrap items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickSelect(0)}
                                    className="h-6 px-2 text-[10px]"
                                >
                                    Hari ini
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickSelect(7)}
                                    className="h-6 px-2 text-[10px]"
                                >
                                    +7 Hari
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickSelect(14)}
                                    className="h-6 px-2 text-[10px]"
                                >
                                    +14 Hari
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickSelect(30)}
                                    className="h-6 px-2 text-[10px]"
                                >
                                    +30 Hari
                                </Button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] pt-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleOpenNativePicker}
                                    className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-primary"
                                    title="Buka kalender popup bawaan peramban"
                                >
                                    Kalender Pop-up Browser
                                </Button>
                                {value && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClear}
                                        className="h-5 px-1.5 text-[10px] text-destructive hover:bg-destructive/10"
                                    >
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Helper preview display */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                {value ? (
                    <span className="text-primary font-medium flex items-center gap-1">
                        <Check className="size-3" />
                        {formatIndonesianDate(value)}
                    </span>
                ) : (
                    <span className="text-muted-foreground text-[10.5px]">
                        Format: <code>HH/BB/TTTT</code> (langsung ketik angka dengan pemisah <code>/</code>) atau klik <strong>Pilih Kalender</strong>.
                    </span>
                )}
            </div>
        </div>
    );
}
