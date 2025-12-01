import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Users, Key, Activity, TrendingUp, Settings, BarChart3, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEMO_USER_ID = "demo-admin-123";

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => ({
      totalUsers: 156,
      activeApiKeys: 42,
      messagesThisMonth: 8234,
      callsThisMonth: 156,
      systemHealth: "operational",
      apiUptime: "99.98%",
    }),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      const res = await fetch("/api/system-logs");
      return res.json();
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">Manage platform, users, and system health.</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
          System: {stats?.systemHealth || "checking..."}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-500" />
              Active API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activeApiKeys || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">+5 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats?.messagesThisMonth || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              API Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.apiUptime || "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>API Services Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "WhatsApp API", status: "operational" },
                  { name: "Twilio Voice", status: "operational" },
                  { name: "Database", status: "operational" },
                  { name: "Authentication", status: "operational" },
                ].map((service) => (
                  <div key={service.name} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-sm">{service.name}</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { metric: "Avg Response Time", value: "145ms" },
                  { metric: "Error Rate", value: "0.02%" },
                  { metric: "CPU Usage", value: "34%" },
                  { metric: "Memory Usage", value: "52%" },
                ].map((item) => (
                  <div key={item.metric} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-sm">{item.metric}</span>
                    <span className="font-mono text-sm text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { email: "admin@platform.com", role: "admin", status: "active" },
                  { email: "user1@example.com", role: "user", status: "active" },
                  { email: "user2@example.com", role: "user", status: "active" },
                ].map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={user.status === "active" ? "bg-green-500/20 text-green-500" : ""}>{user.status}</Badge>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>System and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-auto">
                {logs.slice(-20).map((log: any) => (
                  <div key={log.id} className="p-3 border border-border/30 rounded-lg text-sm hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium capitalize">{log.eventType}</p>
                        <p className="text-xs text-muted-foreground">{log.message}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${
                        log.status === 'success' ? 'bg-green-500/10 text-green-500' :
                        log.status === 'error' ? 'bg-red-500/10 text-red-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">API Rate Limit (requests/minute)</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue="1000" className="flex-1 px-3 py-2 rounded-md border border-input" />
                  <Button>Save</Button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Max Webhook Retries</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue="3" className="flex-1 px-3 py-2 rounded-md border border-input" />
                  <Button>Save</Button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Enable New User Registration</label>
                <div className="flex gap-2">
                  <select className="flex-1 px-3 py-2 rounded-md border border-input">
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                  <Button>Save</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
