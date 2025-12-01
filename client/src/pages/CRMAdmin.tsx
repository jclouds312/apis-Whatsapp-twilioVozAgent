import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Phone, MessageSquare, BarChart3, Settings, Zap, Headphones } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CRMAdmin() {
  const [apiKey, setApiKey] = useState("sk_enterprise_demo_key_12345");
  const [activeConversations, setActiveConversations] = useState(0);

  const statsData = [
    { name: "Lun", llamadas: 45, conversiones: 12 },
    { name: "Mar", llamadas: 52, conversiones: 18 },
    { name: "Mié", llamadas: 38, conversiones: 10 },
    { name: "Jue", llamadas: 65, conversiones: 22 },
    { name: "Vie", llamadas: 48, conversiones: 15 },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Contactos Activos</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-cyan-300">342</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Llamadas Hoy</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-purple-300">89</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Conversiones</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-pink-300">23</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-lime-500/50 bg-gradient-to-br from-lime-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Convs. en Vivo</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-lime-300">{activeConversations}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="agents"><Headphones className="h-4 w-4 mr-2" />Agentes Retell</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Configuración</TabsTrigger>
        </TabsList>

        {/* AGENTS TAB */}
        <TabsContent value="agents" className="space-y-4">
          <Card className="rounded-3xl border-2 border-blue-500/30">
            <CardHeader><CardTitle>Crear Nuevo Agente Retell</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Nombre del Agente</Label><Input placeholder="Digital Future Agent" className="rounded-2xl" /></div>
                <div className="space-y-2"><Label>Idioma</Label><select className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl text-sm"><option>Español</option><option>English</option><option>Portuguese</option></select></div>
              </div>
              <div className="space-y-2">
                <Label>Prompt del Agente</Label>
                <textarea placeholder="Eres un agente de ventas profesional..." className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl text-sm h-24" />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold"><Zap className="h-4 w-4 mr-2" />Crear Agente</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-cyan-500/30">
            <CardHeader><CardTitle>Agentes Activos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 1, name: "Digital Future Agent", language: "Español", calls: 156, status: "active" },
                { id: 2, name: "Sales Bot Pro", language: "English", calls: 89, status: "active" },
                { id: 3, name: "Support Agent", language: "Español", calls: 42, status: "inactive" }
              ].map(agent => (
                <div key={agent.id} className="p-4 rounded-2xl border-2 border-slate-700 hover:border-cyan-500/50 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-white">{agent.name}</p>
                    <p className="text-xs text-slate-400">{agent.language} • {agent.calls} llamadas</p>
                  </div>
                  <Badge className={agent.status === "active" ? "bg-lime-500/30 text-lime-300 rounded-full" : "bg-slate-600/30 rounded-full"}>{agent.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="rounded-3xl border-2 border-purple-500/30">
            <CardHeader><CardTitle>Llamadas y Conversiones Semanal</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                  <Legend />
                  <Bar dataKey="llamadas" fill="#8b5cf6" />
                  <Bar dataKey="conversiones" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="rounded-3xl border-2 border-pink-500/30">
            <CardHeader><CardTitle>Configuración de API</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key para Widgets</Label>
                <div className="flex gap-2">
                  <Input value={apiKey} readOnly className="rounded-2xl font-mono bg-slate-900" />
                  <Button onClick={() => navigator.clipboard.writeText(apiKey)} className="rounded-2xl">Copiar</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Retell API Key</Label>
                <Input type="password" placeholder="sk_retell_..." className="rounded-2xl" />
              </div>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-bold">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
