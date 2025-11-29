
'use client';

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { ChatLayout } from "@/components/dashboard/whatsapp/chat-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { CheckCircle, MessageSquare, Send, Workflow, XCircle } from "lucide-react";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Conversation, ApiKey, ApiLog } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const initialMessageTraffic = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - (14 - i) * 5); // 5 minute intervals
    return {
        date: d.toISOString(),
        'Sent': 0,
        'Received': 0,
    };
});

export default function WhatsAppPage() {
    const [messageTraffic, setMessageTraffic] = useState(initialMessageTraffic);
    const { user } = useUser();
    const firestore = useFirestore();

    const apiKeysQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'apiKeys');
    }, [firestore, user?.uid]);
    const { data: apiKeys, isLoading: isLoadingKeys } = useCollection<ApiKey>(apiKeysQuery);

    const conversationsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(collection(firestore, 'users', user.uid, 'conversations'), orderBy('lastMessageTime', 'desc'));
    }, [firestore, user?.uid]);
    const { data: conversations, isLoading: isLoadingConversations } = useCollection<Conversation>(conversationsQuery);
    
    const logsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        const q = query(collection(firestore, "apiLogs"), where("endpoint", "in", ["/api/whatsapp", "WhatsApp"]), orderBy('timestamp', 'desc'));
        return q;
    }, [firestore, user?.uid]);
    const { data: logs, isLoading: isLoadingLogs } = useCollection<ApiLog>(logsQuery);

    const workflowsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(collection(firestore, 'users', user.uid, 'workflows'), where('trigger.service', '==', 'WhatsApp'));
    }, [firestore, user?.uid]);
    const { data: workflows, isLoading: isLoadingWorkflows } = useCollection(workflowsQuery);


    const isWhatsAppConnected = apiKeys?.some(key => key.service === 'WhatsApp Business' && key.status === 'active');
    const whatsappLogs = logs?.slice(0, 5) || [];
    const totalMessages = logs?.length || 0;


    useEffect(() => {
         if (logs && logs.length > 0) {
            const now = new Date();
            const newTrafficData = Array.from({ length: 15 }, (_, i) => {
                const intervalEnd = new Date(now.getTime() - i * 60000); // 1 minute intervals
                const intervalStart = new Date(now.getTime() - (i + 1) * 60000);

                const sentInInterval = logs.filter(log => {
                    const logDate = parseISO(log.timestamp);
                    try {
                        const reqBody = JSON.parse(log.requestBody);
                        return log.level === 'info' && reqBody.type === 'text' && logDate >= intervalStart && logDate < intervalEnd;
                    } catch {
                        return false;
                    }
                }).length;

                const receivedInInterval = logs.filter(log => {
                     const logDate = parseISO(log.timestamp);
                     try {
                        const reqBody = JSON.parse(log.requestBody);
                        return log.level === 'info' && reqBody.object === 'whatsapp_business_account' && logDate >= intervalStart && logDate < intervalEnd;
                     } catch {
                        return false;
                     }
                }).length;

                return {
                    date: intervalStart.toISOString(),
                    'Sent': sentInInterval,
                    'Received': receivedInInterval,
                };
            }).reverse();
            setMessageTraffic(newTrafficData);
        }
    }, [logs]);
    
    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <>
            <Header title="WhatsApp Integration" />
            <main className="flex-1 flex flex-col">
                <div className="p-4 lg:p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                     <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                             {isLoadingKeys ? <Skeleton className="h-5 w-5" /> : (
                                <>
                                {isWhatsAppConnected ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                </>
                             )}
                        </CardHeader>
                        <CardContent>
                           {isLoadingKeys ? <Skeleton className="h-8 w-3/4" /> : (
                             <div className={`text-2xl font-bold ${isWhatsAppConnected ? "text-green-600" : "text-red-600"}`}>
                                {isWhatsAppConnected ? "Connected" : "Not Connected"}
                            </div>
                           )}
                            <p className="text-xs text-muted-foreground">WhatsApp Business API status</p>
                        </CardContent>
                    </Card>
                     <StatCard 
                        title="Messages (All Time)"
                        value={isLoadingLogs ? '...' : totalMessages.toString()}
                        description="Sent & Received via API"
                        Icon={MessageSquare}
                        iconColor="text-green-500"
                    />
                     <StatCard 
                        title="Active Conversations"
                        value={isLoadingConversations ? '...' : conversations?.length.toString() ?? '0'}
                        description="From Firestore database"
                        Icon={Send}
                        iconColor="text-blue-500"
                    />
                     <StatCard 
                        title="Related Workflows"
                        value={isLoadingWorkflows ? '...' : workflows?.length.toString() ?? '0'}
                        description="Automations using WhatsApp"
                        Icon={Workflow}
                        iconColor="text-purple-500"
                    />
                </div>

                <div className="p-4 lg:p-6 pt-0 grid gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3 transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Message Traffic</CardTitle>
                            <CardDescription>Live volume of sent vs. received messages from logs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AreaChartComponent 
                                data={messageTraffic} 
                                dataKey="Sent"
                                dataKey2="Received"
                                xAxisKey="date" 
                            />
                        </CardContent>
                    </Card>
                     <Card className="lg:col-span-2 transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Recent WhatsApp Activity</CardTitle>
                            <CardDescription>Live feed of API events from Firestore.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingLogs && Array.from({length: 3}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                        </TableRow>
                                    ))}
                                    {whatsappLogs.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{format(parseISO(log.timestamp), 'HH:mm:ss')}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("text-xs", getLogLevelClass(log.level))}>
                                                    {log.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs">{`Status ${log.statusCode}`}</TableCell>
                                        </TableRow>
                                    ))}
                                    {!isLoadingLogs && whatsappLogs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground p-4">No WhatsApp logs found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex-1 px-4 lg:px-6 pb-6 h-[700px]">
                     {isLoadingConversations && <Skeleton className="h-full w-full rounded-lg" />}
                     {!isLoadingConversations && (
                         <ChatLayout
                            defaultLayout={[25, 45, 30]}
                            navCollapsedSize={8}
                            conversations={conversations || []}
                            currentUserAvatar={user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'user'}/100/100`}
                        />
                     )}
                     {!isLoadingConversations && !conversations && (
                         <div className="h-full w-full rounded-lg border flex items-center justify-center bg-muted">
                            <p className="text-muted-foreground">No conversations found.</p>
                        </div>
                     )}
                </div>
            </main>
        </>
    )
}
