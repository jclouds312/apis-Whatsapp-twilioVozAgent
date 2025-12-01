import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, MessageSquare, Loader2, Plus, Trash2, Eye, Volume2, FileAudio, Users,
  TrendingUp, BarChart3, Zap, Settings, AlertCircle, CheckCircle2, Send, Clock,
  Radio, Network, Briefcase, LayoutGrid
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DEMO_USER_ID = "demo-user-123";
const API_KEY = "your-api-key";

// Mock Analytics Data
const callAnalyticsData = [
  { date: "Jan 15", incoming: 125, outgoing: 98, duration: 285 },
  { date: "Jan 16", incoming: 156, outgoing: 142, duration: 320 },
  { date: "Jan 17", incoming: 189, outgoing: 176, duration: 395 },
  { date: "Jan 18", incoming: 234, outgoing: 198, duration: 445 },
  { date: "Jan 19", incoming: 267, outgoing: 215, duration: 520 },
  { date: "Jan 20", incoming: 298, outgoing: 245, duration: 580 },
];

const smsAnalyticsData = [
  { date: "Jan 15", sent: 450, received: 320, delivered: 98 },
  { date: "Jan 16", sent: 520, received: 380, delivered: 99 },
  { date: "Jan 17", sent: 680, received: 520, delivered: 99 },
  { date: "Jan 18", sent: 750, received: 620, delivered: 98 },
  { date: "Jan 19", sent: 890, received: 750, delivered: 99 },
  { date: "Jan 20", sent: 1050, received: 850, delivered: 99 },
];

