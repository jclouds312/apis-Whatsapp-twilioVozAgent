import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Activity, MessageSquare, PhoneCall, Users, Zap,
  RefreshCw, Globe, ArrowRight, Briefcase, Send,
  LayoutDashboard, FileText, Image as ImageIcon, Video,
  Bot, Radio, Server, CloudLightning
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// Enhanced Data for Version 4.0
const trafficData = [
  { time: "00:00", api_v3: 120, api_v4: 240, errors: 2 },
  { time: "04:00", api_v3: 80, api_v4: 190, errors: 1 },
  { time: "08:00", api_v3: 450, api_v4: 850, errors: 5 },
  { time: "12:00", api_v3: 680, api_v4: 1200, errors: 8 },
  { time: "16:00", api_v3: 520, api_v4: 980, errors: 4 },
  { time: "20:00", api_v3: 280, api_v4: 560, errors: 3 },
  { time: "23:59", api_v3: 190, api_v4: 340, errors: 2 },
];

export default function OverviewPage() {
  const [, setLocation] = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const navigateTo = (path: string) => {
    setLocation(`/${path}`);
  };

  return (
    <div className="space-y-6">
      {/* Version 4.0 Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/30 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 px-3 py-1">
                v4.0 Release
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Systems Nominal
              </Badge>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
              NexusCore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Ultra</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Plataforma unificada de orquestación para WhatsApp Cloud API, Twilio Voice, y Agentes IA.
              Procesamiento en tiempo real con latencia sub-50ms.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            <Card className="bg-black/40 border-indigo-500/30 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">API Requests</p>
                  <p className="text-2xl font-mono font-bold text-indigo-400">2.4M</p>
                </div>
                <Activity className="h-8 w-8 text-indigo-500/50" />
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => navigateTo("whatsapp")}>
                <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
              <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800" onClick={() => navigateTo("logs")}>
                <Server className="mr-2 h-4 w-4" /> Logs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "WhatsApp Cloud", value: "99.9%", sub: "Uptime", icon: CloudLightning, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { label: "Active Agents", value: "12", sub: "AI Workers", icon: Bot, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "Twilio Voice", value: "45ms", sub: "Latency", icon: PhoneCall, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
          { label: "Throughput", value: "1.2k/s", sub: "Messages", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
        ].map((stat, i) => (
          <Card key={i} className={`border ${stat.border} ${stat.bg} backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
                <stat.icon className={`h-6 w-6 ${stat.color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Chart */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rendimiento de API v4.0</CardTitle>
              <CardDescription>Comparativa de tráfico vs versión anterior</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <span className="text-xs text-muted-foreground">Auto-refresh</span>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorV4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorV3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Legend />
                <Area type="monotone" dataKey="api_v4" stroke="#6366f1" fillOpacity={1} fill="url(#colorV4)" strokeWidth={3} name="API v4.0 (Cloud)" />
                <Area type="monotone" dataKey="api_v3" stroke="#94a3b8" fillOpacity={1} fill="url(#colorV3)" strokeDasharray="5 5" name="API v3.0 (Legacy)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Hub */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-950/50 h-full">
            <CardHeader>
              <CardTitle>Centro de Acciones</CardTitle>
              <CardDescription>Operaciones Rápidas</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button 
                variant="secondary" 
                className="w-full justify-between group hover:bg-indigo-600 hover:text-white transition-all"
                onClick={() => navigateTo("whatsapp")}
              >
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-indigo-400 group-hover:text-white" /> Nuevo Mensaje Masivo
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full justify-between group hover:bg-emerald-600 hover:text-white transition-all"
                onClick={() => navigateTo("whatsapp")}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400 group-hover:text-white" /> Crear Plantilla v4
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button 
                variant="secondary" 
                className="w-full justify-between group hover:bg-purple-600 hover:text-white transition-all"
                onClick={() => navigateTo("retell")}
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-400 group-hover:text-white" /> Entrenar Agente IA
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Estado de Servicios</h4>
                <div className="space-y-3">
                  {[
                    { name: "Meta Graph API", status: "Online", color: "bg-green-500" },
                    { name: "Webhook Listener", status: "Listening", color: "bg-emerald-500" },
                    { name: "Media Storage", status: "98% Free", color: "bg-blue-500" },
                    { name: "Rate Limiter", status: "Active", color: "bg-yellow-500" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.color} animate-pulse`} />
                        <span className="text-slate-500 text-xs">{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
