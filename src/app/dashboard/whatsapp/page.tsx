'use client';

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { ChatLayout } from "@/components/dashboard/whatsapp/chat-layout";
import { ApiConfigWidget } from "@/components/dashboard/whatsapp/api-config-widget";
import { QuickSendWidget } from "@/components/dashboard/whatsapp/quick-send-widget";
import { MessageStatsWidget } from "@/components/dashboard/whatsapp/message-stats-widget";
import { BusinessProfileWidget } from "@/components/dashboard/whatsapp/business-profile-widget";
import { MetaSDKManager } from "@/components/dashboard/whatsapp/meta-sdk-manager";
import { AdvancedAnalyticsWidget } from "@/components/dashboard/whatsapp/advanced-analytics-widget";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        const q = query(collection(firestore, "apiLogs"), where("endpoint", "in", ["WhatsApp Webhook", "/api/whatsapp"]), orderBy('timestamp', 'desc'));
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
                    return log.endpoint === '/api/whatsapp' && logDate >= intervalStart && logDate < intervalEnd;
                }).length;

                const receivedInInterval = logs.filter(log => {
                     const logDate = parseISO(log.timestamp);
                     return log.endpoint === 'WhatsApp Webhook' && logDate >= intervalStart && logDate < intervalEnd;
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
                     <Card className="transition-all hover:shadow-lg border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                             {isLoadingKeys ? <Skeleton className="h-5 w-5" /> : (
                                <>
                                {isWhatsAppConnected ? (
                                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                                        <XCircle className="h-5 w-5 text-white" />
                                    </div>
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

                <Tabs defaultValue="dashboard" className="p-4 lg:p-6 pt-0">
                    <TabsList className="mb-4">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="send">Send Messages</TabsTrigger>
                        <TabsTrigger value="conversations">Conversations</TabsTrigger>
                        <TabsTrigger value="settings">API Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-5">
                            <Card className="lg:col-span-3 transition-all hover:shadow-lg border-2">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        Message Traffic
                                    </CardTitle>
                                    <CardDescription>Real-time volume of sent vs. received messages from API logs.</CardDescription>
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

                        <div className="grid gap-6 lg:grid-cols-2">
                            <MessageStatsWidget />
                            <BusinessProfileWidget />
                        </div>

                        <AdvancedAnalyticsWidget />
                    </TabsContent>

                    <TabsContent value="send" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <QuickSendWidget />
                            <div className="space-y-6">
                                <ApiConfigWidget />
                                <Card className="transition-all hover:shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg">API Endpoint Reference</CardTitle>
                                        <CardDescription>Meta WhatsApp Cloud API v22.0</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                                            <p className="text-xs text-muted-foreground mb-1">Messages Endpoint</p>
                                            <code className="text-sm font-mono break-all">
                                                POST https://graph.facebook.com/v22.0/882779844920111/messages
                                            </code>
                                        </div>
                                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                                            <p className="text-xs text-muted-foreground mb-1">Required Headers</p>
                                            <code className="text-sm font-mono block">Authorization: Bearer &lt;access_token&gt;</code>
                                            <code className="text-sm font-mono block">Content-Type: application/json</code>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <p className="font-medium mb-1">Supported Message Types:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Text messages</li>
                                                <li>Template messages (hello_world, etc.)</li>
                                                <li>Image messages with captions</li>
                                                <li>Interactive button messages</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="conversations">
                        <div className="h-[700px]">
                            {isLoadingConversations && <Skeleton className="h-full w-full rounded-lg" />}
                            {!isLoadingConversations && conversations && conversations.length > 0 && (
                                <ChatLayout
                                    defaultLayout={[25, 45, 30]}
                                    navCollapsedSize={8}
                                    conversations={conversations || []}
                                    currentUserAvatar={user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'user'}/100/100`}
                                />
                            )}
                            {!isLoadingConversations && !conversations?.length && (
                                <div className="h-full w-full rounded-lg border flex items-center justify-center bg-muted">
                                    <div className="text-center">
                                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No conversations</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Conversations from WhatsApp will appear here automatically.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <ApiConfigWidget />
                            <BusinessProfileWidget />
                        </div>
                        
                        <Card className="border-2 border-primary/20">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                        </svg>
                                    </div>
                                    Meta WhatsApp SDK Manager
                                </CardTitle>
                                <CardDescription>Gestión completa de funciones avanzadas de Meta WhatsApp Cloud API</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <MetaSDKManager />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Webhook Configuration</CardTitle>
                                <CardDescription>Configure your Meta App webhook to receive WhatsApp messages</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium mb-2">Webhook URL</p>
                                        <code className="text-xs font-mono break-all p-2 rounded bg-slate-100 dark:bg-slate-900 block">
                                            https://your-repl-url.replit.app/api/whatsapp
                                        </code>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Replace with your actual Replit deployment URL
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium mb-2">Verify Token</p>
                                        <code className="text-xs font-mono p-2 rounded bg-slate-100 dark:bg-slate-900 block">
                                            Set in WHATSAPP_VERIFY_TOKEN env var
                                        </code>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Webhook Fields to Subscribe</p>
                                    <ul className="text-xs text-blue-600 dark:text-blue-400 list-disc list-inside space-y-1">
                                        <li>messages - Incoming messages from users</li>
                                        <li>message_deliveries - Delivery status updates</li>
                                        <li>message_reads - Read receipts</li>
                                        <li>messaging_postbacks - Button click callbacks</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )
}