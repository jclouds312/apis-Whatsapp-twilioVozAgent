'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

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
                tickFormatter={(value) => value.slice(5)} // Format date like 07-21
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
