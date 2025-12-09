import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Filter, ExternalLink, ArrowUpRight,
  Database, Cloud, Lock, RefreshCw, Plug,
  Code, FileJson, Share2, Settings, Download
} from "lucide-react";

const integrations = [
  {
    id: 1,
    name: "Salesforce",
    description: "Bi-directional sync for contacts, leads, and opportunities.",
    category: "CRM",
    status: "Connected",
    icon: Cloud
  },
  {
    id: 2,
    name: "HubSpot",
    description: "Import contacts and log WhatsApp conversations to timeline.",
    category: "CRM",
    status: "Available",
    icon: Database
  },
  {
    id: 3,
    name: "Zendesk",
    description: "Create support tickets from incoming messages automatically.",
    category: "Support",
    status: "Available",
    icon: Lock
  },
  {
    id: 4,
    name: "Pipedrive",
    description: "Sync deals and activities with your sales pipeline.",
    category: "CRM",
    status: "Beta",
    icon: Plug
  },
  {
    id: 5,
    name: "Slack",
    description: "Get notified about new leads and high-priority messages.",
    category: "Communication",
    status: "Connected",
    icon: MessageIcon
  },
  {
    id: 6,
    name: "Google Sheets",
    description: "Export all data to spreadsheets for custom analysis.",
    category: "Data",
    status: "Available",
    icon: TableIcon
  }
];

const apiEndpoints = [
  {
    method: "POST",
    path: "/api/v1/integrations/twilio/voice/webhook",
    description: "Receives real-time call status updates and recording URLs.",
    type: "Twilio Voice"
  },
  {
    method: "POST",
    path: "/api/v1/integrations/whatsapp/message",
    description: "Webhook for incoming WhatsApp Business messages and status.",
    type: "WhatsApp"
  },
  {
    method: "GET",
    path: "/api/v1/export/calls/logs",
    description: "Export daily call logs formatted for CRM import (CSV/JSON).",
    type: "Export"
  },
  {
    method: "GET",
    path: "/api/v1/export/whatsapp/conversations",
    description: "Export full conversation history by contact ID.",
    type: "Export"
  }
];

export default function CrmIntegration() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrations & API</h1>
          <p className="text-muted-foreground">Manage CRM connections and API endpoints.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <FileJson className="h-4 w-4 mr-2" /> API Docs
            </Button>
            <Button>
                <Settings className="h-4 w-4 mr-2" /> Global Settings
            </Button>
        </div>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="exports">Data Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search integrations..." className="pl-8 bg-background/50" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((item) => (
                    <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all group">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="p-3 bg-background/80 rounded-lg border border-border shadow-sm group-hover:scale-110 transition-transform">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <Badge variant={
                                item.status === "Connected" ? "default" : 
                                item.status === "Available" ? "secondary" : "outline"
                            } className={item.status === "Connected" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}>
                                {item.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{item.description}</p>
                            <Button className="w-full" variant={item.status === "Connected" ? "outline" : "default"}>
                                {item.status === "Connected" ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2" /> Configure
                                    </>
                                ) : (
                                    <>
                                        <Plug className="h-4 w-4 mr-2" /> Connect
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Integration Endpoints</CardTitle>
                    <CardDescription>
                        Use these endpoints to configure webhooks in Twilio Console and WhatsApp Business Manager.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {apiEndpoints.map((endpoint, i) => (
                            <div key={i} className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/20">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">{endpoint.method}</Badge>
                                        <code className="text-sm bg-muted px-2 py-1 rounded text-primary font-mono">{endpoint.path}</code>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>
                                    <Badge variant="secondary" className="mt-1 text-xs">{endpoint.type}</Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Data Export Definitions</CardTitle>
                    <CardDescription>Configure how Twilio Voice and WhatsApp data is formatted for CRM ingestion.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-lg border border-border">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <PhoneIcon className="h-4 w-4" /> Twilio Voice Export
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Exports call duration, recording links, and agent notes. Maps to CRM "Call Activity" object.
                            </p>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                                    <span>Format</span>
                                    <span className="font-mono">JSON / CSV</span>
                                </div>
                                <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                                    <span>Frequency</span>
                                    <span>Real-time Webhook</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Settings className="h-4 w-4 mr-2" /> Configure Mapping
                            </Button>
                        </div>

                        <div className="p-4 rounded-lg border border-border">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <MessageIcon className="h-4 w-4" /> WhatsApp Export
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Exports message threads, media attachments, and delivery status. Maps to CRM "Engagement" object.
                            </p>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                                    <span>Format</span>
                                    <span className="font-mono">JSON</span>
                                </div>
                                <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                                    <span>Frequency</span>
                                    <span>Daily Batch</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Settings className="h-4 w-4 mr-2" /> Configure Mapping
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PhoneIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
}


function MessageIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    )
}

function TableIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v18" />
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </svg>
    )
}
