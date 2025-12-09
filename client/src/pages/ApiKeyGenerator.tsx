import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Code, 
  Copy, 
  Check, 
  Server, 
  MessageSquare, 
  Phone, 
  Globe, 
  Zap, 
  Shield, 
  Rocket,
  Loader2,
  Terminal
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function ApiKeyGenerator() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState("whatsapp");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "My API Service",
    environment: "production",
    permissions: ["read", "write"],
    webhookUrl: "https://api.mysite.com/webhook",
    rateLimit: "1000"
  });

  const handleGenerate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      toast({
        title: "API Generada con éxito",
        description: "Tus credenciales y endpoints han sido creados.",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiado al portapapeles",
    });
  };

  const getCodeSnippet = () => {
    const serviceName = selectedService === 'whatsapp' ? 'WhatsApp' : selectedService === 'twilio' ? 'TwilioVoice' : 'VoIP';
    
    return `// ${serviceName} Integration Client
import { ${serviceName}Client } from '@nexus/sdk';

const client = new ${serviceName}Client({
  apiKey: 'nx_${selectedService}_${Math.random().toString(36).substring(7)}',
  environment: '${formData.environment}',
  webhookUrl: '${formData.webhookUrl}'
});

// Initialize connection
await client.connect();

// Listen for events
client.on('message', (msg) => {
  console.log('Received:', msg);
});`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Generador de APIs
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Configura e implementa servicios de comunicación en segundos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/20">
            <Terminal className="mr-2 h-4 w-4" />
            Documentación
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <Card className="lg:col-span-2 glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Configuración del Servicio
            </CardTitle>
            <CardDescription>
              Define los parámetros para tu nueva instancia de API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div 
                onClick={() => setSelectedService("whatsapp")}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:bg-muted/50 ${selectedService === "whatsapp" ? "border-green-500 bg-green-500/10" : "border-muted"}`}
              >
                <MessageSquare className={`h-8 w-8 mb-3 ${selectedService === "whatsapp" ? "text-green-400" : "text-muted-foreground"}`} />
                <h3 className="font-bold">WhatsApp API</h3>
                <p className="text-xs text-muted-foreground mt-1">Mensajería y bots automatizados.</p>
              </div>
              
              <div 
                onClick={() => setSelectedService("twilio")}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:bg-muted/50 ${selectedService === "twilio" ? "border-red-500 bg-red-500/10" : "border-muted"}`}
              >
                <Phone className={`h-8 w-8 mb-3 ${selectedService === "twilio" ? "text-red-400" : "text-muted-foreground"}`} />
                <h3 className="font-bold">Twilio Voice</h3>
                <p className="text-xs text-muted-foreground mt-1">Llamadas programables y IVR.</p>
              </div>

              <div 
                onClick={() => setSelectedService("voip")}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:bg-muted/50 ${selectedService === "voip" ? "border-blue-500 bg-blue-500/10" : "border-muted"}`}
              >
                <Server className={`h-8 w-8 mb-3 ${selectedService === "voip" ? "text-blue-400" : "text-muted-foreground"}`} />
                <h3 className="font-bold">SIP / VoIP</h3>
                <p className="text-xs text-muted-foreground mt-1">Infraestructura de voz IP privada.</p>
              </div>
            </div>

            <Separator className="bg-primary/10" />

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Servicio</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entorno</Label>
                  <Select 
                    defaultValue="production" 
                    onValueChange={(v) => setFormData({...formData, environment: v})}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook URL (Callback)</Label>
                <Input 
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                  className="font-mono text-xs bg-background/50" 
                />
              </div>

              <div className="space-y-4 pt-2">
                <Label>Permisos y Scopes</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background/30">
                    <Checkbox id="perm-read" defaultChecked />
                    <label htmlFor="perm-read" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Lectura de Mensajes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background/30">
                    <Checkbox id="perm-write" defaultChecked />
                    <label htmlFor="perm-write" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Envío de Respuestas
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background/30">
                    <Checkbox id="perm-media" />
                    <label htmlFor="perm-media" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Gestión Multimedia
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background/30">
                    <Checkbox id="perm-analytics" defaultChecked />
                    <label htmlFor="perm-analytics" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Acceso a Analytics
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t border-primary/10 pt-6">
            <Button variant="ghost">Cancelar</Button>
            <Button 
              onClick={handleGenerate} 
              disabled={loading || generated}
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 min-w-[150px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : generated ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Completado
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Generar API
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Output Panel */}
        <div className="space-y-6">
          <Card className={`glass-card border-primary/20 h-full transition-all duration-500 ${generated ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4 grayscale'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-400" />
                Snippet de Integración
              </CardTitle>
              <CardDescription>
                Usa este código para conectar tu aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generated ? (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-black/50 p-4 font-mono text-xs text-green-400 break-all">
                    <p className="text-muted-foreground mb-1">// API Key (Keep Secret)</p>
                    nx_live_{Math.random().toString(36).substring(2, 15)}_{Math.random().toString(36).substring(2, 15)}
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden border border-white/10">
                    <div className="flex justify-between items-center bg-white/5 px-4 py-2 border-b border-white/10">
                      <span className="text-xs text-muted-foreground">client.ts</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(getCodeSnippet())}>
                        {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <SyntaxHighlighter 
                      language="typescript" 
                      style={atomOneDark}
                      customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', background: 'transparent' }}
                    >
                      {getCodeSnippet()}
                    </SyntaxHighlighter>
                  </div>

                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 flex gap-3">
                    <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-emerald-400">Servicio Activo</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Tu endpoint está listo para recibir peticiones en el entorno de <strong>{formData.environment}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-muted-foreground">
                  <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Server className="h-8 w-8 opacity-50" />
                  </div>
                  <p>Configura y genera tu servicio para ver las credenciales aquí.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
