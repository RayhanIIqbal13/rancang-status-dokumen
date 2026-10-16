import { Link } from '@inertiajs/react';
import { addHours, endOfToday, format, parseISO, subHours } from 'date-fns';
import * as React from 'react';
import { Area, CartesianGrid, ComposedChart, XAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// 180 continuous real-data points replicating next-shadcn-admin-dashboard
const chartValues = [
    { usulanMasuk: 23840, verifikasiSk: 6630, pencairanSakti: 4880 },
    { usulanMasuk: 11508, verifikasiSk: 6468, pencairanSakti: 4643 },
    { usulanMasuk: 9975, verifikasiSk: 6117, pencairanSakti: 4573 },
    { usulanMasuk: 10310, verifikasiSk: 6152, pencairanSakti: 4657 },
    { usulanMasuk: 12244, verifikasiSk: 6473, pencairanSakti: 4657 },
    { usulanMasuk: 11476, verifikasiSk: 6347, pencairanSakti: 4533 },
    { usulanMasuk: 9944, verifikasiSk: 6250, pencairanSakti: 4588 },
    { usulanMasuk: 10259, verifikasiSk: 6417, pencairanSakti: 4763 },
    { usulanMasuk: 9698, verifikasiSk: 6256, pencairanSakti: 4710 },
    { usulanMasuk: 8435, verifikasiSk: 6161, pencairanSakti: 4544 },
    { usulanMasuk: 8885, verifikasiSk: 6510, pencairanSakti: 4595 },
    { usulanMasuk: 13596, verifikasiSk: 6497, pencairanSakti: 4712 },
    { usulanMasuk: 6198, verifikasiSk: 6165, pencairanSakti: 4654 },
    { usulanMasuk: 6546, verifikasiSk: 6295, pencairanSakti: 4622 },
    { usulanMasuk: 8306, verifikasiSk: 6444, pencairanSakti: 4732 },
    { usulanMasuk: 7445, verifikasiSk: 6283, pencairanSakti: 4711 },
    { usulanMasuk: 6646, verifikasiSk: 6409, pencairanSakti: 4551 },
    { usulanMasuk: 8146, verifikasiSk: 6520, pencairanSakti: 4593 },
    { usulanMasuk: 8754, verifikasiSk: 6197, pencairanSakti: 4776 },
    { usulanMasuk: 8715, verifikasiSk: 6205, pencairanSakti: 4745 },
    { usulanMasuk: 10154, verifikasiSk: 6557, pencairanSakti: 4600 },
    { usulanMasuk: 10337, verifikasiSk: 6438, pencairanSakti: 4641 },
    { usulanMasuk: 14212, verifikasiSk: 6251, pencairanSakti: 4715 },
    { usulanMasuk: 18873, verifikasiSk: 6557, pencairanSakti: 4633 },
    { usulanMasuk: 11558, verifikasiSk: 6338, pencairanSakti: 4626 },
    { usulanMasuk: 9951, verifikasiSk: 6218, pencairanSakti: 4769 },
    { usulanMasuk: 8716, verifikasiSk: 6518, pencairanSakti: 4749 },
    { usulanMasuk: 9690, verifikasiSk: 6520, pencairanSakti: 4565 },
    { usulanMasuk: 9423, verifikasiSk: 6157, pencairanSakti: 4581 },
    { usulanMasuk: 8563, verifikasiSk: 6268, pencairanSakti: 4839 },
    { usulanMasuk: 9255, verifikasiSk: 6489, pencairanSakti: 4730 },
    { usulanMasuk: 22106, verifikasiSk: 6317, pencairanSakti: 4619 },
    { usulanMasuk: 7765, verifikasiSk: 6346, pencairanSakti: 4670 },
    { usulanMasuk: 14487, verifikasiSk: 6470, pencairanSakti: 4708 },
    { usulanMasuk: 10830, verifikasiSk: 6194, pencairanSakti: 4589 },
    { usulanMasuk: 9486, verifikasiSk: 6172, pencairanSakti: 4584 },
    { usulanMasuk: 9200, verifikasiSk: 6529, pencairanSakti: 4754 },
    { usulanMasuk: 11020, verifikasiSk: 6417, pencairanSakti: 4751 },
    { usulanMasuk: 11085, verifikasiSk: 6153, pencairanSakti: 4565 },
    { usulanMasuk: 10372, verifikasiSk: 6317, pencairanSakti: 4558 },
    { usulanMasuk: 10936, verifikasiSk: 6323, pencairanSakti: 4692 },
    { usulanMasuk: 10196, verifikasiSk: 6436, pencairanSakti: 4665 },
    { usulanMasuk: 8744, verifikasiSk: 6407, pencairanSakti: 4589 },
    { usulanMasuk: 9592, verifikasiSk: 6429, pencairanSakti: 4670 },
    { usulanMasuk: 14952, verifikasiSk: 6061, pencairanSakti: 4691 },
    { usulanMasuk: 7242, verifikasiSk: 6150, pencairanSakti: 4532 },
    { usulanMasuk: 15297, verifikasiSk: 6568, pencairanSakti: 4511 },
    { usulanMasuk: 7844, verifikasiSk: 6248, pencairanSakti: 4870 },
    { usulanMasuk: 7336, verifikasiSk: 6181, pencairanSakti: 4708 },
    { usulanMasuk: 6548, verifikasiSk: 6322, pencairanSakti: 4542 },
    { usulanMasuk: 7496, verifikasiSk: 6112, pencairanSakti: 4530 },
    { usulanMasuk: 7529, verifikasiSk: 6059, pencairanSakti: 4625 },
    { usulanMasuk: 7369, verifikasiSk: 6401, pencairanSakti: 4570 },
    { usulanMasuk: 9434, verifikasiSk: 6303, pencairanSakti: 4514 },
    { usulanMasuk: 10387, verifikasiSk: 5984, pencairanSakti: 4633 },
    { usulanMasuk: 14173, verifikasiSk: 6146, pencairanSakti: 4660 },
    { usulanMasuk: 9635, verifikasiSk: 6239, pencairanSakti: 4478 },
    { usulanMasuk: 11690, verifikasiSk: 6070, pencairanSakti: 4431 },
    { usulanMasuk: 11148, verifikasiSk: 6221, pencairanSakti: 4688 },
    { usulanMasuk: 10205, verifikasiSk: 6270, pencairanSakti: 4626 },
    { usulanMasuk: 10773, verifikasiSk: 5926, pencairanSakti: 4494 },
    { usulanMasuk: 10134, verifikasiSk: 5995, pencairanSakti: 4500 },
    { usulanMasuk: 22444, verifikasiSk: 6315, pencairanSakti: 4566 },
    { usulanMasuk: 10213, verifikasiSk: 6134, pencairanSakti: 4472 },
    { usulanMasuk: 9788, verifikasiSk: 5983, pencairanSakti: 4416 },
    { usulanMasuk: 7646, verifikasiSk: 6146, pencairanSakti: 4566 },
    { usulanMasuk: 13396, verifikasiSk: 6020, pencairanSakti: 4615 },
    { usulanMasuk: 9889, verifikasiSk: 5938, pencairanSakti: 4434 },
    { usulanMasuk: 8999, verifikasiSk: 6246, pencairanSakti: 4370 },
    { usulanMasuk: 17176, verifikasiSk: 6314, pencairanSakti: 4508 },
    { usulanMasuk: 9602, verifikasiSk: 5827, pencairanSakti: 4527 },
    { usulanMasuk: 9663, verifikasiSk: 5992, pencairanSakti: 4428 },
    { usulanMasuk: 9542, verifikasiSk: 6167, pencairanSakti: 4471 },
    { usulanMasuk: 10921, verifikasiSk: 5981, pencairanSakti: 4530 },
    { usulanMasuk: 10557, verifikasiSk: 6051, pencairanSakti: 4398 },
    { usulanMasuk: 8774, verifikasiSk: 6138, pencairanSakti: 4326 },
    { usulanMasuk: 9607, verifikasiSk: 5843, pencairanSakti: 4489 },
    { usulanMasuk: 15883, verifikasiSk: 5891, pencairanSakti: 4563 },
    { usulanMasuk: 8805, verifikasiSk: 6235, pencairanSakti: 4404 },
    { usulanMasuk: 7551, verifikasiSk: 6065, pencairanSakti: 4342 },
    { usulanMasuk: 8177, verifikasiSk: 5847, pencairanSakti: 4449 },
    { usulanMasuk: 7534, verifikasiSk: 6037, pencairanSakti: 4440 },
    { usulanMasuk: 6902, verifikasiSk: 6264, pencairanSakti: 4360 },
    { usulanMasuk: 7832, verifikasiSk: 5895, pencairanSakti: 4446 },
    { usulanMasuk: 7311, verifikasiSk: 6155, pencairanSakti: 4520 },
    { usulanMasuk: 6245, verifikasiSk: 6119, pencairanSakti: 4369 },
    { usulanMasuk: 8128, verifikasiSk: 5772, pencairanSakti: 4274 },
    { usulanMasuk: 9848, verifikasiSk: 5936, pencairanSakti: 4518 },
    { usulanMasuk: 13995, verifikasiSk: 6184, pencairanSakti: 4515 },
    { usulanMasuk: 8963, verifikasiSk: 5986, pencairanSakti: 4390 },
    { usulanMasuk: 10872, verifikasiSk: 5976, pencairanSakti: 4353 },
    { usulanMasuk: 11036, verifikasiSk: 6106, pencairanSakti: 4440 },
    { usulanMasuk: 19721, verifikasiSk: 6023, pencairanSakti: 4393 },
    { usulanMasuk: 25079, verifikasiSk: 5905, pencairanSakti: 4310 },
    { usulanMasuk: 11054, verifikasiSk: 6252, pencairanSakti: 4611 },
    { usulanMasuk: 9769, verifikasiSk: 6101, pencairanSakti: 4534 },
    { usulanMasuk: 10977, verifikasiSk: 5835, pencairanSakti: 4386 },
    { usulanMasuk: 11193, verifikasiSk: 6048, pencairanSakti: 4276 },
    { usulanMasuk: 8766, verifikasiSk: 6109, pencairanSakti: 4408 },
    { usulanMasuk: 13370, verifikasiSk: 5970, pencairanSakti: 4485 },
    { usulanMasuk: 9279, verifikasiSk: 6168, pencairanSakti: 4390 },
    { usulanMasuk: 8581, verifikasiSk: 6176, pencairanSakti: 4395 },
    { usulanMasuk: 8002, verifikasiSk: 5852, pencairanSakti: 4484 },
    { usulanMasuk: 8811, verifikasiSk: 6005, pencairanSakti: 4401 },
    { usulanMasuk: 8261, verifikasiSk: 6306, pencairanSakti: 4298 },
    { usulanMasuk: 7857, verifikasiSk: 6100, pencairanSakti: 4434 },
    { usulanMasuk: 9836, verifikasiSk: 6013, pencairanSakti: 4564 },
    { usulanMasuk: 10372, verifikasiSk: 6187, pencairanSakti: 4438 },
    { usulanMasuk: 8604, verifikasiSk: 6043, pencairanSakti: 4334 },
    { usulanMasuk: 9027, verifikasiSk: 6029, pencairanSakti: 4439 },
    { usulanMasuk: 15778, verifikasiSk: 6355, pencairanSakti: 4486 },
    { usulanMasuk: 9732, verifikasiSk: 6230, pencairanSakti: 4404 },
    { usulanMasuk: 8909, verifikasiSk: 5932, pencairanSakti: 4454 },
    { usulanMasuk: 9279, verifikasiSk: 6160, pencairanSakti: 4564 },
    { usulanMasuk: 8207, verifikasiSk: 6302, pencairanSakti: 4462 },
    { usulanMasuk: 16222, verifikasiSk: 6269, pencairanSakti: 4333 },
    { usulanMasuk: 8695, verifikasiSk: 6251, pencairanSakti: 4550 },
    { usulanMasuk: 8282, verifikasiSk: 6307, pencairanSakti: 4601 },
    { usulanMasuk: 6307, verifikasiSk: 6020, pencairanSakti: 4506 },
    { usulanMasuk: 7191, verifikasiSk: 6149, pencairanSakti: 4427 },
    { usulanMasuk: 9014, verifikasiSk: 6475, pencairanSakti: 4518 },
    { usulanMasuk: 13671, verifikasiSk: 6264, pencairanSakti: 4525 },
    { usulanMasuk: 8484, verifikasiSk: 6106, pencairanSakti: 4432 },
    { usulanMasuk: 9909, verifikasiSk: 6576, pencairanSakti: 4514 },
    { usulanMasuk: 23158, verifikasiSk: 6252, pencairanSakti: 4654 },
    { usulanMasuk: 10314, verifikasiSk: 6190, pencairanSakti: 4554 },
    { usulanMasuk: 12158, verifikasiSk: 6470, pencairanSakti: 4409 },
    { usulanMasuk: 11810, verifikasiSk: 6376, pencairanSakti: 4512 },
    { usulanMasuk: 10126, verifikasiSk: 6062, pencairanSakti: 4640 },
    { usulanMasuk: 11137, verifikasiSk: 6289, pencairanSakti: 4566 },
    { usulanMasuk: 12120, verifikasiSk: 6494, pencairanSakti: 4528 },
    { usulanMasuk: 10293, verifikasiSk: 6283, pencairanSakti: 4624 },
    { usulanMasuk: 14431, verifikasiSk: 6321, pencairanSakti: 4593 },
    { usulanMasuk: 9549, verifikasiSk: 6423, pencairanSakti: 4472 },
    { usulanMasuk: 8487, verifikasiSk: 6186, pencairanSakti: 4563 },
    { usulanMasuk: 7935, verifikasiSk: 6272, pencairanSakti: 4730 },
    { usulanMasuk: 8825, verifikasiSk: 6598, pencairanSakti: 4648 },
    { usulanMasuk: 7814, verifikasiSk: 6386, pencairanSakti: 4505 },
    { usulanMasuk: 15233, verifikasiSk: 6306, pencairanSakti: 4583 },
    { usulanMasuk: 8133, verifikasiSk: 6403, pencairanSakti: 4676 },
    { usulanMasuk: 9451, verifikasiSk: 6413, pencairanSakti: 4604 },
    { usulanMasuk: 8181, verifikasiSk: 6294, pencairanSakti: 4786 },
    { usulanMasuk: 8262, verifikasiSk: 6508, pencairanSakti: 4725 },
    { usulanMasuk: 14874, verifikasiSk: 6452, pencairanSakti: 4673 },
    { usulanMasuk: 9428, verifikasiSk: 6139, pencairanSakti: 4520 },
    { usulanMasuk: 9471, verifikasiSk: 6348, pencairanSakti: 4687 },
    { usulanMasuk: 10439, verifikasiSk: 6594, pencairanSakti: 4771 },
    { usulanMasuk: 9282, verifikasiSk: 6348, pencairanSakti: 4712 },
    { usulanMasuk: 8014, verifikasiSk: 6303, pencairanSakti: 4592 },
    { usulanMasuk: 9456, verifikasiSk: 6451, pencairanSakti: 4658 },
    { usulanMasuk: 9750, verifikasiSk: 6270, pencairanSakti: 4707 },
    { usulanMasuk: 7623, verifikasiSk: 6301, pencairanSakti: 4614 },
    { usulanMasuk: 7441, verifikasiSk: 6602, pencairanSakti: 4641 },
    { usulanMasuk: 8613, verifikasiSk: 6402, pencairanSakti: 4792 },
    { usulanMasuk: 13354, verifikasiSk: 6136, pencairanSakti: 4740 },
    { usulanMasuk: 21487, verifikasiSk: 6389, pencairanSakti: 4564 },
    { usulanMasuk: 9481, verifikasiSk: 6465, pencairanSakti: 4616 },
    { usulanMasuk: 8932, verifikasiSk: 6287, pencairanSakti: 4772 },
    { usulanMasuk: 8855, verifikasiSk: 6427, pencairanSakti: 4727 },
    { usulanMasuk: 11234, verifikasiSk: 6417, pencairanSakti: 4642 },
    { usulanMasuk: 11850, verifikasiSk: 6123, pencairanSakti: 4717 },
    { usulanMasuk: 19042, verifikasiSk: 6441, pencairanSakti: 4728 },
    { usulanMasuk: 10788, verifikasiSk: 6571, pencairanSakti: 4599 },
    { usulanMasuk: 12062, verifikasiSk: 6301, pencairanSakti: 4630 },
    { usulanMasuk: 11104, verifikasiSk: 6442, pencairanSakti: 4805 },
    { usulanMasuk: 15697, verifikasiSk: 6375, pencairanSakti: 4769 },
    { usulanMasuk: 10622, verifikasiSk: 6259, pencairanSakti: 4593 },
    { usulanMasuk: 8993, verifikasiSk: 6227, pencairanSakti: 4621 },
    { usulanMasuk: 8066, verifikasiSk: 6490, pencairanSakti: 4741 },
    { usulanMasuk: 9249, verifikasiSk: 6317, pencairanSakti: 4690 },
    { usulanMasuk: 8439, verifikasiSk: 6027, pencairanSakti: 4640 },
    { usulanMasuk: 6207, verifikasiSk: 6287, pencairanSakti: 4742 },
    { usulanMasuk: 6868, verifikasiSk: 6422, pencairanSakti: 4734 },
    { usulanMasuk: 8206, verifikasiSk: 6190, pencairanSakti: 4568 },
    { usulanMasuk: 7467, verifikasiSk: 6256, pencairanSakti: 4673 },
    { usulanMasuk: 7595, verifikasiSk: 6306, pencairanSakti: 4764 },
    { usulanMasuk: 13895, verifikasiSk: 6050, pencairanSakti: 4749 },
    { usulanMasuk: 8293, verifikasiSk: 6186, pencairanSakti: 4595 },
    { usulanMasuk: 8744, verifikasiSk: 6464, pencairanSakti: 4615 },
    { usulanMasuk: 10727, verifikasiSk: 6189, pencairanSakti: 4693 },
];

const endDate = endOfToday();
const startDate = subHours(endDate, (chartValues.length - 1) * 12);

export interface PerformanceChartPoint {
    date: string;
    usulanMasuk: number;
    verifikasiSk: number;
    pencairanSakti: number;
    activityName?: string;
    amount?: number;
    formattedAmount?: string;
    disbursedActivity?: string;
    disbursedAmount?: number;
    formattedDisbursedAmount?: string;
    dailySubmissions?: number;
    dailyVerifications?: number;
    dailyPencairans?: number;
}

const fullChartData: PerformanceChartPoint[] = chartValues.map((point, index) => ({
    date: format(addHours(startDate, index * 12), 'yyyy-MM-dd'),
    ...point,
}));

const chartConfig = {
    pencairanSakti: {
        label: 'pencarian sakti',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

export function PerformanceOverview({ initialData }: { initialData?: PerformanceChartPoint[] }) {
    const [period, setPeriod] = React.useState('month');

    const sourceData: PerformanceChartPoint[] = initialData && initialData.length > 0 ? initialData : fullChartData;

    const chartData = React.useMemo(() => {
        if (period === 'month') {
            return sourceData.slice(-30);
        }
        if (period === 'week') {
            return sourceData.slice(-7);
        }
        return sourceData;
    }, [sourceData, period]);

    const latestDisbursedPoint = React.useMemo(() => {
        return [...chartData].reverse().find((p) => p.disbursedActivity || p.activityName);
    }, [chartData]);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle className="leading-none">Performance Overview</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Monitoring pergerakan berkas serapan belanja dan penyelesaian pencarian sakti TA 2026
                    </span>
                    <span className="@[540px]/card:hidden">Realisasi pencarian sakti TA 2026</span>
                </CardDescription>

                <CardAction className="flex flex-wrap items-center gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Period</SelectLabel>
                                <SelectItem value="month">1 month</SelectItem>
                                <SelectItem value="quarter">3 months</SelectItem>
                                <SelectItem value="week">7 days</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Badge variant="outline" className="bg-muted/40 border-border/60 h-8 gap-1.5 px-3 text-xs font-medium">
                        <span className="size-2 rounded-full bg-[var(--chart-3)]" />
                        pencarian sakti
                    </Badge>

                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href="/status-tracking">View report</Link>
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="bg-muted/40 border-border/50 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2.5 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="size-2 rounded-full bg-[var(--chart-3)]" />
                        <span className="text-foreground font-semibold">
                            pencarian sakti (Periode {period === 'month' ? '1 Bulan' : period === 'week' ? '7 Hari' : '3 Bulan'})
                        </span>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            5 Berkas Selesai
                        </span>
                    </div>

                    {latestDisbursedPoint && (
                        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5">
                            <span>Kegiatan Terakhir Selesai:</span>
                            <span
                                className="text-foreground max-w-[260px] truncate font-medium lg:max-w-md"
                                title={latestDisbursedPoint.disbursedActivity ?? latestDisbursedPoint.activityName}
                            >
                                {latestDisbursedPoint.disbursedActivity ?? latestDisbursedPoint.activityName}
                            </span>
                            <span className="ml-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                {latestDisbursedPoint.formattedDisbursedAmount ?? latestDisbursedPoint.formattedAmount}
                            </span>
                        </div>
                    )}
                </div>

                <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillCair" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-pencairanSakti)" stopOpacity={0.28} />
                                <stop offset="95%" stopColor="var(--color-pencairanSakti)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.25} strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={48}
                            tickFormatter={(value) =>
                                parseISO(value).toLocaleDateString('id-ID', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }
                        />

                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) {
                                    return null;
                                }
                                const point = payload[0]?.payload as PerformanceChartPoint;
                                const dateFormatted = point?.date ? format(parseISO(point.date), 'd MMMM yyyy') : '';
                                const actName = point?.disbursedActivity ?? point?.activityName;
                                const actAmount = point?.formattedDisbursedAmount ?? point?.formattedAmount;

                                return (
                                    <div className="border-border/80 bg-background/95 grid max-w-xs min-w-64 items-start gap-2 rounded-xl border p-3 text-xs shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
                                        <div className="border-border/60 flex items-center justify-between border-b pb-1.5 font-medium">
                                            <span className="text-foreground font-semibold">{dateFormatted}</span>
                                            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                                                pencarian sakti
                                            </span>
                                        </div>

                                        {actName && (
                                            <div className="bg-muted/40 border-border/40 space-y-1 rounded-lg border p-2">
                                                <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                                                    Dokumen Cair Terkait
                                                </div>
                                                <div className="text-foreground line-clamp-2 text-xs leading-snug font-medium">{actName}</div>
                                                {actAmount && (
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-muted-foreground text-[10px]">Nominal:</span>
                                                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {actAmount}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid gap-1.5 pt-0.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="size-2 rounded-[2px] bg-[var(--chart-3)]" />
                                                    <span className="text-muted-foreground">pencarian sakti</span>
                                                </div>
                                                <span className="text-foreground font-mono font-semibold">{point?.pencairanSakti} berkas</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

                        <Area
                            dataKey="pencairanSakti"
                            type="natural"
                            fill="url(#fillCair)"
                            stroke="var(--color-pencairanSakti)"
                            strokeWidth={2}
                            dot={false}
                            fillOpacity={1}
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
