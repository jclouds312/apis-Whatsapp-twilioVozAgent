import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code, Globe, Zap, Settings, AlertCircle, Smartphone, Radio, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmbedWidgets() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("sk_live_your_api_key_here");
  const [domain, setDomain] = useState("your-app.replit.dev");

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("¡Código copiado!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const smsEmbedCode = `<!-- SMS Widget v1.0 -->\n<div id="nexus-sms-widget" data-key="${apiKey}"></div>\n<script src="https://${domain}/embed/sms-widget.js"><\/script>`;
  const voiceEmbedCode = `<!-- Voice Widget v1.0 -->\n<div id="nexus-voice-widget" data-key="${apiKey}"></div>\n<script src="https://${domain}/embed/voice-widget.js"><\/script>`;
  const whatsappEmbedCode = `<!-- WhatsApp Widget v1.0 -->\n<div id="nexus-whatsapp-widget" data-key="${apiKey}"></div>\n<script src="https://${domain}/embed/whatsapp-widget.js"><\/script>`;
  const voipEmbedCode = `<!-- VoIP Widget v1.0 -->\n<div id="nexus-voip-widget" data-key="${apiKey}"></div>\n<script src="https://${domain}/embed/voip-widget.js"><\/script>`;
  const crmEmbedCode = `<!-- CRM Widget v1.0 -->\n<div id="nexus-crm-widget" data-key="${apiKey}" data-form="lead-capture"></div>\n<script src="https://${domain}/embed/crm-widget.js"><\/script>`;

  return (
    <div className="space-y-8">
      {/* Funciones Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="group relative rounded-3xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-950/40 to-slate-950 p-6 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Smartphone className="h-8 w-8 text-blue-400" /><span className="text-xs font-bold text-blue-300">SMS</span></div>
          <h3 className="mt-3 text-lg font-bold text-blue-300">Enviar SMS</h3>
          <p className="text-xs text-slate-400 mt-2">Por Twilio</p>
        </div>
        
        <div className="group relative rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-950/40 to-slate-950 p-6 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Radio className="h-8 w-8 text-purple-400" /><span className="text-xs font-bold text-purple-300">VOICE</span></div>
          <h3 className="mt-3 text-lg font-bold text-purple-300">Mensajes Voz</h3>
          <p className="text-xs text-slate-400 mt-2">Auto-grabación</p>
        </div>

        <div className="group relative rounded-3xl border-2 border-green-500/50 bg-gradient-to-br from-green-950/40 to-slate-950 p-6 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><MessageSquare className="h-8 w-8 text-green-400" /><span className="text-xs font-bold text-green-300">WHATSAPP</span></div>
          <h3 className="mt-3 text-lg font-bold text-green-300">WhatsApp Web</h3>
          <p className="text-xs text-slate-400 mt-2">Meta API</p>
        </div>

        <div className="group relative rounded-3xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-950/40 to-slate-950 p-6 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Phone className="h-8 w-8 text-yellow-400" /><span className="text-xs font-bold text-yellow-300">VoIP</span></div>
          <h3 className="mt-3 text-lg font-bold text-yellow-300">Llamadas VoIP</h3>
          <p className="text-xs text-slate-400 mt-2">Asterisk SIP</p>
        </div>

        <div className="group relative rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-6 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
          <div className="flex items-start justify-between"><Globe className="h-8 w-8 text-cyan-400" /><span className="text-xs font-bold text-cyan-300">CRM</span></div>
          <h3 className="mt-3 text-lg font-bold text-cyan-300">Lead Capture</h3>
          <p className="text-xs text-slate-400 mt-2">Formularios</p>
        </div>
      </div>

      {/* Configuration */}
      <Card className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-blue-500" />Configuración Global</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input value={apiKey} onChange={e => setApiKey(e.target.value)} className="font-mono rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label>Dominio</Label>
              <Input value={domain} onChange={e => setDomain(e.target.value)} className="font-mono rounded-2xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widgets Library */}
      <Tabs defaultValue="sms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 rounded-2xl">
          <TabsTrigger value="sms">📱 SMS</TabsTrigger>
          <TabsTrigger value="voice">🎤 Voice</TabsTrigger>
          <TabsTrigger value="whatsapp">💬 WhatsApp</TabsTrigger>
          <TabsTrigger value="voip">☎️ VoIP</TabsTrigger>
          <TabsTrigger value="crm">👥 CRM</TabsTrigger>
        </TabsList>

        {/* SMS Widget */}
        <TabsContent value="sms" className="space-y-4">
          <Card className="rounded-3xl border-2 border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📱 SMS Widget
                <Badge className="bg-blue-500/30 text-blue-300 rounded-full">v1.0</Badge>
              </CardTitle>
              <CardDescription>Enviar SMS desde tu sitio web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-2xl text-xs overflow-x-auto pr-12 border border-slate-700">{smsEmbedCode}</pre>
                <button onClick={() => copyCode(smsEmbedCode, "sms")} className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-xl">
                  {copiedCode === "sms" ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-blue-500/20 border-2 border-blue-500/50 p-3 rounded-2xl text-sm flex gap-2">
                <Zap className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-blue-300">Compatible con Twilio SMS • Manejo automático de números</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Widget */}
        <TabsContent value="voice" className="space-y-4">
          <Card className="rounded-3xl border-2 border-purple-500/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🎤 Voice Message Widget
                <Badge className="bg-purple-500/30 text-purple-300 rounded-full">v1.0</Badge>
              </CardTitle>
              <CardDescription>Mensajes de voz automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-2xl text-xs overflow-x-auto pr-12 border border-slate-700">{voiceEmbedCode}</pre>
                <button onClick={() => copyCode(voiceEmbedCode, "voice")} className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-xl">
                  {copiedCode === "voice" ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-purple-500/20 border-2 border-purple-500/50 p-3 rounded-2xl text-sm flex gap-2">
                <Zap className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-purple-300">Grabación automática • SIP credentials integrados</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Widget */}
        <TabsContent value="whatsapp" className="space-y-4">
          <Card className="rounded-3xl border-2 border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                💬 WhatsApp Widget
                <Badge className="bg-green-500/30 text-green-300 rounded-full">v1.0</Badge>
              </CardTitle>
              <CardDescription>Mensajes WhatsApp desde tu web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-2xl text-xs overflow-x-auto pr-12 border border-slate-700">{whatsappEmbedCode}</pre>
                <button onClick={() => copyCode(whatsappEmbedCode, "whatsapp")} className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-xl">
                  {copiedCode === "whatsapp" ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-green-500/20 border-2 border-green-500/50 p-3 rounded-2xl text-sm flex gap-2">
                <Zap className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-green-300">Meta WhatsApp API • Envío instantáneo de mensajes</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VoIP Widget */}
        <TabsContent value="voip" className="space-y-4">
          <Card className="rounded-3xl border-2 border-yellow-500/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ☎️ VoIP Widget
                <Badge className="bg-yellow-500/30 text-yellow-300 rounded-full">v1.0</Badge>
              </CardTitle>
              <CardDescription>Llamadas VoIP con Asterisk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-2xl text-xs overflow-x-auto pr-12 border border-slate-700">{voipEmbedCode}</pre>
                <button onClick={() => copyCode(voipEmbedCode, "voip")} className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-xl">
                  {copiedCode === "voip" ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-yellow-500/20 border-2 border-yellow-500/50 p-3 rounded-2xl text-sm flex gap-2">
                <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-yellow-300">PI Keys • SIP credentials • Grabación automática</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRM Widget */}
        <TabsContent value="crm" className="space-y-4">
          <Card className="rounded-3xl border-2 border-cyan-500/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                👥 CRM Lead Capture
                <Badge className="bg-cyan-500/30 text-cyan-300 rounded-full">v1.0</Badge>
              </CardTitle>
              <CardDescription>Captura automática de leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-2xl text-xs overflow-x-auto pr-12 border border-slate-700">{crmEmbedCode}</pre>
                <button onClick={() => copyCode(crmEmbedCode, "crm")} className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-xl">
                  {copiedCode === "crm" ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-cyan-500/20 border-2 border-cyan-500/50 p-3 rounded-2xl text-sm flex gap-2">
                <Zap className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-cyan-300">Formularios personalizables • Sincronización en tiempo real</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="rounded-3xl border-2 border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-blue-600" />Instrucciones de Instalación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-3 list-decimal list-inside text-sm">
            <li><span className="font-bold text-white">Copia tu API Key</span> desde la sección API Key Manager</li>
            <li><span className="font-bold text-white">Actualiza los valores</span> de apiKey y domain en los códigos anteriores</li>
            <li><span className="font-bold text-white">Pega el código</span> en tu página HTML o React</li>
            <li><span className="font-bold text-white">Los widgets cargarán</span> automáticamente al iniciar la página</li>
            <li><span className="font-bold text-white">Personaliza estilos</span> con CSS según tu marca</li>
          </ol>
          <div className="bg-lime-500/20 border-2 border-lime-500/50 p-4 rounded-2xl mt-4 flex gap-2">
            <AlertCircle className="h-4 w-4 text-lime-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-lime-300">✓ Todos los widgets son responsive, HTTPS, y GDPR compliant</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
