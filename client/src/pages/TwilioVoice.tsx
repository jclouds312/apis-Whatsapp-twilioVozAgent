import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, MessageSquare, Loader2, Copy, Check, Send, Clock, TrendingUp, 
  Zap, BarChart3, Plus, Trash2, Eye, Volume2, FileAudio, Users
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DEMO_USER_ID = "demo-user-123";
const API_KEY = "your-api-key";

// Mock data
const callVolumeData = [
  { time: "00:00", calls: 42, duration: 150 },
  { time: "06:00", calls: 28, duration: 95 },
  { time: "12:00", calls: 156, duration: 520 },
  { time: "18:00", calls: 98, duration: 340 },
  { time: "23:59", calls: 35, duration: 120 },
];

const smsVolumeData = [
  { time: "00:00", sent: 120, received: 95 },
  { time: "06:00", sent: 200, received: 180 },
  { time: "12:00", sent: 580, received: 520 },
  { time: "18:00", sent: 420, received: 380 },
  { time: "23:59", sent: 150, received: 130 },
];

const recentCalls = [
  { id: "call_1", to: "+34 91 234 5678", duration: 245, status: "completed", date: "2025-01-20 14:30" },
  { id: "call_2", to: "+34 93 456 7890", duration: 180, status: "completed", date: "2025-01-20 13:15" },
  { id: "call_3", to: "+34 88 765 4321", duration: 0, status: "failed", date: "2025-01-20 12:45" },
];

const recentSMS = [
  { id: "sms_1", to: "+34 91 234 5678", body: "Hola, confirmación de pedido", status: "delivered", date: "2025-01-20 14:25" },
  { id: "sms_2", to: "+34 93 456 7890", body: "Tu código de verificación es: 123456", status: "delivered", date: "2025-01-20 13:10" },
  { id: "sms_3", to: "+34 88 765 4321", body: "Recordatorio: Tu cita es mañana", status: "pending", date: "2025-01-20 12:40" },
];

const extensions = [
  { id: "ext_1", number: "1001", name: "Soporte", status: "active", calls: 124 },
  { id: "ext_2", number: "1002", name: "Ventas", status: "active", calls: 89 },
  { id: "ext_3", number: "1003", name: "Facturación", status: "inactive", calls: 0 },
];

