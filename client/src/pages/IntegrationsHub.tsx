
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  DoorOpen, 
  MessageSquare, 
  Server, 
  Zap, 
  Settings,
  Play,
  Square,
  CheckCircle2
} from 'lucide-react';

export default function IntegrationsHubPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [status, setStatus] = useState<{ [key: string]: any }>({});

  // PyVoIP State
  const [pyvoipCall, setPyvoipCall] = useState({ to: '', from: '' });

  // DoorPi State
  const [doorpiConfig, setDoorpiConfig] = useState({ gpioPin: 17, rfidEnabled: true });

  // WhatsApp Cloud State
  const [whatsappMsg, setWhatsappMsg] = useState({ to: '', message: '', templateName: '' });

  // Terraform State
  const [terraformVars, setTerraformVars] = useState({ accountSid: '', authToken: '', phoneNumber: '' });

  const handlePyVoIPInit = async () => {
    setLoading({ pyvoip: true });
    try {
      const response = await fetch('/api/integrations/pyvoip/initialize', { method: 'POST' });
      const data = await response.json();
      setStatus({ ...status, pyvoip: data });
      toast({ title: 'PyVoIP Initialized', description: 'VoIP server is ready' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to initialize PyVoIP', variant: 'destructive' });
    }
    setLoading({ pyvoip: false });
  };

  const handlePyVoIPCall = async () => {
    setLoading({ pyvoipCall: true });
    try {
      const response = await fetch('/api/integrations/pyvoip/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pyvoipCall)
      });
      const data = await response.json();
      toast({ title: 'Call Initiated', description: `Calling ${pyvoipCall.to}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to make call', variant: 'destructive' });
    }
    setLoading({ pyvoipCall: false });
  };

  const handleDoorPiInit = async () => {
    setLoading({ doorpi: true });
    try {
      const response = await fetch('/api/integrations/doorpi/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doorpiConfig)
      });
      const data = await response.json();
      setStatus({ ...status, doorpi: data });
      toast({ title: 'DoorPi Initialized', description: 'Door system is ready' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to initialize DoorPi', variant: 'destructive' });
    }
    setLoading({ doorpi: false });
  };

  const handleDoorTrigger = async () => {
    try {
      const response = await fetch('/api/integrations/doorpi/trigger', { method: 'POST' });
      const data = await response.json();
      toast({ title: 'Door Opened', description: 'Door triggered successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to trigger door', variant: 'destructive' });
    }
  };

  const handleWhatsAppInteractive = async () => {
    setLoading({ whatsapp: true });
    try {
      const interactive = {
        type: 'button',
        body: { text: whatsappMsg.message },
        action: {
          buttons: [
            { type: 'reply', reply: { id: '1', title: 'Sí' } },
            { type: 'reply', reply: { id: '2', title: 'No' } }
          ]
        }
      };
      const response = await fetch('/api/integrations/whatsapp-cloud/interactive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: whatsappMsg.to, interactive })
      });
      const data = await response.json();
      toast({ title: 'Message Sent', description: 'WhatsApp interactive message sent' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    }
    setLoading({ whatsapp: false });
  };

  const handleTerraformPlan = async () => {
    setLoading({ terraform: true });
    try {
      const response = await fetch('/api/integrations/terraform/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(terraformVars)
      });
      const data = await response.json();
      setStatus({ ...status, terraform: data });
      toast({ title: 'Terraform Plan Created', description: 'Infrastructure plan is ready' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create plan', variant: 'destructive' });
    }
    setLoading({ terraform: false });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Integrations Hub
          </h1>
          <p className="text-slate-400 text-lg">
            Control central para todas las integraciones y SDKs
          </p>
        </div>
      </div>

      <Tabs defaultValue="pyvoip" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pyvoip">
            <Phone className="h-4 w-4 mr-2" /> PyVoIP
          </TabsTrigger>
          <TabsTrigger value="doorpi">
            <DoorOpen className="h-4 w-4 mr-2" /> DoorPi
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp Cloud
          </TabsTrigger>
          <TabsTrigger value="terraform">
            <Server className="h-4 w-4 mr-2" /> Terraform
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pyvoip" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  PyVoIP Server
                </CardTitle>
                <CardDescription>Control del servidor VoIP basado en Python</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handlePyVoIPInit} className="w-full" disabled={loading.pyvoip}>
                  <Play className="h-4 w-4 mr-2" />
                  {loading.pyvoip ? 'Inicializando...' : 'Inicializar Servidor'}
                </Button>
                {status.pyvoip && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Estado: {status.pyvoip.status}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Realizar Llamada</CardTitle>
                <CardDescription>Iniciar llamada VoIP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Número destino"
                  value={pyvoipCall.to}
                  onChange={(e) => setPyvoipCall({ ...pyvoipCall, to: e.target.value })}
                />
                <Input
                  placeholder="Número origen"
                  value={pyvoipCall.from}
                  onChange={(e) => setPyvoipCall({ ...pyvoipCall, from: e.target.value })}
                />
                <Button onClick={handlePyVoIPCall} className="w-full bg-green-600 hover:bg-green-700" disabled={loading.pyvoipCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="doorpi" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-purple-500" />
                  DoorPi System
                </CardTitle>
                <CardDescription>Sistema de intercomunicación y control de acceso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">GPIO Pin</label>
                  <Input
                    type="number"
                    value={doorpiConfig.gpioPin}
                    onChange={(e) => setDoorpiConfig({ ...doorpiConfig, gpioPin: parseInt(e.target.value) })}
                  />
                </div>
                <Button onClick={handleDoorPiInit} className="w-full" disabled={loading.doorpi}>
                  <Settings className="h-4 w-4 mr-2" />
                  {loading.doorpi ? 'Inicializando...' : 'Inicializar DoorPi'}
                </Button>
                <Button onClick={handleDoorTrigger} className="w-full bg-purple-600 hover:bg-purple-700">
                  <DoorOpen className="h-4 w-4 mr-2" />
                  Abrir Puerta
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                {status.doorpi && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge variant="default">{status.doorpi.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPIO Pin:</span>
                      <span>{status.doorpi.config.gpioPin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RFID:</span>
                      <Badge variant={status.doorpi.config.rfidEnabled ? 'default' : 'outline'}>
                        {status.doorpi.config.rfidEnabled ? 'Habilitado' : 'Deshabilitado'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  WhatsApp Cloud API
                </CardTitle>
                <CardDescription>Mensajería avanzada con WhatsApp Business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Número destinatario (con código país)"
                  value={whatsappMsg.to}
                  onChange={(e) => setWhatsappMsg({ ...whatsappMsg, to: e.target.value })}
                />
                <Textarea
                  placeholder="Mensaje interactivo..."
                  value={whatsappMsg.message}
                  onChange={(e) => setWhatsappMsg({ ...whatsappMsg, message: e.target.value })}
                  rows={4}
                />
                <Button onClick={handleWhatsAppInteractive} className="w-full bg-green-600 hover:bg-green-700" disabled={loading.whatsapp}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Mensaje Interactivo
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Mensajes interactivos con botones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Plantillas aprobadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Carga de medios (imágenes, videos, documentos)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Flows conversacionales
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terraform" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-orange-500" />
                  Terraform Twilio
                </CardTitle>
                <CardDescription>Infraestructura como código para Twilio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Twilio Account SID"
                  value={terraformVars.accountSid}
                  onChange={(e) => setTerraformVars({ ...terraformVars, accountSid: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Twilio Auth Token"
                  value={terraformVars.authToken}
                  onChange={(e) => setTerraformVars({ ...terraformVars, authToken: e.target.value })}
                />
                <Input
                  placeholder="Phone Number"
                  value={terraformVars.phoneNumber}
                  onChange={(e) => setTerraformVars({ ...terraformVars, phoneNumber: e.target.value })}
                />
                <Button onClick={handleTerraformPlan} className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading.terraform}>
                  <Server className="h-4 w-4 mr-2" />
                  Crear Plan de Infraestructura
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Plan Output</CardTitle>
              </CardHeader>
              <CardContent>
                {status.terraform && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                    <pre className="text-xs text-green-400 overflow-auto max-h-64">
                      {status.terraform.output}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
