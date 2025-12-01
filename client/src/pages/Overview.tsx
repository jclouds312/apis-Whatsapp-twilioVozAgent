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
  Clock
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { time: "00:00", calls: 12, messages: 140 },
  { time: "04:00", calls: 8, messages: 90 },
  { time: "08:00", calls: 45, messages: 450 },
  { time: "12:00", calls: 80, messages: 680 },
  { time: "16:00", calls: 65, messages: 520 },
  { time: "20:00", calls: 30, messages: 280 },
  { time: "23:59", calls: 20, messages: 190 },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
          <p className="text-muted-foreground">Real-time metrics for Voice & Messaging APIs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Last 24h
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Deploy Config
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-border/50 shadow-sm hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="h-3 w-3" /> +20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50 shadow-sm hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Minutes</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">843m</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="h-3 w-3" /> +4.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50 shadow-sm hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-rose-500 flex items-center">
                <ArrowDownRight className="h-3 w-3" /> -2
              </span>
              from peak
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 shadow-sm hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45ms</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 flex items-center">
                <ArrowDownRight className="h-3 w-3" /> -12ms
              </span>
              improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Combined voice and messaging volume.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorMessages)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCalls)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
            <CardDescription>Latest API configuration updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { id: 1, name: "WhatsApp Flow v2.4", status: "Deployed", time: "2m ago", type: "success" },
                { id: 2, name: "Retell Voice Agent A", status: "Processing", time: "15m ago", type: "warning" },
                { id: 3, name: "Twilio Number Config", status: "Failed", time: "1h ago", type: "error" },
                { id: 4, name: "System Webhook Update", status: "Deployed", time: "3h ago", type: "success" },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-4 ${
                    item.type === 'success' ? 'bg-emerald-500' : 
                    item.type === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className={`text-xs font-medium ${
                    item.type === 'success' ? 'text-emerald-500' : 
                    item.type === 'warning' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
