'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, TrendingUp, Workflow as WorkflowIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { ApiKey, ApiLog, Workflow } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function CrmPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const apiKeysQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'apiKeys');
    }, [firestore, user?.uid]);
    const { data: apiKeys, isLoading: isLoadingKeys } = useCollection<ApiKey>(apiKeysQuery);

    const workflowsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'workflows');
    }, [firestore, user?.uid]);
    const { data: workflows, isLoading: isLoadingWorkflows } = useCollection<Workflow>(workflowsQuery);
    
    const logsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'apiLogs');
    }, [firestore]);
    const { data: logs, isLoading: isLoadingLogs } = useCollection<ApiLog>(logsQuery);

    const isCrmConnected = apiKeys?.some(key => key.service.toLowerCase().includes('crm') && key.status === 'active');
    const crmLogs = logs?.filter(log => log.endpoint.toLowerCase().includes('crm')).slice(0, 5) || [];
    const crmWorkflows = workflows?.filter(wf => 
        wf.trigger.service === 'CRM' || wf.steps.some(step => step.description.toLowerCase().includes('crm'))
    ) || [];

    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <>
            <Header title="CRM Integration" />
            <main className="flex-1 flex flex-col gap-6 p-4 lg:p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Connection Status</CardTitle>
                            <CardDescription>CRM API Key status.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center space-x-2 pt-2">
                             {isLoadingKeys ? <Skeleton className="h-6 w-6 rounded-full" /> : (
                                <>
                                    {isCrmConnected ? (
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-500" />
                                    )}
                                    <span className={`text-lg font-medium ${isCrmConnected ? "text-green-600" : "text-red-600"}`}>
                                        {isCrmConnected ? "Connected" : "Not Connected"}
                                    </span>
                                </>
                             )}
                        </CardContent>
                    </Card>
                     <StatCard 
                        title="New Leads (24h)"
                        value="18"
                        description="Placeholder from all channels"
                        Icon={TrendingUp}
                        iconColor="text-blue-500"
                    />
                     <StatCard 
                        title="Contacts Synced"
                        value="1,204"
                        description="Placeholder total in CRM"
                        Icon={Users}
                        iconColor="text-purple-500"
                    />
                     <StatCard 
                        title="Active CRM Workflows"
                        value={isLoadingWorkflows ? '...' : crmWorkflows.filter(wf => wf.status === 'active').length.toString()}
                        description="Automations involving CRM"
                        Icon={WorkflowIcon}
                        iconColor="text-orange-500"
                    />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                     <Card className="transition-all hover:shadow-lg">
                         <CardHeader>
                            <CardTitle>Recent CRM Activity</CardTitle>
                            <CardDescription>Live feed of CRM-related events from Firestore.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>Timestamp</TableHead>
                                       <TableHead>Level</TableHead>
                                       <TableHead>Message</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {isLoadingLogs && Array.from({length: 3}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                        </TableRow>
                                   ))}
                                   {crmLogs.map(log => (
                                       <TableRow key={log.id}>
                                           <TableCell className="text-muted-foreground">{format(parseISO(log.timestamp), "HH:mm:ss")}</TableCell>
                                           <TableCell>
                                                <Badge variant="outline" className={cn("border", getLogLevelClass(log.level))}>
                                                    {log.level}
                                                </Badge>
                                           </TableCell>
                                           <TableCell>{`Status ${log.statusCode} on ${log.endpoint}`}</TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                     <Card className="transition-all hover:shadow-lg">
                         <CardHeader>
                            <CardTitle>Related Workflows</CardTitle>
                            <CardDescription>Automations that interact with your CRM.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>Workflow Name</TableHead>
                                       <TableHead>Trigger</TableHead>
                                       <TableHead>Status</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {isLoadingWorkflows && Array.from({length: 2}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        </TableRow>
                                   ))}
                                   {crmWorkflows.map(wf => (
                                       <TableRow key={wf.id}>
                                           <TableCell className="font-medium">{wf.name}</TableCell>
                                           <TableCell className="text-muted-foreground">{wf.trigger.service}: {wf.trigger.event}</TableCell>
                                           <TableCell>
                                                <Badge variant={wf.status === 'active' ? 'default' : 'secondary'} 
                                                    className={wf.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : ''
                                                    }>
                                                    {wf.status}
                                                </Badge>
                                           </TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
