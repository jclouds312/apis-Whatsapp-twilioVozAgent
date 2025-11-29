
'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { logs } from "@/lib/data";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TwilioPage() {
    const [isConnected, setIsConnected] = useState(false);
    const { toast } = useToast();
    const twilioLogs = logs.filter(log => log.service === 'Twilio');

    const handleConnect = () => {
        setIsConnected(true);
        toast({
            title: "Configuration Saved",
            description: "Successfully connected to Twilio.",
        })
    }

    return (
        <>
            <Header title="Twilio Voice" />
            <main className="flex-1 grid gap-6 p-4 lg:p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-1 flex flex-col transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Twilio Connection</CardTitle>
                            <CardDescription>Manage your Twilio API credentials for Voice.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-grow">
                            <div className="space-y-2">
                                <Label htmlFor="twilio-sid">Account SID</Label>
                                <Input id="twilio-sid" placeholder="AC..." defaultValue="AC1521875f599e92e8bdc38f75c97751cb" className="font-mono"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twilio-token">Auth Token</Label>
                                <Input id="twilio-token" type="password" placeholder="Your auth token" defaultValue="••••••••••••••••••••••••" className="font-mono"/>
                            </div>
                             <div className="flex items-center space-x-2 pt-2">
                                {isConnected ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}>
                                    {isConnected ? "Connected" : "Not Connected"}
                                </span>
                            </div>
                        </CardContent>
                        <CardHeader>
                             <Button onClick={handleConnect}>Save Configuration</Button>
                        </CardHeader>
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
                                   {twilioLogs.map(log => (
                                       <TableRow key={log.id}>
                                           <TableCell>{format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                                           <TableCell>
                                                <Badge variant={log.level === 'error' ? 'destructive' : 'default'} className={
                                                    log.level === 'error' ? 'bg-red-100 text-red-800' 
                                                    : log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                                }>
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
                </div>
            </main>
        </>
    )
}
