
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, PhoneOff, Pause, Play, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { makeCall, endCall, muteCall, unmuteCall } from "@/app/dashboard/twilio/voice-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export function CallManagementWidget() {
    const [toNumber, setToNumber] = useState('');
    const [fromNumber, setFromNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const activCallsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'twilioCalls'),
            where('status', '==', 'in-progress'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user?.uid]);
    const { data: activeCalls } = useCollection(activCallsQuery);

    const handleMakeCall = async () => {
        if (!toNumber || !fromNumber) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please enter both phone numbers"
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await makeCall(toNumber, fromNumber);
            if (result.success) {
                toast({
                    title: "Call Initiated",
                    description: `Call SID: ${result.callSid}`,
                    className: 'bg-green-100 dark:bg-green-900'
                });
                setToNumber('');
            } else {
                toast({
                    variant: "destructive",
                    title: "Call Failed",
                    description: result.error
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to initiate call"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndCall = async (callSid: string) => {
        try {
            await endCall(callSid);
            toast({
                title: "Call Ended",
                description: "The call has been terminated"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to end call"
            });
        }
    };

    return (
        <div className="space-y-6">
            <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Make a Call</CardTitle>
                    <CardDescription>Initiate outbound voice calls using Twilio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="to">To Number</Label>
                            <Input
                                id="to"
                                type="tel"
                                placeholder="+1234567890"
                                value={toNumber}
                                onChange={(e) => setToNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="from">From Number (Twilio)</Label>
                            <Input
                                id="from"
                                type="tel"
                                placeholder="+1234567890"
                                value={fromNumber}
                                onChange={(e) => setFromNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleMakeCall} disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Calling...' : 'Make Call'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Active Calls</CardTitle>
                    <CardDescription>Manage ongoing voice calls</CardDescription>
                </CardHeader>
                <CardContent>
                    {activeCalls && activeCalls.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>To</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeCalls.map(call => (
                                    <TableRow key={call.id}>
                                        <TableCell className="font-mono text-sm">{call.to}</TableCell>
                                        <TableCell className="font-mono text-sm">{call.from}</TableCell>
                                        <TableCell>{call.duration || '0:00'}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                {call.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleEndCall(call.callSid)}
                                            >
                                                <PhoneOff className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Phone className="mx-auto h-12 w-12 mb-2 opacity-50" />
                            <p>No active calls</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
