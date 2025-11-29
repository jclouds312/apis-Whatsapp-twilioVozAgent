
'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, TrendingUp, Workflow as WorkflowIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { ApiKey, Log, Workflow } from '@/lib/types';
import { useLogs } from '@/context/LogContext';

export default function CrmPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { logs } = useLogs();

    const apiKeysQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'apiKeys');
    }, [firestore, user?.uid]);
    const { data: apiKeys } = useCollection<ApiKey>(apiKeysQuery);

    const workflowsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'workflows');
    }, [firestore, user?.uid]);
    const { data: workflows } = useCollection<Workflow>(workflowsQuery);

    const isCrmConnected = apiKeys?.some(key => key.service.toLowerCase().includes('crm') && key.status === 'active');
    const crmLogs = logs.filter(log => log.service === 'CRM Connector');
    const crmWorkflows = workflows?.filter(wf => 
        wf.trigger.service === 'CRM' || wf.steps.some(step => step.description.toLowerCase().includes('crm'))
    ) || [];

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
                             {isCrmConnected ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                                <XCircle className="h-6 w-6 text-red-500" />
                            )}
                            <span className={`text-lg font-medium ${isCrmConnected ? "text-green-600" : "text-red-600"}`}>
                                {isCrmConnected ? "Connected" : "Not Connected"}
                            </span>
                        </CardContent>
                    </Card>
                     <StatCard 
                        title="New Leads (24h)"
                        value="18"
                        description="From all connected channels"
                        Icon={TrendingUp}
                        iconColor="text-blue-500"
                    />
                     <StatCard 
                        title="Contacts Synced"
                        value="1,204"
                        description="Total contacts in CRM"
                        Icon={Users}
                        iconColor="text-purple-500"
                    />
                     <StatCard 
                        title="Active CRM Workflows"
                        value={crmWorkflows.filter(wf => wf.status === 'active').length.toString()}
                        description="Automations involving CRM"
                        Icon={WorkflowIcon}
                        iconColor="text-orange-500"
                    />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                     <Card className="transition-all hover:shadow-lg">
                         <CardHeader>
                            <CardTitle>Recent CRM Activity</CardTitle>
                            <CardDescription>Live feed of CRM-related events.</CardDescription>
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
                                   {crmLogs.map(log => (
                                       <TableRow key={log.id}>
                                           <TableCell className="text-muted-foreground">{format(new Date(log.timestamp), "HH:mm:ss")}</TableCell>
                                           <TableCell>
                                                <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'warn' ? 'default' : 'secondary'} 
                                                    className={
                                                        log.level === 'error' ? 'bg-red-100 text-red-800' 
                                                        : log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                    }
                                                >
                                                    {log.level}
                                                </Badge>
                                           </TableCell>
                                           <TableCell>{log.message}</TableCell>
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
