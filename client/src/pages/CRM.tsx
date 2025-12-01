import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Workflow as WorkflowIcon, Plus, Trash2, Loader2, Mail, Phone, Target, Zap, Headphones, Play, Copy, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_KEY = "sk_enterprise_demo_key_12345";

export default function CrmPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", notes: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState({ totalContacts: 124, newLeads: 18, converted: 34, activeWorkflows: 5 });
  
  // Retell integration
  const [retellApiKey, setRetellApiKey] = useState("");
  const [retellConfigured, setRetellConfigured] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentPrompt, setAgentPrompt] = useState("Eres un agente de ventas profesional. Ayuda a los clientes con sus preguntas.");
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [callPhoneNumber, setCallPhoneNumber] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [copiedAgent, setCopiedAgent] = useState<string | null>(null);

  const [contacts, setContacts] = useState([
    { id: "c1", name: "Carlos López", email: "carlos@empresa.com", phone: "+34912345678", company: "Tech Corp", status: "new", createdAt: "2025-01-20", notes: "Hot lead" },
    { id: "c2", name: "Maria García", email: "maria@negocio.es", phone: "+34634567890", company: "StartUp Inc", status: "contacted", createdAt: "2025-01-19", notes: "Follow up" },
    { id: "c3", name: "Juan Rodríguez", email: "juan@empresa.mx", phone: "+5215551234567", company: "Empresa MX", status: "qualified", createdAt: "2025-01-18", notes: "Ready to close" },
  ]);

  // Retell mutations
  const createAgentMutation = useMutation({
    mutationFn: async () => {
      if (!retellApiKey) throw new Error("Retell API key required");
      const res = await fetch("/api/v1/retell/agent/create", {
        method: "POST",
        headers: { "Authorization": `Bearer ${retellApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: agentName, prompt: agentPrompt, language: "es-ES" }),
      });
      if (!res.ok) throw new Error("Error creando agente");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("¡Agente Retell creado!");
      const newAgent = { id: data.agent?.agent_id || Date.now(), name: agentName, status: "active", createdAt: new Date().toISOString() };
      setAgents([...agents, newAgent]);
      setAgentName("");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const initiateCallMutation = useMutation({
    mutationFn: async () => {
      if (!retellApiKey) throw new Error("Retell API key required");
      if (!selectedAgent) throw new Error("Select an agent");
      if (!callPhoneNumber) throw new Error("Enter phone number");
      
      const res = await fetch("/api/v1/retell/call/initiate", {
        method: "POST",
        headers: { "Authorization": `Bearer ${retellApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent, phoneNumber: callPhoneNumber }),
      });
      if (!res.ok) throw new Error("Error iniciando llamada");
      return res.json();
    },
    onSuccess: () => {
      toast.success("¡Llamada iniciada!");
      setCallPhoneNumber("");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const fetchConversationsMutation = useMutation({
    mutationFn: async () => {
      if (!retellApiKey) throw new Error("Retell API key required");
      const res = await fetch("/api/v1/retell/conversations", {
        headers: { "Authorization": `Bearer ${retellApiKey}` },
      });
      if (!res.ok) throw new Error("Error obteniendo conversaciones");
      return res.json();
    },
    onSuccess: (data) => {
      setConversations(data.conversations || []);
    },
    onError: (error: any) => toast.error(error.message),
  });

  // CRM mutations
  const createContactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/v1/crm/contacts", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "new" }),
      });
      if (!res.ok) throw new Error("Error creando contacto");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Contacto creado!");
      const newContact = { id: `c${Date.now()}`, ...formData, status: "new", createdAt: new Date().toISOString().split("T")[0] };
      setContacts([...contacts, newContact]);
      setFormData({ name: "", email: "", phone: "", company: "", notes: "" });
      setShowForm(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/crm/contacts/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted" }),
      });
      if (!res.ok) throw new Error("Error actualizando");
      return res.json();
    },
    onSuccess: (_, id) => {
      setContacts(contacts.map(c => c.id === id ? { ...c, status: "contacted" } : c));
      toast.success("Contacto actualizado");
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/crm/contacts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${API_KEY}` },
      });
      if (!res.ok) throw new Error("Error eliminando");
      return res.json();
    },
    onSuccess: (_, id) => {
      setContacts(contacts.filter(c => c.id !== id));
      setDeleteConfirm(null);
      toast.success("Contacto eliminado");
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalContacts: prev.totalContacts + Math.floor(Math.random() * 2),
        newLeads: Math.max(5, prev.newLeads + Math.floor(Math.random() * 3 - 1)),
        converted: prev.converted + Math.floor(Math.random() * 2),
        activeWorkflows: prev.activeWorkflows,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRetellIntegration = () => {
    if (retellApiKey) {
      setRetellConfigured(true);
      toast.success("¡Retell conectado!");
      // Load sample agents
      setAgents([
        { id: "agent_1", name: "Digital Future Agent", status: "active", createdAt: "2025-01-20" },
        { id: "agent_2", name: "Sales Bot Pro", status: "active", createdAt: "2025-01-19" },
      ]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Funciones Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="group relative rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-6 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Users className="h-8 w-8 text-cyan-400" /><span className="text-xs font-bold text-cyan-300">MANAGE</span></div>
          <h3 className="mt-3 text-lg font-bold text-cyan-300">Lead Capture</h3>
          <p className="text-xs text-slate-400 mt-2">Capturar contactos auto</p>
        </div>
        
        <div className="group relative rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-950/40 to-slate-950 p-6 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Target className="h-8 w-8 text-purple-400" /><span className="text-xs font-bold text-purple-300">TRACK</span></div>
          <h3 className="mt-3 text-lg font-bold text-purple-300">Lead Tracking</h3>
          <p className="text-xs text-slate-400 mt-2">Seguimiento completo</p>
        </div>

        <div className="group relative rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-950/40 to-slate-950 p-6 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><WorkflowIcon className="h-8 w-8 text-pink-400" /><span className="text-xs font-bold text-pink-300">AUTO</span></div>
          <h3 className="mt-3 text-lg font-bold text-pink-300">Workflows</h3>
          <p className="text-xs text-slate-400 mt-2">Automatización de ventas</p>
        </div>

        <div className="group relative rounded-3xl border-2 border-lime-500/50 bg-gradient-to-br from-lime-950/40 to-slate-950 p-6 hover:border-lime-400 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Headphones className="h-8 w-8 text-lime-400" /><span className="text-xs font-bold text-lime-300">VOICE</span></div>
          <h3 className="mt-3 text-lg font-bold text-lime-300">Retell Voice AI</h3>
          <p className="text-xs text-slate-400 mt-2">Llamadas automáticas</p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Total Contactos</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-cyan-300">{liveStats.totalContacts}</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Nuevos Leads</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-blue-300">{liveStats.newLeads}</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Convertidos</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-purple-300">{liveStats.converted}</div></CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-transparent">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Workflows Activos</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-black text-pink-300">{liveStats.activeWorkflows}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-2" />Contactos</TabsTrigger>
          <TabsTrigger value="retell"><Headphones className="h-4 w-4 mr-2" />Retell Voice</TabsTrigger>
          <TabsTrigger value="workflows"><WorkflowIcon className="h-4 w-4 mr-2" />Workflows</TabsTrigger>
          <TabsTrigger value="logs"><TrendingUp className="h-4 w-4 mr-2" />Logs</TabsTrigger>
        </TabsList>

        {/* CONTACTS TAB */}
        <TabsContent value="contacts" className="space-y-4">
          {showForm && (
            <Card className="rounded-3xl border-2 border-blue-500/30 bg-card/50">
              <CardHeader><CardTitle>Agregar Contacto</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Nombre *</Label><Input placeholder="Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-2xl" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="juan@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-2xl" /></div>
                  <div className="space-y-2"><Label>Teléfono</Label><Input placeholder="+34912345678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-2xl" /></div>
                  <div className="space-y-2"><Label>Empresa</Label><Input placeholder="Tech Corp" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="rounded-2xl" /></div>
                </div>
                <div className="space-y-2"><Label>Notas</Label><Textarea placeholder="Notas sobre el contacto..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} className="rounded-2xl" /></div>
                <div className="flex gap-2">
                  <Button onClick={() => createContactMutation.mutate(formData)} disabled={!formData.name || createContactMutation.isPending} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold">
                    {createContactMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold">
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Cerrar" : "Agregar Contacto"}
            </Button>
          </div>

          <Card className="rounded-3xl border-2 border-cyan-500/30">
            <CardHeader><CardTitle>Todos los Contactos</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email/Teléfono</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map(contact => (
                    <TableRow key={contact.id} className="border-slate-700">
                      <TableCell className="font-bold text-white">{contact.name}</TableCell>
                      <TableCell className="text-sm text-slate-400">{contact.email} / {contact.phone}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>
                        <Badge className={contact.status === "new" ? "bg-cyan-500/30 text-cyan-300 rounded-full" : contact.status === "contacted" ? "bg-purple-500/30 text-purple-300 rounded-full" : "bg-lime-500/30 text-lime-300 rounded-full"}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {contact.status === "new" && (
                            <Button size="sm" variant="outline" onClick={() => updateContactMutation.mutate(contact.id)} className="rounded-lg"><Mail className="h-4 w-4" /></Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(deleteConfirm === contact.id ? null : contact.id)} className="rounded-lg">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          {deleteConfirm === contact.id && (
                            <Button size="sm" variant="destructive" onClick={() => deleteContactMutation.mutate(contact.id)} className="rounded-lg">Confirmar</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RETELL VOICE TAB */}
        <TabsContent value="retell" className="space-y-4">
          {!retellConfigured ? (
            <Card className="rounded-3xl border-2 border-lime-500/50 bg-lime-950/20">
              <CardHeader><CardTitle className="flex items-center gap-2"><Headphones className="h-5 w-5 text-lime-400" />Conectar Retell AI Voice</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key de Retell</Label>
                  <Input 
                    type="password" 
                    placeholder="sk_retell_..." 
                    value={retellApiKey} 
                    onChange={e => setRetellApiKey(e.target.value)} 
                    className="rounded-2xl" 
                  />
                </div>
                <Button 
                  onClick={handleRetellIntegration} 
                  disabled={!retellApiKey}
                  className="w-full bg-gradient-to-r from-lime-600 to-green-600 rounded-2xl font-bold"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Conectar Retell
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Create Agent */}
              <Card className="rounded-3xl border-2 border-blue-500/30">
                <CardHeader><CardTitle>Crear Nuevo Agente Retell</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del Agente</Label>
                    <Input 
                      placeholder="Digital Future Agent" 
                      value={agentName}
                      onChange={e => setAgentName(e.target.value)}
                      className="rounded-2xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prompt</Label>
                    <Textarea 
                      value={agentPrompt}
                      onChange={e => setAgentPrompt(e.target.value)}
                      className="rounded-2xl" 
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => createAgentMutation.mutate()} 
                    disabled={!agentName || createAgentMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold"
                  >
                    {createAgentMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Crear Agente
                  </Button>
                </CardContent>
              </Card>

              {/* List Agents */}
              <Card className="rounded-3xl border-2 border-cyan-500/30">
                <CardHeader><CardTitle>Agentes Disponibles</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {agents.map(agent => (
                    <div key={agent.id} className="p-4 rounded-2xl border-2 border-slate-700 hover:border-cyan-500/50 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-white">{agent.name}</p>
                        <p className="text-xs text-slate-400">ID: {agent.id}</p>
                      </div>
                      <Badge className="bg-lime-500/30 text-lime-300 rounded-full">{agent.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Initiate Call */}
              <Card className="rounded-3xl border-2 border-purple-500/30">
                <CardHeader><CardTitle>Iniciar Llamada</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Seleccionar Agente</Label>
                    <select 
                      value={selectedAgent} 
                      onChange={e => setSelectedAgent(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-primary/30 rounded-2xl text-sm"
                    >
                      <option value="">-- Selecciona un agente --</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de Teléfono</Label>
                    <Input 
                      placeholder="+34912345678" 
                      value={callPhoneNumber}
                      onChange={e => setCallPhoneNumber(e.target.value)}
                      className="rounded-2xl" 
                    />
                  </div>
                  <Button 
                    onClick={() => initiateCallMutation.mutate()} 
                    disabled={!selectedAgent || !callPhoneNumber || initiateCallMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold"
                  >
                    {initiateCallMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
                    Iniciar Llamada
                  </Button>
                </CardContent>
              </Card>

              {/* View Conversations */}
              <Card className="rounded-3xl border-2 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Conversaciones
                    <Button 
                      size="sm" 
                      onClick={() => fetchConversationsMutation.mutate()}
                      disabled={fetchConversationsMutation.isPending}
                      className="rounded-lg"
                    >
                      {fetchConversationsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {conversations.length === 0 ? (
                    <p className="text-slate-400 text-sm">Presiona el botón para cargar conversaciones</p>
                  ) : (
                    conversations.map(conv => (
                      <div 
                        key={conv.id} 
                        onClick={() => setSelectedConv(conv)}
                        className="p-4 rounded-2xl border-2 border-slate-700 hover:border-pink-500/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-bold text-white">{conv.phoneNumber}</p>
                            <p className="text-xs text-slate-400">{Math.round(conv.duration / 60)}m • {new Date(conv.date).toLocaleString()}</p>
                          </div>
                          <Badge className="bg-lime-500/30 text-lime-300 rounded-full">{conv.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-300">{conv.summary}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {selectedConv && (
                <Card className="rounded-3xl border-2 border-cyan-500/30">
                  <CardHeader><CardTitle>Transcripción: {selectedConv.phoneNumber}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-slate-900 p-4 rounded-2xl">
                      <div className="space-y-2 max-h-60 overflow-y-auto text-sm">
                        {selectedConv.transcript?.map((line: any, i: number) => (
                          <p key={i} className={line.speaker === "agent" ? "text-cyan-300" : "text-pink-300"}>
                            <span className="font-bold">{line.speaker === "agent" ? "🤖 Agente:" : "👤 Cliente:"}</span> {line.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* WORKFLOWS TAB */}
        <TabsContent value="workflows" className="space-y-4">
          <Card className="rounded-3xl border-2 border-purple-500/30">
            <CardHeader><CardTitle>Workflows de CRM</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: "Nuevo Lead → Retell Call", trigger: "New Contact", action: "Initiate Voice Call", status: "active" },
                    { id: 2, name: "Deal Closed → Email", trigger: "Status: Qualified", action: "Send Email", status: "active" },
                    { id: 3, name: "Stale Lead → SMS", trigger: "No activity 30 días", action: "Send SMS", status: "inactive" },
                  ].map(wf => (
                    <TableRow key={wf.id} className="border-slate-700">
                      <TableCell className="font-bold text-white">{wf.name}</TableCell>
                      <TableCell className="text-sm text-slate-400">{wf.trigger}</TableCell>
                      <TableCell>{wf.action}</TableCell>
                      <TableCell>
                        <Badge className={wf.status === "active" ? "bg-lime-500/30 text-lime-300 rounded-full" : "bg-slate-600/30 rounded-full"}>
                          {wf.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOGS TAB */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="rounded-3xl border-2 border-pink-500/30">
            <CardHeader><CardTitle>Historial de Auditoría</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="text-xs p-2 border-b border-slate-700 pb-2 hover:bg-slate-900/50 rounded-lg">
                  <p className="font-mono text-slate-400">{new Date(Date.now() - i * 3600000).toLocaleString()} - {i % 3 === 0 ? "Contact created" : i % 3 === 1 ? "Call initiated" : "Conversation saved"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
