import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, Check, Zap, MessageSquare, Phone, Users, AlertCircle, CheckCircle2, CloudCheck } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

export default function ApiKeyGenerator() {
  const [twilioEmail, setTwilioEmail] = useState("alexander.medez931@outlook.com");
  const [twilioPassword, setTwilioPassword] = useState("MENDEZPORTILLO2024$@");
  const [generatedKeys, setGeneratedKeys] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch connected services
  const { data: servicesData, refetch: refetchServices } = useQuery({
    queryKey: ["services", DEMO_USER_ID],
    queryFn: async () => {
      const res = await fetch(`/api/services?userId=${DEMO_USER_ID}`);
      return res.json();
    },
    refetchInterval: 5000, // Auto-sync every 5 seconds
  });

  // Fetch generated keys
  const { data: keysData, refetch: refetchKeys } = useQuery({
    queryKey: ["generated-keys", DEMO_USER_ID],
    queryFn: async () => {
      const res = await fetch(`/api/api-keys/generated?userId=${DEMO_USER_ID}`);
      return res.json();
    },
  });

  // Connect service
  const connectService = useMutation({
    mutationFn: async (serviceName: string) => {
      const res = await fetch("/api/services/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          serviceName,
          credentials: {
            email: twilioEmail,
            password: twilioPassword,
          },
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Service connected!");
        refetchServices();
      } else {
        toast.error("Failed to connect service");
      }
    },
  });

  // Generate API Key for specific module
  const generateKeyMutation = useMutation({
    mutationFn: async (module: string) => {
      const res = await fetch("/api/api-keys/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          service: module,
          twilioEmail,
          twilioPassword,
        }),
      });
      return res.json();
    },
    onSuccess: (data, module) => {
      if (data.success) {
        setGeneratedKeys((prev) => ({
          ...prev,
          [module]: data.apiKey,
        }));
        toast.success(`✅ ${module} API key generated & saved!`);
        refetchServices();
        refetchKeys();
      } else {
        toast.error(`Failed to generate ${module} key: ${data.error}`);
      }
    },
  });

  const copyToClipboard = (key: string, module: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(module);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const modules = [
    {
      name: "WhatsApp Business API",
      id: "whatsapp",
      icon: MessageSquare,
      color: "from-green-500 to-emerald-600",
      description: "Send and receive WhatsApp messages",
    },
    {
      name: "Twilio Voice API",
      id: "twilio",
      icon: Phone,
      color: "from-red-500 to-pink-600",
      description: "Initiate and manage phone calls",
    },
    {
      name: "CRM Contacts API",
      id: "crm",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      description: "Manage customer relationships",
    },
  ];

  const getServiceStatus = (serviceName: string) => {
    const service = servicesData?.services?.find((s: any) => s.name === serviceName);
    return service?.status || "disconnected";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="h-8 w-8 text-amber-500" />
            API Key Generator
          </h1>
          <p className="text-muted-foreground mt-2">Generate and manage API keys synchronized with Twilio services - All saved on server!</p>
        </div>
        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
          <CloudCheck className="h-4 w-4 mr-1" />
          Server Storage Active
        </Badge>
      </div>

      {/* Twilio Credentials Section */}
      <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            Twilio Account Connection
          </CardTitle>
          <CardDescription>Connect your Twilio account to generate and manage API keys online</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Twilio Email</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={twilioEmail}
                onChange={(e) => setTwilioEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Twilio Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={twilioPassword}
                onChange={(e) => setTwilioPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2 md:grid-cols-3">
            {modules.map((module) => (
              <Button
                key={module.id}
                onClick={() => connectService.mutate(module.id)}
                disabled={connectService.isPending}
                variant={getServiceStatus(module.id) === "connected" ? "default" : "outline"}
                className="text-sm"
              >
                {connectService.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : getServiceStatus(module.id) === "connected" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Connected
                  </>
                ) : (
                  <>
                    <CloudCheck className="h-4 w-4 mr-2" />
                    Connect {module.name.split(" ")[0]}
                  </>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Key Modules Generator */}
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50">
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.id}>
              {module.name.split(" ")[0]}
              {getServiceStatus(module.id) === "connected" && (
                <span className="ml-2 h-2 w-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map((module) => {
          const Icon = module.icon;
          const hasKey = generatedKeys[module.id] || keysData?.keys?.find((k: any) => k.service === module.id)?.fullKey;

          return (
            <TabsContent key={module.id} value={module.id}>
              <Card className={`bg-gradient-to-br ${module.color}/10 border-${module.color.split("-")[1]}-500/20 overflow-hidden`}>
                <div className={`h-1 w-full bg-gradient-to-r ${module.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <div>
                        <CardTitle>{module.name}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getServiceStatus(module.id) === "connected" ? "bg-green-500/20 text-green-600" : "bg-gray-500/20"}>
                      {getServiceStatus(module.id) === "connected" ? "🟢 Connected" : "⚪ Offline"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!hasKey ? (
                    <>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <p className="text-sm text-muted-foreground mb-4">
                          Click below to generate a secure API key for {module.name}. Your key will be stored securely on the server and always accessible.
                        </p>
                        <Button
                          onClick={() => generateKeyMutation.mutate(module.id)}
                          disabled={generateKeyMutation.isPending || getServiceStatus(module.id) !== "connected"}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          {generateKeyMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating & Saving...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Generate & Save {module.name} Key
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Generated API Key (Stored on Server)</Label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-muted/50 p-3 rounded-lg font-mono text-sm break-all">
                            {hasKey.substring(0, 16)}...{hasKey.substring(hasKey.length - 8)}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(hasKey, module.id)}
                            className={copiedKey === module.id ? "text-green-500" : ""}
                          >
                            {copiedKey === module.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* API Usage Example */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">API Usage Example</Label>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                            {`curl -X POST https://api.nexus-core.com/api/v1/${module.id}/send \\
  -H "Authorization: Bearer ${hasKey.substring(0, 16)}..." \\
  -H "Content-Type: application/json" \\
  -d '{"to": "+1234567890", "message": "Hello!"}'`}
                          </pre>
                        </div>
                      </div>

                      {/* Regenerate Button */}
                      <Button
                        variant="outline"
                        onClick={() => generateKeyMutation.mutate(module.id)}
                        disabled={generateKeyMutation.isPending}
                      >
                        Regenerate Key
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Services Status & Sync */}
      {servicesData?.services && servicesData.services.length > 0 && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudCheck className="h-5 w-5 text-blue-600" />
              Connected Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {servicesData.services.map((service: any) => (
                <div key={service.id} className="p-3 border border-border/50 rounded-lg">
                  <p className="font-semibold text-sm">{service.name.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <span className={service.status === "connected" ? "text-green-600" : "text-gray-600"}>{service.status}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last Sync: {service.lastSyncedAt ? new Date(service.lastSyncedAt).toLocaleString() : "Never"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-500">✅ Server-Based Security</h3>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>✓ API keys are permanently stored in encrypted PostgreSQL database</li>
                <li>✓ Services stay online 24/7 on the server</li>
                <li>✓ Full sync capability between Twilio and our system</li>
                <li>✓ Each key is independent and can be managed separately</li>
                <li>✓ Credentials are encrypted with military-grade encryption</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
