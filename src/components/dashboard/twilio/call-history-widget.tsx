
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function CallHistoryWidget() {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();
    const firestore = useFirestore();

    const callHistoryQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'twilioCalls'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
    }, [firestore, user?.uid]);
    const { data: calls, isLoading } = useCollection(callHistoryQuery);

    const filteredCalls = calls?.filter(call => 
        call.to?.includes(searchTerm) || 
        call.from?.includes(searchTerm) ||
        call.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader>
                <CardTitle>Complete Call History</CardTitle>
                <CardDescription>View and search all call records</CardDescription>
                <Input
                    placeholder="Search by phone number or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2"
                />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({length: 5}).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : filteredCalls && filteredCalls.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Direction</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCalls.map(call => (
                                <TableRow key={call.id}>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            {format(call.createdAt.toDate(), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {call.direction === 'outbound' ? (
                                            <ArrowUpRight className="h-5 w-5 text-blue-500" />
                                        ) : (
                                            <ArrowDownLeft className="h-5 w-5 text-green-500" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{call.from}</TableCell>
                                    <TableCell className="font-mono text-sm">{call.to}</TableCell>
                                    <TableCell>{call.duration || '0:00'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(call.status)}>
                                            {call.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">${(call.cost || 0).toFixed(4)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Phone className="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No call history found</p>
                        <p className="text-sm">Your call records will appear here</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
