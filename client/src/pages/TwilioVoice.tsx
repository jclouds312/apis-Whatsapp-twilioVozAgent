import { useState, useEffect, useCallback } from "react";
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
  Phone, MessageSquare, Loader2, Plus, Trash2, Eye, Volume2, FileAudio, Users,
  TrendingUp, BarChart3, Zap, Settings, AlertCircle, CheckCircle2, Send, Clock,
  Radio, Network, Briefcase, LayoutGrid, Power, Copy, Download, Play, Pause,
  RefreshCw, Smartphone, DollarSign, Gauge, Radio as RadioIcon, Waves, Monitor,
  Code, Webhook, Save, X, ChevronRight, ArrowRight, ExternalLink
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const API_KEY = "your-api-key";

// Real-time data
const callAnalyticsData = [
  { time: "00:00", incoming: 25, outgoing: 18, duration: 145, cost: 2.50 },
  { time: "04:00", time_offset: -4, incoming: 12, outgoing: 8, duration: 78, cost: 1.30 },
  { time: "08:00", incoming: 85, outgoing: 62, duration: 450, cost: 7.50 },
  { time: "12:00", incoming: 145, outgoing: 118, duration: 890, cost: 14.80 },
  { time: "16:00", incoming: 120, outgoing: 95, duration: 720, cost: 12.00 },
  { time: "20:00", incoming: 95, outgoing: 72, duration: 580, cost: 9.70 },
  { time: "23:59", incoming: 48, outgoing: 35, duration: 280, cost: 4.70 },
];

const smsAnalyticsData = [
  { hour: "00:00", sent: 120, received: 95, delivered: 118, failed: 2, cost: 0.60 },
  { hour: "04:00", sent: 85, received: 60, delivered: 83, failed: 2, cost: 0.42 },
  { hour: "08:00", sent: 450, received: 320, delivered: 445, failed: 5, cost: 2.25 },
  { hour: "12:00", sent: 680, received: 520, delivered: 675, failed: 5, cost: 3.40 },
  { hour: "16:00", sent: 520, received: 380, delivered: 512, failed: 8, cost: 2.60 },
  { hour: "20:00", sent: 280, received: 220, delivered: 275, failed: 5, cost: 1.40 },
  { hour: "23:59", sent: 190, received: 150, delivered: 188, failed: 2, cost: 0.95 },
];

const costBreakdownData = [
  { name: "Llamadas", value: 45, color: "#ef4444" },
  { name: "SMS", value: 30, color: "#f97316" },
  { name: "IVR", value: 15, color: "#eab308" },
  { name: "Grabaciones", value: 10, color: "#a855f7" },
];

