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

export default function TwilioPage() {
  const [numbers] = useState([
    { id: 1, number: "+1 (555) 123-4567", country: "US", type: "Local", capabilities: ["Voice", "SMS"], status: "active" },
    { id: 2, number: "+1 (555) 987-6543", country: "US", type: "Toll-Free", capabilities: ["Voice"], status: "active" },
    { id: 3, number: "+44 20 7123 4567", country: "GB", type: "National", capabilities: ["Voice", "SMS"], status: "inactive" },
  ]);

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
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Recent Voice Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-border/40 last:border-0 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {i % 2 === 0 ? <Phone className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div>
                        <p className="font-medium">+1 (555) 123-4567</p>
                        <p className="text-xs text-muted-foreground">Today, 10:{20 + i} AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{i % 2 === 0 ? 'Completed' : 'No Answer'}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">04:2{i}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
