import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { logs } from "@/lib/data";
import { format } from "date-fns";

export default function TwilioPage() {
    const isConnected = true; // Mock status
    const twilioLogs = logs.filter(log => log.service === 'Twilio');

    return (
        <>
            <Header title="Twilio Voice" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Twilio Connection</CardTitle>
                            <CardDescription>Manage your Twilio API credentials for Voice.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="twilio-sid">Account SID</Label>
                                <Input id="twilio-sid" defaultValue="AC1521875f599e92e8bdc38f75c97751cb" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twilio-token">Auth Token</Label>
                                <Input id="twilio-token" type="password" defaultValue="••••••••••••••••••••••••" />
                            </div>
                             <div className="flex items-center space-x-2">
                                {isConnected ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm font-medium">
                                    {isConnected ? "Connected" : "Not Connected"}
                                </span>
                            </div>
                        </CardContent>
                        <CardHeader>
                             <Button>Save Configuration</Button>
                        </CardHeader>
                    </Card>

                    <Card className="lg:col-span-2">
                         <CardHeader>
                            <CardTitle>Recent Voice Activity</CardTitle>
                             <CardDescription>Last voice and SMS events from Twilio.</CardDescription>
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
                                                <Badge variant={log.level === 'error' ? 'destructive' : 'default'} className={log.level === 'warn' ? 'bg-yellow-500' : ''}>
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
