import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Phone, Copy, Loader2, Plus, Trash2, Eye, Download, Play, Pause, Server, Users,
  Radio, Key, BarChart3, Settings, AlertCircle, CheckCircle2, Send, Clock, RefreshCw,
  Smartphone, DollarSign, Gauge, Globe, Code, Webhook, Network, Power, Download as DownloadIcon
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const API_KEY = "your-api-key";

const callStatsData = [
  { hour: "00:00", calls: 12, duration: 145, cost: 2.50 },
  { hour: "04:00", calls: 8, duration: 78, cost: 1.30 },
  { hour: "08:00", calls: 45, duration: 450, cost: 7.50 },
  { hour: "12:00", calls: 85, duration: 890, cost: 14.80 },
  { hour: "16:00", calls: 68, duration: 720, cost: 12.00 },
  { hour: "20:00", calls: 45, duration: 580, cost: 9.70 },
  { hour: "23:59", calls: 25, duration: 280, cost: 4.70 },
];

const costAnalyticsData = [
  { day: "Mon", cost: 45.20, calls: 125 },
  { day: "Tue", cost: 52.30, calls: 142 },
  { day: "Wed", cost: 48.90, calls: 118 },
  { day: "Thu", cost: 61.40, calls: 165 },
  { day: "Fri", cost: 73.50, calls: 198 },
  { day: "Sat", cost: 38.20, calls: 85 },
  { day: "Sun", cost: 32.10, calls: 62 },
];

