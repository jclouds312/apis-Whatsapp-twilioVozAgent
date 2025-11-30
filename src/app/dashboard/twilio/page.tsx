
'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Phone, PhoneCall, Mic, Users, History, Settings } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { ApiKey, ApiLog } from "@/lib/types";
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallManagementWidget } from "@/components/dashboard/twilio/call-management-widget";
import { RecordingsWidget } from "@/components/dashboard/twilio/recordings-widget";
import { VoiceUsersWidget } from "@/components/dashboard/twilio/voice-users-widget";
import { CallHistoryWidget } from "@/components/dashboard/twilio/call-history-widget";
import { TwilioConfigWidget } from "@/components/dashboard/twilio/config-widget";
import { StatCard } from "@/components/dashboard/stat-card";

export default function TwilioPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const apiKeysQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'apiKeys');
    }, [firestore, user?.uid]);
    const { data: apiKeys, isLoading: isLoadingKeys } = useCollection<ApiKey>(apiKeysQuery);

    const logsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'apiLogs'), 
            where('endpoint', 'in', ['Twilio', '/api/twilio']),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, user?.uid]);
    const { data: logs, isLoading: isLoadingLogs } = useCollection<ApiLog>(logsQuery);

    const callsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'twilioCalls'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user?.uid]);
    const { data: calls, isLoading: isLoadingCalls } = useCollection(callsQuery);

    const recordingsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'twilioRecordings'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user?.uid]);
    const { data: recordings } = useCollection(recordingsQuery);

    const isConnected = apiKeys?.some(key => key.service.toLowerCase() === 'twilio' && key.status === 'active');
    const twilioLogs = logs?.slice(0, 5) || [];
    const totalCalls = calls?.length || 0;
    const totalRecordings = recordings?.length || 0;
    const activeCalls = calls?.filter(call => call.status === 'in-progress')?.length || 0;

    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <>
            <Header title="Twilio Voice & Communications" />
            <main className="flex-1 flex flex-col">
                <div className="p-4 lg:p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                            {isLoadingKeys ? <Skeleton className="h-5 w-5" /> : (
                                <>
                                {isConnected ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                </>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isLoadingKeys ? <Skeleton className="h-8 w-3/4" /> : (
                                <div className={`text-2xl font-bold ${isConnected ? "text-green-600" : "text-red-600"}`}>
                                    {isConnected ? "Connected" : "Not Connected"}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">Twilio API status</p>
                        </CardContent>
                    </Card>

                    <StatCard 
                        title="Total Calls"
                        value={isLoadingCalls ? '...' : totalCalls.toString()}
                        description="All time call volume"
                        Icon={Phone}
                        iconColor="text-blue-500"
                    />

                    <StatCard 
                        title="Active Calls"
                        value={isLoadingCalls ? '...' : activeCalls.toString()}
                        description="Currently in progress"
                        Icon={PhoneCall}
                        iconColor="text-green-500"
                    />

                    <StatCard 
                        title="Recordings"
                        value={totalRecordings.toString()}
                        description="Stored voice recordings"
                        Icon={Mic}
                        iconColor="text-purple-500"
                    />
                </div>

                <Tabs defaultValue="calls" className="p-4 lg:p-6 pt-0">
                    <TabsList className="mb-4">
                        <TabsTrigger value="calls">
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Call Management
                        </TabsTrigger>
                        <TabsTrigger value="recordings">
                            <Mic className="h-4 w-4 mr-2" />
                            Recordings
                        </TabsTrigger>
                        <TabsTrigger value="users">
                            <Users className="h-4 w-4 mr-2" />
                            Voice Users
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            <History className="h-4 w-4 mr-2" />
                            Call History
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Configuration
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calls" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <CallManagementWidget />
                            </div>
                            <Card className="transition-all hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                                    <CardDescription>Latest Twilio API events</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Level</TableHead>
                                                <TableHead>Event</TableHead>
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
                                            {twilioLogs.map(log => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="text-xs">{format(parseISO(log.timestamp), 'HH:mm:ss')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant='outline' className={cn("text-xs", getLogLevelClass(log.level))}>
                                                            {log.level}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs">{`Status ${log.statusCode}`}</TableCell>
                                                </TableRow>
                                            ))}
                                            {!isLoadingLogs && twilioLogs.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground p-4">No logs found</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="recordings">
                        <RecordingsWidget />
                    </TabsContent>

                    <TabsContent value="users">
                        <VoiceUsersWidget />
                    </TabsContent>

                    <TabsContent value="history">
                        <CallHistoryWidget />
                    </TabsContent>

                    <TabsContent value="settings">
                        <TwilioConfigWidget />
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )
}
