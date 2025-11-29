'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { workflows as initialWorkflows, logs as initialLogs, exposedApis, users } from "@/lib/data";
import { Activity, Workflow, AlertCircle, Users, CodeXml, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, parseISO } from "date-fns";
import { cn } from '@/lib/utils';
import type { Log, Workflow as WorkflowType } from '@/lib/types';


const initialApiTrafficData = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setSeconds(d.getSeconds() - (14 - i) * 5);
    return {
        date: d.toISOString(),
        'API Calls': 0,
    };
});

export default function DashboardPage() {
    const [apiTrafficData, setApiTrafficData] = useState(initialApiTrafficData);
    const [recentLogs, setRecentLogs] = useState<Log[]>(initialLogs.slice(0, 10));
    const [activeWorkflows, setActiveWorkflows] = useState<WorkflowType[]>(initialWorkflows.filter(w => w.status === 'active'));
    
    const topExposedApis = exposedApis.slice(0, 4);

    const [totalApiCalls, setTotalApiCalls] = useState(0);
    const [errorsToday, setErrorsToday] = useState(0);
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
        setErrorsToday(initialLogs.filter(l => l.level === 'error' && (new Date().getTime() - new Date(l.timestamp).getTime()) < 86400000).length);
        
        const interval = setInterval(() => {
            setApiTrafficData(prevData => {
                const now = new Date();
                const newCallCount = Math.floor(Math.random() * 50) + 10;
                const newEntry = {
                    date: now.toISOString(),
                    'API Calls': newCallCount,
                };
                
                const shiftedData = [...prevData.slice(1), newEntry];
                
                setTotalApiCalls(currentTotal => currentTotal + newCallCount);

                return shiftedData;
            });

            const newLog: Log = {
              id: `log_${Date.now()}`,
              timestamp: new Date().toISOString(),
              level: ['info', 'warn'][Math.floor(Math.random() * 2)] as 'info' | 'warn',
              service: ['Function Connect', 'CRM Connector', 'Twilio', 'WhatsApp', 'API Exhibition'][Math.floor(Math.random() * 5)],
              message: ['Operation successful.', 'Task may require attention.', 'Connection timed out.', 'Data processed.', 'User logged in.'][Math.floor(Math.random() * 5)],
            };
            setRecentLogs(prev => [newLog, ...prev].slice(0, 10));

            if (newLog.level === 'error') {
                setErrorsToday(prev => prev + 1);
            }

             if (Math.random() > 0.8) { 
                setActiveWorkflows(prev => {
                    const randomIndex = Math.floor(Math.random() * prev.length);
                    const updatedWf = { ...prev[randomIndex], lastRun: new Date().toISOString() };
                    return [...prev.slice(0, randomIndex), updatedWf, ...prev.slice(randomIndex + 1)];
                })
             }


        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    const publishedApis = exposedApis.filter(api => api.status === 'published').length;

    const getStatusClass = (status: 'published' | 'draft' | 'deprecated') => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/50';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/50';
            case 'deprecated': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-500/50';
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
                iconColor="text-primary"
            />
            <StatCard 
                title="Active Workflows"
                value={activeWorkflows.length.toString()}
                description="Automating your business"
                Icon={Workflow}
                iconColor="text-orange-500"
            />
            <StatCard 
                title="Published APIs"
                value={publishedApis.toString()}
                description="Exposed to the world"
                Icon={CodeXml}
                iconColor="text-purple-500"
            />
            <StatCard 
                title="Errors (24h)"
                value={errorsToday.toString()}
                description={errorsToday === 0 ? "All systems operational" : "Needs attention"}
                Icon={AlertCircle}
                iconColor={errorsToday === 0 ? "text-green-500" : "text-destructive"}
            />
            <StatCard 
                title="Active Users"
                value={users.length.toString()}
                description="Across all roles"
                Icon={Users}
                iconColor="text-green-500"
            />
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3 transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>API Traffic</CardTitle>
                    <CardDescription>Live connection showing API call volume over time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AreaChartComponent data={apiTrafficData} dataKey="API Calls" xAxisKey="date" />
                </CardContent>
            </Card>
            <Card className="lg:col-span-2 transition-all hover:shadow-lg">
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
                            {topExposedApis.map(api => (
                                <TableRow key={api.id}>
                                    <TableCell>
                                        <div className="font-medium">{api.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">
                                            <Badge variant="outline" className={cn("font-mono text-xs", getMethodClass(api.method))}>{api.method}</Badge>
                                            <span className="ml-2 font-mono text-muted-foreground text-xs">{api.endpoint}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={cn("text-xs font-semibold", getStatusClass(api.status))}>
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
             <Card className="lg:col-span-3 transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Live feed from all services.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {recentLogs.map((log) => (
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
                               {isClient ? formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true }) : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2 transition-all hover:shadow-lg">
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
                            {activeWorkflows.sort((a,b) => new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime()).map(wf => (
                                <TableRow key={wf.id}>
                                    <TableCell>
                                        <div className="font-medium">{wf.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">
                                            Trigger: {wf.trigger.event}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{isClient ? formatDistanceToNow(parseISO(wf.lastRun), { addSuffix: true }) : ''}</TableCell>
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
