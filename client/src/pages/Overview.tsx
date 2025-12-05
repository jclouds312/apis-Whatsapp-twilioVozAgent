import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Activity, MessageSquare, PhoneCall, Users, ArrowUpRight, ArrowDownRight,
  Zap, Clock, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Radio,
  Target, Zap as Lightning, RefreshCw, Power, Settings, Globe, ArrowRight,
  Briefcase, Send, Volume2, Network, LayoutGrid, ExternalLink
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";

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
  { api: "CRM API", requests: 650, limit: 1000 },
];

const serviceMetrics = [
  { requests: 2500, delivered: 2480, failed: 20, pending: 5 },
  { requests: 1200, delivered: 1190, failed: 5, pending: 5 },
  { requests: 980, delivered: 975, failed: 3, pending: 2 },
];

export default function OverviewPage() {
  const [, setLocation] = useLocation();
  const [serviceStates, setServiceStates] = useState({
    whatsapp: true,
    twilio: true,
    facebook: true,
    crm: true,
  });
  const [systemHealth, setSystemHealth] = useState({
    database: 98,
    gateway: 100,
    webhooks: 85,
  });
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: "sms", service: "Twilio", message: "SMS enviado a +34912345678", time: "hace 2m", status: "success" },
    { id: 2, type: "call", service: "Twilio", message: "Llamada iniciada - 3min 45s", time: "hace 5m", status: "success" },
    { id: 3, type: "message", service: "WhatsApp", message: "Mensaje entregado a +1234567890", time: "hace 8m", status: "success" },
    { id: 4, type: "webhook", service: "Facebook", message: "Webhook recibido", time: "hace 12m", status: "pending" },
  ]);

  const toggleService = (service: keyof typeof serviceStates) => {
    setServiceStates(prev => ({ ...prev, [service]: !prev[service] }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        database: Math.min(100, prev.database + Math.random() * 2 - 0.5),
        gateway: Math.min(100, prev.gateway + Math.random() * 1 - 0.3),
        webhooks: Math.min(100, prev.webhooks + Math.random() * 3 - 1),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (path: string) => {
    setLocation(`/${path}`);
  };

  const quickActions = [
    { label: "Enviar SMS", icon: Send, color: "from-yellow-600 to-amber-600", action: () => navigateTo("twilio-voice") },
    { label: "Hacer Llamada", icon: PhoneCall, color: "from-red-600 to-orange-600", action: () => navigateTo("twilio-voice") },
    { label: "WhatsApp", icon: MessageSquare, color: "from-green-600 to-emerald-600", action: () => navigateTo("whatsapp") },
    { label: "Facebook SDK", icon: Globe, color: "from-blue-600 to-cyan-600", action: () => navigateTo("facebook") },
  ];

  return (
    <div className="space-y-6">
      {/* Header Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900 to-slate-950 border border-primary/30 p-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Enterprise Command Center v3.0
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                WhatsApp • Twilio • Facebook • CRM - Control total en tiempo real
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                <Zap className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid gap-3 md:grid-cols-4">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            onClick={action.action}
            className={`h-16 bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all`}
          >
            <action.icon className="h-5 w-5 mr-2" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Main KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => navigateTo("whatsapp")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">WhatsApp</CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">12,234</div>
            <p className="text-xs text-muted-foreground mt-1 flex gap-1">
              <span className="text-emerald-400">✓ Conectado</span>
            </p>
            <Button size="sm" variant="ghost" className="mt-2 text-xs">Ver más <ArrowRight className="h-3 w-3 ml-1" /></Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => navigateTo("twilio-voice")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Twilio Voice</CardTitle>
            <PhoneCall className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">843m</div>
            <p className="text-xs text-muted-foreground mt-1">+4.5% vs ayer</p>
            <Button size="sm" variant="ghost" className="mt-2 text-xs">Ver más <ArrowRight className="h-3 w-3 ml-1" /></Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer group" onClick={() => navigateTo("facebook")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Facebook SDK</CardTitle>
            <Globe className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">4,520</div>
            <p className="text-xs text-muted-foreground mt-1">SDK v2.18</p>
            <Button size="sm" variant="ghost" className="mt-2 text-xs">Ver más <ArrowRight className="h-3 w-3 ml-1" /></Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30 hover:border-cyan-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latencia API</CardTitle>
            <Activity className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">45ms</div>
            <p className="text-xs text-muted-foreground mt-1">Excelente rendimiento</p>
            <div className="mt-2 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-cyan-500/30 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Control Panel */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Control de Servicios
          </CardTitle>
          <CardDescription>Activa/Desactiva servicios y monitorea su estado</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {[
            { name: "WhatsApp", icon: MessageSquare, color: "text-green-500", key: "whatsapp" as const },
            { name: "Twilio Voice", icon: PhoneCall, color: "text-red-500", key: "twilio" as const },
            { name: "Facebook", icon: Globe, color: "text-blue-600", key: "facebook" as const },
            { name: "CRM API", icon: Briefcase, color: "text-purple-500", key: "crm" as const },
          ].map((service) => (
            <div key={service.key} className="p-4 border border-primary/20 rounded-lg hover:bg-muted/30 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <service.icon className={`h-5 w-5 ${service.color}`} />
                <Badge className={serviceStates[service.key] ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                  {serviceStates[service.key] ? "En línea" : "Desactivado"}
                </Badge>
              </div>
              <p className="font-medium text-sm">{service.name}</p>
              <div className="flex items-center gap-3">
                <Switch checked={serviceStates[service.key]} onCheckedChange={() => toggleService(service.key)} />
                <span className="text-xs text-muted-foreground">
                  {serviceStates[service.key] ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Analytics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Traffic Chart */}
        <Card className="col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Tráfico 24 horas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(59, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(59, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(59, 130, 246, 0.5)" }} />
                <Legend />
                <Area type="monotone" dataKey="messages" stroke="hsl(59, 100%, 50%)" fillOpacity={1} fill="url(#colorMessages)" />
                <Area type="monotone" dataKey="calls" stroke="hsl(0, 100%, 50%)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="fb" stroke="hsl(240, 100%, 50%)" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Salud del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Database", value: systemHealth.database, color: "from-green-500 to-emerald-400" },
              { name: "API Gateway", value: systemHealth.gateway, color: "from-blue-500 to-cyan-400" },
              { name: "Webhooks", value: systemHealth.webhooks, color: "from-yellow-500 to-amber-400" },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name}</span>
                  <Badge className={item.value > 90 ? "bg-green-500/20 text-green-400" : item.value > 70 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}>
                    {item.value}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
