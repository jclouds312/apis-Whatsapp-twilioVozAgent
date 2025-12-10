
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone, PhoneOff, PhoneIncoming, PhoneMissed, Mic, MicOff,
  Volume2, VolumeX, Clock, User, Hash, Settings as SettingsIcon
} from "lucide-react";
import { twilioVoiceService } from "@/lib/twilio-voice";
import { useToast } from "@/hooks/use-toast";

interface Extension {
  id: string;
  number: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
}

const defaultExtensions: Extension[] = [
  { id: '1001', number: '1001', name: 'Sales Extension', status: 'available' },
  { id: '1002', number: '1002', name: 'Support Extension', status: 'available' },
  { id: '1003', number: '1003', name: 'Manager Extension', status: 'busy' },
  { id: '1004', number: '1004', name: 'Reception', status: 'available' },
];

export default function TwilioVoIP() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [extensions, setExtensions] = useState<Extension[]>(defaultExtensions);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeDevice();
    return () => {
      twilioVoiceService.destroy();
      if (callTimer) clearInterval(callTimer);
    };
  }, []);

  const initializeDevice = async () => {
    try {
      // Fetch access token from backend
      const response = await fetch('/api/twilio/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: 'user_' + Date.now() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const { token } = await response.json();

      const result = await twilioVoiceService.initialize({ token });

      if (result.success) {
        setupEventListeners();
        setIsRegistered(true);
        toast({
          title: "Connected",
          description: "VoIP device registered successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setupEventListeners = () => {
    twilioVoiceService.on('incoming', (call: any) => {
      setIncomingCall(call);
      setCallStatus('ringing');
    });

    twilioVoiceService.on('callAccepted', () => {
      setCallStatus('connected');
      startCallTimer();
    });

    twilioVoiceService.on('callDisconnected', () => {
      setCallStatus('idle');
      setIncomingCall(null);
      stopCallTimer();
    });

    twilioVoiceService.on('callError', (error: any) => {
      toast({
        title: "Call Error",
        description: error.message,
        variant: "destructive",
      });
      setCallStatus('idle');
    });
  };

  const startCallTimer = () => {
    setCallDuration(0);
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const stopCallTimer = () => {
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    setCallDuration(0);
  };

  const handleCall = async (number: string) => {
    if (!isRegistered) {
      toast({
        title: "Not Connected",
        description: "Please wait for device registration",
        variant: "destructive",
      });
      return;
    }

    setCallStatus('calling');
    const result = await twilioVoiceService.makeCall({
      To: number,
    });

    if (!result.success) {
      toast({
        title: "Call Failed",
        description: result.message,
        variant: "destructive",
      });
      setCallStatus('idle');
    }
  };

  const handleHangup = () => {
    twilioVoiceService.hangup();
    setCallStatus('idle');
    stopCallTimer();
  };

  const handleAccept = () => {
    twilioVoiceService.acceptIncomingCall();
    setIncomingCall(null);
  };

  const handleReject = () => {
    twilioVoiceService.rejectIncomingCall();
    setIncomingCall(null);
    setCallStatus('idle');
  };

  const toggleMute = () => {
    twilioVoiceService.mute(!isMuted);
    setIsMuted(!isMuted);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNumberClick = (num: string) => {
    setDialNumber(prev => prev + num);
    if (callStatus === 'connected') {
      twilioVoiceService.sendDigits(num);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isRegistered ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <div>
                <p className="font-semibold">
                  {isRegistered ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Twilio VoIP Extension Ready
                </p>
              </div>
            </div>
            {callStatus === 'connected' && (
              <Badge variant="outline" className="gap-2">
                <Clock className="h-3 w-3" />
                {formatDuration(callDuration)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dialer */}
        <Card>
          <CardHeader>
            <CardTitle>Make a Call</CardTitle>
            <CardDescription>Dial a number or select an extension</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              placeholder="Enter number or extension"
              className="text-center text-2xl font-mono"
            />

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-14 text-xl"
                  onClick={() => handleNumberClick(num)}
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Call Controls */}
            <div className="flex gap-2">
              {callStatus === 'idle' && (
                <Button
                  onClick={() => handleCall(dialNumber)}
                  disabled={!dialNumber || !isRegistered}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}

              {callStatus === 'calling' && (
                <Button
                  onClick={handleHangup}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}

              {callStatus === 'connected' && (
                <>
                  <Button
                    onClick={toggleMute}
                    variant={isMuted ? "destructive" : "outline"}
                    className="flex-1"
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleHangup}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Hang Up
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extensions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Dial Extensions</CardTitle>
            <CardDescription>Click to call internal extensions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {extensions.map((ext) => (
                  <Button
                    key={ext.id}
                    variant="outline"
                    className="w-full justify-between h-auto py-3"
                    onClick={() => handleCall(ext.number)}
                    disabled={!isRegistered || callStatus !== 'idle'}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        ext.status === 'available' ? 'bg-green-500' :
                        ext.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <div className="text-left">
                        <p className="font-semibold">{ext.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Ext. {ext.number}
                        </p>
                      </div>
                    </div>
                    <Phone className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneIncoming className="h-5 w-5 text-green-500 animate-pulse" />
                Incoming Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono">{incomingCall.from}</p>
                <p className="text-sm text-muted-foreground">is calling...</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
