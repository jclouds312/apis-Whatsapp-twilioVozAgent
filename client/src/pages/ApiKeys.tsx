import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Key, Copy, Eye, Trash2, Plus, ShieldAlert, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123"; // In real app, get from auth context

export default function ApiKeysPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ key: "", secret: "", service: "whatsapp", webhookUrl: "" });

  const { data: keys = [], isLoading, refetch } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const res = await fetch(`/api/api-keys?userId=${DEMO_USER_ID}`);
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
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
    mutationFn: (id) => fetch(`/api/api-keys/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      toast.success("API key deleted");
      refetch();
    },
    onError: () => toast.error("Failed to delete API key"),
  });

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
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Close" : "Add New Key"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-card/50 border-border/50 border-primary/50">
          <CardHeader>
            <CardTitle>Add API Key</CardTitle>
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
                  <option value="evolution">Evolution API</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input 
                  type="password"
                  placeholder="Enter API key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                />
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
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Save Key
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Active Keys</CardTitle>
          <CardDescription>These keys grant access to your Nexus Core APIs.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : keys.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No API keys configured yet.</p>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors bg-card">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{key.service}</span>
                      <Badge variant="secondary" className="text-xs">
                        {key.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded w-fit">
                      {key.key.substring(0, 8)}••••••••
                      <Button variant="ghost" size="icon" className="h-4 w-4 hover:text-foreground" onClick={() => navigator.clipboard.writeText(key.key)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="text-right">
                      <p>Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                      <p className="text-emerald-500">Last used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:text-destructive"
                      onClick={() => deleteMutation.mutate(key.id)}
                      disabled={deleteMutation.isPending}
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