export default function TwilioVoicePage() {
  const [recipientPhone, setRecipientPhone] = useState("+34");
  const [smsMessage, setSmsMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceType, setVoiceType] = useState("Alice");
  const [extensionName, setExtensionName] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Send SMS mutation
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
      toast.success("¡SMS enviado correctamente!");
      setSmsMessage("");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Send Voice mutation
  const sendVoiceMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !voiceMessage) throw new Error("Completa todos los campos");
      const res = await fetch("/api/v1/twilio/voice-message", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, message: voiceMessage, voice: voiceType }),
      });
      if (!res.ok) throw new Error("Error al enviar mensaje de voz");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Mensaje de voz enviado!");
      setVoiceMessage("");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Make Call mutation
  const makeCallMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone) throw new Error("Ingresa un número telefónico");
      const res = await fetch("/api/v1/twilio/call", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientPhone, recordCall: true }),
      });
      if (!res.ok) throw new Error("Error al iniciar llamada");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Llamada iniciada!");
      setRecipientPhone("+34");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
            <Phone className="h-8 w-8 text-red-600" />
            Twilio Voice & SMS v2.4
          </h1>
          <p className="text-muted-foreground mt-2">Llamadas • Mensajes de voz • SMS • Extensiones • Grabaciones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/50">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reportes
          </Button>
          <Button className="bg-gradient-to-r from-red-600 to-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Llamada
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/30 hover:border-red-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Llamadas Hoy</CardTitle>
            <Phone className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">359</div>
            <p className="text-xs text-muted-foreground mt-2">+8.2% vs ayer</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 hover:border-orange-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duración Promedio</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">5m 42s</div>
            <p className="text-xs text-muted-foreground mt-2">Tiempo medio de llamada</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-500/30 hover:border-yellow-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SMS Enviados</CardTitle>
            <MessageSquare className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">2,847</div>
            <p className="text-xs text-muted-foreground mt-2">+15.3% este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 hover:border-amber-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Grabaciones</CardTitle>
            <FileAudio className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">1,245</div>
            <p className="text-xs text-muted-foreground mt-2">Almacenadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-card border border-primary/20 shadow-lg grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Voz
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Llamadas
          </TabsTrigger>
          <TabsTrigger value="extensions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Extensiones
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Volumen de Llamadas 24h</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(239, 68, 68, 0.5)"}} />
                    <Legend />
                    <Bar dataKey="calls" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="duration" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Volumen SMS 24h</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={smsVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(234, 179, 8, 0.5)"}} />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#eab308" strokeWidth={2} />
                    <Line type="monotone" dataKey="received" stroke="#ca8a04" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
              <CardHeader>
                <CardTitle>Enviar SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="+34 91 234 5678"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mensaje ({smsMessage.length}/160)</Label>
                  <Textarea
                    placeholder="Escribe tu SMS..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value.slice(0, 160))}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={() => sendSmsMutation.mutate()}
                  disabled={sendSmsMutation.isPending || !smsMessage}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600"
                >
                  {sendSmsMutation.isPending ? (
                    <> <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <> <Send className="h-4 w-4 mr-2" /> Enviar SMS</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Historial de SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentSMS.map((sms) => (
                  <div key={sms.id} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-muted/30">
                    <div className="flex-1">
                      <p className="font-medium font-mono text-sm">{sms.to}</p>
                      <p className="text-xs text-muted-foreground mt-1">{sms.body}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={sms.status === "delivered" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {sms.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{sms.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice" className="space-y-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
            <CardHeader>
              <CardTitle>Enviar Mensaje de Voz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="+34 93 456 7890"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Voz</Label>
                  <select
                    value={voiceType}
                    onChange={(e) => setVoiceType(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-md text-sm"
                  >
                    <option value="Alice">Alice (Femenina)</option>
                    <option value="Woman">Woman (Femenina)</option>
                    <option value="Man">Man (Masculina)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mensaje de Voz</Label>
                <Textarea
                  placeholder="Escribe el mensaje que se convertirá en voz..."
                  value={voiceMessage}
                  onChange={(e) => setVoiceMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={() => sendVoiceMutation.mutate()}
                disabled={sendVoiceMutation.isPending || !voiceMessage}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {sendVoiceMutation.isPending ? (
                  <> <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
                ) : (
                  <> <Volume2 className="h-4 w-4 mr-2" /> Enviar Mensaje de Voz</>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
              <CardHeader>
                <CardTitle>Iniciar Llamada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Número Destino</Label>
                  <Input
                    placeholder="+34 88 765 4321"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-xs space-y-1">
                  <p className="text-green-400 font-semibold">✓ Grabación automática</p>
                  <p className="text-muted-foreground">Se guardará en el sistema</p>
                </div>
                <Button
                  onClick={() => makeCallMutation.mutate()}
                  disabled={makeCallMutation.isPending || !recipientPhone}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600"
                >
                  {makeCallMutation.isPending ? (
                    <> <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Iniciando...</>
                  ) : (
                    <> <Phone className="h-4 w-4 mr-2" /> Hacer Llamada</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Llamadas Recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-muted/30">
                    <div className="flex-1">
                      <p className="font-medium font-mono text-sm">{call.to}</p>
                      <p className="text-xs text-muted-foreground mt-1">Duración: {call.duration}s • {call.date}</p>
                    </div>
                    <Badge className={call.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {call.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Extensions Tab */}
        <TabsContent value="extensions" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Extensiones Telefónicas</CardTitle>
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Extensión
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {extensions.map((ext) => (
                <div key={ext.id} className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-muted/30">
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {ext.number}
                      <span className="text-sm font-normal text-muted-foreground">• {ext.name}</span>
                      <Badge className={ext.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                        {ext.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{ext.calls} llamadas</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Documentation */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Endpoints API Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">POST /api/v1/twilio/sms</code>
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">POST /api/v1/twilio/call</code>
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">POST /api/v1/twilio/voice-message</code>
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">GET /api/v1/twilio/call/:callSid</code>
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">GET /api/v1/twilio/recordings/:callSid</code>
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">POST /api/v1/twilio/extension</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
