import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Eye, Trash2, Plus, ShieldAlert, Loader2, Key, Zap, MessageSquare, Phone, Users, Download } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

const API_MODULES = [
  {
    name: "WhatsApp Messages API",
    service: "whatsapp",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
    endpoint: "/api/v1/whatsapp/send",
    description: "Send WhatsApp messages via Meta Graph API",
    methods: ["POST"],
    example: {
      code: `curl -X POST https://api.nexus-core.com/api/v1/whatsapp/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "message": "Hello from Nexus Core!",
    "type": "text"
  }'`,
      response: `{
  "success": true,
  "messageId": "wamid.xxx",
  "status": "sent",
  "timestamp": "2024-12-01T12:00:00Z"
}`,
    },
  },
  {
    name: "Twilio Voice API",
    service: "twilio",
    icon: Phone,
    color: "from-red-500 to-pink-600",
    endpoint: "/api/v1/twilio/call",
    description: "Initiate phone calls and manage voice communications",
    methods: ["POST"],
    example: {
      code: `curl -X POST https://api.nexus-core.com/api/v1/twilio/call \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "from": "+18622770131",
    "message": "Thank you for calling"
  }'`,
      response: `{
  "success": true,
  "callSid": "CA123456789",
  "status": "initiated",
  "duration": 0,
  "timestamp": "2024-12-01T12:00:00Z"
}`,
    },
  },
  {
    name: "CRM Contacts API",
    service: "crm",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
    endpoint: "/api/v1/crm/contacts",
    description: "Manage customer relationships and contact information",
    methods: ["GET", "POST", "PUT", "DELETE"],
    example: {
      code: `curl -X GET https://api.nexus-core.com/api/v1/crm/contacts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Create contact
curl -X POST https://api.nexus-core.com/api/v1/crm/contacts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'`,
      response: `{
  "success": true,
  "contact": {
    "id": "contact_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-12-01T12:00:00Z"
  }
}`,
    },
  },
];

