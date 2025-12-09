import { useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  MessageSquare, Users, Send, BarChart3, Settings, 
  Plus, Search, Phone, MoreVertical, FileText, 
  Image as ImageIcon, Paperclip, Smile,
  Filter, Calendar, ArrowUpRight, TrendingUp,
  LayoutGrid, List, CheckCircle2, AlertCircle, RefreshCw,
  Building2, Shield, UserPlus, Mail, CreditCard, LogOut,
  Briefcase, Check, Link2, QrCode, ExternalLink, Play,
  Pause, Copy, Eye, EyeOff
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  useClients, 
  useCampaigns, 
  useContacts, 
  useConversations,
  useWhatsAppConnections,
  useCreateWhatsAppConnection,
  useCreateCampaign,
  useCreateClient,
  useCreateContact,
  useSendMessage
} from "@/hooks/useWhatsAppData";
import { useToast } from "@/hooks/use-toast";

const teamMembers = [
  { id: 1, name: "John Doe", role: "Admin", email: "john@nexus.com", status: "active", clients: ["All"] },
  { id: 2, name: "Sarah Smith", role: "Manager", email: "sarah@nexus.com", status: "active", clients: ["Acme Corp", "TechStart"] },
  { id: 3, name: "Mike Johnson", role: "Agent", email: "mike@nexus.com", status: "offline", clients: ["Global Marketing"] },
];

