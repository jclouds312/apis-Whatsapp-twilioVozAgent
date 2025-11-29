'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';

type AreaChartComponentProps = {
  data: any[];
  dataKey: string;
  xAxisKey: string;
};

const chartConfig = {
  calls: {
    label: 'API Calls',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export function AreaChartComponent({ data, dataKey, xAxisKey }: AreaChartComponentProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                    if (value.includes(" ")) { // It's a datetime string
                        return format(new Date(value), 'HH:mm');
                    }
                    return value.slice(5) // It's just a date
                }}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <defs>
                <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                <stop
                    offset="5%"
                    stopColor="var(--color-calls)"
                    stopOpacity={0.8}
                />
                <stop
                    offset="95%"
                    stopColor="var(--color-calls)"
                    stopOpacity={0.1}
                />
                </linearGradient>
            </defs>
            <Area
                dataKey={dataKey}
                type="natural"
                fill="url(#fillCalls)"
                stroke="var(--color-calls)"
                stackId="a"
            />
        </AreaChart>
    </ChartContainer>
  );
}
