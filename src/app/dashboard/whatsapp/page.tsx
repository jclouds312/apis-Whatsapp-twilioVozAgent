'use client';

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { ChatLayout } from "@/components/dashboard/whatsapp/chat-layout";
import { conversations, userAvatar, apiKeys } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { CheckCircle, Circle, MessageSquare, Send, Workflow, XCircle } from "lucide-react";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { useLogs } from "@/context/LogContext";
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
    const { logs } = useLogs();
    const [messageTraffic, setMessageTraffic] = useState(initialMessageTraffic);
    
    const isWhatsAppConnected = apiKeys.some(key => key.service === 'WhatsApp Business' && key.status === 'active');
    const whatsappLogs = logs.filter(log => log.service === 'WhatsApp').slice(0, 5);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageTraffic(prevData => {
                const now = new Date();
                const newSent = Math.floor(Math.random() * 15);
                const newReceived = Math.floor(Math.random() * 10);
                const newEntry = {
                    date: now.toISOString(),
                    'Sent': newSent,
                    'Received': newReceived,
                };
                
                return [...prevData.slice(1), newEntry];
            });
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

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
                             {isWhatsAppConnected ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${isWhatsAppConnected ? "text-green-600" : "text-red-600"}`}>
                                {isWhatsAppConnected ? "Connected" : "Not Connected"}
                            </div>
                            <p className="text-xs text-muted-foreground">WhatsApp Business API status</p>
                        </CardContent>
                    </Card>
                     <StatCard 
                        title="Messages (24h)"
                        value="3,204"
                        description="Sent & Received"
                        Icon={MessageSquare}
                        iconColor="text-green-500"
                    />
                     <StatCard 
                        title="Active Conversations"
                        value={conversations.length.toString()}
                        description="Live chats with contacts"
                        Icon={Send}
                        iconColor="text-blue-500"
                    />
                     <StatCard 
                        title="Related Workflows"
                        value="2"
                        description="Automations using WhatsApp"
                        Icon={Workflow}
                        iconColor="text-purple-500"
                    />
                </div>

                <div className="p-4 lg:p-6 pt-0 grid gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3 transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Message Traffic</CardTitle>
                            <CardDescription>Live volume of sent vs. received messages.</CardDescription>
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
                            <CardDescription>Live feed of API events.</CardDescription>
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
                                    {whatsappLogs.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{format(parseISO(log.timestamp), 'HH:mm:ss')}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("text-xs", getLogLevelClass(log.level))}>
                                                    {log.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs">{log.message}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex-1 px-4 lg:px-6 pb-6">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>WhatsApp Live Chat</CardTitle>
                            <CardDescription>Engage directly with your contacts.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-4rem)] p-0">
                             <ChatLayout
                                defaultLayout={[320, 1080]}
                                navCollapsedSize={8}
                                conversations={conversations}
                                currentUserAvatar={userAvatar}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
