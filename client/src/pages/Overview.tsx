import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity, MessageSquare, PhoneCall, Users, Zap, Globe, Briefcase, ArrowRight,
  TrendingUp, ShieldCheck, Phone, Smartphone, UserPlus
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const trafficData = [
  { time: "00:00", calls: 12, messages: 140, fb: 45 },
  { time: "04:00", calls: 8, messages: 90, fb: 32 },
  { time: "08:00", calls: 45, messages: 450, fb: 120 },
  { time: "12:00", calls: 80, messages: 680, fb: 280 },
  { time: "16:00", calls: 65, messages: 520, fb: 210 },
  { time: "20:00", calls: 30, messages: 280, fb: 95 },
  { time: "23:59", calls: 20, messages: 190, fb: 68 },
];

export default function OverviewPage() {
  const [, setLocation] = useLocation();

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-950 border border-indigo-500/20 p-10 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-3 py-1 mb-2">
              Dashboard v3.0
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              Bienvenido a NexusCore
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Plataforma unificada de gestión PBX, WhatsApp Business y CRM.
              <br className="hidden md:block" />
              Supervisa comunicaciones y rendimiento en tiempo real.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={() => navigateTo("/admin/extensions")} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-900/20">
                <Phone className="mr-2 h-4 w-4" /> Gestionar Extensiones
              </Button>
              <Button onClick={() => navigateTo("/admin/whatsapp")} variant="outline" className="bg-slate-900/50 border-slate-700 hover:bg-slate-800 backdrop-blur">
                <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp Admin
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Estado del Sistema</div>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-bold">Operativo 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur hover:bg-slate-900/60 transition-colors cursor-pointer group" onClick={() => navigateTo("/admin/accounts")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Ventas</CardTitle>
            <Briefcase className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">$45,231.89</div>
            <p className="text-xs text-emerald-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur hover:bg-slate-900/60 transition-colors cursor-pointer group" onClick={() => navigateTo("/admin/extensions")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Extensiones Activas</CardTitle>
            <PhoneCall className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">24/30</div>
            <p className="text-xs text-blue-400 mt-1">
              8 extensiones en llamada
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur hover:bg-slate-900/60 transition-colors cursor-pointer group" onClick={() => navigateTo("/admin/whatsapp")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Mensajes WhatsApp</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">+12,234</div>
            <p className="text-xs text-green-400 mt-1">
              98% tasa de respuesta
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur hover:bg-slate-900/60 transition-colors cursor-pointer group" onClick={() => navigateTo("/admin/accounts")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">573</div>
            <p className="text-xs text-purple-400 mt-1">
              +201 nuevos esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Tráfico de Comunicaciones</CardTitle>
            <CardDescription>Llamadas, Mensajes y Actividad Social (24h)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Area type="monotone" dataKey="messages" name="WhatsApp" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMessages)" />
                <Area type="monotone" dataKey="calls" name="Llamadas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions / Status */}
        <div className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button onClick={() => navigateTo("/admin/accounts")} variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800 hover:text-white h-12">
                <UserPlus className="mr-3 h-5 w-5 text-purple-500" />
                Registrar Nuevo Cliente
              </Button>
              <Button onClick={() => navigateTo("/admin/extensions")} variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800 hover:text-white h-12">
                <Phone className="mr-3 h-5 w-5 text-blue-500" />
                Asignar Extensión
              </Button>
              <Button onClick={() => navigateTo("/admin/whatsapp")} variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800 hover:text-white h-12">
                <Smartphone className="mr-3 h-5 w-5 text-green-500" />
                Conectar WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-indigo-300">Plan Enterprise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-white">85%</span>
                <span className="text-xs text-indigo-300">Uso de recursos</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[85%] rounded-full" />
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Tu plan se renueva en 12 días.
              </p>
              <Button size="sm" variant="link" className="px-0 text-indigo-400 hover:text-indigo-300 mt-1">
                Gestionar Suscripción <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}