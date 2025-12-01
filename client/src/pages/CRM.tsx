import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, Workflow as WorkflowIcon, Plus, Trash2, Loader2, Mail, Phone } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-slate-900 to-slate-950 border border-cyan-500/30 p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="h-10 w-10 text-cyan-500" />
            CRM Pro • Contact Manager
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Gestión de contactos • Lead tracking • Automatizaciones • Sincronización en tiempo real</p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30">
          <CardHeader className="pb-2"><CardTitle className="text-xs"><span>Total Contactos</span></CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-cyan-400">{liveStats.totalContacts}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Nuevos Leads</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-400">{liveStats.newLeads}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Convertidos</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-400">{liveStats.converted}</div></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/30">
          <CardHeader className="pb-2"><CardTitle className="text-xs">Workflows Activos</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-pink-400">{liveStats.activeWorkflows}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-2" />Contactos</TabsTrigger>
          <TabsTrigger value="workflows"><WorkflowIcon className="h-4 w-4 mr-2" />Workflows</TabsTrigger>
          <TabsTrigger value="logs"><TrendingUp className="h-4 w-4 mr-2" />Logs</TabsTrigger>
        </TabsList>

        {/* CONTACTS TAB */}
        <TabsContent value="contacts" className="space-y-4">
          {showForm && (
            <Card className="bg-card/50 border-blue-500/20">
              <CardHeader><CardTitle>Agregar Contacto</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input placeholder="Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="juan@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input placeholder="+34912345678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input placeholder="Tech Corp" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea placeholder="Notas sobre el contacto..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => createContactMutation.mutate(formData)} disabled={!formData.name || createContactMutation.isPending} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600">
                    {createContactMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-cyan-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Cerrar" : "Agregar Contacto"}
            </Button>
          </div>

          <Card>
            <CardHeader><CardTitle>Todos los Contactos</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email/Teléfono</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map(contact => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{contact.email} / {contact.phone}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>
                        <Badge className={contact.status === "new" ? "bg-blue-500/20 text-blue-700" : contact.status === "contacted" ? "bg-yellow-500/20 text-yellow-700" : "bg-green-500/20 text-green-700"}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {contact.status === "new" && (
                            <Button size="sm" variant="outline" onClick={() => updateContactMutation.mutate(contact.id)}><Mail className="h-4 w-4" /></Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(deleteConfirm === contact.id ? null : contact.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          {deleteConfirm === contact.id && (
                            <Button size="sm" variant="destructive" onClick={() => deleteContactMutation.mutate(contact.id)}>Confirmar</Button>
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
          <Card>
            <CardHeader><CardTitle>Workflows de CRM</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableRow key={wf.id}>
                      <TableCell className="font-medium">{wf.name}</TableCell>
                      <TableCell className="text-sm">{wf.trigger}</TableCell>
                      <TableCell>{wf.action}</TableCell>
                      <TableCell>
                        <Badge className={wf.status === "active" ? "bg-green-500/20 text-green-700" : "bg-gray-500/20"}>
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
          <Card>
            <CardHeader><CardTitle>Historial de Auditoría</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="text-xs p-2 border-b pb-2 hover:bg-muted/50">
                  <p className="font-mono text-muted-foreground">{new Date(Date.now() - i * 3600000).toLocaleString()} - Contact {i % 3 === 0 ? "created" : i % 3 === 1 ? "updated" : "deleted"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
