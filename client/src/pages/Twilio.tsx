import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import FlowDesigner from "@/components/visual/FlowDesigner";
import { 
  Phone, 
  Mic, 
  Globe, 
  Settings2, 
  PlayCircle, 
  History,
  MoreHorizontal,
  Wifi,
  Workflow
} from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DEMO_USER_ID = "demo-user-123";
const DEMO_FROM_NUMBER = "+1234567890";

export default function TwilioPage() {
  const [toNumber, setToNumber] = useState("");
  const [twimlUrl, setTwimlUrl] = useState("https://api.nexus-core.com/voice/twiml");

  const [numbers] = useState([
    { id: 1, number: "+1 (555) 123-4567", country: "US", type: "Local", capabilities: ["Voice", "SMS"], status: "active" },
    { id: 2, number: "+1 (555) 987-6543", country: "US", type: "Toll-Free", capabilities: ["Voice"], status: "active" },
    { id: 3, number: "+44 20 7123 4567", country: "GB", type: "National", capabilities: ["Voice", "SMS"], status: "inactive" },
  ]);

  const { data: calls = [], isLoading, refetch } = useQuery({
    queryKey: ["twilioCalls"],
    queryFn: async () => {
      const res = await fetch(`/api/twilio/calls?userId=${DEMO_USER_ID}`);
      return res.json();
    },
    refetchInterval: 3000,
  });

  const initiateCallMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/twilio/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          callSid: `call_${Date.now()}`,
          fromNumber: DEMO_FROM_NUMBER,
          toNumber,
          status: "initiated",
          direction: "outbound",
        }),
      });
      if (!res.ok) throw new Error("Failed to initiate call");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Call initiated!");
      setToNumber("");
      refetch();
    },
    onError: () => toast.error("Failed to initiate call"),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Phone className="h-6 w-6 text-red-500" />
            Twilio Voice Manager
          </h2>
          <p className="text-muted-foreground">Manage phone numbers, SIP trunks, and voice routing.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Buy Number
        </Button>
      </div>

      <Tabs defaultValue="numbers" className="space-y-4">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="numbers">Phone Numbers</TabsTrigger>
          <TabsTrigger value="voice-config">Voice Configuration</TabsTrigger>
          <TabsTrigger value="flow-builder">Flow Builder</TabsTrigger>
          <TabsTrigger value="logs">Call Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="numbers">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Active Numbers</CardTitle>
              <CardDescription>Your purchased phone numbers and their capabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {numbers.map((num) => (
                  <div key={num.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium font-mono text-lg tracking-tight">{num.number}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="uppercase">{num.country}</span>
                          <span>•</span>
                          <span>{num.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex gap-2">
                        {num.capabilities.map(cap => (
                          <Badge key={cap} variant="secondary" className="text-xs font-normal">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${num.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                        <span className="text-sm capitalize text-muted-foreground">{num.status}</span>
                      </div>

                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-config">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2 bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Voice Routing & TwiML</CardTitle>
                <CardDescription>Configure how incoming calls are handled.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-base">Retell AI Handoff</Label>
                      <p className="text-sm text-muted-foreground">Automatically route calls to Retell AI agent on pickup.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fallback URL (Webhook)</Label>
                    <Input className="font-mono" value="https://api.nexus-core.com/voice/fallback" />
                  </div>

                  <div className="space-y-2">
                    <Label>Status Callback</Label>
                    <Input className="font-mono" value="https://api.nexus-core.com/voice/status" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1 bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Recording Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Record All Calls</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Transcribe</Label>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Storage Retention</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>30 Days</option>
                    <option>90 Days</option>
                    <option>1 Year</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flow-builder">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-primary" />
                Visual Flow Designer
              </CardTitle>
              <CardDescription>Design your call flow logic visually.</CardDescription>
            </CardHeader>
            <CardContent>
              <FlowDesigner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1 bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Initiate Call</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>To Number</Label>
                  <Input 
                    placeholder="+1 555 987 6543"
                    value={toNumber}
                    onChange={(e) => setToNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>From Number</Label>
                  <Input disabled value={DEMO_FROM_NUMBER} className="bg-muted/50" />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => initiateCallMutation.mutate()}
                  disabled={!toNumber || initiateCallMutation.isPending}
                >
                  {initiateCallMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
                  Make Call
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="space-y-2">
                    {calls.slice(-10).map((call: any) => (
                      <div key={call.id} className="flex items-center justify-between p-3 border-b border-border/40 last:border-0 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{call.toNumber}</p>
                            <p className="text-xs text-muted-foreground">{new Date(call.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className={`text-xs ${
                            call.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            call.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            {call.status}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">{call.duration || '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