export default function TwilioVoicePage() {
  const [recipientPhone, setRecipientPhone] = useState("+34");
  const [smsMessage, setSmsMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceType, setVoiceType] = useState("Alice");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAreaCode, setNewAreaCode] = useState("201");
  const [campaignName, setCampaignName] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [ivrName, setIvrName] = useState("");
  const [queueName, setQueueName] = useState("");
  const [queueSize, setQueueSize] = useState("50");

  // Mock data
  const [accounts] = useState([
    { sid: "AC1", name: "Main Account", status: "active", created: "2024-01-15" },
    { sid: "AC2", name: "Marketing Team", status: "active", created: "2024-02-10" },
  ]);

  const [phoneNumbers] = useState([
    { sid: "PN1", number: "+1 (201) 555-0123", areaCode: "201", status: "active", capabilities: ["voice", "sms"] },
    { sid: "PN2", number: "+1 (212) 555-0456", areaCode: "212", status: "active", capabilities: ["voice", "sms"] },
    { sid: "PN3", number: "+1 (646) 555-0789", areaCode: "646", status: "inactive", capabilities: ["voice"] },
  ]);

  const [campaigns] = useState([
    { id: "C1", name: "Summer Promo", type: "sms", recipients: 5000, sent: 4850, failed: 12, status: "completed" },
    { id: "C2", name: "Product Update", type: "sms", recipients: 3000, sent: 2950, failed: 5, status: "running" },
  ]);

  const [queues] = useState([
    { id: "Q1", name: "Support Queue", maxSize: 50, current: 8, avgWait: 180 },
    { id: "Q2", name: "Sales Queue", maxSize: 30, current: 3, avgWait: 45 },
  ]);

  const [recordings] = useState([
    { id: "R1", date: "2025-01-20 14:35", duration: "5:42", from: "+1 (201) 555-0123", size: "2.3MB" },
    { id: "R2", date: "2025-01-20 13:20", duration: "3:15", from: "+1 (212) 555-0456", size: "1.8MB" },
  ]);

  // Mutations
  const sendSmsMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !smsMessage) throw new Error("Completa todos los campos");
      const res = await fetch("/api/v1/twilio/sms", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, body: smsMessage }),
      });
      if (!res.ok) throw new Error("Error al enviar SMS");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡SMS enviado!");
      setSmsMessage("");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const sendVoiceMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !voiceMessage) throw new Error("Completa todos los campos");
      const res = await fetch("/api/v1/twilio/voice-message", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, message: voiceMessage, voice: voiceType }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Mensaje de voz enviado!");
      setVoiceMessage("");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
            <Phone className="h-8 w-8 text-red-600" />
            Twilio Enterprise v2.4
          </h1>
          <p className="text-muted-foreground mt-2">Voice • SMS • IVR • Campaigns • Account Management • Call Queues • Recordings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/50">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-gradient-to-r from-red-600 to-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Llamadas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">543</div>
            <p className="text-xs text-muted-foreground mt-1">+12%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">SMS Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">+8.5%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Números Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{phoneNumbers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">2 inactivos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Grabaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">1,245</div>
            <p className="text-xs text-muted-foreground mt-1">4.2GB</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Campañas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">1 activa</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-card border border-primary/20 shadow-lg grid w-full grid-cols-6">
          <TabsTrigger value="overview"><BarChart3 className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="messaging"><MessageSquare className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="calls"><Phone className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="accounts"><Briefcase className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="advanced"><Network className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="resources"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Volumen de Llamadas</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                    <Legend />
                    <Bar dataKey="incoming" fill="#ef4444" />
                    <Bar dataKey="outgoing" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Volumen SMS</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={smsAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#eab308" strokeWidth={2} />
                    <Line type="monotone" dataKey="delivered" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Messaging Tab */}
        <TabsContent value="messaging" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
              <CardHeader><CardTitle>SMS</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="+34" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Mensaje ({smsMessage.length}/160)</Label>
                  <Textarea placeholder="Escribe SMS..." value={smsMessage} onChange={(e) => setSmsMessage(e.target.value.slice(0, 160))} rows={3} />
                </div>
                <Button onClick={() => sendSmsMutation.mutate()} disabled={sendSmsMutation.isPending} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600">
                  {sendSmsMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar SMS
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
              <CardHeader><CardTitle>Voz</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="+34" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo Voz</Label>
                  <select value={voiceType} onChange={(e) => setVoiceType(e.target.value)} className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-md text-sm">
                    <option value="Alice">Alice (Femenina)</option>
                    <option value="Woman">Woman (Femenina)</option>
                    <option value="Man">Man (Masculina)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Mensaje</Label>
                  <Textarea placeholder="Texto..." value={voiceMessage} onChange={(e) => setVoiceMessage(e.target.value)} rows={2} />
                </div>
                <Button onClick={() => sendVoiceMutation.mutate()} disabled={sendVoiceMutation.isPending} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
              <CardHeader><CardTitle>Llamada</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="+34" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="font-mono" />
                </div>
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-xs space-y-1">
                  <p className="text-green-400">✓ Grabación automática</p>
                  <p className="text-muted-foreground">Duración máx: 1 hora</p>
                </div>
                <Button onClick={() => makeCallMutation.mutate()} disabled={makeCallMutation.isPending} className="w-full bg-gradient-to-r from-red-600 to-orange-600">
                  {makeCallMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
                  Llamar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader>
              <CardTitle>Grabaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recordings.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{rec.from}</p>
                    <p className="text-xs text-muted-foreground">{rec.date} • {rec.duration} • {rec.size}</p>
                  </div>
                  <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Nueva Cuenta</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Mi cuenta" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600">Crear</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Nuevo Número</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Área (USA)</Label>
                  <Input placeholder="201" value={newAreaCode} onChange={(e) => setNewAreaCode(e.target.value)} />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-green-600">Comprar</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Cuentas</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {accounts.map((acc) => (
                  <div key={acc.sid} className="text-sm p-2 border border-primary/20 rounded">
                    <p className="font-medium">{acc.name}</p>
                    <Badge className="mt-1 text-xs bg-green-500/20 text-green-400">{acc.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Números de Teléfono</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {phoneNumbers.map((num) => (
                <div key={num.sid} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg">
                  <div>
                    <p className="font-medium font-mono text-sm">{num.number}</p>
                    <p className="text-xs text-muted-foreground">{num.capabilities.join(", ")}</p>
                  </div>
                  <Badge className={num.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"}>{num.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Crear IVR</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Mi IVR" value={ivrName} onChange={(e) => setIvrName(e.target.value)} />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600">Crear</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Crear Cola</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Mi cola" value={queueName} onChange={(e) => setQueueName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tamaño Máx</Label>
                  <Input placeholder="50" value={queueSize} onChange={(e) => setQueueSize(e.target.value)} />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-blue-600">Crear</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Colas de Llamadas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {queues.map((q) => (
                <div key={q.id} className="p-3 border border-primary/20 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{q.name}</span>
                    <span className="text-sm text-muted-foreground">{q.current}/{q.maxSize}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Espera prom: {Math.round(q.avgWait/60)}m</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Campañas SMS</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {campaigns.map((c) => (
                <div key={c.id} className="p-3 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{c.name}</span>
                    <Badge className={c.status === "running" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"}>{c.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                    <span>Enviados: {c.sent}/{c.recipients}</span>
                    <span>Fallidos: {c.failed}</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-400 h-1 rounded-full" style={{width: `${(c.sent/c.recipients)*100}%`}} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader>
              <CardTitle>Scripts & Widgets</CardTitle>
              <CardDescription>Copiar y pegar en tu aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-mono">Widget SMS embebido</p>
                <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
                  &lt;div id="nexus-sms-widget"&gt;&lt;/div&gt;
                </code>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-mono">Widget de Llamadas</p>
                <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
                  &lt;div id="nexus-call-widget"&gt;&lt;/div&gt;
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs font-mono">
              <p>POST /api/v1/twilio/sms</p>
              <p>POST /api/v1/twilio/call</p>
              <p>POST /api/v1/twilio/voice-message</p>
              <p>GET /api/v1/twilio/call/:callSid</p>
              <p>GET /api/v1/twilio/recordings/:callSid</p>
              <p>POST /api/v1/twilio/extension</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
