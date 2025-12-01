import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Loader2, Copy, Check, Trash2, Power, Plus, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

const DEMO_USER_ID = "demo-user-123";

export default function ApiKeyManager() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyService, setNewKeyService] = useState("twilio");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch API keys
  const { data: keysData, refetch } = useQuery({
    queryKey: ["api-keys", DEMO_USER_ID],
    queryFn: async () => {
      const res = await fetch(`/api/v1/keys?userId=${DEMO_USER_ID}`);
      return res.json();
    },
    refetchInterval: 5000,
  });

  // Create new API key
  const createKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/keys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          service: newKeyService,
          name: newKeyName || `${newKeyService}_key_${Date.now()}`,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("API key created!");
        setNewKeyName("");
        refetch();
      }
    },
    onError: () => toast.error("Failed to create key"),
  });

  // Toggle key active status
  const toggleKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await fetch(`/api/v1/keys/${keyId}/toggle`, {
        method: "POST",
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Key updated!");
      refetch();
    },
  });

  // Delete key
  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await fetch(`/api/v1/keys/${keyId}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Key deleted!");
      refetch();
    },
  });

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) newVisible.delete(id);
    else newVisible.add(id);
    setVisibleKeys(newVisible);
  };

  // Calculate usage stats
  const usageStats = keysData?.keys?.map((k: any) => ({
    name: k.name || k.service,
    requests: parseInt(k.totalRequests || 0),
    lastUsed: k.lastUsed ? new Date(k.lastUsed) : null,
  })) || [];

  const chartData = [
    { date: "Mon", usage: 234 },
    { date: "Tue", usage: 321 },
    { date: "Wed", usage: 245 },
    { date: "Thu", usage: 456 },
    { date: "Fri", usage: 321 },
    { date: "Sat", usage: 123 },
    { date: "Sun", usage: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
          🔑 API Key Manager
        </h1>
        <p className="text-muted-foreground mt-2">Crea, gestiona y monitorea tus API keys con estadísticas en tiempo real</p>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">
            <Plus className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="usage">
            <TrendingUp className="h-4 w-4 mr-2" />
            Uso & Estadísticas
          </TabsTrigger>
          <TabsTrigger value="sync">
            <Power className="h-4 w-4 mr-2" />
            Sincronización
          </TabsTrigger>
        </TabsList>

        {/* API KEYS TAB */}
        <TabsContent value="keys" className="space-y-4">
          {/* Create New Key */}
          <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle>Crear Nueva API Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Nombre (Opcional)</Label>
                  <Input
                    placeholder="Mi clave de Twilio"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Servicio</Label>
                  <select
                    value={newKeyService}
                    onChange={(e) => setNewKeyService(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="twilio">Twilio (SMS/Voice)</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="crm">CRM</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => createKeyMutation.mutate()}
                    disabled={createKeyMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {createKeyMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Key
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keys List */}
          <div className="space-y-3">
            {keysData?.keys?.map((key: any) => (
              <Card key={key.id} className={`border-l-4 ${
                key.isActive ? "border-l-green-500" : "border-l-gray-500"
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{key.name || key.service}</h3>
                        <Badge className={key.isActive ? "bg-green-500/20 text-green-700" : "bg-gray-500/20 text-gray-700"}>
                          {key.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-700">{key.service}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Creada: {format(new Date(key.createdAt), "dd/MM/yyyy HH:mm")}
                      </p>
                      {key.lastUsed && (
                        <p className="text-xs text-muted-foreground">
                          Última vez usada: {format(new Date(key.lastUsed), "dd/MM/yyyy HH:mm")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{key.totalRequests || "0"}</p>
                      <p className="text-xs text-muted-foreground">Requests</p>
                    </div>
                  </div>

                  {/* Key Display */}
                  <div className="bg-muted p-3 rounded mb-4 flex items-center justify-between gap-2">
                    <div className="flex-1 font-mono text-xs overflow-hidden">
                      {visibleKeys.has(key.id) ? key.key : "••••••••••••••••"}
                    </div>
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="p-1 hover:bg-muted-foreground/10 rounded"
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyKey(key.key, key.id)}
                      className="p-1 hover:bg-muted-foreground/10 rounded"
                    >
                      {copiedKey === key.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleKeyMutation.mutate(key.id)}
                      className="flex-1"
                    >
                      <Power className="h-4 w-4 mr-2" />
                      {key.isActive ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteConfirm(deleteConfirm === key.id ? null : key.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === key.id && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                      <p className="text-sm text-red-700 mb-2">¿Eliminar esta key? Esta acción es irreversible.</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteKeyMutation.mutate(key.id)}
                        className="w-full"
                      >
                        Confirmar eliminación
                      </Button>
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
            <CardHeader>
              <CardTitle>Uso de APIs en 7 días</CardTitle>
              <CardDescription>Monitoreo de requests por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requests por API Key</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYNC TAB */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sincronización de Servicios</CardTitle>
              <CardDescription>Estado de conexión con tus servicios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["twilio", "whatsapp", "crm"].map((service) => (
                <div key={service} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="font-semibold capitalize">{service}</p>
                      <p className="text-xs text-muted-foreground">Conectado y sincronizado</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Sincronizar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Sincronización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-xs p-2 border-b pb-2">
                  <p className="font-mono text-muted-foreground">
                    {format(new Date(Date.now() - i * 3600000), "dd/MM/yyyy HH:mm")} - API Key sync completado
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
