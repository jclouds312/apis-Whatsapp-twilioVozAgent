import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check, Users, Code, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_KEY = "your-api-key-here";

export default function CrmIntegration() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch contacts
  const { data: contactsData, refetch } = useQuery({
    queryKey: ["crm-contacts"],
    queryFn: async () => {
      const res = await fetch("/api/v1/crm/contacts", {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      });
      return res.json();
    },
  });

  // Create contact
  const createContactMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/crm/contacts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          source: "crm_integration",
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Contact created!");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactCompany("");
      refetch();
    },
    onError: () => {
      toast.error("Failed to create contact");
    },
  });

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const createContactCode = `// Create a contact via API
fetch("https://api.nexus-core.com/api/v1/crm/contacts", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+12345678901",
    company: "Acme Corp"
  })
})
.then(res => res.json())
.then(data => console.log(data));`;

  const listContactsCode = `// Get all contacts
fetch("https://api.nexus-core.com/api/v1/crm/contacts", {
  headers: {
    "Authorization": "Bearer ${API_KEY}"
  }
})
.then(res => res.json())
.then(data => {
  console.log("Total contacts:", data.total);
  console.log(data.contacts);
});`;

  const twilioIntegrationCode = `// Send SMS to CRM contact
async function sendSMStoContact(contactPhone) {
  // First get the contact
  const contacts = await fetch("/api/v1/crm/contacts", {
    headers: { "Authorization": "Bearer ${API_KEY}" }
  }).then(r => r.json());

  const contact = contacts.contacts.find(c => c.phone === contactPhone);
  
  if (contact) {
    // Send SMS via Twilio
    await fetch("/api/v1/twilio/sms", {
      method: "POST",
      headers: {
        "Authorization": "Bearer ${API_KEY}",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: contact.phone,
        body: "Hello " + contact.name + "! This is from our CRM."
      })
    });
  }
}

// Usage
sendSMStoContact("+12345678901");`;

  const voiceIntegrationCode = `// Call CRM contact with voice message
async function callContactWithMessage(contactPhone, message) {
  const contacts = await fetch("/api/v1/crm/contacts", {
    headers: { "Authorization": "Bearer ${API_KEY}" }
  }).then(r => r.json());

  const contact = contacts.contacts.find(c => c.phone === contactPhone);
  
  if (contact) {
    // Send voice message
    await fetch("/api/v1/twilio/voice-message", {
      method: "POST",
      headers: {
        "Authorization": "Bearer ${API_KEY}",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: contact.phone,
        message: message,
        voice: "Alice"
      })
    });
  }
}

// Usage
callContactWithMessage("+12345678901", "Important update from our company");`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            CRM + Twilio Integration
          </h1>
          <p className="text-muted-foreground mt-2">Manage contacts and send messages/calls</p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-600">Connected</Badge>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card border">
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="actions">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            Code
          </TabsTrigger>
        </TabsList>

        {/* CONTACTS TAB */}
        <TabsContent value="contacts" className="space-y-4">
          {/* Create Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Contact</CardTitle>
              <CardDescription>Add a new contact to your CRM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="john@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+12345678901"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Acme Corp"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => createContactMutation.mutate()}
                disabled={createContactMutation.isPending || !contactName}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                {createContactMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Create Contact
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Contacts ({contactsData?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {contactsData?.contacts && contactsData.contacts.length > 0 ? (
                <div className="space-y-2">
                  {contactsData.contacts.map((contact: any) => (
                    <div key={contact.id} className="border border-border/50 rounded-lg p-3 hover:bg-muted/50">
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      {contact.company && <p className="text-xs text-muted-foreground">{contact.company}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No contacts yet. Create one to get started!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIONS TAB */}
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Send Messages to Contacts</CardTitle>
              <CardDescription>Use Twilio to send SMS or voice messages to your CRM contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Send SMS to Contacts</p>
                    <p className="text-xs text-muted-foreground">Reach out via text message using Twilio SMS API</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Send SMS Campaign
                </Button>
              </div>

              <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Send Voice Messages</p>
                    <p className="text-xs text-muted-foreground">Deliver automated voice calls with custom messages</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Send Voice Campaign
                </Button>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Make Calls</p>
                    <p className="text-xs text-muted-foreground">Initiate phone calls to contacts with recording</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Initiate Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CODE TAB */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Create Contact Code
                <button
                  onClick={() => copyCode(createContactCode, "create_contact")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "create_contact" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{createContactCode}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                List Contacts Code
                <button
                  onClick={() => copyCode(listContactsCode, "list_contacts")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "list_contacts" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{listContactsCode}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                CRM + Twilio Integration Code
                <button
                  onClick={() => copyCode(twilioIntegrationCode, "twilio_integration")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "twilio_integration" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
              <CardDescription>Send SMS to CRM contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{twilioIntegrationCode}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                CRM + Voice Integration Code
                <button
                  onClick={() => copyCode(voiceIntegrationCode, "voice_integration")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedCode === "voice_integration" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </CardTitle>
              <CardDescription>Call CRM contacts with voice messages</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                <code>{voiceIntegrationCode}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
