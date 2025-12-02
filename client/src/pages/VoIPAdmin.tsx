
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Phone, PhoneCall, Plus, Trash2, Edit, Calendar, Clock, 
  User, Server, Settings, Activity, BarChart3, Copy,
  CheckCircle2, AlertCircle, Radio, Power
} from "lucide-react";
import { toast } from "sonner";

interface Extension {
  id: string;
  extensionNumber: string;
  displayName: string;
  userId: string;
  status: string;
  sipCredentials?: {
    username: string;
    password: string;
    domain: string;
    sipUri: string;
  };
  forwardingEnabled: boolean;
  forwardingNumber?: string;
  voicemailEnabled: boolean;
  createdAt: string;
}

interface RecurringCall {
  id: string;
  extensionId: string;
  destinationNumber: string;
  schedule: {
    frequency: string;
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone: string;
  };
  enabled: boolean;
  nextExecution: string;
}

export default function VoIPAdmin() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [recurringCalls, setRecurringCalls] = useState<RecurringCall[]>([]);
  const [showNewExtension, setShowNewExtension] = useState(false);
  const [showNewRecurring, setShowNewRecurring] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<string>("");
  
  const [newExtension, setNewExtension] = useState({
    userId: "admin",
    extensionNumber: "",
    displayName: ""
  });

  const [newRecurring, setNewRecurring] = useState({
    extensionId: "",
    destinationNumber: "",
    frequency: "daily",
    time: "09:00",
    dayOfWeek: 1,
    dayOfMonth: 1,
    timezone: "America/New_York"
  });

  const [serverStats, setServerStats] = useState({
    openSIPSStatus: "running",
    activeExtensions: 0,
    activeCalls: 0,
    totalRecurringCalls: 0,
    uptime: "5h 32m"
  });

  useEffect(() => {
    loadExtensions();
    loadRecurringCalls();
    loadServerStats();
  }, []);

  const loadExtensions = async () => {
    try {
      const response = await fetch("/api/v1/voip/extensions", {
        headers: { "Authorization": "Bearer sk_voip_demo_key" }
      });
      const data = await response.json();
      if (data.success) {
        setExtensions(data.extensions || []);
        setServerStats(prev => ({ ...prev, activeExtensions: data.extensions?.length || 0 }));
      }
    } catch (error) {
      console.error("Error loading extensions:", error);
    }
  };

  const loadRecurringCalls = async () => {
    // Load all recurring calls from all extensions
    setRecurringCalls([]);
  };

  const loadServerStats = async () => {
    try {
      const response = await fetch("/api/v1/opensips/status", {
        headers: { "Authorization": "Bearer sk_voip_demo_key" }
      });
      const data = await response.json();
      if (data.success) {
        setServerStats(prev => ({
          ...prev,
          openSIPSStatus: data.status,
          activeCalls: data.activeCalls || 0,
          uptime: data.uptime || "N/A"
        }));
      }
    } catch (error) {
      console.error("Error loading server stats:", error);
    }
  };

  const createExtension = async () => {
    if (!newExtension.extensionNumber || !newExtension.displayName) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/v1/voip/extensions/create", {
        method: "POST",
        headers: {
          "Authorization": "Bearer sk_voip_demo_key",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExtension)
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Extensión creada exitosamente");
        loadExtensions();
        setShowNewExtension(false);
        setNewExtension({ userId: "admin", extensionNumber: "", displayName: "" });
      } else {
        toast.error(data.error || "Error al crear extensión");
      }
    } catch (error) {
      toast.error("Error al crear extensión");
    }
  };

  const deleteExtension = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/voip/extensions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer sk_voip_demo_key" }
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Extensión eliminada");
        loadExtensions();
      }
    } catch (error) {
      toast.error("Error al eliminar extensión");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const createRecurringCall = async () => {
    if (!newRecurring.extensionId || !newRecurring.destinationNumber) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const schedule: any = {
        frequency: newRecurring.frequency,
        time: newRecurring.time,
        timezone: newRecurring.timezone
      };

      if (newRecurring.frequency === "weekly") {
        schedule.dayOfWeek = newRecurring.dayOfWeek;
      } else if (newRecurring.frequency === "monthly") {
        schedule.dayOfMonth = newRecurring.dayOfMonth;
      }

      const response = await fetch(`/api/v1/voip/extensions/${newRecurring.extensionId}/recurring-calls`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer sk_voip_demo_key",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destinationNumber: newRecurring.destinationNumber,
          schedule
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Llamada recurrente creada");
        setShowNewRecurring(false);
        loadRecurringCalls();
      } else {
        toast.error(data.error || "Error al crear llamada recurrente");
      }
    } catch (error) {
      toast.error("Error al crear llamada recurrente");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Server className="h-4 w-4" /> OpenSIPS Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={serverStats.openSIPSStatus === "running" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
              {serverStats.openSIPSStatus}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Uptime: {serverStats.uptime}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <User className="h-4 w-4" /> Extensiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-purple-300">{serverStats.activeExtensions}</div>
            <p className="text-xs text-muted-foreground mt-1">Activas</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <PhoneCall className="h-4 w-4" /> Llamadas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-pink-300">{serverStats.activeCalls}</div>
            <p className="text-xs text-muted-foreground mt-1">En este momento</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-lime-500/50 bg-gradient-to-br from-lime-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Recurrentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-lime-300">{recurringCalls.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Programadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="extensions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="extensions"><User className="h-4 w-4 mr-2" />Extensiones</TabsTrigger>
          <TabsTrigger value="recurring"><Calendar className="h-4 w-4 mr-2" />Llamadas Recurrentes</TabsTrigger>
          <TabsTrigger value="server"><Server className="h-4 w-4 mr-2" />Servidor</TabsTrigger>
        </TabsList>

        {/* Extensions Tab */}
        <TabsContent value="extensions" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowNewExtension(!showNewExtension)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Extensión
            </Button>
          </div>

          {showNewExtension && (
            <Card className="rounded-3xl border-2 border-green-500/30">
              <CardHeader>
                <CardTitle>Crear Nueva Extensión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Número de Extensión</Label>
                    <Input
                      placeholder="1001"
                      value={newExtension.extensionNumber}
                      onChange={(e) => setNewExtension({...newExtension, extensionNumber: e.target.value})}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      placeholder="Juan Pérez"
                      value={newExtension.displayName}
                      onChange={(e) => setNewExtension({...newExtension, displayName: e.target.value})}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createExtension} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
                    Crear Extensión
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewExtension(false)} className="flex-1 rounded-2xl">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {extensions.map((ext) => (
              <Card key={ext.id} className="rounded-3xl border-2 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{ext.displayName}</h3>
                      <p className="text-sm text-muted-foreground">Ext. {ext.extensionNumber}</p>
                    </div>
                    <Badge className={ext.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"}>
                      {ext.status}
                    </Badge>
                  </div>

                  {ext.sipCredentials && (
                    <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg">
                      <p className="text-xs font-bold text-cyan-400">Credenciales SIP</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs flex-1 truncate">{ext.sipCredentials.sipUri}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(ext.sipCredentials!.sipUri)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">User: {ext.sipCredentials.username}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 rounded-lg">
                      <Edit className="h-3 w-3 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteExtension(ext.id)} className="flex-1 rounded-lg">
                      <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recurring Calls Tab */}
        <TabsContent value="recurring" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowNewRecurring(!showNewRecurring)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Llamada Recurrente
            </Button>
          </div>

          {showNewRecurring && (
            <Card className="rounded-3xl border-2 border-purple-500/30">
              <CardHeader>
                <CardTitle>Programar Llamada Recurrente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Extensión</Label>
                  <select 
                    value={newRecurring.extensionId}
                    onChange={(e) => setNewRecurring({...newRecurring, extensionId: e.target.value})}
                    className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl"
                  >
                    <option value="">Seleccionar extensión...</option>
                    {extensions.map(ext => (
                      <option key={ext.id} value={ext.id}>{ext.extensionNumber} - {ext.displayName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Número de Destino</Label>
                  <Input
                    placeholder="+1234567890"
                    value={newRecurring.destinationNumber}
                    onChange={(e) => setNewRecurring({...newRecurring, destinationNumber: e.target.value})}
                    className="rounded-2xl"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Frecuencia</Label>
                    <select 
                      value={newRecurring.frequency}
                      onChange={(e) => setNewRecurring({...newRecurring, frequency: e.target.value})}
                      className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl"
                    >
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input
                      type="time"
                      value={newRecurring.time}
                      onChange={(e) => setNewRecurring({...newRecurring, time: e.target.value})}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={createRecurringCall} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                    Programar
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewRecurring(false)} className="flex-1 rounded-2xl">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {recurringCalls.map((call) => (
              <Card key={call.id} className="rounded-3xl border-2 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-white">{call.destinationNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {call.schedule.frequency} a las {call.schedule.time}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Próxima: {new Date(call.nextExecution).toLocaleString()}
                      </p>
                    </div>
                    <Switch checked={call.enabled} />
                  </div>
                </CardContent>
              </Card>
            ))}

            {recurringCalls.length === 0 && (
              <Card className="rounded-3xl border-2 border-slate-700">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No hay llamadas recurrentes programadas
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Server Tab */}
        <TabsContent value="server" className="space-y-4">
          <Card className="rounded-3xl border-2 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                Estado del Servidor OpenSIPS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="text-2xl font-bold text-green-400">Running</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Puerto SIP</p>
                  <p className="text-2xl font-bold text-cyan-400">5060</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Protocolo</p>
                  <p className="text-2xl font-bold text-purple-400">UDP/TCP</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold text-pink-400">{serverStats.uptime}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
                  <Power className="h-4 w-4 mr-2" /> Iniciar
                </Button>
                <Button variant="destructive" className="flex-1 rounded-2xl">
                  <Power className="h-4 w-4 mr-2" /> Detener
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl">
                  <Settings className="h-4 w-4 mr-2" /> Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-500" />
                Logs del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
                <p className="text-green-400">[OK] OpenSIPS server started successfully</p>
                <p className="text-cyan-400">[INFO] Listening on 0.0.0.0:5060</p>
                <p className="text-green-400">[OK] Extension 1001 registered</p>
                <p className="text-cyan-400">[INFO] Processing recurring calls...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
