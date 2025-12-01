import { useState, Loader2 } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import EvolutionChat from "@/components/chat/EvolutionChat";
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

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";
const DEMO_PHONE = "+1234567890";

export default function WhatsAppPage() {
  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("welcome_message");

  const [templates] = useState([
    { id: 1, name: "welcome_message", language: "en_US", status: "approved", category: "marketing" },
    { id: 2, name: "order_update", language: "en_US", status: "approved", category: "utility" },
    { id: 3, name: "verification_code", language: "es_ES", status: "approved", category: "auth" },
    { id: 4, name: "promo_winter", language: "en_US", status: "rejected", category: "marketing" },
  ]);

  const { data: messages = [], refetch: refetchMessages, isLoading } = useQuery({
    queryKey: ["whatsappMessages"],
    queryFn: async () => {
      const res = await fetch(`/api/whatsapp/messages?userId=${DEMO_USER_ID}`);
      return res.json();
    },
    refetchInterval: 5000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          phoneNumber: DEMO_PHONE,
          recipientPhone,
          message: messageText,
          status: "pending",
          direction: "outbound",
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setMessageText("");
      setRecipientPhone("");
      refetchMessages();
    },
    onError: () => toast.error("Failed to send message"),
  });

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

      <Tabs defaultValue="evolution-chat" className="space-y-4">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="evolution-chat">Evolution Chat</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Evolution Chat Tab */}
        <TabsContent value="evolution-chat">
            <EvolutionChat />
        </TabsContent>

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
                <CardTitle>Send Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>To Phone Number</Label>
                  <Input 
                    placeholder="+1 234 567 8900"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Message Text</Label>
                  <Textarea 
                    className="font-mono text-xs h-24"
                    placeholder="Enter custom message or use template"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => sendMessageMutation.mutate()}
                  disabled={!recipientPhone || !messageText || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Message
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-card/50 border-border/50 flex flex-col overflow-hidden">
              <div className="bg-muted/50 p-4 border-b border-border/50 flex items-center justify-between">
                <span className="text-sm font-medium">Recent Messages</span>
                <Badge variant="outline">{messages.length} total</Badge>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-8"><span className="text-muted-foreground">Loading...</span></div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No messages yet</p>
                ) : (
                  messages.slice(-5).map((msg: any) => (
                    <div key={msg.id} className="p-3 bg-muted/30 rounded-lg text-sm border border-border/50">
                      <p className="font-mono text-xs text-muted-foreground">{msg.recipientPhone}</p>
                      <p className="mt-1">{msg.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className={`text-xs ${
                          msg.status === 'sent' ? 'bg-green-500/10 text-green-500' :
                          msg.status === 'delivered' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {msg.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