export default function TwilioVoIPPage() {
  const [, setLocation] = useLocation();
  const [liveStats, setLiveStats] = useState({
    activeCalls: 12,
    totalCallMinutes: 8420,
    totalCost: 1284.56,
    asteriskConnected: true,
    recordingsStored: 4520,
  });

  // PI Keys
  const [piKeys, setPiKeys] = useState([
    {
      id: "pk_1",
      piKey: "pi_1704067200_a1b2c3d4e5f6g7h8",
      region: "US-EAST",
      status: "active",
      callMinutes: 2450,
      costPerMinute: 0.015,
      created: "2025-01-10",
      expires: "2026-01-10",
    },
    {
      id: "pk_2",
      piKey: "pi_1704153600_x9y8z7w6v5u4t3s2",
      region: "US-WEST",
      status: "active",
      callMinutes: 1820,
      costPerMinute: 0.015,
      created: "2025-01-15",
      expires: "2026-01-15",
    },
  ]);

  // Active Calls
  const [activeCalls] = useState([
    { id: "c1", from: "+18005551234", to: "+34912345678", duration: 340, recordingUrl: "rec_1.wav" },
    { id: "c2", from: "+14155552671", to: "+5511999999999", duration: 125, recordingUrl: "rec_2.wav" },
  ]);

  // Recordings
  const [recordings] = useState([
    { id: "r1", callId: "c1", duration: 340, size: 2.4, date: "2025-01-20 14:35", quality: "high" },
    { id: "r2", callId: "c2", duration: 195, size: 1.8, date: "2025-01-20 13:20", quality: "medium" },
    { id: "r3", callId: "c3", duration: 480, size: 4.2, date: "2025-01-20 12:45", quality: "high" },
  ]);

  // Asterisk Config
  const [asteriskConfig] = useState({
    hostname: "asterisk.voip.aws.com",
    port: 5060,
    status: "connected",
    activeCalls: 12,
    channels: 48,
    maxChannels: 100,
    uptime: "24d 15h 42m",
  });

  // Form states
  const [recipientPhone, setRecipientPhone] = useState("+34");
  const [newRegion, setNewRegion] = useState("US-EAST");
  const [recordingEnabled, setRecordingEnabled] = useState(true);
  const [selectedPiKey, setSelectedPiKey] = useState("pk_1");

  // Mutations
  const generatePIKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/voip/pi-key/generate", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ region: newRegion }),
      });
      if (!res.ok) throw new Error("Error generating PI Key");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("¡PI Key generado!");
      setPiKeys([...piKeys, data]);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const initiateVoIPCallMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone) throw new Error("Ingresa número");
      const res = await fetch("/api/v1/voip/call", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          piKeyId: selectedPiKey,
          toNumber: recipientPhone,
          recordingEnabled,
        }),
      });
      if (!res.ok) throw new Error("Error iniciando llamada");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Llamada VoIP iniciada!");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Live update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeCalls: Math.max(0, prev.activeCalls + Math.floor(Math.random() * 3 - 1)),
        totalCallMinutes: prev.totalCallMinutes + Math.floor(Math.random() * 50),
        totalCost: prev.totalCost + (Math.random() * 2 - 0.5),
        asteriskConnected: true,
        recordingsStored: prev.recordingsStored + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-950 border border-purple-500/30 p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center gap-3">
                <Radio className="h-10 w-10 text-purple-500" />
                Twilio VoIP Enterprise v1.0
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Asterisk • SIP • VoIP Calls • PI Keys • Recordings • Debian/Go Core</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 text-sm px-3 py-1">{asteriskConfig.status === "connected" ? "Conectado" : "Desconectado"}</Badge>
          </div>
        </div>
      </div>

      {/* Live KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Llamadas Activas</span><Phone className="h-4 w-4 text-purple-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{liveStats.activeCalls}</div>
            <p className="text-xs text-muted-foreground">En vivo</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Minutos Totales</span><Clock className="h-4 w-4 text-blue-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{liveStats.totalCallMinutes}</div>
            <p className="text-xs text-muted-foreground">Mes actual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Costo Total</span><DollarSign className="h-4 w-4 text-pink-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-400">${liveStats.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Grabaciones</span><Download className="h-4 w-4 text-green-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{liveStats.recordingsStored}</div>
            <p className="text-xs text-muted-foreground">Almacenadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Asterisk</span><Server className="h-4 w-4 text-orange-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{asteriskConfig.activeCalls}/{asteriskConfig.maxChannels}</div>
            <p className="text-xs text-muted-foreground">Canales activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-card border border-primary/20 grid w-full grid-cols-5">
          <TabsTrigger value="overview"><BarChart3 className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="pikeys"><Key className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="calls"><Phone className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="recordings"><Download className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="asterisk"><Server className="h-4 w-4" /></TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Llamadas Diarias</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                    <Bar dataKey="calls" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Costo por Día</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                    <Line type="monotone" dataKey="cost" stroke="#ec4899" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PI Keys Tab */}
        <TabsContent value="pikeys" className="space-y-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
            <CardHeader><CardTitle>Generar PI Key</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Región</Label><select value={newRegion} onChange={e => setNewRegion(e.target.value)} className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-md text-sm">
                <option>US-EAST</option><option>US-WEST</option><option>EU-WEST</option><option>LATAM</option>
              </select></div>
              <Button onClick={() => generatePIKeyMutation.mutate()} disabled={generatePIKeyMutation.isPending} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                {generatePIKeyMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Generar PI Key
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>PI Keys Activos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {piKeys.map(key => (
                <div key={key.id} className="p-4 border border-primary/20 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-sm font-bold">{key.piKey}</p>
                      <p className="text-xs text-muted-foreground">{key.region} • {key.created}</p>
                    </div>
                    <Badge className={key.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"}>{key.status}</Badge>
                  </div>
                  <div className="grid gap-2 text-xs">
                    <div className="flex justify-between"><span>Minutos:</span><span className="font-bold">{key.callMinutes}</span></div>
                    <div className="flex justify-between"><span>Costo/Min:</span><span>${key.costPerMinute}</span></div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(key.piKey)} className="w-full">
                    <Copy className="h-3 w-3 mr-1" /> Copiar PI Key
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>SIP Credentials</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              <div className="bg-muted p-2 rounded">username: user_1704067200</div>
              <div className="bg-muted p-2 rounded">password: •••••••••••••••</div>
              <div className="bg-muted p-2 rounded">sip-server: sip.asterisk.us-east.voip.twilio.com</div>
              <div className="bg-muted p-2 rounded">port: 5060</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
            <CardHeader><CardTitle>Iniciar Llamada VoIP</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>PI Key</Label><select value={selectedPiKey} onChange={e => setSelectedPiKey(e.target.value)} className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-md text-sm">
                {piKeys.map(k => <option key={k.id} value={k.id}>{k.piKey}</option>)}
              </select></div>
              <div><Label>Número Destino</Label><Input placeholder="+34" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} className="font-mono" /></div>
              <div className="flex items-center gap-2"><Switch checked={recordingEnabled} onCheckedChange={setRecordingEnabled} /><Label className="mb-0">Grabar llamada</Label></div>
              <Button onClick={() => initiateVoIPCallMutation.mutate()} disabled={initiateVoIPCallMutation.isPending} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                {initiateVoIPCallMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
                Iniciar Llamada
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Llamadas Activas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {activeCalls.map(call => (
                <div key={call.id} className="p-3 border border-primary/20 rounded-lg text-sm">
                  <p className="font-mono">{call.from} → {call.to}</p>
                  <p className="text-xs text-muted-foreground">Duración: {call.duration}s • Grabación: {call.recordingUrl}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recordings Tab */}
        <TabsContent value="recordings" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Grabaciones VoIP</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {recordings.map(rec => (
                <div key={rec.id} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Llamada {rec.callId}</p>
                    <p className="text-xs text-muted-foreground">{rec.date} • {rec.duration}s • {rec.size}MB</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Play className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost"><DownloadIcon className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asterisk Tab */}
        <TabsContent value="asterisk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
              <CardHeader><CardTitle>Asterisk Server</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span>Hostname:</span><span className="font-mono">{asteriskConfig.hostname}</span></div>
                  <div className="flex justify-between"><span>Puerto:</span><span className="font-mono">{asteriskConfig.port}</span></div>
                  <div className="flex justify-between"><span>Estado:</span><Badge className="bg-green-500/20 text-green-400">{asteriskConfig.status}</Badge></div>
                  <div className="flex justify-between"><span>Uptime:</span><span>{asteriskConfig.uptime}</span></div>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600"><RefreshCw className="h-4 w-4 mr-2" /> Reconectar</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Capacidad de Canales</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">{asteriskConfig.activeCalls}/{asteriskConfig.maxChannels}</div>
                  <p className="text-xs text-muted-foreground">Canales utilizados</p>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{width: `${(asteriskConfig.activeCalls / asteriskConfig.maxChannels) * 100}%`}} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Debian/Go Core Config</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              <div className="bg-muted p-2 rounded">OS: Debian 12 (Bookworm)</div>
              <div className="bg-muted p-2 rounded">Asterisk: 20.x LTS</div>
              <div className="bg-muted p-2 rounded">Go Core: v1.21</div>
              <div className="bg-muted p-2 rounded">Database: PostgreSQL 15</div>
              <div className="bg-muted p-2 rounded">SIP Protocol: RFC 3261</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
