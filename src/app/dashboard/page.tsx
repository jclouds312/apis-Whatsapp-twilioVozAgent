'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { workflows, logs, exposedApis } from "@/lib/data";
import { Activity, Workflow, AlertCircle, Users, CodeXml, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from '@/lib/utils';

const initialApiTrafficData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
        date: d.toISOString().split('T')[0],
        'API Calls': 0,
    };
});

export default function DashboardPage() {
    const [apiTrafficData, setApiTrafficData] = useState(initialApiTrafficData);
    const totalApiCalls = apiTrafficData.reduce((sum, item) => sum + item['API Calls'], 0);
    const activeWorkflows = workflows.filter(w => w.status === 'active');
    const errorsToday = logs.filter(l => l.level === 'error').length;
    const publishedApis = exposedApis.filter(api => api.status === 'published').length;

    useEffect(() => {
        const interval = setInterval(() => {
            setApiTrafficData(prevData => {
                const newData = [...prevData];
                const lastIndex = newData.length - 1;
                const newCalls = newData[lastIndex]['API Calls'] + Math.floor(Math.random() * 50) + 10;
                
                // Shift data to the left
                const shiftedData = newData.slice(1);
                const newDate = new Date();

                // To prevent date labels from being the same, we'll just add the current time to the label
                const newDateLabel = format(newDate, 'yyyy-MM-dd HH:mm:ss');

                return [
                    ...shiftedData,
                    { date: newDateLabel, 'API Calls': newCalls }
                ];

            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusClass = (status: 'published' | 'draft' | 'deprecated') => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300';
            case 'deprecated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300';
        }
    };

    const getMethodClass = (method: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
         switch (method) {
            case 'GET': return 'text-blue-600 dark:text-blue-400';
            case 'POST': return 'text-green-600 dark:text-green-400';
            case 'PUT': return 'text-orange-600 dark:text-orange-400';
            case 'DELETE': return 'text-red-600 dark:text-red-400';
        }
    }


  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard 
                title="Total API Calls (Live)"
                value={totalApiCalls.toLocaleString()}
                description="Updating in real-time"
                Icon={Activity}
            />
            <StatCard 
                title="Active Workflows"
                value={activeWorkflows.length.toString()}
                description="Automating your business"
                Icon={Workflow}
            />
            <StatCard 
                title="Published APIs"
                value={publishedApis.toString()}
                description="Exposed to the world"
                Icon={CodeXml}
            />
            <StatCard 
                title="Errors (24h)"
                value={errorsToday.toString()}
                description="Needs attention"
                Icon={AlertCircle}
            />
            <StatCard 
                title="Active Users"
                value="4"
                description="Across all roles"
                Icon={Users}
            />
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>API Traffic</CardTitle>
                    <CardDescription>Live connection showing API call volume over time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AreaChartComponent data={apiTrafficData} dataKey="API Calls" xAxisKey="date" />
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Exposed APIs</CardTitle>
                    <CardDescription>Your public and private facing APIs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>API</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exposedApis.slice(0,4).map(api => (
                                <TableRow key={api.id}>
                                    <TableCell>
                                        <div className="font-medium">{api.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">
                                            <Badge variant="outline" className={cn("font-mono text-xs", getMethodClass(api.method))}>{api.method}</Badge>
                                            <span className="ml-2 font-mono text-muted-foreground text-xs">{api.endpoint}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={cn("text-xs", getStatusClass(api.status))}>
                                            {api.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest logs from all services.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {logs.slice(0, 10).map((log) => (
                        <div key={log.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0 pt-1">
                            {log.level === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                            {log.level === 'warn' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                            {log.level === 'info' && <Circle className="h-5 w-5 text-blue-500 fill-current" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">
                              <span className="font-semibold text-primary">{log.service}:</span> {log.message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Active Workflows</CardTitle>
                    <CardDescription>A list of your currently running automations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Workflow</TableHead>
                                <TableHead className="text-right">Last Run</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeWorkflows.map(wf => (
                                <TableRow key={wf.id}>
                                    <TableCell>
                                        <div className="font-medium">{wf.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">
                                            Trigger: {wf.trigger.event}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{format(new Date(wf.lastRun), 'PP')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
