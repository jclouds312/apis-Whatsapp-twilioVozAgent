import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, Filter, ExternalLink, ArrowUpRight,
  Database, Cloud, Lock, RefreshCw, Plug
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

export default function CrmIntegration() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrations Directory</h1>
          <p className="text-muted-foreground">Connect NexusCore with your favorite tools.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search integrations..." className="pl-8 bg-background/50" />
            </div>
            <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
            </Button>
        </div>
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
                                <RefreshCw className="h-4 w-4 mr-2" /> Manage
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
    </div>
  );
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
