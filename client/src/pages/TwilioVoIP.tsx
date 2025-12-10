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
  role?: 'admin'; // Added role property
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

  // Admin setup states
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Test call states
  const [testCallNumber, setTestCallNumber] = useState("");
  const [activeTestCall, setActiveTestCall] = useState<any>(null);
  const [callHistory, setCallHistory] = useState<any[]>([]);

  useEffect(() => {
    initializeDevice();
    fetchCallHistory();
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

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      const response = await fetch('/api/voip/call-history?limit=10');
      if (response.ok) {
        const history = await response.json();
        setCallHistory(history);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
    }
  };

  // Make test call
  const makeTestCall = async () => {
    if (!testCallNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/voip/test-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromExtension: '1000',
          toNumber: testCallNumber,
          extensionId: 'admin-1000',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setActiveTestCall(data);
        toast({
          title: "Call Initiated",
          description: `Calling ${testCallNumber}...`,
        });
        
        // Poll for call status
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/voip/call-status/${data.callSid}`);
            if (statusResponse.ok) {
              const status = await statusResponse.json();
              if (status.status === 'completed' || status.status === 'failed') {
                clearInterval(pollInterval);
                setActiveTestCall(null);
                fetchCallHistory();
                toast({
                  title: "Call Ended",
                  description: `Duration: ${status.duration || 0} seconds`,
                });
              }
            }
          } catch (error) {
            clearInterval(pollInterval);
          }
        }, 2000);
      } else {
        const error = await response.json();
        toast({
          title: "Call Failed",
          description: error.error || "Failed to initiate call",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make test call",
        variant: "destructive",
      });
    }
  };

  // End test call
  const endTestCall = async () => {
    if (!activeTestCall?.callSid) return;

    try {
      const response = await fetch(`/api/voip/end-call/${activeTestCall.callSid}`, {
        method: 'POST',
      });

      if (response.ok) {
        setActiveTestCall(null);
        fetchCallHistory();
        toast({
          title: "Call Ended",
          description: "The call has been terminated",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end call",
        variant: "destructive",
      });
    }
  };

  // Function to create admin extension
  const createAdminExtension = async () => {
    if (!adminPhone || !adminEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide phone number and email for the admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Assuming you have an API endpoint to create admin users
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: adminPhone,
          email: adminEmail,
          role: 'admin', // Assign admin role
          extensionNumber: '1000' // Assign extension 1000 to admin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create admin extension');
      }

      const newAdminExtension: Extension = {
        id: 'admin-1000', // Unique ID for admin
        number: '1000',
        name: 'General Admin',
        status: 'available', // Default status
        role: 'admin',
      };

      setExtensions(prevExtensions => [...prevExtensions, newAdminExtension]);
      toast({
        title: "Admin Created",
        description: "General admin extension created successfully.",
      });
      setShowAdminSetup(false);
      setAdminPhone("");
      setAdminEmail("");

    } catch (error: any) {
      toast({
        title: "Error Creating Admin",
        description: error.message,
        variant: "destructive",
      });
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

      {/* Test Call Section for Admin */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-500" />
            Admin Test Call (Extension 1000)
          </CardTitle>
          <CardDescription>
            Make test calls from admin extension to US numbers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Destination Number (US)</Label>
            <Input
              value={testCallNumber}
              onChange={(e) => setTestCallNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={!!activeTestCall}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Enter US phone number including country code (+1)
            </p>
          </div>

          {activeTestCall ? (
            <div className="space-y-3">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium text-green-600">Call in Progress</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Calling: {testCallNumber}
                </p>
              </div>
              <Button 
                onClick={endTestCall}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Call
              </Button>
            </div>
          ) : (
            <Button 
              onClick={makeTestCall}
              disabled={!testCallNumber || !isRegistered}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              Make Test Call
            </Button>
          )}
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

        {/* Call History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Test Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {callHistory.length > 0 ? (
                <div className="space-y-2">
                  {callHistory.map((call, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium font-mono">{call.to}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(call.startTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                          {call.status}
                        </Badge>
                        {call.duration && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {call.duration}s
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No call history yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Extensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Extensions
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowAdminSetup(true)}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Setup Admin
                </Button>
                <Button size="sm" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Add Extension
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showAdminSetup && (
              <div className="mb-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <h4 className="font-semibold mb-3">Crear Admin Principal</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Número de Teléfono</Label>
                    <Input
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="8622770131"
                    />
                  </div>
                  <div>
                    <Label>Email del Admin</Label>
                    <Input
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="alexander.medez931@outlook.com"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createAdminExtension} className="flex-1">
                      Crear Admin con Privilegios Completos
                    </Button>
                    <Button variant="outline" onClick={() => setShowAdminSetup(false)}>
                      Cancelar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Se creará la extensión 1000 como admin general con acceso completo a VoIP, WhatsApp y CRM.
                  </p>
                </div>
              </div>
            )}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {extensions.map((ext) => (
                  <div
                    key={ext.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        ext.status === 'available' ? 'bg-green-500' :
                        ext.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium">{ext.number}</p>
                        <p className="text-sm text-muted-foreground">{ext.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ext.role === 'admin' && (
                        <Badge variant="destructive">Admin</Badge>
                      )}
                      <Badge variant={ext.status === 'available' ? 'default' : 'secondary'}>
                        {ext.status}
                      </Badge>
                    </div>
                  </div>
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