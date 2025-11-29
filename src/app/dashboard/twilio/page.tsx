
'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { ApiKey, ApiLog } from "@/lib/types";
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
        return query(collection(firestore, 'apiLogs'), where('endpoint', '==', 'Twilio'));
    }, [firestore, user?.uid]);
    const { data: logs, isLoading: isLoadingLogs } = useCollection<ApiLog>(logsQuery);

    const isConnected = apiKeys?.some(key => key.service.toLowerCase() === 'twilio' && key.status === 'active');
    const twilioLogs = logs?.slice(0, 5) || [];

    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <>
            <Header title="Twilio Voice" />
            <main className="flex-1 grid gap-6 p-4 lg:p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-1 flex flex-col transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Twilio Connection</CardTitle>
                            <CardDescription>Manage your Twilio API credentials.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-grow">
                             <div className="flex items-center space-x-2 pt-2">
                                {isLoadingKeys ? <Skeleton className="h-6 w-6 rounded-full" /> : (
                                    <>
                                        {isConnected ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}>
                                            {isConnected ? "Connected" : "Not Connected"}
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                API Keys for Twilio are managed in the <a href="/dashboard/settings" className="text-primary underline">Settings</a> page.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 transition-all hover:shadow-lg">
                         <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Voice Activity</CardTitle>
                                <CardDescription>Last voice and SMS events from Twilio.</CardDescription>
                            </div>
                            <Phone className="h-6 w-6 text-red-500" />
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
                                   {twilioLogs.map(log => (
                                       <TableRow key={log.id}>
                                           <TableCell>{format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                                           <TableCell>
                                                <Badge variant='outline' className={cn("border", getLogLevelClass(log.level))}>
                                                    {log.level}
                                                </Badge>
                                           </TableCell>
                                           <TableCell>{`Status ${log.statusCode} on ${log.endpoint}`}</TableCell>
                                       </TableRow>
                                   ))}
                                   {!isLoadingLogs && twilioLogs.length === 0 && (
                                       <TableRow>
                                           <TableCell colSpan={3} className="text-center text-muted-foreground">No Twilio logs found.</TableCell>
                                       </TableRow>
                                   )}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