export default function TwilioVoicePage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [liveStats, setLiveStats] = useState({
    activeCalls: 12,
    queuedCalls: 4,
    avgWaitTime: 45,
    totalCost: 1284.56,
  });

  // Phone Numbers Management
  const [phoneNumbers, setPhoneNumbers] = useState([
    { sid: "PN1", number: "+1 (201) 555-0123", areaCode: "201", status: "active", created: "2024-01-15", monthlyFee: 1.00, calls: 543, sms: 2847, capabilities: ["voice", "sms", "mms"] },
    { sid: "PN2", number: "+1 (212) 555-0456", areaCode: "212", status: "active", created: "2024-02-10", monthlyFee: 1.00, calls: 298, sms: 1540, capabilities: ["voice", "sms"] },
    { sid: "PN3", number: "+1 (646) 555-0789", areaCode: "646", status: "inactive", created: "2024-03-05", monthlyFee: 1.00, calls: 0, sms: 0, capabilities: ["voice"] },
  ]);

  // Accounts
  const [accounts] = useState([
    { sid: "AC1", name: "Main Account", status: "active", balance: 542.30, created: "2024-01-10", tier: "Enterprise" },
    { sid: "AC2", name: "Marketing Team", status: "active", balance: 125.50, created: "2024-02-20", tier: "Professional" },
  ]);

  // IVR Flows
  const [ivrFlows] = useState([
    { id: "IVR1", name: "Support Flow", created: "2024-01-15", calls: 4520, avgDuration: 240 },
    { id: "IVR2", name: "Billing Flow", created: "2024-02-10", calls: 1820, avgDuration: 180 },
  ]);

  // Call Queues
  const [queues] = useState([
    { id: "Q1", name: "Support Queue", maxSize: 100, current: 8, avgWait: 180, agents: 5 },
    { id: "Q2", name: "Sales Queue", maxSize: 50, current: 3, avgWait: 45, agents: 3 },
  ]);

  // Campaigns
  const [campaigns] = useState([
    { id: "C1", name: "Appointment Reminder", type: "sms", recipients: 5000, sent: 4950, delivered: 4890, failed: 12, status: "completed", createdAt: "2025-01-18" },
    { id: "C2", name: "Product Launch", type: "sms", recipients: 3000, sent: 2950, delivered: 2925, failed: 5, status: "running", createdAt: "2025-01-19" },
    { id: "C3", name: "Survey Campaign", type: "voice", recipients: 1000, sent: 850, delivered: 820, failed: 15, status: "running", createdAt: "2025-01-20" },
  ]);

  // Recordings
  const [recordings] = useState([
    { id: "R1", date: "2025-01-20 14:35", duration: 342, from: "+1 (201) 555-0123", to: "+34912345678", size: 2.3, status: "completed", quality: "high" },
    { id: "R2", date: "2025-01-20 13:20", duration: 195, from: "+1 (212) 555-0456", to: "+18888888888", size: 1.8, status: "completed", quality: "medium" },
    { id: "R3", date: "2025-01-20 12:45", duration: 480, from: "+1 (201) 555-0123", to: "+5511999999999", size: 4.2, status: "completed", quality: "high" },
  ]);

  // Form states
  const [recipientPhone, setRecipientPhone] = useState("+34");
  const [smsMessage, setSmsMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceType, setVoiceType] = useState("Alice");
  const [newAreaCode, setNewAreaCode] = useState("201");
  const [campaignName, setCampaignName] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [campaignRecipients, setCampaignRecipients] = useState("1000");
  const [ivrName, setIvrName] = useState("");
  const [queueName, setQueueName] = useState("");
  const [queueSize, setQueueSize] = useState("50");
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  // Mutations
  const sendSmsMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !smsMessage) throw new Error("Completa todos los campos");
      const res = await fetch("/api/v1/twilio/sms", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, body: smsMessage }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡SMS enviado!");
      setSmsMessage("");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const makeCallMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone) throw new Error("Ingresa número");
      const res = await fetch("/api/v1/twilio/call", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, recordCall: true }),
      });
      if (!res.ok) throw new Error("Error al iniciar");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Llamada iniciada!");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const sendVoiceMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !voiceMessage) throw new Error("Completa campos");
      const res = await fetch("/api/v1/twilio/voice-message", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, message: voiceMessage, voice: voiceType }),
      });
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Mensaje de voz enviado!");
      setVoiceMessage("");
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Live update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeCalls: Math.max(0, prev.activeCalls + Math.floor(Math.random() * 5 - 2)),
        queuedCalls: Math.max(0, prev.queuedCalls + Math.floor(Math.random() * 3 - 1)),
        avgWaitTime: Math.max(20, prev.avgWaitTime + Math.floor(Math.random() * 10 - 5)),
        totalCost: prev.totalCost + (Math.random() * 2 - 0.5),
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/40 via-slate-900 to-slate-950 border border-red-500/30 p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center gap-3">
                <Phone className="h-10 w-10 text-red-500" />
                Twilio Enterprise v4.2
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Voice • SMS • IVR • Campaigns • Call Queues • Recordings • Account Management</p>
            </div>
            <div className="text-right space-y-2">
              <Badge className="bg-green-500/20 text-green-400 text-sm px-3 py-1">Conectado</Badge>
              <p className="text-sm text-muted-foreground">+ Números: {phoneNumbers.filter(p => p.status === "active").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between"><span>Llamadas Activas</span><Phone className="h-5 w-5 text-red-500" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-bold text-red-400">{liveStats.activeCalls}</div>
            <div className="text-xs text-muted-foreground">Avg: {liveStats.avgWaitTime}s espera</div>
            <div className="w-full bg-muted/30 h-1 rounded-full"><div className="bg-red-500 h-1 rounded-full" style={{width: `${(liveStats.activeCalls / 50) * 100}%`}} /></div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between"><span>SMS Hoy</span><MessageSquare className="h-5 w-5 text-orange-500" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-bold text-orange-400">2,847</div>
            <div className="text-xs text-muted-foreground">+12% vs ayer</div>
            <Button size="sm" variant="ghost" className="w-full text-xs mt-1">Ver detalles</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between"><span>Costo Total</span><DollarSign className="h-5 w-5 text-yellow-500" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-bold text-yellow-400">${liveStats.totalCost.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Este mes</div>
            <Button size="sm" variant="ghost" className="w-full text-xs mt-1">Facturación</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between"><span>Grabaciones</span><FileAudio className="h-5 w-5 text-purple-500" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-bold text-purple-400">{recordings.length}</div>
            <div className="text-xs text-muted-foreground">Total: {(recordings.reduce((a, r) => a + r.size, 0)).toFixed(1)}GB</div>
            <Button size="sm" variant="ghost" className="w-full text-xs mt-1">Ver grabaciones</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-primary/20 grid w-full grid-cols-8 gap-1">
          <TabsTrigger value="overview" className="text-xs"><BarChart3 className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="messaging" className="text-xs"><Send className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="calls" className="text-xs"><Phone className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="numbers" className="text-xs"><Smartphone className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="ivr" className="text-xs"><Radio className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="queues" className="text-xs"><Users className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs"><TrendingUp className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="config" className="text-xs"><Settings className="h-4 w-4" /></TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Volumen de Llamadas 24h</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                    <Bar dataKey="incoming" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="outgoing" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Costo por Servicio</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={costBreakdownData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Volumen de SMS 24h</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={smsAnalyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#fbbf24" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messaging Tab */}
        <TabsContent value="messaging" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
              <CardHeader><CardTitle className="flex gap-2"><Send className="h-4 w-4" /> Enviar SMS</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Teléfono</Label><Input placeholder="+34" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} /></div>
                <div><Label>Mensaje ({smsMessage.length}/160)</Label><Textarea placeholder="SMS..." value={smsMessage} onChange={e => setSmsMessage(e.target.value.slice(0, 160))} rows={3} /></div>
                <Button onClick={() => sendSmsMutation.mutate()} disabled={sendSmsMutation.isPending} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600">
                  {sendSmsMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar SMS
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
              <CardHeader><CardTitle className="flex gap-2"><Volume2 className="h-4 w-4" /> Mensaje Voz</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Teléfono</Label><Input placeholder="+34" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} /></div>
                <div><Label>Tipo Voz</Label><select value={voiceType} onChange={e => setVoiceType(e.target.value)} className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-md text-sm"><option>Alice</option><option>Woman</option><option>Man</option></select></div>
                <div><Label>Mensaje</Label><Textarea placeholder="Texto..." value={voiceMessage} onChange={e => setVoiceMessage(e.target.value)} rows={2} /></div>
                <Button onClick={() => sendVoiceMutation.mutate()} disabled={sendVoiceMutation.isPending} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Volume2 className="h-4 w-4 mr-2" /> Enviar Voz
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
              <CardHeader><CardTitle className="flex gap-2"><Phone className="h-4 w-4" /> Llamada</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Teléfono</Label><Input placeholder="+34" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} /></div>
                <div className="bg-green-500/10 border border-green-500/30 p-2 rounded text-xs space-y-1">
                  <p className="text-green-400">✓ Grabación automática</p>
                  <p className="text-muted-foreground">Máx: 1 hora</p>
                </div>
                <Button onClick={() => makeCallMutation.mutate()} disabled={makeCallMutation.isPending} className="w-full bg-gradient-to-r from-red-600 to-orange-600">
                  {makeCallMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
                  Iniciar Llamada
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Grabaciones Recientes</CardTitle><CardDescription>{recordings.length} grabaciones en total</CardDescription></CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {recordings.map(rec => (
                <div key={rec.id} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-sm font-mono">{rec.from} → {rec.to}</p>
                    <p className="text-xs text-muted-foreground">{rec.date} • {(rec.duration / 60).toFixed(2)}m • {rec.size}MB</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Play className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phone Numbers Tab */}
        <TabsContent value="numbers" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader>
              <CardTitle>Números de Teléfono Activos</CardTitle>
              <CardDescription>Gestiona tus números y compra nuevos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {phoneNumbers.map(num => (
                <div key={num.sid} className="p-4 border border-primary/20 rounded-lg hover:bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-lg">{num.number}</p>
                      <p className="text-xs text-muted-foreground">{num.capabilities.join(", ")}</p>
                    </div>
                    <Badge className={num.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"}>{num.status}</Badge>
                  </div>
                  <div className="grid gap-2 text-xs">
                    <div className="flex justify-between"><span>Llamadas:</span><span className="font-bold text-red-400">{num.calls}</span></div>
                    <div className="flex justify-between"><span>SMS:</span><span className="font-bold text-orange-400">{num.sms}</span></div>
                    <div className="flex justify-between"><span>Fee Mensual:</span><span className="font-bold">${num.monthlyFee}</span></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30">
            <CardHeader><CardTitle>Comprar Nuevo Número</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Área (201, 212, 646, etc.)</Label><Input placeholder="201" value={newAreaCode} onChange={e => setNewAreaCode(e.target.value)} maxLength={3} /></div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600"><Plus className="h-4 w-4 mr-2" /> Comprar Número</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IVR Tab */}
        <TabsContent value="ivr" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
              <CardHeader><CardTitle>Crear IVR</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Nombre del Flujo</Label><Input placeholder="Mi IVR" value={ivrName} onChange={e => setIvrName(e.target.value)} /></div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"><Plus className="h-4 w-4 mr-2" /> Crear IVR</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>IVR Flows Activos</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {ivrFlows.map(ivr => (
                  <div key={ivr.id} className="p-3 border border-primary/20 rounded-lg text-sm">
                    <p className="font-medium">{ivr.name}</p>
                    <p className="text-xs text-muted-foreground">{ivr.calls} llamadas • Duración prom: {ivr.avgDuration}s</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Queues Tab */}
        <TabsContent value="queues" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Colas de Llamadas</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {queues.map(q => (
                  <div key={q.id} className="p-3 border border-primary/20 rounded-lg">
                    <div className="flex justify-between items-center"><span className="font-medium">{q.name}</span><Badge>{q.current}/{q.maxSize}</Badge></div>
                    <p className="text-xs text-muted-foreground mt-1">Espera: {q.avgWait}s • Agentes: {q.agents}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30">
              <CardHeader><CardTitle>Nueva Cola</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Nombre</Label><Input placeholder="Support Queue" value={queueName} onChange={e => setQueueName(e.target.value)} /></div>
                <div><Label>Tamaño Máx</Label><Input placeholder="50" type="number" value={queueSize} onChange={e => setQueueSize(e.target.value)} /></div>
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"><Plus className="h-4 w-4 mr-2" /> Crear Cola</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Campañas SMS/Voice</CardTitle><CardDescription>{campaigns.length} campañas totales</CardDescription></CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {campaigns.map(c => (
                <div key={c.id} className="p-3 border border-primary/20 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    <Badge className={c.status === "running" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"}>{c.status}</Badge>
                  </div>
                  <div className="grid gap-2 text-xs">
                    <div className="flex justify-between"><span>Enviados:</span><span>{c.sent}/{c.recipients}</span></div>
                    <div className="flex justify-between"><span>Entregados:</span><span className="text-green-400">{c.delivered}</span></div>
                    <div className="flex justify-between"><span>Fallidos:</span><span className="text-red-400">{c.failed}</span></div>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1.5"><div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-1.5 rounded-full" style={{width: `${(c.sent / c.recipients) * 100}%`}} /></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/30">
            <CardHeader><CardTitle>Nueva Campaña SMS</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Nombre</Label><Input placeholder="Nombre campaña" value={campaignName} onChange={e => setCampaignName(e.target.value)} /></div>
              <div><Label>Recipients</Label><Input placeholder="1000" type="number" value={campaignRecipients} onChange={e => setCampaignRecipients(e.target.value)} /></div>
              <div><Label>Mensaje</Label><Textarea placeholder="Texto..." value={campaignBody} onChange={e => setCampaignBody(e.target.value)} rows={2} /></div>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-red-600"><Send className="h-4 w-4 mr-2" /> Crear Campaña</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Cuentas</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {accounts.map(acc => (
                  <div key={acc.sid} className="p-3 border border-primary/20 rounded-lg text-sm">
                    <p className="font-medium">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.tier} • ${acc.balance}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader><CardTitle>Webhook</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <Label>URL Webhook</Label>
                  <div className="flex gap-2">
                    <Input placeholder="https://api.ejemplo.com/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} readOnly className="text-xs" />
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(webhookUrl)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
                <Button className="w-full" size="sm"><RefreshCw className="h-4 w-4 mr-2" /> Test Webhook</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader><CardTitle>Scripts & Widgets</CardTitle><CardDescription>Copiar y pegar en tu aplicación</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-mono">Widget de Llamadas</p>
                <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">&lt;div id="twilio-call-widget"&gt;&lt;/div&gt;</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('<div id="twilio-call-widget"></div>')}><Copy className="h-3 w-3 mr-1" /> Copiar</Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-mono">Widget de SMS</p>
                <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">&lt;div id="twilio-sms-widget"&gt;&lt;/div&gt;</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('<div id="twilio-sms-widget"></div>')}><Copy className="h-3 w-3 mr-1" /> Copiar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
