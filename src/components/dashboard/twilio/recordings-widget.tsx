
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, Trash2, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function RecordingsWidget() {
    const { user } = useUser();
    const firestore = useFirestore();

    const recordingsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'twilioRecordings'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user?.uid]);
    const { data: recordings, isLoading } = useCollection(recordingsQuery);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader>
                <CardTitle>Call Recordings</CardTitle>
                <CardDescription>Access and manage your voice call recordings</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({length: 5}).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : recordings && recordings.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Call SID</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recordings.map(recording => (
                                <TableRow key={recording.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {format(recording.createdAt.toDate(), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{recording.callSid?.substring(0, 20)}...</TableCell>
                                    <TableCell>{formatDuration(recording.duration || 0)}</TableCell>
                                    <TableCell>{((recording.size || 0) / 1024).toFixed(1)} KB</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {recording.status || 'completed'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Play className="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No recordings found</p>
                        <p className="text-sm">Call recordings will appear here when available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
