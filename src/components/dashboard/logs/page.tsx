
'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import type { ApiLog } from "@/lib/types";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


export default function LogsPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    
    const logsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'apiLogs'), orderBy('timestamp', 'desc'));
    }, [firestore]);

    const { data: logs, isLoading } = useCollection<ApiLog>(logsQuery);

    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200';
            case 'error': return 'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/20';
        }
    }
    return (
        <>
            <Header title="Logs & Audit Trail" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>System Logs</CardTitle>
                        <CardDescription>A comprehensive trail of all events and activities from Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                    </TableRow>
                                ))}
                                {logs?.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">
                                            {format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border", getLogLevelClass(log.level))}>
                                                {log.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{log.endpoint}</TableCell>
                                        <TableCell>{`Status: ${log.statusCode}, Request: ${log.requestBody.substring(0,50)}... Response: ${log.responseBody.substring(0,50)}...`}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
