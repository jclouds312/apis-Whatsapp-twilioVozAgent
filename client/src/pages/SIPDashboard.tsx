
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Server, Settings, Activity, BarChart3, Terminal, Power, 
  RefreshCw, CheckCircle2, XCircle, AlertTriangle, Phone,
  Users, Network, Database, Wifi, WifiOff
} from "lucide-react";
import { toast } from "sonner";

interface SIPServerStatus {
  status: string;
  host: string;
  port: number;
  protocol: string;
  uptime?: string;
  activeCalls?: number;
  registeredUsers?: number;
  statistics?: any;
}

interface SIPConfig {
  host: string;
  port: number;
  transportProtocol: "UDP" | "TCP" | "TLS";
  domain: string;
  registrarExpires: number;
}

export default function SIPDashboard() {
  const [serverStatus, setServerStatus] = useState<SIPServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<SIPConfig>({
    host: "0.0.0.0",
    port: 5060,
    transportProtocol: "UDP",
    domain: "sip.nexus-core.com",
    registrarExpires: 3600
  });
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadServerStatus();
    const interval = setInterval(loadServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadServerStatus = async () => {
    try {
      const response = await fetch("/api/v1/opensips/status", {
        headers: { "Authorization": "Bearer sk_voip_demo_key" }
      });
      const data = await response.json();
      if (data.success) {
        setServerStatus(data.status);
      }
    } catch (error) {
      console.error("Error loading server status:", error);
    }
  };

  const startServer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/opensips/start", {
        method: "POST",
        headers: { 
          "Authorization": "Bearer sk_voip_demo_key",
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Servidor OpenSIPS iniciado correctamente");
        addLog("Servidor OpenSIPS iniciado");
        loadServerStatus();
      } else {
        toast.error(data.error || "Error al iniciar servidor");
      }
    } catch (error) {
      toast.error("Error al iniciar servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const stopServer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/opensips/stop", {
        method: "POST",
        headers: { "Authorization": "Bearer sk_voip_demo_key" }
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Servidor OpenSIPS detenido");
        addLog("Servidor OpenSIPS detenido");
        loadServerStatus();
      } else {
        toast.error(data.error || "Error al detener servidor");
      }
    } catch (error) {
      toast.error("Error al detener servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async () => {
    toast.info("Configuración actualizada (requiere reinicio)");
    addLog(`Configuración actualizada: ${JSON.stringify(config)}`);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)]);
  };

  const getStatusIcon = () => {
    if (!serverStatus) return <WifiOff className="h-6 w-6 text-gray-500" />;
    switch (serverStatus.status) {
      case "running":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "stopped":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Server className="h-4 w-4" /> Estado del Servidor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-2xl font-black text-white">
                {serverStatus?.status || "Desconocido"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {serverStatus?.host}:{serverStatus?.port}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Phone className="h-4 w-4" /> Llamadas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-cyan-300">
              {serverStatus?.activeCalls || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En curso</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Users className="h-4 w-4" /> Usuarios Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-purple-300">
              {serverStatus?.registeredUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Conectados</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-2">
              <Activity className="h-4 w-4" /> Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-pink-300">
              {serverStatus?.uptime || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tiempo activo</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="control" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="control"><Power className="h-4 w-4 mr-2" />Control</TabsTrigger>
          <TabsTrigger value="config"><Settings className="h-4 w-4 mr-2" />Configuración</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="h-4 w-4 mr-2" />Estadísticas</TabsTrigger>
          <TabsTrigger value="logs"><Terminal className="h-4 w-4 mr-2" />Logs</TabsTrigger>
        </TabsList>

        {/* Control Tab */}
        <TabsContent value="control" className="space-y-4">
          <Card className="rounded-3xl border-2 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power className="h-5 w-5 text-blue-500" />
                Control del Servidor OpenSIPS
              </CardTitle>
              <CardDescription>
                Administra el estado del servidor SIP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={startServer}
                  disabled={isLoading || serverStatus?.status === "running"}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl"
                >
                  <Power className="h-4 w-4 mr-2" />
                  Iniciar Servidor
                </Button>
                <Button 
                  onClick={stopServer}
                  disabled={isLoading || serverStatus?.status === "stopped"}
                  variant="destructive"
                  className="flex-1 rounded-2xl"
                >
                  <Power className="h-4 w-4 mr-2" />
                  Detener Servidor
                </Button>
                <Button 
                  onClick={loadServerStatus}
                  variant="outline"
                  className="rounded-2xl"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-muted-foreground">Protocolo</p>
                  <p className="text-xl font-bold text-white">{serverStatus?.protocol || "N/A"}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-muted-foreground">Puerto SIP</p>
                  <p className="text-xl font-bold text-white">{serverStatus?.port || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card className="rounded-3xl border-2 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                Configuración del Servidor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input
                    value={config.host}
                    onChange={(e) => setConfig({...config, host: e.target.value})}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Puerto SIP</Label>
                  <Input
                    type="number"
                    value={config.port}
                    onChange={(e) => setConfig({...config, port: parseInt(e.target.value)})}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Protocolo de Transporte</Label>
                  <select 
                    value={config.transportProtocol}
                    onChange={(e) => setConfig({...config, transportProtocol: e.target.value as any})}
                    className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl"
                  >
                    <option value="UDP">UDP</option>
                    <option value="TCP">TCP</option>
                    <option value="TLS">TLS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Dominio SIP</Label>
                  <Input
                    value={config.domain}
                    onChange={(e) => setConfig({...config, domain: e.target.value})}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tiempo de Expiración del Registro (segundos)</Label>
                  <Input
                    type="number"
                    value={config.registrarExpires}
                    onChange={(e) => setConfig({...config, registrarExpires: parseInt(e.target.value)})}
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <Button 
                onClick={updateConfig}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
              >
                Actualizar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card className="rounded-3xl border-2 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-500" />
                Estadísticas del Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="h-4 w-4 text-green-400" />
                    <p className="text-sm text-muted-foreground">Conexiones Totales</p>
                  </div>
                  <p className="text-3xl font-bold text-green-400">
                    {serverStatus?.registeredUsers || 0}
                  </p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-cyan-400" />
                    <p className="text-sm text-muted-foreground">Llamadas Procesadas</p>
                  </div>
                  <p className="text-3xl font-bold text-cyan-400">
                    {serverStatus?.activeCalls || 0}
                  </p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-purple-400" />
                    <p className="text-sm text-muted-foreground">Memoria Usada</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">N/A</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="rounded-3xl border-2 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-yellow-500" />
                Logs del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No hay logs disponibles</p>
                ) : (
                  logs.map((log, index) => (
                    <p key={index} className="text-green-400">{log}</p>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
