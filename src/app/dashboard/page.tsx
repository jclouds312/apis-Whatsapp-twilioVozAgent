
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Workflow, AlertCircle, Users, CodeXml, Circle, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, parseISO, subDays, isAfter } from "date-fns";
import { cn } from '@/lib/utils';
import type { ApiLog, Workflow as WorkflowType, ExposedApi, DashboardUser } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


const initialApiTrafficData = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setSeconds(d.getSeconds() - (14 - i) * 5);
    return {
        date: d.toISOString(),
        'API Calls': 0,
    };
});

function WelcomeCard() {
    return (
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/10 to-background">
            <CardHeader>
                <CardTitle>Welcome to APIs Manager!</CardTitle>
                <CardDescription>Your central hub for managing and orchestrating services is ready.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <p className="md:col-span-3 text-muted-foreground">
                    It looks like you're just getting started. Here are a few quick links to help you begin:
                </p>
                <Link href="/dashboard/settings" passHref>
                   <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform">
                       <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2"><CodeXml className="w-5 h-5 text-purple-500" /> API Keys</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-sm text-muted-foreground">Add your first API Key for services like WhatsApp or Twilio.</p>
                       </CardContent>
                       <CardFooter>
                           <Button variant="link" className="p-0">Go to Settings <ArrowRight className="w-4 h-4 ml-2" /></Button>
                       </CardFooter>
                   </Card>
                </Link>
                <Link href="/dashboard/whatsapp" passHref>
                     <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform">
                       <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-green-500" /> View Activity</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-sm text-muted-foreground">Once connected, your live WhatsApp & Twilio activity will appear here.</p>
                       </CardContent>
                        <CardFooter>
                           <Button variant="link" className="p-0">Explore WhatsApp <ArrowRight className="w-4 h-4 ml-2" /></Button>
                       </CardFooter>
                   </Card>
                </Link>
                 <Link href="/dashboard/users" passHref>
                     <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform">
                       <CardHeader>
                           <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Manage Users</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <p className="text-sm text-muted-foreground">Invite and manage roles for your team members.</p>
                       </CardContent>
                        <CardFooter>
                           <Button variant="link" className="p-0">Manage Users <ArrowRight className="w-4 h-4 ml-2" /></Button>
                       </CardFooter>
                   </Card>
                </Link>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
    const [apiTrafficData, setApiTrafficData] = useState(initialApiTrafficData);
    const [isClient, setIsClient] = useState(false);

    const { user } = useUser();
    const firestore = useFirestore();

    // Queries for all data
    const exposedApisQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'exposedApis');
    }, [firestore, user?.uid]);
    const { data: exposedApis, isLoading: isLoadingApis } = useCollection<ExposedApi>(exposedApisQuery);
    
    const workflowsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'workflows');
    }, [firestore, user?.uid]);
    const { data: workflows, isLoading: isLoadingWorkflows } = useCollection<WorkflowType>(workflowsQuery);

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'dashboardUsers');
    }, [firestore, user?.uid]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<DashboardUser>(usersQuery);

    const logsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(collection(firestore, 'apiLogs'), orderBy('timestamp', 'desc'), limit(100));
    }, [firestore, user?.uid]);
    const { data: logs, isLoading: isLoadingLogs } = useCollection<ApiLog>(logsQuery);
    
    // Derived stats
    const activeWorkflows = workflows?.filter(w => w.status === 'active') || [];
    const publishedApis = exposedApis?.filter(api => api.status === 'published').length || 0;
    const errorsToday = logs?.filter(l => l.level === 'error' && isAfter(parseISO(l.timestamp), subDays(new Date(), 1))).length || 0;
    const totalApiCalls = logs?.length || 0;
    const recentLogs = logs?.slice(0, 15) || [];
    
    const isNewUser = !isLoadingLogs && !isLoadingApis && !isLoadingWorkflows && (logs?.length === 0 && exposedApis?.length === 0 && workflows?.length === 0);

    useEffect(() => {
        setIsClient(true);

        if (logs && logs.length > 0) {
            const now = new Date();
            const newTrafficData = Array.from({ length: 15 }, (_, i) => {
                const intervalEnd = new Date(now.getTime() - i * 5000);
                const intervalStart = new Date(now.getTime() - (i + 1) * 5000);

                const callsInInterval = logs.filter(log => {
                    const logDate = parseISO(log.timestamp);
                    return logDate >= intervalStart && logDate < intervalEnd;
                }).length;

                return {
                    date: intervalStart.toISOString(),
                    'API Calls': callsInInterval,
                };
            }).reverse();
            setApiTrafficData(newTrafficData);
        }

    }, [logs]);

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

    const getActivityLogMessage = (log: ApiLog) => {
        if (log.endpoint === 'WhatsApp Webhook') {
            return `Webhook received from WhatsApp.`;
        }
        if (log.endpoint === '/api/whatsapp') {
            if (log.statusCode === 200) {
                return `Message sent successfully via WhatsApp API.`;
            }
            return `Failed to send message via WhatsApp API.`;
        }
        return `Request to ${log.endpoint} returned status ${log.statusCode}.`;
    }

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
             {isNewUser && <WelcomeCard />}

            <StatCard 
                title="Total API Calls"
                value={isLoadingLogs ? '...' : totalApiCalls.toLocaleString()}
                description="From all integrated services"
                Icon={Activity}
                iconColor="text-primary"
            />
            <StatCard 
                title="Active Workflows"
                value={isLoadingWorkflows ? '...' : activeWorkflows.length.toString()}
                description="Automating your business"
                Icon={Workflow}
                iconColor="text-orange-500"
            />
            <StatCard 
                title="Published APIs"
                value={isLoadingApis ? '...' : publishedApis.toString()}
                description="Exposed to other systems"
                Icon={CodeXml}
                iconColor="text-purple-500"
            />
            <StatCard 
                title="Errors (24h)"
                value={isLoadingLogs ? '...' : errorsToday.toString()}
                description={errorsToday === 0 ? "All systems operational" : "Needs attention"}
                Icon={AlertCircle}
                iconColor={errorsToday === 0 ? "text-green-500" : "text-destructive"}
            />
            <StatCard 
                title="Active Users"
                value={isLoadingUsers ? '...' : (users?.length.toString() ?? '0')}
                description="Across all roles"
                Icon={Users}
                iconColor="text-green-500"
            />
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
            <Card className="lg:col-span-1 xl:col-span-3 transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>API Traffic</CardTitle>
                    <CardDescription>Live call volume from the last minute.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <AreaChartComponent data={apiTrafficData} dataKey="API Calls" xAxisKey="date" />
                </CardContent>
            </Card>
            <Card className="lg:col-span-1 xl:col-span-2 transition-all hover:shadow-lg">
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
                            {isLoadingApis && Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-6 w-20 rounded-full inline-block" /></TableCell>
                                </TableRow>
                            ))}
                            {exposedApis?.slice(0, 4).map(api => (
                                <TableRow key={api.id}>
                                    <TableCell>
                                        <div className="font-medium">{api.name}</div>
                                        <div className="text-sm text-muted-foreground">
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
                            {!isLoadingApis && exposedApis?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground p-8">
                                        No exposed APIs yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
             <Card className="lg:col-span-3 transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Live feed from Firestore logs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {isLoadingLogs && Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                      {recentLogs?.map((log) => (
                        <div key={log.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0 pt-1">
                            {log.level === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                            {log.level === 'warn' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                            {log.level === 'info' && <Circle className="h-5 w-5 text-blue-500 fill-current" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">
                               {getActivityLogMessage(log)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                               {isClient ? formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true }) : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                       {!isLoadingLogs && recentLogs?.length === 0 && (
                            <div className="text-center text-muted-foreground p-8">
                                No recent activity.
                            </div>
                        )}
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
                            {isLoadingWorkflows && Array.from({length: 3}).map((_, i) => (
                                 <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-1/4" /></TableCell>
                                </TableRow>
                            ))}
                            {activeWorkflows.sort((a,b) => (b.lastRun?.seconds || 0) - (a.lastRun?.seconds || 0)).map(wf => (
                                <TableRow key={wf.id}>
                                    <TableCell>
                                        <div className="font-medium">{wf.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">
                                            Trigger: {wf.trigger.event}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{isClient && wf.lastRun?.seconds ? formatDistanceToNow(new Date(wf.lastRun.seconds * 1000), { addSuffix: true }) : 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                             {!isLoadingWorkflows && activeWorkflows?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground p-8">
                                        No active workflows.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}

    