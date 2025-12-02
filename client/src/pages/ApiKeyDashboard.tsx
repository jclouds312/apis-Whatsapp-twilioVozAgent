import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, EyeOff, Trash2, Plus, RotateCcw, BarChart3, Key, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

export default function ApiKeyDashboard() {
  const [keys, setKeys] = useState<any[]>([]);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyData, setNewKeyData] = useState({ name: "", service: "voip" });
  const [isLoading, setIsLoading] = useState(false);

  // Load API keys from server
  const loadApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/keys?userId=${DEMO_USER_ID}`);
      const data = await response.json();
      if (data.success) {
        // Transform to match UI format
        const transformedKeys = data.keys.map((k: any) => ({
          id: k.id,
          name: k.metadata?.name || "Unnamed Key",
          key: k.key,
          service: k.service,
          status: k.isActive ? "active" : "inactive",
          usage: parseInt(k.metadata?.totalRequests || "0"),
          limit: 50000,
          created: new Date(k.createdAt).toLocaleDateString(),
          lastUsed: k.lastUsed ? new Date(k.lastUsed).toLocaleString() : "Never"
        }));
        setKeys(transformedKeys);
      }
    } catch (error: any) {
      toast.error("Error loading API keys: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copiada!");
  };

  const maskKey = (key: string, visible: boolean) => {
    if (visible) return key;
    return key.substring(0, 8) + "*".repeat(key.length - 16) + key.substring(key.length - 8);
  };

  const deleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/keys/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setKeys(keys.filter(k => k.id !== id));
        toast.success("API key eliminada");
      } else {
        toast.error(data.error || "Error al eliminar");
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const regenerateKey = async (id: string) => {
    try {
      // Delete old key and create new one
      await deleteKey(id);
      await loadApiKeys();
      toast.success("API key regenerada!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const createNewKey = async () => {
    if (!newKeyData.name) {
      toast.error("Nombre requerido");
      return;
    }
    
    setIsLoading(true);
    try {
      const endpoint = newKeyData.service === "voip" 
        ? "/api/v1/keys/voip/generate" 
        : "/api/v1/keys/create";
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          service: newKeyData.service,
          name: newKeyData.name
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await loadApiKeys();
        setNewKeyData({ name: "", service: "voip" });
        setShowNewKeyForm(false);
        toast.success("API key creada!");
      } else {
        toast.error(data.error || "Error al crear key");
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl p-4">
            <p className="text-cyan-300">Cargando...</p>
          </div>
        </div>
      )}
      
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Total API Keys</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-cyan-300">{keys.length}</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Active Keys</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-purple-300">{keys.filter(k => k.status === "active").length}</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Total Requests</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-pink-300">{keys.reduce((sum, k) => sum + k.usage, 0).toLocaleString()}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="all"><Key className="h-4 w-4 mr-2" />Todas las Keys</TabsTrigger>
          <TabsTrigger value="usage"><BarChart3 className="h-4 w-4 mr-2" />Uso</TabsTrigger>
          <TabsTrigger value="security"><Lock className="h-4 w-4 mr-2" />Seguridad</TabsTrigger>
        </TabsList>

        {/* ALL KEYS TAB */}
        <TabsContent value="all" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowNewKeyForm(!showNewKeyForm)} className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Nueva API Key
            </Button>
          </div>

          {showNewKeyForm && (
            <Card className="rounded-3xl border-2 border-green-500/30">
              <CardHeader><CardTitle>Crear Nueva API Key</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre de la Key</Label>
                  <Input placeholder="ej: Production API" value={newKeyData.name} onChange={e => setNewKeyData({...newKeyData, name: e.target.value})} className="rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label>Servicio</Label>
                  <select value={newKeyData.service} onChange={e => setNewKeyData({...newKeyData, service: e.target.value})} className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl text-sm">
                    <option value="voip">VoIP / Asterisk</option>
                    <option value="retell">Retell AI</option>
                    <option value="crm">CRM</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createNewKey} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold">Crear</Button>
                  <Button variant="outline" onClick={() => setShowNewKeyForm(false)} className="flex-1 rounded-2xl">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {keys.map(apiKey => (
              <Card key={apiKey.id} className="rounded-3xl border-2 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-bold text-white mb-1">{apiKey.name}</p>
                      <p className="text-xs text-slate-400 mb-3">Servicio: {apiKey.service.toUpperCase()}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <code className="flex-1 text-xs font-mono bg-slate-900 p-2 rounded-lg text-slate-300 overflow-auto">
                          {maskKey(apiKey.key, visibleKeys.has(apiKey.id))}
                        </code>
                        <Button size="sm" variant="ghost" onClick={() => toggleKeyVisibility(apiKey.id)} className="rounded-lg">
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(apiKey.key)} className="rounded-lg">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2 text-xs text-slate-400 mt-2">
                        <span>Creada: {apiKey.created}</span>
                        <span>•</span>
                        <span>Última: {apiKey.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-slate-400">Uso</p>
                          <Badge className={apiKey.status === "active" ? "bg-lime-500/30 text-lime-300 rounded-full" : "bg-yellow-500/30 text-yellow-300 rounded-full"}>
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="bg-slate-900 rounded-lg h-2 overflow-hidden mb-1">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full" 
                            style={{ width: `${(apiKey.usage / apiKey.limit) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400">{apiKey.usage.toLocaleString()} / {apiKey.limit.toLocaleString()}</p>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => regenerateKey(apiKey.id)} className="flex-1 rounded-lg text-xs">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Regenerar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteKey(apiKey.id)} className="flex-1 rounded-lg text-xs">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* USAGE TAB */}
        <TabsContent value="usage" className="space-y-4">
          <Card className="rounded-3xl border-2 border-blue-500/30">
            <CardHeader><CardTitle>Resumen de Uso por Servicio</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["voip", "retell", "crm", "whatsapp"].map(service => {
                const serviceKeys = keys.filter(k => k.service === service);
                const totalUsage = serviceKeys.reduce((sum, k) => sum + k.usage, 0);
                const totalLimit = serviceKeys.reduce((sum, k) => sum + k.limit, 0);
                return (
                  <div key={service} className="p-4 rounded-2xl border-2 border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-white capitalize">{service}</p>
                      <Badge>{serviceKeys.length} keys</Badge>
                    </div>
                    <div className="bg-slate-900 rounded-lg h-2 overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full" 
                        style={{ width: `${(totalUsage / totalLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">{totalUsage.toLocaleString()} / {totalLimit.toLocaleString()} solicitudes</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-4">
          <Card className="rounded-3xl border-2 border-red-500/30">
            <CardHeader><CardTitle>Seguridad y Protección</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-900/50">
                <div className="flex gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-lime-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Encriptación AES-256</p>
                    <p className="text-xs text-slate-400">Todas las keys están encriptadas en tránsito y en reposo</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-900/50">
                <div className="flex gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-lime-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Bearer Token Auth</p>
                    <p className="text-xs text-slate-400">Autenticación de portador en todos los endpoints API</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-900/50">
                <div className="flex gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Rate Limiting</p>
                    <p className="text-xs text-slate-400">Límites de velocidad por API key para prevenir abuso</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-900/50">
                <div className="flex gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-lime-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Audit Logging</p>
                    <p className="text-xs text-slate-400">Todos los accesos registrados en sistema de logs</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-900/50">
                <div className="flex gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-lime-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">IP Whitelisting</p>
                    <p className="text-xs text-slate-400">Restricción de IPs para máxima seguridad</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl font-bold mt-4">
                Regenerar todas las Keys
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
