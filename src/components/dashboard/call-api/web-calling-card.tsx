
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { JsonRpcClient } from '@/lib/json-rpc-client'; // Assuming you create a similar client

export function WebCallingCard() {
    const [apiKey, setApiKey] = useState('');
    const [callerId, setCallerId] = useState('100'); // Default caller
    const [callee, setCallee] = useState('');
    const [callId, setCallId] = useState<string | null>(null);
    const [isCalling, setIsCalling] = useState(false);
    const [onHold, setOnHold] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [callStatus, setCallStatus] = useState('');
    const clientRef = useRef<JsonRpcClient | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            clientRef.current?.close();
        };
    }, []);

    const handleConnect = () => {
        if (!apiKey) {
            toast({ title: "API Key Required", description: "Please enter your Call API key.", variant: "destructive" });
            return;
        }

        const socketUrl = `/api/call-api?apiKey=${apiKey}`;
        clientRef.current = new JsonRpcClient(socketUrl, {
            onmessage: handleCallOnMessage,
            onopen: () => toast({ title: "Connected", description: "WebSocket connection established." }),
            onclose: () => toast({ title: "Disconnected", description: "WebSocket connection closed." }),
            onerror: (error) => toast({ title: "Connection Error", description: String(error), variant: "destructive" }),
        });
    };


    const handleCallStart = () => {
        if (!clientRef.current || !callee) {
            toast({ title: "Missing Information", description: "Connect with an API key and provide a callee.", variant: "destructive" });
            return;
        }
        setIsCalling(true);
        setCallStatus('Initiating call...');
        clientRef.current.call('CallStart', { caller: callerId, callee }, 
            (result) => {
                console.log('CallStart success:', result);
            },
            (error) => {
                setIsCalling(false);
                setCallStatus('Call failed');
                toast({ title: "Call Error", description: error.message, variant: "destructive" });
            }
        );
    };

    const handleCallEnd = () => {
        if (!clientRef.current || !callId) return;
        clientRef.current.call('CallEnd', { callid: callId }, () => {
            setCallId(null);
            setIsCalling(false);
            setOnHold(false);
            setCallStatus('Call ended');
        });
    };

    const handleCallHold = () => {
        if (!clientRef.current || !callId) return;
        const method = onHold ? 'CallUnhold' : 'CallHold';
        clientRef.current.call(method, { callid: callId }, () => {
            setOnHold(!onHold);
            setCallStatus(onHold ? 'Resumed' : 'On Hold');
        });
    };
    
    const handleCallOnMessage = (message: MessageEvent) => {
        const obj = JSON.parse(message.data);
        if (obj.method !== 'Event') return;

        const { event, data } = obj.params;
        setCallStatus(`Event: ${event}`);

        switch (event) {
            case 'Error':
                toast({ title: "Call Error", description: data, variant: "destructive" });
                setIsCalling(false);
                break;
            case 'CallerAnswered':
                 setCallStatus('Waiting for callee...');
                break;
            case 'TransferStart':
                setCallId(data.callid);
                setCallStatus(`Ringing ${data.callee}...`);
                break;
            case 'CalleeAnswered':
                setCallStatus('Call connected');
                break;
            case 'Ended':
                setCallId(null);
                setIsCalling(false);
                setOnHold(false);
                setCallStatus('Call has ended');
                break;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Web Calling</CardTitle>
                <CardDescription>Make and manage VoIP calls directly from your browser.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Label htmlFor="call-api-key">API Key</Label>
                        <Input id="call-api-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your Call API Key" />
                    </div>
                    <Button onClick={handleConnect} disabled={!apiKey}>Connect</Button>
                </div>

                <div className="flex items-end gap-2">
                    <div className="flex-1">
                         <Label htmlFor="callee">Callee Number</Label>
                         <Input id="callee" value={callee} onChange={(e) => setCallee(e.target.value)} placeholder="e.g., 101" />
                    </div>
                    {!isCalling ? (
                        <Button onClick={handleCallStart} disabled={!clientRef.current || !callee}>
                            <Phone className="mr-2 h-4 w-4"/> Call
                        </Button>
                    ) : (
                        <Button onClick={handleCallEnd} variant="destructive">
                            <PhoneOff className="mr-2 h-4 w-4"/> End Call
                        </Button>
                    )}
                </div>
                
                {isCalling && (
                    <div className="p-4 bg-muted rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Ongoing Call</p>
                                <p className="text-sm text-muted-foreground">{callStatus}</p>
                            </div>
                            <p className="text-lg font-mono">{callId}</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                             <Button onClick={handleCallHold} variant={onHold ? "default" : "outline"}>
                                {onHold ? 'Resume' : 'Hold'}
                            </Button>
                            <Button variant="outline" disabled> 
                                {isMuted ? <MicOff className="h-4 w-4"/> : <Mic className="h-4 w-4" />} 
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
