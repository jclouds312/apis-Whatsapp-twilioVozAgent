import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  MessageSquare, 
  PhoneCall, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Clock,
  BarChart3,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const trafficData = [
  { time: "00:00", calls: 12, messages: 140, fb: 45 },
  { time: "04:00", calls: 8, messages: 90, fb: 32 },
  { time: "08:00", calls: 45, messages: 450, fb: 120 },
  { time: "12:00", calls: 80, messages: 680, fb: 280 },
  { time: "16:00", calls: 65, messages: 520, fb: 210 },
  { time: "20:00", calls: 30, messages: 280, fb: 95 },
  { time: "23:59", calls: 20, messages: 190, fb: 68 },
];

const apiUsageData = [
  { api: "WhatsApp", requests: 4520, limit: 5000 },
  { api: "Twilio Voice", requests: 2130, limit: 3000 },
  { api: "Facebook SDK", requests: 1840, limit: 2000 },
  { api: "Retell AI", requests: 890, limit: 1000 },
  { api: "CRM API", requests: 650, limit: 1000 },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Enterprise Command Center
          </h1>
          <p className="text-muted-foreground mt-2">Real-time metrics • WhatsApp • Twilio • Facebook • AI Agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
            <Clock className="h-4 w-4" />
            Last 24h
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg">
            <Zap className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30 hover:border-blue-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">WhatsApp Messages</CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              12,234
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <span className="text-emerald-500 flex items-center font-semibold">
                <ArrowUpRight className="h-3 w-3" /> +20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/30 hover:border-purple-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Voice Minutes</CardTitle>
            <PhoneCall className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              843m
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <span className="text-emerald-500 flex items-center font-semibold">
                <ArrowUpRight className="h-3 w-3" /> +4.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/30 hover:border-pink-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Agents</CardTitle>
            <Users className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              24
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <span className="text-green-500 flex items-center font-semibold">
                <ArrowUpRight className="h-3 w-3" /> +8
              </span>
              AI agents online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/30 hover:border-cyan-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">API Latency</CardTitle>
            <Activity className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
              45ms
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <span className="text-emerald-500 flex items-center font-semibold">
                <ArrowDownRight className="h-3 w-3" /> -12ms
              </span>
              improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Traffic Overview */}
        <Card className="col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Traffic Overview
            </CardTitle>
            <CardDescription>24-hour API usage across all integrations</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(59, 100%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(59, 100%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(259, 84%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(259, 84%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(59, 130, 246, 0.5)"}} />
                  <Legend />
                  <Area type="monotone" dataKey="messages" stroke="hsl(59, 100%, 50%)" fillOpacity={1} fill="url(#colorMessages)" />
                  <Area type="monotone" dataKey="calls" stroke="hsl(168, 76%, 42%)" fillOpacity={1} fill="url(#colorCalls)" />
                  <Area type="monotone" dataKey="fb" stroke="hsl(259, 84%, 60%)" fillOpacity={1} fill="url(#colorFb)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full" style={{width: "98%"}} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">API Gateway</span>
                <Badge className="bg-green-500/20 text-green-400">Online</Badge>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full" style={{width: "100%"}} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Webhooks</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">2 Pending</Badge>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-1.5 rounded-full" style={{width: "85%"}} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Usage */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            API Rate Limit Usage
          </CardTitle>
          <CardDescription>Current utilization across services (5-hour cycle)</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="api" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(59, 130, 246, 0.5)"}} />
                <Legend />
                <Bar dataKey="requests" fill="url(#gradientRequests)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="limit" fill="rgba(100, 116, 139, 0.3)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="gradientRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(59, 100%, 50%)" />
                    <stop offset="100%" stopColor="hsl(259, 84%, 60%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Scheduled Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Database optimization scheduled for Dec 5, 2025 at 02:00 UTC. No service interruption expected.
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Zap className="h-5 w-5" />
              New Features Available
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Facebook SDK v21.0 integration now available. Upgrade your instance to access enhanced features.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
