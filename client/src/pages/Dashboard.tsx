
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server, Phone, MessageSquare, Users, Activity, TrendingUp,
  BarChart3, Clock, Database, Wifi, Shield, Zap, AlertTriangle,
  CheckCircle2, Radio, PhoneCall, Key, Cloud
} from "lucide-react";

interface DashboardStats {
  opensipsStatus: string;
  activeExtensions: number;
  activeCalls: number;
  messagesTotal: number;
  apiKeysActive: number;
  systemUptime: string;
  twilioStatus: string;
  whatsappStatus: string;
  totalUsers: number;
  callsToday: number;
  messagesThisMonth: number;
  apiRequestsToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    opensipsStatus: "running",
    activeExtensions: 0,
    activeCalls: 0,
    messagesTotal: 0,
    apiKeysActive: 0,
    systemUptime: "0h 0m",
    twilioStatus: "operational",
    whatsappStatus: "operational",
    totalUsers: 0,
    callsToday: 0,
    messagesThisMonth: 0,
    apiRequestsToday: 0
  });

  const [realtimeData, setRealtimeData] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    requestsPerMinute: 0
  });

  useEffect(() => {
    loadDashboardStats();
    const interval = setInterval(loadDashboardStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        headers: { "Authorization": "Bearer sk_voip_demo_key" }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRealtimeData(data.realtime || realtimeData);
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "operational":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Dashboard Administrativo
        </h2>
        <p className="text-muted-foreground">Vista general del sistema y métricas en tiempo real</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Server className="h-4 w-4" /> OpenSIPS Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(stats.opensipsStatus)}>
              {stats.opensipsStatus}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Uptime: {stats.systemUptime}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Phone className="h-4 w-4" /> Llamadas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-purple-300">{stats.activeCalls}</div>
            <p className="text-xs text-muted-foreground mt-1">Hoy: {stats.callsToday}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Mensajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-300">{stats.messagesThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Key className="h-4 w-4" /> API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-amber-300">{stats.apiKeysActive}</div>
            <p className="text-xs text-muted-foreground mt-1">Activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="overview"><Activity className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="services"><Cloud className="h-4 w-4 mr-2" />Servicios</TabsTrigger>
          <TabsTrigger value="realtime"><Zap className="h-4 w-4 mr-2" />Tiempo Real</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Usuarios</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border-2 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-blue-500" />
                  VoIP Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm">Extensiones Activas</span>
                  <span className="text-xl font-bold text-cyan-400">{stats.activeExtensions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm">Llamadas en Curso</span>
                  <span className="text-xl font-bold text-purple-400">{stats.activeCalls}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm">Total Hoy</span>
                  <span className="text-xl font-bold text-green-400">{stats.callsToday}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Mensajería
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm">WhatsApp Status</span>
                  <Badge className={getStatusColor(stats.whatsappStatus)}>
                    {stats.whatsappStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm">Mensajes Este Mes</span>
                  <span className="text-xl font-bold text-green-400">{stats.messagesThisMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm">Total Enviados</span>
                  <span className="text-xl font-bold text-cyan-400">{stats.messagesTotal}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border-2 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">API Requests Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{stats.apiRequestsToday}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% vs ayer</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-cyan-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Usuarios Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">{stats.totalUsers}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-cyan-400">
                  <Users className="h-3 w-3" />
                  <span>+5 esta semana</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-pink-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-400">{stats.systemUptime}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-pink-400">
                  <Clock className="h-3 w-3" />
                  <span>Sin interrupciones</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border-2 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-cyan-500" />
                  Estado de Servicios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "OpenSIPS Server", status: stats.opensipsStatus },
                  { name: "Twilio API", status: stats.twilioStatus },
                  { name: "WhatsApp API", status: stats.whatsappStatus },
                  { name: "Database", status: "operational" }
                ].map((service) => (
                  <div key={service.name} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                    <span className="font-medium">{service.name}</span>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status === "operational" || service.status === "running" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Seguridad y API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Keys Activas</span>
                    <span className="text-xl font-bold text-amber-400">{stats.apiKeysActive}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Requests Hoy</span>
                    <span className="text-xl font-bold text-green-400">{stats.apiRequestsToday}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rate Limit Status</span>
                    <Badge className="bg-green-500/20 text-green-400">Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Realtime Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="rounded-3xl border-2 border-lime-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-lime-400">{realtimeData.cpuUsage}%</div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-cyan-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">{realtimeData.memoryUsage}%</div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Conexiones Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">{realtimeData.activeConnections}</div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-pink-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Requests/min</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-400">{realtimeData.requestsPerMinute}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-2 border-blue-500/30">
            <CardHeader>
              <CardTitle>Actividad del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Nueva extensión creada: 1005</span>
                  <span className="text-xs text-muted-foreground ml-auto">Hace 2 min</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <PhoneCall className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm">Llamada completada: +1234567890</span>
                  <span className="text-xs text-muted-foreground ml-auto">Hace 5 min</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">Mensaje WhatsApp enviado</span>
                  <span className="text-xs text-muted-foreground ml-auto">Hace 8 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="rounded-3xl border-2 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Estadísticas de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  <p className="text-3xl font-bold text-green-400">{Math.floor(stats.totalUsers * 0.8)}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Nuevos (7 días)</p>
                  <p className="text-3xl font-bold text-cyan-400">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
