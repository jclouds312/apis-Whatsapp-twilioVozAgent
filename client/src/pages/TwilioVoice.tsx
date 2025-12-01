import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check, Phone, MessageSquare, Code } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const API_KEY = "your-api-key-here";

export default function TwilioVoice() {
  const [recipientPhone, setRecipientPhone] = useState("+1");
  const [smsMessage, setSmsMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceType, setVoiceType] = useState("Alice");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Send SMS
  const sendSmsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/twilio/sms", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipientPhone,
          body: smsMessage,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("SMS sent successfully!");
      setSmsMessage("");
    },
    onError: () => {
      toast.error("Failed to send SMS");
    },
  });

  // Send Voice Message
  const sendVoiceMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/twilio/voice-message", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipientPhone,
          message: voiceMessage,
          voice: voiceType,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Voice message sent successfully!");
      setVoiceMessage("");
    },
    onError: () => {
      toast.error("Failed to send voice message");
    },
  });

  // Make Call
  const makeCallMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/twilio/call", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipientPhone,
          recordCall: true,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Call initiated!");
    },
    onError: () => {
      toast.error("Failed to initiate call");
    },
  });

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const smsCodeExample = `fetch("https://api.nexus-core.com/api/v1/twilio/sms", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "+12345678901",
    body: "Hello from Twilio SMS API"
  })
})
.then(res => res.json())
.then(data => console.log(data));`;

  const voiceCodeExample = `fetch("https://api.nexus-core.com/api/v1/twilio/voice-message", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "+12345678901",
    message: "This is a voice message",
    voice: "Alice"
  })
})
.then(res => res.json())
.then(data => console.log(data));`;

  const callCodeExample = `fetch("https://api.nexus-core.com/api/v1/twilio/call", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "+12345678901",
    recordCall: true
  })
})
.then(res => res.json())
.then(data => console.log(data));`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Phone className="h-8 w-8 text-red-600" />
            Twilio Voice & SMS
          </h1>
          <p className="text-muted-foreground mt-2">Complete voice, SMS, and calling capabilities</p>
        </div>
        <Badge className="bg-red-500/20 text-red-600">Production Ready</Badge>
      </div>

      <Tabs defaultValue="sms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-card border">
          <TabsTrigger value="sms">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Phone className="h-4 w-4 mr-2" />
            Voice Message
          </TabsTrigger>
          <TabsTrigger value="call">
            <Phone className="h-4 w-4 mr-2" />
            Make Call
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            Code Snippets
          </TabsTrigger>
        </TabsList>

        {/* SMS TAB */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Send SMS</CardTitle>
              <CardDescription>Send text messages to any phone number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Recipient Phone Number</Label>
                  <Input
                    placeholder="+12345678901"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <textarea
                    placeholder="Enter your message..."
                    className="w-full h-24 px-3 py-2 border border-border rounded-md bg-background"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{smsMessage.length} characters</p>
                </div>
                <Button
                  onClick={() => sendSmsMutation.mutate()}
                  disabled={sendSmsMutation.isPending || !smsMessage}
                  className="bg-gradient-to-r from-red-600 to-pink-600"
                >
                  {sendSmsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send SMS
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VOICE MESSAGE TAB */}
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Send Voice Message</CardTitle>
              <CardDescription>Convert text to voice and send as call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Recipient Phone Number</Label>
                  <Input
                    placeholder="+12345678901"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voice Message Text</Label>
                  <textarea
                    placeholder="Enter your voice message..."
                    className="w-full h-24 px-3 py-2 border border-border rounded-md bg-background"
                    value={voiceMessage}
                    onChange={(e) => setVoiceMessage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voice Type</Label>
                  <select
                    value={voiceType}
                    onChange={(e) => setVoiceType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Alice">Alice (Female)</option>
                    <option value="Woman">Woman (Female)</option>
                    <option value="Man">Man (Male)</option>
                  </select>
                </div>
                <Button
                  onClick={() => sendVoiceMutation.mutate()}
                  disabled={sendVoiceMutation.isPending || !voiceMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {sendVoiceMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Send Voice Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MAKE CALL TAB */}
        <TabsContent value="call">
          <Card>
            <CardHeader>
              <CardTitle>Initiate Phone Call</CardTitle>
              <CardDescription>Make outbound calls with automatic recording</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Recipient Phone Number</Label>
                  <Input
                    placeholder="+12345678901"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ✓ Call will be automatically recorded
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ✓ Recording will be available in the system logs
                  </p>
                </div>
                <Button
                  onClick={() => makeCallMutation.mutate()}
                  disabled={makeCallMutation.isPending}
                  className="bg-gradient-to-r from-red-600 to-orange-600"
                >
                  {makeCallMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Initiating...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Make Call
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CODE SNIPPETS TAB */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                SMS API Code
                <button
                  onClick={() => copyCode(smsCodeExample, "sms_code")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "sms_code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{smsCodeExample}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Voice Message API Code
                <button
                  onClick={() => copyCode(voiceCodeExample, "voice_code")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "voice_code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{voiceCodeExample}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Call API Code
                <button
                  onClick={() => copyCode(callCodeExample, "call_code")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "call_code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{callCodeExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
