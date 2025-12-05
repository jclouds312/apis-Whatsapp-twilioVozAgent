import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Users,
  Settings,
  BarChart3,
  Copy,
  Trash2,
  Power,
  Eye,
  EyeOff,
  TrendingUp,
  Zap,
  ShieldCheck,
  Server,
  Link as LinkIcon
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DEMO_USER_ID = "demo-user-123";
const DEMO_WABA_ID = import.meta.env.VITE_REACT_APP_WABA_ID || "123456789";
const DEMO_BUSINESS_ID = import.meta.env.VITE_REACT_APP_BUSINESS_ID || "987654321";

// Sample data
const messageVolumeData = [
  { time: "00:00", sent: 120, received: 95 },
  { time: "06:00", sent: 200, received: 180 },
  { time: "12:00", sent: 580, received: 520 },
  { time: "18:00", sent: 420, received: 380 },
  { time: "23:59", sent: 150, received: 130 },
];

const templateCategoryData = [
  { name: "Marketing", value: 45 },
  { name: "Utility", value: 30 },
  { name: "Authentication", value: 20 },
  { name: "Service", value: 5 },
];

const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#f59e0b"];

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateLanguage, setTemplateLanguage] = useState("es");
  const [templateCategory, setTemplateCategory] = useState("utility");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());

  // Mock templates data
  const [templates] = useState([
    { id: "tpl_1", name: "welcome_message", language: "es", status: "approved", category: "marketing", created: "2025-01-15" },
    { id: "tpl_2", name: "order_update", language: "es", status: "approved", category: "utility", created: "2025-01-10" },
    { id: "tpl_3", name: "verification_code", language: "es", status: "approved", category: "authentication", created: "2025-01-05" },
    { id: "tpl_4", name: "promo_winter", language: "es", status: "pending", category: "marketing", created: "2025-01-20" },
  ]);

  // Mock phone numbers
  const [phoneNumbers] = useState([
    { id: "ph_1", display: "+34 91 234 5678", quality: "high", verified: true, status: "active" },
    { id: "ph_2", display: "+34 93 456 7890", quality: "medium", verified: true, status: "active" },
    { id: "ph_3", display: "+34 88 765 4321", quality: "high", verified: false, status: "inactive" },
  ]);

  // Mock users
  const [assignedUsers] = useState([
    { id: "user_1", name: "María García", email: "maria@company.com", role: "admin" },
    { id: "user_2", name: "Carlos López", email: "carlos@company.com", role: "operator" },
    { id: "user_3", name: "Ana Martínez", email: "ana@company.com", role: "viewer" },
  ]);

  // Mock extended credits
  const [extendedCredits] = useState([
    { id: "cred_1", owner: "Company A", amount: 5000, used: 3200, currency: "USD" },
    { id: "cred_2", owner: "Company B", amount: 10000, used: 8500, currency: "USD" },
  ]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !messageText) {
        throw new Error("Please fill in all fields");
      }
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success("¡Mensaje enviado exitosamente!");
      setMessageText("");
      setRecipientPhone("");
    },
    onError: (error: any) => toast.error(error.message || "Error al enviar mensaje"),
  });

  // Send template mutation
  const sendTemplateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTemplate || !recipientPhone) {
        throw new Error("Selecciona template y destinatario");
      }
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success("¡Template enviado!");
      setRecipientPhone("");
      setSelectedTemplate("");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-green-500" />
            WhatsApp Business API v2.4
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestión completa • Meta Graph API v21 • Templates • Usuarios • Créditos • Mensajería
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30 hover:border-green-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mensajes Enviados</CardTitle>
            <Send className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">24,582</div>
            <p className="text-xs text-muted-foreground mt-2">+12.5% este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Templates Activos</CardTitle>
            <BarChart3 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">14</div>
            <p className="text-xs text-muted-foreground mt-2">4 pendientes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/30 hover:border-teal-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Números Verificados</CardTitle>
            <Phone className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-500">3</div>
            <p className="text-xs text-muted-foreground mt-2">2 activos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/30 hover:border-cyan-500/50 transition-all shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crédito Disponible</CardTitle>
            <TrendingUp className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-500">$8,450</div>
            <p className="text-xs text-muted-foreground mt-2">85% disponible</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-primary/20 shadow-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Mensajería
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="phone-numbers" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Números
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Créditos
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Volumen de Mensajes 24h</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messageVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(34, 197, 94, 0.5)"}} />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="received" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
              <CardHeader>
                <CardTitle>Categorías de Templates</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={templateCategoryData} cx="50%" cy="50%" labelLine={false} label={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} outerRadius={100} fill="#8884d8" dataKey="value">
                      {templateCategoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(34, 197, 94, 0.5)"}} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-primary/20">
            <CardHeader>
              <CardTitle>WABA Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">WABA ID</p>
                <div className="flex gap-2">
                  <code className="flex-1 bg-muted/50 px-3 py-2 rounded font-mono text-sm">{DEMO_WABA_ID}</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(DEMO_WABA_ID, "waba")}>
                    {copiedId === "waba" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Business ID</p>
                <div className="flex gap-2">
                  <code className="flex-1 bg-muted/50 px-3 py-2 rounded font-mono text-sm">{DEMO_BUSINESS_ID}</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(DEMO_BUSINESS_ID, "business")}>
                    {copiedId === "business" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
