import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Key, Copy, RefreshCw, Trash2, ShieldAlert, Plus, Eye, EyeOff, Calendar
} from "lucide-react";

const apiKeys = [
  { id: 1, name: "Production API Key", prefix: "pk_live_", created: "Oct 15, 2024", lastUsed: "2 mins ago", status: "Active", usage: 14520 },
  { id: 2, name: "Development Key", prefix: "pk_test_", created: "Nov 02, 2024", lastUsed: "5 hours ago", status: "Active", usage: 340 },
  { id: 3, name: "Mobile App Key", prefix: "pk_live_", created: "Sep 20, 2024", lastUsed: "1 day ago", status: "Active", usage: 8900 },
  { id: 4, name: "Legacy Integration", prefix: "pk_live_", created: "Jan 10, 2024", lastUsed: "30 days ago", status: "Revoked", usage: 0 },
];

export default function ApiKeyManager() {
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

  const toggleVisibility = (id: number) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage API keys for accessing the NexusCore Platform API.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            Security Notice
          </CardTitle>
          <CardDescription>
            Your API keys carry full privileges. Do not share them in publicly accessible areas such as GitHub, client-side code, or public blogs.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-primary/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-primary/10">
                <TableHead>Name</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id} className="hover:bg-muted/50 border-primary/10">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {key.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-mono text-sm bg-muted/50 px-2 py-1 rounded border border-border/50 w-fit">
                      {visibleKeys[key.id] ? `${key.prefix}x829s...` : `${key.prefix}••••••••`}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 hover:bg-transparent"
                        onClick={() => toggleVisibility(key.id)}
                      >
                        {visibleKeys[key.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.status === "Active" ? "default" : "destructive"} className={key.status === "Active" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}>
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {key.created}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{key.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
