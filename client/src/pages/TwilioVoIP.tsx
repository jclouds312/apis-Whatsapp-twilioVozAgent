import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  Users,
  Settings,
  Activity,
  Server,
  Shield,
  Database,
  BarChart3,
  PhoneCall,
  Voicemail,
  Mic2,
  RefreshCw,
  Power,
  Globe,
  Lock,
  HardDrive,
  Network
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";

// Mock Data for PBX Metrics
const callVolumeData = [
  { time: "00:00", incoming: 45, outgoing: 12, internal: 5 },
  { time: "04:00", incoming: 20, outgoing: 8, internal: 2 },
  { time: "08:00", incoming: 350, outgoing: 180, internal: 45 },
  { time: "12:00", incoming: 580, outgoing: 420, internal: 120 },
  { time: "16:00", incoming: 490, outgoing: 380, internal: 95 },
  { time: "20:00", incoming: 150, outgoing: 90, internal: 25 },
  { time: "23:59", incoming: 60, outgoing: 30, internal: 10 },
];

const trunkStatusData = [
  { id: 1, name: "SIP-Trunk-Primary", provider: "Twilio", status: "online", channels: "24/50", latency: "45ms" },
  { id: 2, name: "SIP-Trunk-Backup", provider: "Bandwidth", status: "online", channels: "0/20", latency: "52ms" },
  { id: 3, name: "GSM-Gateway", provider: "Internal", status: "offline", channels: "0/8", latency: "-" },
];

const extensionStatusData = [
  { status: "Online", count: 145, color: "bg-green-500" },
  { status: "Busy", count: 32, color: "bg-red-500" },
  { status: "Offline", count: 23, color: "bg-slate-500" },
  { status: "DND", count: 15, color: "bg-yellow-500" },
];

export default function TwilioVoIPPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      {/* Header Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 px-3 py-1">
                Issabel PBX Core
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Asterisk 18.x Running
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Unified VoIP Controller
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Gestión centralizada de extensiones, troncales SIP, IVR y conferencias.
              Integración nativa con Issabel PBX y Docker containers.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
              <RefreshCw className="mr-2 h-4 w-4" /> Sync Config
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Settings className="mr-2 h-4 w-4" /> System Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Calls", value: "42", sub: "Peak: 65", icon: PhoneCall, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { label: "Extensions", value: "215", sub: "145 Online", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { label: "Trunk Status", value: "3/4", sub: "98% Uptime", icon: Network, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "System Load", value: "0.45", sub: "4 CPU Cores", icon: Server, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
        ].map((stat, i) => (
          <Card key={i} className={`border ${stat.border} ${stat.bg} backdrop-blur-sm`}>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="extensions" className="data-[state=active]:bg-slate-800">
            <Users className="h-4 w-4 mr-2" /> Extensions
          </TabsTrigger>
          <TabsTrigger value="trunks" className="data-[state=active]:bg-slate-800">
            <Network className="h-4 w-4 mr-2" /> Trunks
          </TabsTrigger>
          <TabsTrigger value="ivr" className="data-[state=active]:bg-slate-800">
            <Mic2 className="h-4 w-4 mr-2" /> IVR & Flows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Call Volume Chart */}
            <Card className="lg:col-span-2 border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Volumen de Llamadas (24h)</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={callVolumeData}>
                    <defs>
                      <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
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
                    <Area type="monotone" dataKey="incoming" stroke="#4ade80" fillOpacity={1} fill="url(#colorIncoming)" name="Entrantes" />
                    <Area type="monotone" dataKey="outgoing" stroke="#60a5fa" fillOpacity={1} fill="url(#colorOutgoing)" name="Salientes" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* System Status & Services */}
            <div className="space-y-6">
              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle>Estado de Servicios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Asterisk Core", status: "Running", uptime: "14d 2h", color: "bg-green-500" },
                    { name: "MySQL DB", status: "Running", uptime: "14d 2h", color: "bg-green-500" },
                    { name: "Fail2Ban", status: "Active", uptime: "14d 2h", color: "bg-emerald-500" },
                    { name: "HylaFAX", status: "Running", uptime: "14d 2h", color: "bg-green-500" },
                    { name: "A2Billing", status: "Stopped", uptime: "-", color: "bg-red-500" },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${service.color} animate-pulse`} />
                        <div>
                          <p className="text-sm font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.uptime}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${service.color.replace('bg-', 'text-')} border-0 bg-opacity-10`}>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle>Extensiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {extensionStatusData.map((status, i) => (
                      <div key={i} className="p-4 rounded bg-slate-900/50 border border-slate-800 text-center">
                        <div className={`w-3 h-3 rounded-full ${status.color} mx-auto mb-2`} />
                        <h4 className="text-2xl font-bold">{status.count}</h4>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{status.status}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trunks" className="space-y-6">
          <Card className="border-slate-800 bg-slate-950/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>SIP Trunks Configuration</CardTitle>
                <Button size="sm"><Settings className="h-4 w-4 mr-2" /> Configure Trunks</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trunkStatusData.map((trunk) => (
                  <div key={trunk.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${trunk.status === 'online' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <Activity className={`h-5 w-5 ${trunk.status === 'online' ? 'text-green-500' : 'text-red-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">{trunk.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="h-3 w-3" /> {trunk.provider}
                          <span className="text-slate-600">•</span>
                          <Server className="h-3 w-3" /> {trunk.latency}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Channels</p>
                        <p className="font-mono font-medium">{trunk.channels}</p>
                      </div>
                      <Badge variant={trunk.status === 'online' ? 'default' : 'destructive'}>
                        {trunk.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extensions" className="space-y-6">
          <Card className="border-slate-800 bg-slate-950/50 h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Extension Manager</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Gestión de extensiones SIP/IAX2, buzones de voz y reglas de desvío.
              </p>
              <Button>Open Extension Panel</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
