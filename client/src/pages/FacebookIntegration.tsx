import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Facebook, Globe, MessageSquare, Share2, RefreshCw, CheckCircle2,
  AlertCircle, BarChart3, Settings, Link, Unlink
} from "lucide-react";

const connectedPages = [
  { id: 1, name: "Acme Corp Business", category: "Business", followers: "12.5k", status: "Connected", lastSync: "2 mins ago" },
  { id: 2, name: "Acme Support", category: "Customer Service", followers: "5.2k", status: "Connected", lastSync: "5 mins ago" },
  { id: 3, name: "Acme Marketing", category: "Marketing", followers: "8.9k", status: "Disconnected", lastSync: "2 days ago" },
];

const webhooks = [
  { id: 1, event: "messages", status: "active", endpoint: "https://api.nexuscore.com/webhooks/fb/messages" },
  { id: 2, event: "messaging_postbacks", status: "active", endpoint: "https://api.nexuscore.com/webhooks/fb/postbacks" },
  { id: 3, event: "messaging_optins", status: "inactive", endpoint: "https://api.nexuscore.com/webhooks/fb/optins" },
  { id: 4, event: "message_deliveries", status: "active", endpoint: "https://api.nexuscore.com/webhooks/fb/deliveries" },
];

export default function FacebookIntegration() {
  return (
    <div className="space-y-6">
      {/* Header / Connection Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 bg-gradient-to-br from-blue-600/10 to-blue-900/10 border-blue-500/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Facebook className="h-6 w-6 text-blue-600" />
                  Facebook Graph API v21.0
                </CardTitle>
                <CardDescription className="mt-2">
                  Manage your Facebook Pages, Instagram Business accounts, and WhatsApp Assets.
                </CardDescription>
              </div>
              <Badge className="bg-blue-600 hover:bg-blue-700">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-background/50 p-4 rounded-lg border border-blue-500/10">
                <p className="text-sm text-muted-foreground">App ID</p>
                <p className="font-mono font-medium mt-1">84920184...</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-blue-500/10">
                <p className="text-sm text-muted-foreground">API Version</p>
                <p className="font-mono font-medium mt-1">v21.0</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-blue-500/10">
                <p className="text-sm text-muted-foreground">Permissions</p>
                <p className="font-medium mt-1 text-green-500">Granted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Assets
            </Button>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure App
            </Button>
            <Button variant="ghost" className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10">
              <Unlink className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Connected Pages */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Connected Pages
            </CardTitle>
            <CardDescription>Facebook Pages currently managed by NexusCore</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 rounded-lg border border-primary/10 bg-background/30 hover:bg-background/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {page.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{page.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{page.category}</span>
                      <span>•</span>
                      <span>{page.followers} followers</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={page.status === "Connected" ? "default" : "secondary"} className={page.status === "Connected" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}>
                      {page.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">Synced {page.lastSync}</p>
                  </div>
                  <Switch checked={page.status === "Connected"} />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5">
              <Link className="h-4 w-4 mr-2" />
              Connect New Page
            </Button>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-orange-500" />
              Webhooks
            </CardTitle>
            <CardDescription>Real-time event subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-muted/30 p-3 rounded-md border border-primary/10 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Verify Token:</span>
                    <span className="font-mono">nx_ver_8x92m...</span>
                </div>
             </div>
             {webhooks.map((hook) => (
                 <div key={hook.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                     <div>
                         <p className="font-medium text-sm">{hook.event}</p>
                         <p className="text-xs text-muted-foreground truncate max-w-[200px]">{hook.endpoint}</p>
                     </div>
                     <Switch checked={hook.status === 'active'} />
                 </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
