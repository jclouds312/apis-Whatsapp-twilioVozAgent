import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Eye, Trash2, Plus, ShieldAlert } from "lucide-react";

export default function ApiKeysPage() {
  const [keys] = useState([
    { id: 1, name: "Production Server", prefix: "pk_live_...", service: "All Access", created: "Oct 12, 2024", lastUsed: "2 mins ago" },
    { id: 2, name: "Staging Environment", prefix: "pk_test_...", service: "WhatsApp Only", created: "Nov 01, 2024", lastUsed: "1 day ago" },
    { id: 3, name: "Mobile App V2", prefix: "pk_live_...", service: "Twilio Voice", created: "Nov 15, 2024", lastUsed: "Just now" },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Key className="h-6 w-6 text-amber-500" />
            API Key Management
          </h2>
          <p className="text-muted-foreground">Manage access keys for external services consuming your APIs.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Active Keys</CardTitle>
          <CardDescription>These keys grant access to your Nexus Core APIs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors bg-card">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{key.name}</span>
                    <Badge variant="secondary" className="text-xs">{key.service}</Badge>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded w-fit">
                    {key.prefix}••••••••••••••••
                    <Button variant="ghost" size="icon" className="h-4 w-4 hover:text-foreground">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="text-right">
                    <p>Created: {key.created}</p>
                    <p className="text-emerald-500">Last used: {key.lastUsed}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover:text-amber-500">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-amber-500 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-500">Security Best Practices</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Never share your API keys in client-side code (browsers, mobile apps). 
                Rotate your keys every 90 days. 
                Use restricted keys with minimum necessary permissions for specific services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
