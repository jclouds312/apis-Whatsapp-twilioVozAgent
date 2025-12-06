import React from "react";
import { 
  Activity, 
  Phone, 
  MessageSquare, 
  Cpu, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const data = [
  { time: "00:00", calls: 12, messages: 45 },
  { time: "04:00", calls: 8, messages: 30 },
  { time: "08:00", calls: 45, messages: 120 },
  { time: "12:00", calls: 89, messages: 250 },
  { time: "16:00", calls: 67, messages: 180 },
  { time: "20:00", calls: 34, messages: 90 },
  { time: "23:59", calls: 20, messages: 60 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Mission Control</h2>
          <p className="text-muted-foreground">Real-time overview of your AI agent fleet.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            System Online
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-panel border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+20.1%</span> from last hour
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+4.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg AI Latency</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450ms</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500 rotate-180" />
              <span className="text-emerald-500">-12ms</span> improvement
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 agents currently idle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 lg:col-span-5 glass-panel">
          <CardHeader>
            <CardTitle>Communication Traffic</CardTitle>
            <CardDescription>
              Volume of voice calls and WhatsApp messages over the last 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorMessages)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCalls)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 lg:col-span-2 glass-panel flex flex-col">
          <CardHeader>
            <CardTitle>Live Activity</CardTitle>
            <CardDescription>Recent system events</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="space-y-6 relative">
               {/* Timeline line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-border" />
              
              {[
                { type: 'call', title: 'Incoming Call', desc: '+1 (555) 0123 connected', time: '2m ago', color: 'bg-emerald-500' },
                { type: 'msg', title: 'WhatsApp Sent', desc: 'Order confirmation #2938', time: '5m ago', color: 'bg-blue-500' },
                { type: 'alert', title: 'High Latency', desc: 'Response time > 800ms', time: '12m ago', color: 'bg-orange-500' },
                { type: 'call', title: 'Call Ended', desc: 'Duration: 4m 32s', time: '15m ago', color: 'bg-slate-500' },
                { type: 'msg', title: 'WhatsApp Recv', desc: 'Support query #992', time: '22m ago', color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="relative flex gap-4 items-start">
                  <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-background ${item.color} shadow-sm`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex flex-col gap-1 -mt-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                    <span className="text-[10px] text-muted-foreground/70 font-mono">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full text-xs h-8">View All Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2">
         <Card className="glass-panel">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <AlertCircle className="h-5 w-5 text-orange-500" />
               Pending Actions
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-2">
               <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded bg-background flex items-center justify-center text-xs font-bold border border-border">TW</div>
                   <div>
                     <p className="text-sm font-medium">Update Twilio Webhook</p>
                     <p className="text-xs text-muted-foreground">Certificate expires in 2 days</p>
                   </div>
                 </div>
                 <Button size="sm" variant="secondary">Fix</Button>
               </div>
               <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded bg-background flex items-center justify-center text-xs font-bold border border-border">WA</div>
                   <div>
                     <p className="text-sm font-medium">WhatsApp Template Approval</p>
                     <p className="text-xs text-muted-foreground">"Shipping_Update_v2" rejected</p>
                   </div>
                 </div>
                 <Button size="sm" variant="secondary">Review</Button>
               </div>
             </div>
           </CardContent>
         </Card>

         <Card className="glass-panel">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Cpu className="h-5 w-5 text-primary" />
               Agent Health
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm">
                   <span>Memory Usage</span>
                   <span className="font-mono text-muted-foreground">64%</span>
                 </div>
                 <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                   <div className="h-full w-[64%] bg-primary/80" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm">
                   <span>API Rate Limits</span>
                   <span className="font-mono text-muted-foreground">23%</span>
                 </div>
                 <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                   <div className="h-full w-[23%] bg-emerald-500/80" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm">
                   <span>Error Rate (1h)</span>
                   <span className="font-mono text-muted-foreground">0.01%</span>
                 </div>
                 <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                   <div className="h-full w-[1%] bg-emerald-500/80" />
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}