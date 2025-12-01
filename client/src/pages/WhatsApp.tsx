import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Save, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Smartphone,
  Code,
  RefreshCw
} from "lucide-react";

export default function WhatsAppPage() {
  const [templates] = useState([
    { id: 1, name: "welcome_message", language: "en_US", status: "approved", category: "marketing" },
    { id: 2, name: "order_update", language: "en_US", status: "approved", category: "utility" },
    { id: 3, name: "verification_code", language: "es_ES", status: "approved", category: "auth" },
    { id: 4, name: "promo_winter", language: "en_US", status: "rejected", category: "marketing" },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-green-500" />
            WhatsApp Business API
          </h2>
          <p className="text-muted-foreground">Manage templates, configure webhooks, and test messaging.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Templates
        </Button>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Meta Credentials</CardTitle>
                <CardDescription>Connect your Meta App to enable messaging.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-id">App ID</Label>
                  <Input id="app-id" placeholder="e.g. 1234567890" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-id">Phone Number ID</Label>
                  <Input id="phone-id" placeholder="e.g. 10987654321" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-token">System User Access Token</Label>
                  <Input id="access-token" type="password" value="EAAB..." className="font-mono" />
                </div>
                <div className="pt-2">
                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Credentials
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>Receive real-time updates for messages and status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Callback URL</Label>
                  <div className="flex gap-2">
                    <Input id="webhook-url" value="https://api.nexus-core.com/webhooks/whatsapp" readOnly className="font-mono bg-muted/50" />
                    <Button variant="outline" size="icon"><Code className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verify-token">Verify Token</Label>
                  <Input id="verify-token" value="nexus_verification_v1" readOnly className="font-mono bg-muted/50" />
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-4 mt-4">
                  <div className="flex items-center gap-2 text-emerald-500 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium text-sm">Webhook Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Last ping received 2 minutes ago.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Manage your approved WhatsApp templates.</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm">{template.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="uppercase text-[10px]">{template.language}</Badge>
                          <span>•</span>
                          <span className="capitalize">{template.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={`
                        ${template.status === 'approved' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 
                          template.status === 'rejected' ? 'border-rose-500/30 text-rose-500 bg-rose-500/10' : 
                          'border-amber-500/30 text-amber-500 bg-amber-500/10'}
                      `}>
                        {template.status}
                      </Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulator Tab */}
        <TabsContent value="simulator">
          <div className="grid gap-4 md:grid-cols-3 h-[600px]">
            <Card className="md:col-span-1 bg-card/50 border-border/50 flex flex-col">
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>To Phone Number</Label>
                  <Input placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>welcome_message</option>
                    <option>order_update</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Variables (JSON)</Label>
                  <Textarea className="font-mono text-xs h-32" defaultValue='{
  "1": "John Doe",
  "2": "NX-8821"
}' />
                </div>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Message
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-card/50 border-border/50 flex flex-col overflow-hidden">
              <div className="bg-muted/50 p-4 border-b border-border/50 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Device Preview</span>
              </div>
              <div className="flex-1 bg-[#0b141a] p-6 relative overflow-hidden">
                {/* WhatsApp Background Pattern Mockup */}
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}></div>
                
                <div className="relative z-10 space-y-4 max-w-md mx-auto">
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] text-[#e9edef] p-3 rounded-lg rounded-tl-none max-w-[80%] shadow-sm text-sm">
                      <p>Hello! Welcome to Nexus Core support.</p>
                      <span className="text-[10px] text-gray-400 block text-right mt-1">10:23 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] text-[#e9edef] p-3 rounded-lg rounded-tr-none max-w-[80%] shadow-sm text-sm">
                      <p>I need to check my API status.</p>
                      <span className="text-[10px] text-[#86cbb4] block text-right mt-1 flex justify-end gap-1 items-center">
                        10:24 AM <CheckCircle2 className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-[#202c33] text-[#e9edef] p-3 rounded-lg rounded-tl-none max-w-[80%] shadow-sm text-sm">
                      <p>Sure, John Doe. Your system status is currently: <strong className="text-emerald-400">Operational</strong>.</p>
                      <span className="text-[10px] text-gray-400 block text-right mt-1">10:24 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
