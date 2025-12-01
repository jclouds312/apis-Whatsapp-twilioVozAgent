import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code } from "lucide-react";
import { toast } from "sonner";

export default function ApiDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiDocs, setApiDocs] = useState<any>(null);

  useEffect(() => {
    fetch("/api/v1/docs")
      .then((res) => res.json())
      .then((data) => setApiDocs(data));
  }, []);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!apiDocs) return <div className="p-4">Loading API documentation...</div>;

  const twilioExamples = {
    sms: `var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var requestOptions = {
    method: "post",
    headers: myHeaders,
    body: JSON.stringify({
        "to": "+12345678901",
        "body": "Hello from Twilio"
    })
};
fetch("https://api.nexus-core.com/api/v1/twilio/sms", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));`,
    
    call: `fetch("https://api.nexus-core.com/api/v1/twilio/call", {
    method: "POST",
    headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "to": "+12345678901",
        "recordCall": true
    })
})
.then(res => res.json())
.then(data => console.log(data));`,

    voice: `fetch("https://api.nexus-core.com/api/v1/twilio/voice-message", {
    method: "POST",
    headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "to": "+12345678901",
        "message": "This is a voice message",
        "voice": "Alice"
    })
})
.then(res => res.json())
.then(data => console.log(data));`,
  };

  const whatsappExamples = {
    send: `fetch("https://api.nexus-core.com/api/v1/whatsapp/send", {
    method: "POST",
    headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "to": "+12345678901",
        "message": "Hello from WhatsApp!"
    })
})
.then(res => res.json())
.then(data => console.log(data));`,

    bulk: `fetch("https://api.nexus-core.com/api/v1/whatsapp/send-bulk", {
    method: "POST",
    headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "recipients": ["+12345678901", "+12345678902", "+12345678903"],
        "message": "Bulk message to multiple contacts"
    })
})
.then(res => res.json())
.then(data => console.log(data));`,
  };

  const crmExamples = {
    create: `fetch("https://api.nexus-core.com/api/v1/crm/contacts", {
    method: "POST",
    headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+12345678901",
        "company": "Acme Corp"
    })
})
.then(res => res.json())
.then(data => console.log(data));`,

    list: `fetch("https://api.nexus-core.com/api/v1/crm/contacts", {
    method: "GET",
    headers: {
        "Authorization": "Bearer YOUR_API_KEY"
    }
})
.then(res => res.json())
.then(data => console.log(data));`,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          API Documentation
        </h1>
        <p className="text-muted-foreground mt-2">
          {apiDocs.description}
        </p>
      </div>

      {/* Quick Start */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Base URL:</span> {apiDocs.baseUrl}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Authentication:</span> {apiDocs.authentication}
          </p>
          <p className="text-sm">
            <span className="font-semibold">API Version:</span> {apiDocs.version}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="twilio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
        </TabsList>

        {/* TWILIO */}
        <TabsContent value="twilio" className="space-y-4">
          {/* SMS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Send SMS
                <Badge className="bg-green-500/20 text-green-700">POST</Badge>
              </CardTitle>
              <CardDescription>/api/v1/twilio/sms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-2">Parameters:</p>
                <div className="bg-muted/50 p-3 rounded text-xs space-y-1">
                  <p><span className="font-mono">to</span> - Phone number (required)</p>
                  <p><span className="font-mono">body</span> - Message text (required)</p>
                  <p><span className="font-mono">from</span> - Sender phone (optional)</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(twilioExamples.sms, "sms")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "sms" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{twilioExamples.sms}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* CALL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Initiate Call
                <Badge className="bg-green-500/20 text-green-700">POST</Badge>
              </CardTitle>
              <CardDescription>/api/v1/twilio/call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-2">Parameters:</p>
                <div className="bg-muted/50 p-3 rounded text-xs space-y-1">
                  <p><span className="font-mono">to</span> - Destination phone (required)</p>
                  <p><span className="font-mono">from</span> - Caller ID (optional)</p>
                  <p><span className="font-mono">recordCall</span> - Record call (optional)</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(twilioExamples.call, "call")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "call" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{twilioExamples.call}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* VOICE MESSAGE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Send Voice Message
                <Badge className="bg-green-500/20 text-green-700">POST</Badge>
              </CardTitle>
              <CardDescription>/api/v1/twilio/voice-message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-2">Parameters:</p>
                <div className="bg-muted/50 p-3 rounded text-xs space-y-1">
                  <p><span className="font-mono">to</span> - Recipient phone (required)</p>
                  <p><span className="font-mono">message</span> - Voice message text (required)</p>
                  <p><span className="font-mono">voice</span> - Alice, Woman, or Man (optional)</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(twilioExamples.voice, "voice")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "voice" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{twilioExamples.voice}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WHATSAPP */}
        <TabsContent value="whatsapp" className="space-y-4">
          {/* SEND */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Send Message
                <Badge className="bg-green-500/20 text-green-700">POST</Badge>
              </CardTitle>
              <CardDescription>/api/v1/whatsapp/send</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-2">Parameters:</p>
                <div className="bg-muted/50 p-3 rounded text-xs space-y-1">
                  <p><span className="font-mono">to</span> - Recipient phone (required)</p>
                  <p><span className="font-mono">message</span> - Message text (required)</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(whatsappExamples.send, "wapp_send")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "wapp_send" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{whatsappExamples.send}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* BULK */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Send Bulk Messages
                <Badge className="bg-green-500/20 text-green-700">POST</Badge>
              </CardTitle>
              <CardDescription>/api/v1/whatsapp/send-bulk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-2">Parameters:</p>
                <div className="bg-muted/50 p-3 rounded text-xs space-y-1">
                  <p><span className="font-mono">recipients</span> - Array of phones (required)</p>
                  <p><span className="font-mono">message</span> - Message text (required)</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(whatsappExamples.bulk, "wapp_bulk")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "wapp_bulk" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{whatsappExamples.bulk}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRM */}
        <TabsContent value="crm" className="space-y-4">
          {/* CREATE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Create Contact
                <Badge className="bg-green-500/20 text-green-700">POST</Badge>
              </CardTitle>
              <CardDescription>/api/v1/crm/contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-2">Parameters:</p>
                <div className="bg-muted/50 p-3 rounded text-xs space-y-1">
                  <p><span className="font-mono">name</span> - Contact name (required)</p>
                  <p><span className="font-mono">email</span> - Email (optional)</p>
                  <p><span className="font-mono">phone</span> - Phone (optional)</p>
                  <p><span className="font-mono">company</span> - Company (optional)</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(crmExamples.create, "crm_create")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "crm_create" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{crmExamples.create}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* LIST */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                List Contacts
                <Badge className="bg-blue-500/20 text-blue-700">GET</Badge>
              </CardTitle>
              <CardDescription>/api/v1/crm/contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Example:</p>
                  <button
                    onClick={() => copyCode(crmExamples.list, "crm_list")}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === "crm_list" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                  <code>{crmExamples.list}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
