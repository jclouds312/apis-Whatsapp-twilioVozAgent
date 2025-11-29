'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format, parseISO } from 'date-fns';

type AreaChartComponentProps = {
  data: any[];
  dataKey: string;
  dataKey2?: string;
  xAxisKey: string;
};

const chartConfig = {
  data1: {
    label: 'Data 1',
    color: 'hsl(var(--chart-1))',
  },
  data2: {
    label: 'Data 2',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


export function AreaChartComponent({ data, dataKey, dataKey2, xAxisKey }: AreaChartComponentProps) {
  
  chartConfig.data1.label = dataKey;
  if(dataKey2) {
    chartConfig.data2.label = dataKey2;
  }
  
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
                    if (typeof value === 'string') {
                       try {
                         return format(parseISO(value), 'HH:mm:ss');
                       } catch {
                         return '';
                       }
                    }
                    return '';
                }}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <Tooltip 
              content={<ChartTooltipContent indicator="dot" />} 
              cursor={true}
            />
             <defs>
                <linearGradient id="fillData1" x1="0" y1="0" x2="0" y2="1">
                <stop
                    offset="5%"
                    stopColor="var(--color-data1)"
                    stopOpacity={0.8}
                />
                <stop
                    offset="95%"
                    stopColor="var(--color-data1)"
                    stopOpacity={0.1}
                />
                </linearGradient>
                {dataKey2 && (
                    <linearGradient id="fillData2" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-data2)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-data2)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                )}
            </defs>
            <Area
                dataKey={dataKey}
                type="natural"
                fill="url(#fillData1)"
                stroke="var(--color-data1)"
                stackId="a"
                dot={false}
            />
            {dataKey2 && (
                <Area
                    dataKey={dataKey2}
                    type="natural"
                    fill="url(#fillData2)"
                    stroke="var(--color-data2)"
                    stackId="b"
                    dot={false}
                />
            )}
             <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
    </ChartContainer>
  );
}
