
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VoIPConsolePage() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeCall, setActiveCall] = useState<any>(null);

  const initiateCall = async () => {
    try {
      const response = await fetch('/api/voip/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          from: '+1234567890',
          identity: 'user@example.com',
        }),
      });
      const data = await response.json();
      setActiveCall(data);
      setCallStatus('calling');
      toast({
        title: 'Call Initiated',
        description: `Calling ${phoneNumber}...`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate call',
        variant: 'destructive',
      });
    }
  };

  const endCall = async () => {
    if (activeCall) {
      try {
        await fetch(`/api/voip/calls/${activeCall.sid}/end`, { method: 'POST' });
        setCallStatus('ended');
        setActiveCall(null);
        toast({
          title: 'Call Ended',
          description: 'Call has been terminated',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to end call',
          variant: 'destructive',
        });
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-blue-500/30 p-8 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            VoIP Console
          </h1>
          <p className="text-slate-400 text-lg">
            Manage voice calls and telephony operations
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle>Dialer</CardTitle>
            <CardDescription>Make outbound calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-2xl text-center"
            />
            
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-16 text-xl"
                  onClick={() => setPhoneNumber((prev) => prev + num)}
                >
                  {num}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 justify-center pt-4">
              {callStatus === 'idle' && (
                <Button
                  className="bg-green-600 hover:bg-green-700 h-16 px-8"
                  onClick={initiateCall}
                  disabled={!phoneNumber}
                >
                  <Phone className="h-6 w-6 mr-2" /> Call
                </Button>
              )}
              {(callStatus === 'calling' || callStatus === 'connected') && (
                <Button
                  className="bg-red-600 hover:bg-red-700 h-16 px-8"
                  onClick={endCall}
                >
                  <PhoneOff className="h-6 w-6 mr-2" /> End
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle>Call Status</CardTitle>
            <CardDescription>Active call information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <Badge variant={callStatus === 'connected' ? 'default' : 'outline'} className="text-lg px-4 py-2">
                {callStatus.toUpperCase()}
              </Badge>
              
              {callStatus !== 'idle' && (
                <div className="text-4xl font-bold text-white">
                  {formatDuration(callDuration)}
                </div>
              )}
            </div>

            {callStatus === 'connected' && (
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsHolding(!isHolding)}
                >
                  {isHolding ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
            )}

            {activeCall && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SID:</span>
                  <span className="font-mono">{activeCall.sid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span>{activeCall.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span>{activeCall.to}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
