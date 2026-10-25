import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

interface TableProps extends React.ComponentProps<'table'> {
    containerClassName?: string;
    dragToScroll?: boolean;
    showScrollHint?: boolean;
    scrollHintText?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    (
        {
            className,
            containerClassName,
            dragToScroll = true,
            showScrollHint = true,
            scrollHintText = 'Tabel dapat digeser horizontal',
            ...props
        },
        ref
    ) => {
        const containerRef = React.useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = React.useState(false);
        const [canScrollLeft, setCanScrollLeft] = React.useState(false);
        const [canScrollRight, setCanScrollRight] = React.useState(false);
        const [isScrollable, setIsScrollable] = React.useState(false);

        const isMouseDown = React.useRef(false);
        const startX = React.useRef(0);
        const scrollStart = React.useRef(0);
        const hasMoved = React.useRef(false);

        const checkScroll = React.useCallback(() => {
            const el = containerRef.current;
            if (!el) return;
            const sl = el.scrollLeft;
            const sw = el.scrollWidth;
            const cw = el.clientWidth;
            const scrollable = sw > cw + 4;
            setIsScrollable(scrollable);
            setCanScrollLeft(sl > 6);
            setCanScrollRight(sl + cw < sw - 6);
        }, []);

        React.useEffect(() => {
            const el = containerRef.current;
            if (!el) return;
            checkScroll();

            const ro = new ResizeObserver(() => checkScroll());
            ro.observe(el);

            const handleScroll = () => checkScroll();
            el.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                ro.disconnect();
                el.removeEventListener('scroll', handleScroll);
            };
        }, [checkScroll]);

        const scrollByOffset = (direction: 'left' | 'right') => {
            const el = containerRef.current;
            if (!el) return;
            const offset = (direction === 'left' ? -1 : 1) * Math.max(240, el.clientWidth * 0.45);
            el.scrollBy({ left: offset, behavior: 'smooth' });
        };

        const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!dragToScroll) return;
            if (e.button !== 0) return;
            const target = e.target as HTMLElement;
            if (target.closest('button, a, input, select, textarea, [role="button"], [role="checkbox"], [data-no-drag]')) {
                return;
            }
            const el = containerRef.current;
            if (!el) return;

            isMouseDown.current = true;
            hasMoved.current = false;
            startX.current = e.pageX - el.offsetLeft;
            scrollStart.current = el.scrollLeft;
        };

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isMouseDown.current) return;
            const el = containerRef.current;
            if (!el) return;

            const x = e.pageX - el.offsetLeft;
            const diff = x - startX.current;
            if (Math.abs(diff) > 4) {
                if (!hasMoved.current) {
                    hasMoved.current = true;
                    setIsDragging(true);
                }
                e.preventDefault();
                el.scrollLeft = scrollStart.current - diff * 1.35;
            }
        };

        const handleMouseUp = () => {
            if (isMouseDown.current) {
                isMouseDown.current = false;
                setTimeout(() => setIsDragging(false), 50);
            }
        };

        const handleMouseLeave = () => {
            if (isMouseDown.current) {
                isMouseDown.current = false;
                setIsDragging(false);
            }
        };

        return (
            <div className={cn('group/grid-table relative w-full space-y-2', containerClassName)}>
                {/* Scroll Hint & Quick Nav Buttons when scrollable */}
                {isScrollable && showScrollHint && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground select-none px-1">
                        <div className="flex items-center gap-1.5 font-medium">
                            <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <MoveHorizontal className="size-3" />
                            </span>
                            <span className="text-foreground/80">{scrollHintText}</span>
                            <span className="hidden sm:inline text-muted-foreground/60">(klik & geser atau gunakan panah navigasi)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={!canScrollLeft}
                                onClick={() => scrollByOffset('left')}
                                className="flex size-6 items-center justify-center rounded-md border border-border/80 bg-background text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
                                title="Geser ke kiri"
                                aria-label="Geser tabel ke kiri"
                            >
                                <ChevronLeft className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                disabled={!canScrollRight}
                                onClick={() => scrollByOffset('right')}
                                className="flex size-6 items-center justify-center rounded-md border border-border/80 bg-background text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
                                title="Geser ke kanan"
                                aria-label="Geser tabel ke kanan"
                            >
                                <ChevronRight className="size-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Relative Scroll Container */}
                <div className="relative w-full rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
                    {/* Left Shadow Indicator */}
                    {canScrollLeft && (
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background/90 via-background/40 to-transparent transition-opacity"
                        />
                    )}

                    {/* Right Shadow Indicator */}
                    {canScrollRight && (
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background/90 via-background/40 to-transparent transition-opacity"
                        />
                    )}

                    {/* Draggable Scroll Area */}
                    <div
                        ref={containerRef}
                        data-slot="table-container"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                            'relative w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/25 hover:scrollbar-thumb-muted-foreground/40',
                            isScrollable && dragToScroll && (isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'),
                            isScrollable && 'touch-pan-x'
                        )}
                    >
                        <table ref={ref} data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
                    </div>
                </div>
            </div>
        );
    }
);
Table.displayName = 'Table';

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return <thead data-slot="table-header" className={cn('[&_tr]:border-b border-border/80 bg-muted/40 sticky top-0 z-10 backdrop-blur-sm', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
    return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0 divide-y divide-border/60', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-b border-border/60 transition-colors hover:bg-muted/40 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted/60',
                className
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-10 px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-muted-foreground text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0',
                className
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
    return (
        <td
            data-slot="table-cell"
            className={cn('p-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0', className)}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return (
        <caption data-slot="table-caption" className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
    );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
