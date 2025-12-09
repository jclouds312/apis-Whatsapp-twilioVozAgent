
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Phone, Plus, QrCode, Link2, MessageSquare, CheckCircle2, AlertCircle, 
  RefreshCw, Send, Users, Calendar, Settings, Trash2, Edit, Download,
  Upload, Clock, TrendingUp, Activity, PhoneCall, Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  provider: string;
  displayName: string;
  status: string;
  connectionType: string;
  capabilities: string[];
  metadata: any;
  createdAt: string;
}

interface SmsMessage {
  id: string;
  phoneNumberId: string;
  to: string;
  from: string;
  body: string;
  status: string;
  type: string;
  createdAt: string;
}

interface Itinerary {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  contactId: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export default function PhoneNumbersAdmin() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showItineraryDialog, setShowItineraryDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showSmsDialog, setShowSmsDialog] = useState(false);
  const [connectionType, setConnectionType] = useState("api");
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newNumber, setNewNumber] = useState({
    phoneNumber: "",
    provider: "whatsapp",
    displayName: "",
    connectionType: "api",
    clientId: "24011ed8-2e27-4cf5-90e6-59cfc7045aac"
  });

  const [otpRequest, setOtpRequest] = useState({
    phoneNumber: "",
    code: "",
    type: "sms"
  });

  const [newSms, setNewSms] = useState({
    to: "",
    body: "",
    phoneNumberId: ""
  });

  const [newItinerary, setNewItinerary] = useState({
    title: "",
    description: "",
    assignedTo: "",
    scheduledAt: "",
    contactId: "",
    clientId: "24011ed8-2e27-4cf5-90e6-59cfc7045aac"
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  // Fetch phone numbers
  const { data: phoneNumbers = [], isLoading: loadingNumbers } = useQuery<PhoneNumber[]>({
    queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/phone-numbers'],
  });

  // Fetch SMS messages
  const { data: smsMessages = [] } = useQuery<SmsMessage[]>({
    queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/sms'],
  });

  // Fetch itineraries
  const { data: itineraries = [] } = useQuery<Itinerary[]>({
    queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/itineraries'],
  });

  // Add phone number mutation
  const addNumberMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/phone-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add number');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/phone-numbers'] });
      toast({ title: "Éxito", description: "Número agregado correctamente" });
      setShowAddDialog(false);
      setNewNumber({
        phoneNumber: "",
        provider: "whatsapp",
        displayName: "",
        connectionType: "api",
        clientId: "24011ed8-2e27-4cf5-90e6-59cfc7045aac"
      });
    },
  });

  // Send SMS mutation
  const sendSmsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send SMS');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/sms'] });
      toast({ title: "SMS Enviado", description: "Mensaje enviado correctamente" });
      setShowSmsDialog(false);
    },
  });

  // Create itinerary mutation
  const createItineraryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create itinerary');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/itineraries'] });
      toast({ title: "Éxito", description: "Itinerario creado correctamente" });
      setShowItineraryDialog(false);
    },
  });

  // Sync phone number mutation
  const syncNumberMutation = useMutation({
    mutationFn: async (phoneNumberId: string) => {
      const response = await fetch(`/api/phone-numbers/${phoneNumberId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to sync');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients/24011ed8-2e27-4cf5-90e6-59cfc7045aac/phone-numbers'] });
      toast({ title: "Sincronizado", description: "Historial actualizado" });
    },
  });

  const handleAddNumber = () => {
    if (connectionType === "qr") {
      // Generate QR code
      setQrCodeData(`whatsapp://connect/${newNumber.phoneNumber}`);
    }
    addNumberMutation.mutate(newNumber);
  };

  const handleSendOtp = async () => {
    const response = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: otpRequest.phoneNumber, type: otpRequest.type }),
    });
    if (response.ok) {
      toast({ title: "OTP Enviado", description: `Código enviado a ${otpRequest.phoneNumber}` });
    }
  };

  const handleVerifyOtp = async () => {
    const response = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpRequest),
    });
    if (response.ok) {
      toast({ title: "Verificado", description: "Código OTP válido" });
      setShowOtpDialog(false);
    } else {
      toast({ title: "Error", description: "Código inválido", variant: "destructive" });
    }
  };

  const availablePermissions = [
    "view_numbers", "add_numbers", "edit_numbers", "delete_numbers",
    "send_sms", "view_messages", "manage_itineraries", "manage_roles",
    "view_analytics", "export_data"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Administración de Números</h1>
          <p className="text-muted-foreground">Gestiona números telefónicos, SMS, OTP e itinerarios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSmsDialog(true)}>
            <MessageSquare className="mr-2 h-4 w-4" /> Enviar SMS
          </Button>
          <Button variant="outline" onClick={() => setShowOtpDialog(true)}>
            <Mail className="mr-2 h-4 w-4" /> OTP
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Número
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{phoneNumbers.length}</div>
                <div className="text-sm text-muted-foreground">Números Activos</div>
              </div>
              <Phone className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{smsMessages.length}</div>
                <div className="text-sm text-muted-foreground">SMS Enviados</div>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{itineraries.length}</div>
                <div className="text-sm text-muted-foreground">Itinerarios</div>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-sm text-muted-foreground">Tasa de Entrega</div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="numbers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="numbers">Números</TabsTrigger>
          <TabsTrigger value="sms">SMS/OTP</TabsTrigger>
          <TabsTrigger value="itineraries">Itinerarios</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permisos</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="numbers" className="space-y-4">
          {loadingNumbers ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Cargando números...</p>
              </CardContent>
            </Card>
          ) : phoneNumbers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No hay números registrados</p>
                <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Primer Número
                </Button>
              </CardContent>
            </Card>
          ) : (
            phoneNumbers.map((number) => (
              <Card key={number.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <CardTitle>{number.displayName || "Sin nombre"}</CardTitle>
                        <CardDescription className="font-mono">{number.phoneNumber}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={number.status === "active" ? "default" : "secondary"}>
                      {number.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Proveedor</div>
                      <div className="font-medium capitalize">{number.provider}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tipo de Conexión</div>
                      <div className="font-medium capitalize">{number.connectionType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Capacidades</div>
                      <div className="flex gap-1">
                        {number.capabilities.map((cap: string) => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => syncNumberMutation.mutate(number.id)}
                    disabled={syncNumberMutation.isPending}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncNumberMutation.isPending ? 'animate-spin' : ''}`} /> 
                    Sincronizar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedNumber(number)}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Ver Historial
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Configurar
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes SMS Recientes</CardTitle>
              <CardDescription>Últimos mensajes enviados y recibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {smsMessages.slice(0, 10).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{msg.to}</div>
                        <Badge variant={msg.status === "delivered" ? "default" : "secondary"}>
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.body}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itineraries" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Itinerarios de Ventas</h3>
            <Button onClick={() => setShowItineraryDialog(true)}>
              <Calendar className="mr-2 h-4 w-4" /> Nuevo Itinerario
            </Button>
          </div>
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{itinerary.title}</CardTitle>
                    <CardDescription>{itinerary.description}</CardDescription>
                  </div>
                  <Badge variant={itinerary.status === "completed" ? "default" : "secondary"}>
                    {itinerary.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Asignado a</div>
                    <div className="font-medium">{itinerary.assignedTo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Programado</div>
                    <div className="font-medium">{new Date(itinerary.scheduledAt).toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Roles y Permisos</CardTitle>
                  <CardDescription>Gestiona roles de usuarios por departamento</CardDescription>
                </div>
                <Button onClick={() => setShowRoleDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Rol
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Admin", "Manager", "Agente de Ventas", "Soporte", "Visor"].map((role) => (
                  <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{role}</div>
                        <div className="text-xs text-muted-foreground">
                          {role === "Admin" ? "Acceso completo" : "Permisos limitados"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Mensajes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tasa de Entrega</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tasa de Apertura</span>
                      <span className="font-medium">87.2%</span>
                    </div>
                    <Progress value={87.2} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tasa de Respuesta</span>
                      <span className="font-medium">45.8%</span>
                    </div>
                    <Progress value={45.8} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Actividad por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <Clock className="h-12 w-12 mb-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog: Agregar Número */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Número Telefónico</DialogTitle>
            <DialogDescription>Conecta un número mediante API, código QR o conexión directa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Conexión</Label>
              <Select value={connectionType} onValueChange={setConnectionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API (WhatsApp Business/Twilio)</SelectItem>
                  <SelectItem value="qr">Código QR (Evolution API)</SelectItem>
                  <SelectItem value="direct">Conexión Directa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número de Teléfono</Label>
              <Input
                placeholder="+1-555-0100"
                value={newNumber.phoneNumber}
                onChange={(e) => setNewNumber({ ...newNumber, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Proveedor</Label>
              <Select value={newNumber.provider} onValueChange={(v) => setNewNumber({ ...newNumber, provider: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp Business API</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="evolution">Evolution API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nombre para Mostrar</Label>
              <Input
                placeholder="Ej: Soporte Principal"
                value={newNumber.displayName}
                onChange={(e) => setNewNumber({ ...newNumber, displayName: e.target.value })}
              />
            </div>
            {connectionType === "qr" && qrCodeData && (
              <div className="p-6 bg-muted/30 rounded-lg flex flex-col items-center">
                <QrCode className="h-32 w-32 text-muted-foreground mb-4" />
                <p className="text-sm text-center text-muted-foreground">
                  Escanea este código QR desde WhatsApp para conectar
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">{qrCodeData}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddNumber} disabled={addNumberMutation.isPending}>
              {addNumberMutation.isPending ? "Agregando..." : "Agregar Número"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Enviar SMS */}
      <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar SMS</DialogTitle>
            <DialogDescription>Envía un mensaje de texto a un número</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Desde (Número)</Label>
              <Select value={newSms.phoneNumberId} onValueChange={(v) => setNewSms({ ...newSms, phoneNumberId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un número" />
                </SelectTrigger>
                <SelectContent>
                  {phoneNumbers.map((num) => (
                    <SelectItem key={num.id} value={num.id}>
                      {num.phoneNumber} - {num.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Para (Destinatario)</Label>
              <Input
                placeholder="+1-555-0100"
                value={newSms.to}
                onChange={(e) => setNewSms({ ...newSms, to: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Textarea
                placeholder="Escribe tu mensaje..."
                value={newSms.body}
                onChange={(e) => setNewSms({ ...newSms, body: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSmsDialog(false)}>Cancelar</Button>
            <Button onClick={() => sendSmsMutation.mutate(newSms)} disabled={sendSmsMutation.isPending}>
              <Send className="mr-2 h-4 w-4" /> {sendSmsMutation.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: OTP */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificación OTP</DialogTitle>
            <DialogDescription>Envía y verifica códigos de verificación</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Verificación</Label>
              <Select value={otpRequest.type} onValueChange={(v) => setOtpRequest({ ...otpRequest, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número de Teléfono / Email</Label>
              <Input
                placeholder="+1-555-0100"
                value={otpRequest.phoneNumber}
                onChange={(e) => setOtpRequest({ ...otpRequest, phoneNumber: e.target.value })}
              />
            </div>
            <Button onClick={handleSendOtp} className="w-full">
              <Send className="mr-2 h-4 w-4" /> Enviar Código
            </Button>
            <div className="space-y-2">
              <Label>Código de Verificación</Label>
              <Input
                placeholder="123456"
                value={otpRequest.code}
                onChange={(e) => setOtpRequest({ ...otpRequest, code: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOtpDialog(false)}>Cancelar</Button>
            <Button onClick={handleVerifyOtp}>Verificar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Itinerario */}
      <Dialog open={showItineraryDialog} onOpenChange={setShowItineraryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Itinerario</DialogTitle>
            <DialogDescription>Programa actividades para el equipo de ventas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                placeholder="Visita cliente"
                value={newItinerary.title}
                onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Detalles del itinerario..."
                value={newItinerary.description}
                onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Asignar a</Label>
              <Input
                placeholder="Nombre del usuario"
                value={newItinerary.assignedTo}
                onChange={(e) => setNewItinerary({ ...newItinerary, assignedTo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <Input
                type="datetime-local"
                value={newItinerary.scheduledAt}
                onChange={(e) => setNewItinerary({ ...newItinerary, scheduledAt: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItineraryDialog(false)}>Cancelar</Button>
            <Button onClick={() => createItineraryMutation.mutate(newItinerary)} disabled={createItineraryMutation.isPending}>
              {createItineraryMutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Crear Rol */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>Define permisos para un nuevo rol de usuario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del Rol</Label>
              <Input
                placeholder="Ej: Supervisor de Ventas"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Descripción del rol..."
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Permisos</Label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map((perm) => (
                  <div key={perm} className="flex items-center space-x-2">
                    <Switch
                      checked={newRole.permissions.includes(perm)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewRole({ ...newRole, permissions: [...newRole.permissions, perm] });
                        } else {
                          setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== perm) });
                        }
                      }}
                    />
                    <Label className="text-xs">{perm.replace(/_/g, ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Cancelar</Button>
            <Button onClick={() => {
              toast({ title: "Éxito", description: "Rol creado correctamente" });
              setShowRoleDialog(false);
            }}>
              Crear Rol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
