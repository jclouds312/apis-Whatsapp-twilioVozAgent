
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Phone, PhoneOff, Mic, MicOff, Server, AlertTriangle } from 'lucide-react';
import { Device, Connection } from '@twilio/voice-sdk';

export function TwilioVoiceCard() {
    const [apiKey, setApiKey] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [device, setDevice] = useState<Device | null>(null);
    const [connection, setConnection] = useState<Connection | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [status, setStatus] = useState('Offline');
    const { toast } = useToast();

    useEffect(() => {
        // Dynamically load the Twilio Voice SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.twilio.com/js/voice/v2.10.0/twilio.min.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            device?.destroy();
        };
    }, []);

    const setupDevice = async () => {
        if (!apiKey) {
            toast({ title: "API Key Missing", description: "Please enter a valid Twilio API key.", variant: "destructive" });
            return;
        }

        setStatus('Connecting...');
        try {
            const response = await fetch('/api/twilio-token', {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch token');
            }

            const { token } = await response.json();
            
            if (!token) {
                 throw new Error('Token not found in response');
            }

            const twilioDevice = new Device(token, { 
                codecPreferences: ['opus', 'pcmu'],
                // Add other options here
            });

            twilioDevice.on('ready', () => {
                setDevice(twilioDevice);
                setStatus('Ready to call');
                toast({ title: "Twilio Softphone Ready" });
            });

            twilioDevice.on('error', (error) => {
                console.error("Twilio Device Error:", error);
                setStatus('Error');
                toast({ title: "Softphone Error", description: error.message, variant: "destructive" });
            });

            twilioDevice.on('connect', (conn) => {
                setConnection(conn);
                setStatus('On call');
            });

            twilioDevice.on('disconnect', () => {
                setConnection(null);
                setStatus('Ready to call');
            });

            twilioDevice.on('incoming', (conn) => {
                 setStatus(`Incoming call from ${conn.parameters.From}`);
                 setConnection(conn);
                 // Here you could show a UI to accept/reject the call
            });

            setDevice(twilioDevice);

        } catch (error: any) {
            setStatus('Offline - Connection Failed');
            toast({ title: "Connection Failed", description: error.message, variant: "destructive" });
        }
    };

    const makeCall = async () => {
        if (!device || !phoneNumber) return;
        try {
            const conn = await device.connect({ params: { To: phoneNumber } });
            setConnection(conn);
        } catch (error: any) { 
            console.error("Call failed:", error);
            toast({ title: "Call Failed", description: error.message, variant: "destructive" });
        }
    };

    const endCall = () => {
        connection?.disconnect();
    };
    
    const acceptCall = () => {
        connection?.accept();
    };

    const toggleMute = () => {
        if (!connection) return;
        const newMutedState = !isMuted;
        connection.mute(newMutedState);
        setIsMuted(newMutedState);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Twilio Voice Softphone</CardTitle>
                <CardDescription>Make and receive calls using your Twilio account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Label htmlFor="twilio-voice-key">API Key</Label>
                        <Input id="twilio-voice-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your Twilio API Key" />
                    </div>
                    <Button onClick={setupDevice} disabled={!apiKey || !!device}>
                        <Server className="mr-2 h-4 w-4" /> Connect
                    </Button>
                </div>

                <Card className="p-4 bg-muted/50">
                    <div className="flex justify-between items-center mb-4">
                         <p className="text-sm font-medium">Status: {status}</p>
                    </div>
                    
                    <div className="flex items-end gap-2 mb-4">
                        <div className="flex-1">
                            <Label htmlFor="phone-number">Phone Number / SIP URI</Label>
                            <Input id="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1234567890" disabled={!device} />
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        {!connection ? (
                           <>
                            <Button onClick={makeCall} disabled={!device || !phoneNumber} size="lg" className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600">
                                <Phone className="h-6 w-6" />
                            </Button>
                            {status.startsWith('Incoming') && (
                                <Button onClick={acceptCall} size="lg" className="rounded-full w-16 h-16 bg-blue-500 hover:bg-blue-600">
                                    Accept
                                </Button>
                            )}
                           </>
                        ) : (
                            <>
                                <Button onClick={endCall} variant="destructive" size="lg" className="rounded-full w-16 h-16">
                                    <PhoneOff className="h-6 w-6" />
                                </Button>
                                <Button onClick={toggleMute} variant="outline" size="lg" className="rounded-full w-16 h-16">
                                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Requires a TwiML App and API credentials set in your environment variables.</span>
                </div>
            </CardContent>
        </Card>
    );
}
