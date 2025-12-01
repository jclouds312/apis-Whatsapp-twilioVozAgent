
'use client';

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { ApiLog } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { EvolutionInstanceManager } from "@/components/dashboard/whatsapp/evolution-instance-manager";
import { EvolutionChatLayout } from "@/components/dashboard/whatsapp/evolution-chat-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WhatsAppPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    // State for the chat component
    const [apiKeyForChat, setApiKeyForChat] = useState('');
    const [instanceNameForChat, setInstanceNameForChat] = useState('');
    const [chatReady, setChatReady] = useState(false);

    const logsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        const q = query(collection(firestore, "apiLogs"), where("endpoint", "in", ["WhatsApp Webhook", "/api/whatsapp", "/api/evolution"]), orderBy('timestamp', 'desc'));
        return q;
    }, [firestore, user?.uid]);
    const { data: logs, isLoading: isLoadingLogs } = useCollection<ApiLog>(logsQuery);
    
    const whatsappLogs = logs?.slice(0, 10) || [];

    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    const handleLoadChat = () => {
        if(apiKeyForChat && instanceNameForChat) {
            setChatReady(true);
        }
    };

    return (
        <>
            <Header title="WhatsApp Integration" />
            <main className="flex-1 flex flex-col p-4 lg:p-6 space-y-6">
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <EvolutionInstanceManager />
                    <Card className="lg:col-span-1 transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Recent API Activity</CardTitle>
                            <CardDescription>Live feed of proxied Evolution API events.</CardDescription>
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
                                    {isLoadingLogs && Array.from({length: 5}).map((_, i) => (
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
                                            <TableCell className="text-xs">{`Status ${log.statusCode} on ${log.endpoint}`}</TableCell>
                                        </TableRow>
                                    ))}
                                    {!isLoadingLogs && whatsappLogs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground p-4">No API logs found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="h-[800px]">
                     <Card>
                        <CardHeader>
                            <CardTitle>Live Chat</CardTitle>
                            <CardDescription>Connect to an instance to view and send messages.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!chatReady ? (
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label htmlFor="apiKeyForChat">API Key</Label>
                                        <Input id="apiKeyForChat" placeholder="Enter your API Key" value={apiKeyForChat} onChange={e => setApiKeyForChat(e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="instanceNameForChat">Instance Name</Label>
                                        <Input id="instanceNameForChat" placeholder="The name of the connected instance" value={instanceNameForChat} onChange={e => setInstanceNameForChat(e.target.value)} />
                                    </div>
                                    <Button onClick={handleLoadChat}>Load Chat</Button>
                                </div>
                            ) : (
                                 <EvolutionChatLayout apiKey={apiKeyForChat} instanceName={instanceNameForChat} />
                            )}
                        </CardContent>
                     </Card>
                </div>
            </main>
        </>
    )
}
