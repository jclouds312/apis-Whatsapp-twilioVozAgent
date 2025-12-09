
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Plus, QrCode, Link2, MessageSquare, CheckCircle2, AlertCircle, RefreshCw, Send, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PhoneNumbersAdmin() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showItineraryDialog, setShowItineraryDialog] = useState(false);
  const [connectionType, setConnectionType] = useState("api");
  const { toast } = useToast();

  const [newNumber, setNewNumber] = useState({
    phoneNumber: "",
    provider: "whatsapp",
    displayName: "",
    connectionType: "api"
  });

  const [otpRequest, setOtpRequest] = useState({
    phoneNumber: "",
    code: ""
  });

  const [newItinerary, setNewItinerary] = useState({
    title: "",
    assignedTo: "",
    scheduledAt: "",
    contactId: ""
  });

  const mockNumbers = [
    { id: "1", phoneNumber: "+1-555-0100", provider: "whatsapp", status: "active", displayName: "Soporte Principal", messageCount: "1,234" },
    { id: "2", phoneNumber: "+1-555-0101", provider: "twilio", status: "active", displayName: "Ventas", messageCount: "856" },
  ];

  const mockItineraries = [
    { id: "1", title: "Visita cliente ABC Corp", assignedTo: "Juan Pérez", scheduledAt: "2024-12-10 10:00", status: "scheduled" },
    { id: "2", title: "Llamada seguimiento XYZ", assignedTo: "María García", scheduledAt: "2024-12-10 14:30", status: "completed" },
  ];

  const handleAddNumber = async () => {
    toast({ title: "Éxito", description: "Número agregado correctamente" });
    setShowAddDialog(false);
  };

  const handleSendOtp = async () => {
    toast({ title: "OTP Enviado", description: `Código enviado a ${otpRequest.phoneNumber}` });
  };

  const handleVerifyOtp = async () => {
    toast({ title: "Verificado", description: "Código OTP válido" });
    setShowOtpDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Administración de Números</h1>
          <p className="text-muted-foreground">Gestiona números telefónicos, SMS, OTP e itinerarios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowOtpDialog(true)}>
            <MessageSquare className="mr-2 h-4 w-4" /> Enviar OTP
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Número
          </Button>
        </div>
      </div>

      <Tabs defaultValue="numbers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="numbers">Números</TabsTrigger>
          <TabsTrigger value="sms">SMS/OTP</TabsTrigger>
          <TabsTrigger value="itineraries">Itinerarios</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permisos</TabsTrigger>
        </TabsList>

        <TabsContent value="numbers" className="space-y-4">
          {mockNumbers.map((number) => (
            <Card key={number.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>{number.displayName}</CardTitle>
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
                    <div className="text-sm text-muted-foreground">Mensajes</div>
                    <div className="font-medium">{number.messageCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tipo</div>
                    <div className="font-medium">API</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" /> Sincronizar
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" /> Ver Historial
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envío de SMS y OTP</CardTitle>
              <CardDescription>Gestiona mensajes SMS y códigos de verificación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">1,547</div>
                    <div className="text-sm text-muted-foreground">SMS Enviados</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">342</div>
                    <div className="text-sm text-muted-foreground">OTP Verificados</div>
                  </CardContent>
                </Card>
              </div>
              <Button onClick={() => setShowOtpDialog(true)} className="w-full">
                <Send className="mr-2 h-4 w-4" /> Enviar OTP de Prueba
              </Button>
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
          {mockItineraries.map((itinerary) => (
            <Card key={itinerary.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{itinerary.title}</CardTitle>
                    <CardDescription>Asignado a: {itinerary.assignedTo}</CardDescription>
                  </div>
                  <Badge variant={itinerary.status === "completed" ? "default" : "secondary"}>
                    {itinerary.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Programado: {itinerary.scheduledAt}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles y Permisos</CardTitle>
              <CardDescription>Gestiona roles de usuarios por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Admin", "Manager", "Agente de Ventas", "Soporte", "Visor"].map((role) => (
                  <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{role}</div>
                        <div className="text-xs text-muted-foreground">
                          {role === "Admin" ? "Acceso completo" : "Permisos limitados"}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Agregar Número */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Número Telefónico</DialogTitle>
            <DialogDescription>Conecta un número mediante API o código QR</DialogDescription>
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
            {connectionType === "qr" && (
              <div className="p-6 bg-muted/30 rounded-lg flex flex-col items-center">
                <QrCode className="h-32 w-32 text-muted-foreground mb-4" />
                <p className="text-sm text-center text-muted-foreground">
                  Escanea este código QR desde WhatsApp para conectar
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddNumber}>Agregar Número</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: OTP */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificación OTP</DialogTitle>
            <DialogDescription>Envía y verifica códigos OTP</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número de Teléfono</Label>
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
              <Label>Asignar a</Label>
              <Select value={newItinerary.assignedTo} onValueChange={(v) => setNewItinerary({ ...newItinerary, assignedTo: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">Juan Pérez</SelectItem>
                  <SelectItem value="user2">María García</SelectItem>
                </SelectContent>
              </Select>
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
            <Button onClick={() => {
              toast({ title: "Éxito", description: "Itinerario creado" });
              setShowItineraryDialog(false);
            }}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