export default function WhatsAppPage() {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  // Form states
  const [newConnection, setNewConnection] = useState({
    phoneNumberId: "",
    businessAccountId: "",
    accessToken: "",
    displayName: ""
  });

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    messageContent: "",
    connectionId: "",
    scheduledAt: ""
  });

  const [newClient, setNewClient] = useState({
    name: "",
    plan: "starter",
    phoneNumber: "",
    credits: "1000"
  });

  const [newContact, setNewContact] = useState({
    phoneNumber: "",
    name: "",
    email: "",
    tags: ""
  });

  const { toast } = useToast();

  const { data: clients = [], isLoading: loadingClients } = useClients();
  const { data: campaigns = [], isLoading: loadingCampaigns } = useCampaigns(selectedClient !== "all" ? selectedClient : undefined);
  const { data: contacts = [] } = useContacts(selectedClient !== "all" ? selectedClient : undefined);
  const { data: conversations = [] } = useConversations(selectedClient !== "all" ? selectedClient : undefined);
  const { data: connections = [] } = useWhatsAppConnections(selectedClient !== "all" ? selectedClient : undefined);

  const createConnection = useCreateWhatsAppConnection();
  const createCampaign = useCreateCampaign();
  const createClient = useCreateClient();
  const createContact = useCreateContact();
  const sendMessage = useSendMessage();

  const handleLinkWhatsApp = async () => {
    if (!selectedClient || selectedClient === "all") {
      toast({ title: "Error", description: "Selecciona un cliente primero", variant: "destructive" });
      return;
    }

    try {
      await createConnection.mutateAsync({
        clientId: selectedClient,
        ...newConnection,
        status: "connected"
      });
      toast({ title: "Éxito", description: "Número de WhatsApp vinculado correctamente" });
      setShowLinkDialog(false);
      setNewConnection({ phoneNumberId: "", businessAccountId: "", accessToken: "", displayName: "" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo vincular el número", variant: "destructive" });
    }
  };

  const handleCreateCampaign = async () => {
    if (!selectedClient || selectedClient === "all") {
      toast({ title: "Error", description: "Selecciona un cliente primero", variant: "destructive" });
      return;
    }

    try {
      await createCampaign.mutateAsync({
        clientId: selectedClient,
        name: newCampaign.name,
        messageContent: newCampaign.messageContent,
        status: "draft",
        createdBy: "admin",
        scheduledAt: newCampaign.scheduledAt ? new Date(newCampaign.scheduledAt) : undefined
      });
      toast({ title: "Éxito", description: "Campaña creada correctamente" });
      setShowCampaignDialog(false);
      setNewCampaign({ name: "", messageContent: "", connectionId: "", scheduledAt: "" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear la campaña", variant: "destructive" });
    }
  };

  const handleCreateClient = async () => {
    try {
      await createClient.mutateAsync({
        ...newClient,
        status: "active"
      });
      toast({ title: "Éxito", description: "Cliente creado correctamente" });
      setShowClientDialog(false);
      setNewClient({ name: "", plan: "starter", phoneNumber: "", credits: "1000" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear el cliente", variant: "destructive" });
    }
  };

  const handleCreateContact = async () => {
    if (!selectedClient || selectedClient === "all") {
      toast({ title: "Error", description: "Selecciona un cliente primero", variant: "destructive" });
      return;
    }

    try {
      await createContact.mutateAsync({
        clientId: selectedClient,
        phoneNumber: newContact.phoneNumber,
        name: newContact.name,
        email: newContact.email,
        tags: newContact.tags ? newContact.tags.split(",").map(t => t.trim()) : [],
        isOptedIn: true
      });
      toast({ title: "Éxito", description: "Contacto agregado correctamente" });
      setShowContactDialog(false);
      setNewContact({ phoneNumber: "", name: "", email: "", tags: "" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo agregar el contacto", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Client Context */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/50 p-4 rounded-xl border border-primary/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">WhatsApp Marketing Hub</h1>
            <p className="text-xs text-muted-foreground">Platform Administration & Client Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-primary/10">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current View:</span>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[200px] h-8 bg-transparent border-none focus:ring-0">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Global Admin View</SelectItem>
                <DropdownMenuSeparator />
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => setShowLinkDialog(true)}
            variant="outline"
            disabled={selectedClient === "all"}
          >
            <Link2 className="h-4 w-4 mr-2" /> Vincular WhatsApp
          </Button>
          <Button 
            onClick={() => setShowCampaignDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
            disabled={selectedClient === "all"}
          >
            <Plus className="h-4 w-4 mr-2" /> Nueva Campaña
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-primary/10">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="dashboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="whatsapp-setup" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              WhatsApp Setup
            </TabsTrigger>
            <TabsTrigger value="clients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Clientes
            </TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Contactos
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Equipo
            </TabsTrigger>
            <TabsTrigger value="inbox" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Inbox
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Campañas
            </TabsTrigger>
          </TabsList>
        </div>

        {/* WHATSAPP CONNECTIONS TAB */}
        <TabsContent value="whatsapp-setup" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Configuración de WhatsApp Business</h2>
              <p className="text-sm text-muted-foreground">Vincula números de WhatsApp para campañas y conversaciones</p>
            </div>
            <Button 
              onClick={() => setShowLinkDialog(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={selectedClient === "all"}
            >
              <Link2 className="mr-2 h-4 w-4" /> Vincular Nuevo Número
            </Button>
          </div>

          {selectedClient === "all" ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Selecciona un cliente</p>
                <p className="text-sm text-muted-foreground">Elige un cliente para ver y configurar sus números de WhatsApp</p>
              </CardContent>
            </Card>
          ) : connections.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Sin números vinculados</p>
                <p className="text-sm text-muted-foreground mb-4">Vincula tu primer número de WhatsApp Business</p>
                <Button onClick={() => setShowLinkDialog(true)} className="bg-green-600 hover:bg-green-700">
                  <Link2 className="mr-2 h-4 w-4" /> Vincular WhatsApp
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {connections.map((conn) => (
                <Card key={conn.id} className="border-primary/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Phone className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {conn.displayName || "WhatsApp Business"}
                            <Badge variant={conn.status === "connected" ? "default" : "secondary"}>
                              {conn.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>ID: {conn.phoneNumberId}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" /> Sincronizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" /> Configurar Webhook
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <LogOut className="mr-2 h-4 w-4" /> Desvincular
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Business Account ID</div>
                        <div className="font-mono text-sm">{conn.businessAccountId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Última Sincronización</div>
                        <div className="text-sm">{conn.lastSyncAt ? new Date(conn.lastSyncAt).toLocaleString() : "Nunca"}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Access Token</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowTokens(!showTokens)}
                        >
                          {showTokens ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="font-mono text-xs break-all">
                        {showTokens ? conn.accessToken : "••••••••••••••••••••"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="mr-2 h-4 w-4" /> Ver en Meta
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" /> Probar Envío
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DASHBOARD CONTENT */}
        <TabsContent value="dashboard" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
                <Send className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4M</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
                <Building2 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+8 new this week</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">+20.1% vs last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Agents</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
             <Card className="border-primary/10">
               <CardHeader>
                 <CardTitle>Recent Client Activity</CardTitle>
                 <CardDescription>Latest actions across all tenants</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {[
                     { client: "Acme Corp", action: "Started Campaign 'Summer Sale'", time: "10 mins ago" },
                     { client: "TechStart", action: "Added new agent", time: "1 hour ago" },
                     { client: "Global Mkt", action: "Topped up 5000 credits", time: "2 hours ago" },
                     { client: "Acme Corp", action: "Updated WhatsApp Template", time: "5 hours ago" },
                   ].map((log, i) => (
                     <div key={i} className="flex items-center justify-between text-sm border-b border-primary/5 last:border-0 pb-2 last:pb-0">
                        <div>
                          <span className="font-medium text-primary">{log.client}</span>
                          <p className="text-muted-foreground">{log.action}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

             <Card className="border-primary/10">
               <CardHeader>
                 <CardTitle>Platform Health</CardTitle>
                 <CardDescription>System status overview</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Latency</span>
                      <span className="text-green-500">45ms</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Message Queue</span>
                      <span className="text-blue-500">120 pending</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Webhook Success Rate</span>
                      <span className="text-green-500">99.9%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
               </CardContent>
             </Card>
           </div>
        </TabsContent>

        {/* CLIENTS MANAGEMENT TAB */}
        <TabsContent value="clients" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Directorio de Clientes</h2>
              <p className="text-sm text-muted-foreground">Administra empresas, suscripciones y cuotas</p>
            </div>
            <Button onClick={() => setShowClientDialog(true)}>
              <Building2 className="mr-2 h-4 w-4" /> Crear Cliente
            </Button>
          </div>

          <Card className="border-primary/10">
            <div className="rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-muted/30 border-b border-primary/10">
                <div className="col-span-3">Empresa</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-2">WhatsApp</div>
                <div className="col-span-2">Créditos</div>
                <div className="col-span-1">Estado</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>
              <div className="max-h-[600px] overflow-auto">
                {loadingClients ? (
                  <div className="p-8 text-center text-muted-foreground">Cargando clientes...</div>
                ) : clients.length === 0 ? (
                  <div className="p-8 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay clientes. Crea tu primer cliente arriba.</p>
                  </div>
                ) : (
                  clients.map((client) => (
                    <div key={client.id} className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/10 transition-colors border-b border-primary/5 last:border-0">
                      <div className="col-span-3 font-medium flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {client.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          {client.name}
                          <div className="text-xs text-muted-foreground">ID: {client.id.substring(0, 8)}</div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-normal capitalize">{client.plan || 'starter'}</Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground font-mono text-xs">
                        {client.phoneNumber || 'Sin configurar'}
                      </div>
                      <div className="col-span-2">
                         <span className={parseInt(client.credits || '0') < 500 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                           {parseInt(client.credits || '0').toLocaleString()}
                         </span>
                      </div>
                      <div className="col-span-1">
                        <Badge 
                          variant={client.status === 'active' ? 'default' : client.status === 'inactive' ? 'secondary' : 'destructive'} 
                          className="text-[10px]"
                        >
                          {client.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-right flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setSelectedClient(client.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem><Link2 className="mr-2 h-4 w-4" /> Vincular WhatsApp</DropdownMenuItem>
                            <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario</DropdownMenuItem>
                            <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /> Agregar Créditos</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500"><LogOut className="mr-2 h-4 w-4" /> Suspender</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* CONTACTS TAB */}
        <TabsContent value="contacts" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Gestión de Contactos</h2>
              <p className="text-sm text-muted-foreground">Administra los destinatarios de tus campañas</p>
            </div>
            <Button 
              onClick={() => setShowContactDialog(true)}
              disabled={selectedClient === "all"}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Contacto
            </Button>
          </div>

          {selectedClient === "all" ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Selecciona un cliente</p>
                <p className="text-sm text-muted-foreground">Elige un cliente para ver sus contactos</p>
              </CardContent>
            </Card>
          ) : contacts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Sin contactos</p>
                <p className="text-sm text-muted-foreground mb-4">Agrega tu primer contacto para comenzar campañas</p>
                <Button onClick={() => setShowContactDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Agregar Contacto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/10">
              <div className="rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-muted/30 border-b border-primary/10">
                  <div className="col-span-3">Nombre</div>
                  <div className="col-span-3">Teléfono</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-2">Tags</div>
                  <div className="col-span-2 text-right">Acciones</div>
                </div>
                <div className="max-h-[600px] overflow-auto">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/10 transition-colors border-b border-primary/5 last:border-0">
                      <div className="col-span-3 font-medium flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{contact.name?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                        </Avatar>
                        <div>
                          {contact.name || "Sin nombre"}
                          <div className="text-xs text-muted-foreground">
                            {contact.isOptedIn ? <Check className="h-3 w-3 inline text-green-500" /> : "Sin opt-in"}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 font-mono text-xs">
                        {contact.phoneNumber}
                      </div>
                      <div className="col-span-2 text-muted-foreground text-xs">
                        {contact.email || "N/A"}
                      </div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(contact.tags) && contact.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Send className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* OLD CLIENTS TAB - REMOVED, REPLACED ABOVE */}
        <TabsContent value="clients-old" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Client Directory</h2>
              <p className="text-sm text-muted-foreground">Manage companies, subscriptions, and quotas.</p>
            </div>
            <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
              <DialogTrigger asChild>
                <Button><Building2 className="mr-2 h-4 w-4" /> Onboard Client</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Onboard New Client</DialogTitle>
                  <DialogDescription>Create a new workspace for a client company.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Company</Label>
                    <Input id="name" className="col-span-3" placeholder="Acme Inc." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Plan</Label>
                    <Select defaultValue="pro">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter ($99/mo)</SelectItem>
                        <SelectItem value="pro">Pro ($299/mo)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (Custom)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">WhatsApp #</Label>
                    <Input id="phone" className="col-span-3" placeholder="+1..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Workspace</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-primary/10">
            <div className="rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-muted/30 border-b border-primary/10">
                <div className="col-span-3">Company</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-2">WhatsApp Number</div>
                <div className="col-span-2">Credits</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <div className="max-h-[600px] overflow-auto">
                {loadingClients ? (
                  <div className="p-8 text-center text-muted-foreground">Loading clients...</div>
                ) : clients.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No clients yet. Create your first client above.</div>
                ) : (
                  clients.map((client) => (
                    <div key={client.id} className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/10 transition-colors border-b border-primary/5 last:border-0">
                      <div className="col-span-3 font-medium flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {client.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          {client.name}
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-normal capitalize">{client.plan || 'starter'}</Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground font-mono text-xs">
                        {client.phoneNumber || 'Not set'}
                      </div>
                      <div className="col-span-2">
                         <span className={parseInt(client.credits || '0') < 500 ? "text-red-500 font-bold" : ""}>
                           {parseInt(client.credits || '0').toLocaleString()}
                         </span>
                      </div>
                      <div className="col-span-1">
                        <Badge 
                          variant={client.status === 'active' ? 'default' : client.status === 'inactive' ? 'secondary' : 'destructive'} 
                          className="text-[10px]"
                        >
                          {client.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" /> Add User</DropdownMenuItem>
                            <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /> Add Credits</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500"><LogOut className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TEAM MANAGEMENT TAB */}
        <TabsContent value="team" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Team & Agents</h2>
              <p className="text-sm text-muted-foreground">Manage support agents and their access permissions.</p>
            </div>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Add Team Member</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
             {teamMembers.map((member) => (
               <Card key={member.id} className="border-primary/10 overflow-hidden group">
                 <div className="h-2 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <CardContent className="p-6">
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {member.email}
                          </p>
                        </div>
                     </div>
                     <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>{member.role}</Badge>
                   </div>

                   <div className="space-y-3">
                     <div>
                       <div className="text-xs text-muted-foreground mb-1">Assigned Clients</div>
                       <div className="flex flex-wrap gap-1">
                         {member.clients.map((c, i) => (
                           <Badge key={i} variant="outline" className="text-[10px] bg-muted/50">{c}</Badge>
                         ))}
                       </div>
                     </div>
                   </div>

                   <div className="mt-6 flex gap-2">
                     <Button variant="outline" size="sm" className="flex-1">Edit Access</Button>
                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10"><LogOut className="h-4 w-4" /></Button>
                   </div>
                 </CardContent>
               </Card>
             ))}

             {/* Add New Card Placeholder */}
             <Card className="border-primary/10 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors min-h-[200px]">
               <div className="text-center space-y-2">
                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto">
                   <Plus className="h-6 w-6 text-muted-foreground" />
                 </div>
                 <p className="font-medium text-muted-foreground">Add New Agent</p>
               </div>
             </Card>
          </div>
        </TabsContent>

        {/* CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Gestión de Campañas</h2>
              <p className="text-sm text-muted-foreground">Crea y administra campañas masivas de WhatsApp</p>
            </div>
            <Button 
              onClick={() => setShowCampaignDialog(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={selectedClient === "all"}
            >
              <Plus className="mr-2 h-4 w-4" /> Nueva Campaña
            </Button>
          </div>

          <div className="grid gap-4">
            {loadingCampaigns ? (
              <div className="text-center py-8 text-muted-foreground">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No campaigns yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Create your first WhatsApp campaign</p>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id} className="border-primary/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {campaign.name}
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Created {new Date(campaign.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Sent</div>
                        <div className="text-2xl font-bold">{campaign.sentCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Delivered</div>
                        <div className="text-2xl font-bold text-green-500">{campaign.deliveredCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Read</div>
                        <div className="text-2xl font-bold text-blue-500">{campaign.readCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                        <div className="text-2xl font-bold text-red-500">{campaign.failedCount || 0}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* INBOX TAB (Reused but context-aware) */}
        <TabsContent value="inbox" className="h-[600px] flex gap-4 animate-in fade-in zoom-in-95 duration-300">
           {/* Reusing existing inbox structure for simplicity, in a real app this would be more complex */}
           <Card className="w-80 flex flex-col border-primary/10">
             <div className="p-4 border-b border-primary/10">
               <h3 className="font-semibold mb-2">Unified Inbox</h3>
               <Input placeholder="Search global messages..." className="bg-muted/30" />
             </div>
             <ScrollArea className="flex-1">
               {conversations.map(chat => (
                  <div key={chat.id} className="p-3 hover:bg-muted/50 cursor-pointer border-b border-primary/5">
                    <div className="flex justify-between">
                      <span className="font-medium">{chat.name}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{chat.lastMsg}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-[10px]">{chat.status}</Badge>
                      <span className="text-[10px] text-muted-foreground">Agent: {chat.agent}</span>
                    </div>
                  </div>
               ))}
             </ScrollArea>
           </Card>

           <Card className="flex-1 flex items-center justify-center border-primary/10 bg-muted/5">
             <div className="text-center text-muted-foreground">
               <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p>Select a conversation to start chatting</p>
               <p className="text-xs mt-2">You are viewing the unified inbox for {selectedClient === 'all' ? 'All Clients' : clients.find(c => c.id.toString() === selectedClient)?.name}</p>
             </div>
           </Card>
        </TabsContent>

        {/* SETTINGS TAB (SaaS Admin) */}
        <TabsContent value="settings" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-6">
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Platform White-Labeling
                    </CardTitle>
                    <CardDescription>Customize the branding for your sub-clients.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Platform Name</Label>
                      <Input defaultValue="Nexus Marketing" />
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Domain (CNAME)</Label>
                      <div className="flex gap-2">
                        <Input defaultValue="app.nexus-marketing.com" />
                        <Button variant="outline">Verify</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="space-y-0.5">
                         <Label>Show "Powered by"</Label>
                         <p className="text-xs text-muted-foreground">Remove footer branding</p>
                       </div>
                       <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      Reseller Pricing & Billing
                    </CardTitle>
                    <CardDescription>Set your margins and billing rules.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Cost per Message (Base)</Label>
                         <Input disabled value="$0.005" className="bg-muted" />
                       </div>
                       <div className="space-y-2">
                         <Label>Your Markup (%)</Label>
                         <Input defaultValue="150" type="number" />
                       </div>
                     </div>
                     <div className="p-3 bg-muted/30 rounded-lg text-sm">
                       <div className="flex justify-between mb-1">
                         <span>Final Client Price:</span>
                         <span className="font-bold text-green-500">$0.0125 / msg</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Estimated Profit/10k:</span>
                         <span className="font-bold text-green-500">$75.00</span>
                       </div>
                     </div>
                  </CardContent>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500" />
                      API Distribution Controls
                    </CardTitle>
                    <CardDescription>Manage global API access policies.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Rate Limit (RPM)</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="100">100 req/min (Starter)</SelectItem>
                           <SelectItem value="1000">1,000 req/min (Pro)</SelectItem>
                           <SelectItem value="10000">10,000 req/min (Enterprise)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Global Webhook Endpoint</Label>
                      <Input defaultValue="https://api.nexus.com/v1/webhooks/router" />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Allow Client API Keys</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Require IP Whitelisting</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sandbox Mode Access</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                      <RefreshCw className="mr-2 h-4 w-4" /> Sync Policies
                    </Button>
                  </CardFooter>
                </Card>
             </div>
           </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG: Vincular WhatsApp Business */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vincular Número de WhatsApp Business</DialogTitle>
            <DialogDescription>
              Conecta tu número de WhatsApp Business desde Meta Business Suite
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Phone Number ID</Label>
              <Input 
                placeholder="Ej: 123456789012345"
                value={newConnection.phoneNumberId}
                onChange={(e) => setNewConnection({ ...newConnection, phoneNumberId: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Encuéntralo en Meta Business Suite → WhatsApp → Configuración de API
              </p>
            </div>
            <div className="space-y-2">
              <Label>Business Account ID</Label>
              <Input 
                placeholder="Ej: 987654321098765"
                value={newConnection.businessAccountId}
                onChange={(e) => setNewConnection({ ...newConnection, businessAccountId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Access Token (Permanente)</Label>
              <Textarea 
                placeholder="EAA..."
                value={newConnection.accessToken}
                onChange={(e) => setNewConnection({ ...newConnection, accessToken: e.target.value })}
                className="font-mono text-xs"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Genera un token permanente desde Meta Business Suite → Configuración del sistema
              </p>
            </div>
            <div className="space-y-2">
              <Label>Nombre para mostrar (opcional)</Label>
              <Input 
                placeholder="Ej: Soporte Principal"
                value={newConnection.displayName}
                onChange={(e) => setNewConnection({ ...newConnection, displayName: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Pasos para obtener credenciales:
                </h4>
                <ol className="text-xs space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Ve a business.facebook.com</li>
                  <li>Selecciona tu cuenta de WhatsApp Business</li>
                  <li>Ve a Configuración → WhatsApp Business API</li>
                  <li>Copia el Phone Number ID y Business Account ID</li>
                  <li>Genera un Access Token permanente en System Users</li>
                </ol>
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Compatibilidad con WhatsApp Business App:
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  ✅ Puedes usar el MISMO número en esta plataforma Y en la app WhatsApp Business simultáneamente.
                </p>
                <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Los mensajes se sincronizan automáticamente</li>
                  <li>Puedes responder desde cualquiera de las dos plataformas</li>
                  <li>Las conversaciones se mantienen actualizadas en ambos lados</li>
                  <li>Los webhooks capturan todos los mensajes (enviados/recibidos)</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleLinkWhatsApp}
              className="bg-green-600 hover:bg-green-700"
              disabled={!newConnection.phoneNumberId || !newConnection.accessToken}
            >
              <Link2 className="mr-2 h-4 w-4" /> Vincular WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Nueva Campaña */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Campaña de WhatsApp</DialogTitle>
            <DialogDescription>
              Configura una campaña masiva para tus contactos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nombre de la Campaña</Label>
              <Input 
                placeholder="Ej: Promoción Black Friday 2024"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Número de WhatsApp</Label>
              <Select 
                value={newCampaign.connectionId}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, connectionId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un número vinculado" />
                </SelectTrigger>
                <SelectContent>
                  {connections.map((conn) => (
                    <SelectItem key={conn.id} value={conn.id}>
                      {conn.displayName || conn.phoneNumberId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mensaje de la Campaña</Label>
              <Textarea 
                placeholder="Escribe tu mensaje aquí... Puedes usar variables como {{name}}"
                value={newCampaign.messageContent}
                onChange={(e) => setNewCampaign({ ...newCampaign, messageContent: e.target.value })}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Caracteres: {newCampaign.messageContent.length} / Mensajes estimados: {Math.ceil(newCampaign.messageContent.length / 160)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Destinatarios</Label>
                <Select defaultValue="opted">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los contactos ({contacts.length})</SelectItem>
                    <SelectItem value="opted">Solo con opt-in ({contacts.filter(c => c.isOptedIn).length})</SelectItem>
                    <SelectItem value="segment">Segmento personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Programar Envío</Label>
                <Input 
                  type="datetime-local"
                  value={newCampaign.scheduledAt}
                  onChange={(e) => setNewCampaign({ ...newCampaign, scheduledAt: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleCreateCampaign}
              className="bg-green-600 hover:bg-green-700"
              disabled={!newCampaign.name || !newCampaign.messageContent}
            >
              <Play className="mr-2 h-4 w-4" /> Crear Campaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Nuevo Cliente */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Crea un nuevo workspace para una empresa cliente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nombre de la Empresa</Label>
              <Input 
                placeholder="Ej: Acme Corporation"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Plan de Suscripción</Label>
              <Select 
                value={newClient.plan}
                onValueChange={(value) => setNewClient({ ...newClient, plan: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter - $99/mes (5,000 mensajes)</SelectItem>
                  <SelectItem value="pro">Pro - $299/mes (25,000 mensajes)</SelectItem>
                  <SelectItem value="enterprise">Enterprise - Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Teléfono Principal (opcional)</Label>
              <Input 
                placeholder="+1-555-0100"
                value={newClient.phoneNumber}
                onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Créditos Iniciales</Label>
              <Input 
                type="number"
                placeholder="1000"
                value={newClient.credits}
                onChange={(e) => setNewClient({ ...newClient, credits: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClientDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleCreateClient}
              disabled={!newClient.name}
            >
              Crear Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Nuevo Contacto */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Contacto</DialogTitle>
            <DialogDescription>
              Agrega un nuevo destinatario para campañas
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Número de WhatsApp</Label>
              <Input 
                placeholder="+1-555-0001"
                value={newContact.phoneNumber}
                onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input 
                placeholder="Juan Pérez"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email (opcional)</Label>
              <Input 
                type="email"
                placeholder="juan@example.com"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (separados por coma)</Label>
              <Input 
                placeholder="cliente, premium, interesado"
                value={newContact.tags}
                onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleCreateContact}
              disabled={!newContact.phoneNumber}
            >
              Agregar Contacto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}