export default function ApiKeysPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState("whatsapp");
  const [formData, setFormData] = useState({ key: "", secret: "", service: "whatsapp", webhookUrl: "" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: keys = [], isLoading, refetch } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const res = await fetch(`/api/api-keys?userId=${DEMO_USER_ID}`);
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: DEMO_USER_ID, ...data }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("API key created successfully");
      refetch();
      setFormData({ key: "", secret: "", service: "whatsapp", webhookUrl: "" });
      setShowForm(false);
    },
    onError: () => toast.error("Failed to create API key"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/api-keys/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      toast.success("API key deleted");
      refetch();
    },
    onError: () => toast.error("Failed to delete API key"),
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateSampleKey = () => {
    const key = "sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setFormData({ ...formData, key });
    toast.success("Sample key generated");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Key className="h-8 w-8 text-amber-500" />
            API Key Management
          </h1>
          <p className="text-muted-foreground mt-2">Generate and manage API keys for integrating Nexus Core with external services.</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50">
          <TabsTrigger value="keys">My API Keys</TabsTrigger>
          <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
          <TabsTrigger value="integrations">Integration Guides</TabsTrigger>
        </TabsList>

        {/* My API Keys Tab */}
        <TabsContent value="keys" className="space-y-4">
          {/* Create Key Card */}
          {showForm ? (
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New API Key
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="whatsapp">WhatsApp API</option>
                      <option value="twilio">Twilio Voice</option>
                      <option value="crm">CRM Contacts</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Enter API key or generate one"
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      />
                      <Button variant="outline" onClick={generateSampleKey} size="sm">
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secret (Optional)</Label>
                    <Input
                      type="password"
                      placeholder="Enter secret"
                      value={formData.secret}
                      onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL (Optional)</Label>
                    <Input
                      placeholder="https://api.example.com/webhook"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => createMutation.mutate(formData)}
                    disabled={!formData.key || createMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Create Key
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={() => setShowForm(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Generate New API Key
            </Button>
          )}

          {/* Keys List */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>Manage and monitor your API credentials</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : keys.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No API keys yet. Create your first key to get started.</p>
              ) : (
                <div className="space-y-3">
                  {keys.map((key: any) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors bg-card">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-semibold">{key.key.substring(0, 8)}••••••••</span>
                          <Badge className={`text-xs ${key.isActive ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}>
                            {key.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {key.service}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(key.createdAt).toLocaleDateString()} • Last used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className={copiedKey === key.id ? "text-green-500" : ""}
                        >
                          {copiedKey === key.id ? <Eye className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(key.id)}
                          disabled={deleteMutation.isPending}
                          className="hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Alert */}
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <ShieldAlert className="h-6 w-6 text-amber-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-500">Security Best Practices</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>Never share API keys in public repositories or client-side code</li>
                    <li>Rotate keys every 90 days for maximum security</li>
                    <li>Use keys with minimum necessary permissions</li>
                    <li>Monitor key usage in the Activity Log</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Documentation Tab */}
        <TabsContent value="api-docs" className="space-y-4">
          {API_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.service} className="bg-card/50 border-border/50 overflow-hidden">
                <div className={`h-1 w-full bg-gradient-to-r ${module.color}`} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {module.name}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Endpoint
                      </Label>
                      <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm break-all">
                        {module.endpoint}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        HTTP Methods
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {module.methods.map((method) => (
                          <Badge key={method} variant="secondary" className="font-mono">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Example Request
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(module.example.code);
                            toast.success("Copied to clipboard");
                          }}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted/70 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words">{module.example.code}</pre>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Example Response
                      </Label>
                      <div className="bg-muted/70 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs font-mono text-green-400/80 whitespace-pre-wrap break-words">{module.example.response}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Integration Guides Tab */}
        <TabsContent value="integrations" className="space-y-4">
          {/* Twilio CRM Integration */}
          <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                Twilio CRM Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Integration Steps:</Label>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Create an API key with Twilio service type above</li>
                  <li>Go to Twilio Console and copy your Account SID</li>
                  <li>Use the endpoint: <code className="bg-muted px-2 py-1 rounded text-xs">https://api.nexus-core.com/api/v1/twilio/call</code></li>
                  <li>Include your API key in the Authorization header: <code className="bg-muted px-2 py-1 rounded text-xs">Bearer YOUR_API_KEY</code></li>
                  <li>Configure webhooks for call status updates</li>
                </ol>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground">
                  curl -X POST https://api.nexus-core.com/api/v1/twilio/call \ <br/>
                  -H &quot;Authorization: Bearer sk_xxxxxxxxxxxx&quot; \ <br/>
                  -d &apos;{`{"to":"+1234567890","message":"Hello"}`}&apos;
                </p>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Integration */}
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                WhatsApp Business Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Integration Steps:</Label>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Create an API key with WhatsApp service type</li>
                  <li>Get your Meta Business Account ID</li>
                  <li>Configure webhook verification token in platform settings</li>
                  <li>Point Meta webhooks to: <code className="bg-muted px-2 py-1 rounded text-xs">https://api.nexus-core.com/api/whatsapp/webhook</code></li>
                  <li>Subscribe to message_template_status_update events</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* CRM Integration */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                CRM Contacts Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Integration Steps:</Label>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Create an API key with CRM service type</li>
                  <li>Map your contact fields to Nexus Core schema</li>
                  <li>Use the endpoint: <code className="bg-muted px-2 py-1 rounded text-xs">https://api.nexus-core.com/api/v1/crm/contacts</code></li>
                  <li>Sync contacts regularly using webhooks or scheduled tasks</li>
                  <li>Enable real-time contact updates via streaming API</li>
                </ol>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground">
                  curl -X POST https://api.nexus-core.com/api/v1/crm/contacts \ <br/>
                  -H &quot;Authorization: Bearer sk_xxxxxxxxxxxx&quot; \ <br/>
                  -d &apos;{`{"name":"John Doe","email":"john@example.com"}`}&apos;
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Download */}
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="h-4 w-4 mr-2" />
            Download Full API Documentation (PDF)
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
