import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, Check, Zap, MessageSquare, Phone, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

export default function ApiKeyGenerator() {
  const [twilioEmail, setTwilioEmail] = useState("alexander.medez931@outlook.com");
  const [twilioPassword, setTwilioPassword] = useState("MENDEZPORTILLO2024$@");
  const [generatedKeys, setGeneratedKeys] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Twilio Credentials Validation
  const validateTwilioCreds = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/twilio/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: twilioEmail, password: twilioPassword }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Twilio credentials validated!");
      } else {
        toast.error("Invalid Twilio credentials");
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
        toast.success(`${module} API key generated!`);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="h-8 w-8 text-amber-500" />
            API Key Generator
          </h1>
          <p className="text-muted-foreground mt-2">Generate and manage API keys synchronized with Twilio services</p>
        </div>
      </div>

      {/* Twilio Credentials Section */}
      <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            Twilio Credentials
          </CardTitle>
          <CardDescription>Connect your Twilio account to synchronize API keys</CardDescription>
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
          <Button
            onClick={() => validateTwilioCreds.mutate()}
            disabled={validateTwilioCreds.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {validateTwilioCreds.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Validate & Connect
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* API Key Modules Generator */}
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50">
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.id}>
              {module.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map((module) => {
          const Icon = module.icon;
          const hasKey = generatedKeys[module.id];

          return (
            <TabsContent key={module.id} value={module.id}>
              <Card className={`bg-gradient-to-br ${module.color}/10 border-${module.color.split("-")[1]}-500/20 overflow-hidden`}>
                <div className={`h-1 w-full bg-gradient-to-r ${module.color}`} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {module.name}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!hasKey ? (
                    <>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <p className="text-sm text-muted-foreground mb-4">
                          Click below to generate a secure API key for {module.name}. This key will be synchronized with your Twilio account.
                        </p>
                        <Button
                          onClick={() => generateKeyMutation.mutate(module.id)}
                          disabled={generateKeyMutation.isPending}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          {generateKeyMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Generate {module.name} Key
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Generated API Key</Label>
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
                        <Label className="text-sm font-semibold">Usage Example</Label>
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

      {/* Security Notice */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-500">Security Notice</h3>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>API keys are securely generated and stored in encrypted format</li>
                <li>Your Twilio credentials are only used for validation and not stored</li>
                <li>Each key can be regenerated independently</li>
                <li>Never share API keys in public repositories or with unauthorized users</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
