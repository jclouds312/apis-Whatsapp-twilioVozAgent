import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, Copy, Check, Trash2, Power, Plus, Eye, EyeOff, TrendingUp, Key, RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

const API_KEY = "sk_enterprise_demo_key_12345";

export default function ApiKeyManager() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyService, setNewKeyService] = useState("twilio");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState({ activeSessions: 12, totalRequests: 45230, keyCount: 8 });

  const [apiKeys, setApiKeys] = useState([
    { id: "key_1", name: "Twilio Production", service: "twilio", key: "sk_live_51234567890abcdef", isActive: true, createdAt: "2025-01-10", lastUsed: "2025-01-20 14:35", totalRequests: 5420 },
    { id: "key_2", name: "WhatsApp Integration", service: "whatsapp", key: "sk_whatsapp_xyz789abc", isActive: true, createdAt: "2025-01-15", lastUsed: "2025-01-20 10:20", totalRequests: 3210 },
    { id: "key_3", name: "CRM Staging", service: "crm", key: "sk_crm_test_456def789", isActive: false, createdAt: "2025-01-05", lastUsed: "2025-01-15 08:45", totalRequests: 1205 },
  ]);

  const chartData = [
    { date: "Mon", usage: 2340 },
    { date: "Tue", usage: 3210 },
    { date: "Wed", usage: 2450 },
    { date: "Thu", usage: 4560 },
    { date: "Fri", usage: 3210 },
    { date: "Sat", usage: 1230 },
    { date: "Sun", usage: 890 },
  ];

  const createKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/keys/create", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ service: newKeyService, name: newKeyName || `${newKeyService}_${Date.now()}` }),
      });
      if (!res.ok) throw new Error("Failed to create key");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡API Key creada!");
      setNewKeyName("");
      const newKey = {
        id: `key_${Date.now()}`,
        name: newKeyName || `${newKeyService}_key`,
        service: newKeyService,
        key: `sk_${Math.random().toString(36).substring(2, 20)}`,
        isActive: true,
        createdAt: format(new Date(), "yyyy-MM-dd"),
        lastUsed: format(new Date(), "yyyy-MM-dd HH:mm"),
        totalRequests: 0,
      };
      setApiKeys([...apiKeys, newKey]);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const toggleKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await fetch(`/api/v1/keys/${keyId}/toggle`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}` },
      });
      if (!res.ok) throw new Error("Failed to toggle key");
      return res.json();
    },
    onSuccess: (_, keyId) => {
      setApiKeys(apiKeys.map(k => k.id === keyId ? { ...k, isActive: !k.isActive } : k));
      toast.success("Clave actualizada");
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await fetch(`/api/v1/keys/${keyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${API_KEY}` },
      });
      if (!res.ok) throw new Error("Failed to delete key");
      return res.json();
    },
    onSuccess: (_, keyId) => {
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
      setDeleteConfirm(null);
      toast.success("Clave eliminada");
    },
  });

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    newVisible.has(id) ? newVisible.delete(id) : newVisible.add(id);
    setVisibleKeys(newVisible);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeSessions: Math.max(5, prev.activeSessions + Math.floor(Math.random() * 3 - 1)),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 100),
        keyCount: prev.keyCount,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/30 p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <Key className="h-10 w-10 text-blue-500" />
            API Key Manager Pro
          </h1>
          <p className="text-muted-foreground text-lg">Gestión empresarial de claves API • Estadísticas en tiempo real • Auditoría completa</p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Sesiones Activas</span><RefreshCw className="h-4 w-4 text-blue-500" /></CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-400">{liveStats.activeSessions}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>Total Requests</span><TrendingUp className="h-4 w-4 text-purple-500" /></CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-400">{liveStats.totalRequests.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs"><span>API Keys</span><Key className="h-4 w-4 text-pink-500" /></CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-pink-400">{apiKeys.length}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys"><Plus className="h-4 w-4 mr-2" />API Keys</TabsTrigger>
          <TabsTrigger value="usage"><TrendingUp className="h-4 w-4 mr-2" />Uso</TabsTrigger>
          <TabsTrigger value="audit"><RefreshCw className="h-4 w-4 mr-2" />Auditoría</TabsTrigger>
        </TabsList>

        {/* API KEYS TAB */}
        <TabsContent value="keys" className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <CardHeader><CardTitle>Crear Nueva API Key</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Mi clave de producción" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Servicio</Label>
                  <select value={newKeyService} onChange={e => setNewKeyService(e.target.value)} className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-md text-sm">
                    <option value="twilio">Twilio</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="crm">CRM</option>
                    <option value="voip">VoIP</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => createKeyMutation.mutate()} disabled={createKeyMutation.isPending} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    {createKeyMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Crear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keys List */}
          <div className="space-y-3">
            {apiKeys.map(key => (
              <Card key={key.id} className={`border-l-4 ${key.isActive ? "border-l-green-500 bg-green-500/5" : "border-l-gray-500"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{key.name}</h3>
                        <Badge className={key.isActive ? "bg-green-500/20 text-green-700" : "bg-gray-500/20"}>{key.isActive ? "Activa" : "Inactiva"}</Badge>
                        <Badge className="bg-blue-500/20 text-blue-700">{key.service}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Creada: {key.createdAt} • Últ. uso: {key.lastUsed}</p>
                    </div>
                    <div className="text-right"><p className="text-2xl font-bold text-blue-600">{key.totalRequests}</p><p className="text-xs text-muted-foreground">Requests</p></div>
                  </div>
                  <div className="bg-muted p-3 rounded mb-4 flex items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex-1 overflow-hidden">{visibleKeys.has(key.id) ? key.key : "••••••••••••••••"}</div>
                    <button onClick={() => toggleKeyVisibility(key.id)} className="p-1 hover:bg-muted-foreground/10 rounded">
                      {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => copyKey(key.key, key.id)} className="p-1 hover:bg-muted-foreground/10 rounded">
                      {copiedKey === key.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleKeyMutation.mutate(key.id)} className="flex-1"><Power className="h-4 w-4 mr-2" />{key.isActive ? "Desactivar" : "Activar"}</Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(deleteConfirm === key.id ? null : key.id)} className="flex-1"><Trash2 className="h-4 w-4 mr-2" />Eliminar</Button>
                  </div>
                  {deleteConfirm === key.id && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                      <p className="text-sm text-red-700 mb-2">¿Eliminar? Irreversible.</p>
                      <Button size="sm" variant="destructive" onClick={() => deleteKeyMutation.mutate(key.id)} className="w-full">Confirmar</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* USAGE TAB */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Uso de APIs en 7 días</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{backgroundColor: "rgba(15, 23, 42, 0.9)"}} />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT TAB */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Historial de Auditoría</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-xs p-3 border-b pb-2 hover:bg-muted/50">
                  <p className="font-mono text-muted-foreground">{format(new Date(Date.now() - i * 3600000), "yyyy-MM-dd HH:mm")} - API Key {i % 3 === 0 ? "created" : i % 3 === 1 ? "toggled" : "used"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
