import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Workflow as WorkflowIcon, Plus, Trash2, Loader2, Mail, Phone, Target, Zap } from "lucide-react";
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

  const [contacts, setContacts] = useState([
    { id: "c1", name: "Carlos López", email: "carlos@empresa.com", phone: "+34912345678", company: "Tech Corp", status: "new", createdAt: "2025-01-20", notes: "Hot lead" },
    { id: "c2", name: "Maria García", email: "maria@negocio.es", phone: "+34634567890", company: "StartUp Inc", status: "contacted", createdAt: "2025-01-19", notes: "Follow up" },
    { id: "c3", name: "Juan Rodríguez", email: "juan@empresa.mx", phone: "+5215551234567", company: "Empresa MX", status: "qualified", createdAt: "2025-01-18", notes: "Ready to close" },
  ]);

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

  return (
    <div className="space-y-8">
      {/* Funciones Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
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
          <div className="flex items-start justify-between"><Zap className="h-8 w-8 text-lime-400" /><span className="text-xs font-bold text-lime-300">SYNC</span></div>
          <h3 className="mt-3 text-lg font-bold text-lime-300">Real-time Sync</h3>
          <p className="text-xs text-slate-400 mt-2">Sincronización en vivo</p>
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
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-2" />Contactos</TabsTrigger>
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
                    { id: 1, name: "Nuevo Lead → WhatsApp", trigger: "New Contact", action: "Send WhatsApp", status: "active" },
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
                  <p className="font-mono text-slate-400">{new Date(Date.now() - i * 3600000).toLocaleString()} - Contact {i % 3 === 0 ? "created" : i % 3 === 1 ? "updated" : "deleted"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
