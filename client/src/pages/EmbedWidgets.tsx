import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code, Globe, Zap, Settings, AlertCircle } from "lucide-react";
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

  const smsEmbedCode = `<!-- SMS Widget v1.0 -->
<div id="nexus-sms-widget" data-key="${apiKey}"></div>
<script src="https://${domain}/embed/sms-widget.js"></script>`;

  const voiceEmbedCode = `<!-- Voice Widget v1.0 -->
<div id="nexus-voice-widget" data-key="${apiKey}"></div>
<script src="https://${domain}/embed/voice-widget.js"></script>`;

  const whatsappEmbedCode = `<!-- WhatsApp Widget v1.0 -->
<div id="nexus-whatsapp-widget" data-key="${apiKey}"></div>
<script src="https://${domain}/embed/whatsapp-widget.js"></script>`;

  const voipEmbedCode = `<!-- VoIP Widget v1.0 -->
<div id="nexus-voip-widget" data-key="${apiKey}"></div>
<script src="https://${domain}/embed/voip-widget.js"></script>`;

  const crmEmbedCode = `<!-- CRM Widget v1.0 -->
<div id="nexus-crm-widget" data-key="${apiKey}" data-form="lead-capture"></div>
<script src="https://${domain}/embed/crm-widget.js"></script>`;

  const multiWidgetCode = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Digital Future</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; }
        .widgets-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .widget-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(147,51,234,0.3);
            border-radius: 12px;
            padding: 20px;
        }
        h1 { text-align: center; color: #a78bfa; margin: 40px 0 20px; font-size: 2.5rem; }
        .subtitle { text-align: center; color: #cbd5e1; margin-bottom: 40px; }
    </style>
</head>
<body>
    <h1>Contáctanos - Digital Future</h1>
    <p class="subtitle">Múltiples canales de comunicación disponibles</p>
    
    <div class="widgets-container">
        <div class="widget-card">
            <h3 style="color: #3b82f6; margin-bottom: 15px;">📱 SMS</h3>
            <div id="nexus-sms-widget" data-key="${apiKey}"></div>
        </div>
        
        <div class="widget-card">
            <h3 style="color: #a855f7; margin-bottom: 15px;">🎤 Voice</h3>
            <div id="nexus-voice-widget" data-key="${apiKey}"></div>
        </div>
        
        <div class="widget-card">
            <h3 style="color: #10b981; margin-bottom: 15px;">💬 WhatsApp</h3>
            <div id="nexus-whatsapp-widget" data-key="${apiKey}"></div>
        </div>
        
        <div class="widget-card">
            <h3 style="color: #f59e0b; margin-bottom: 15px;">☎️ VoIP</h3>
            <div id="nexus-voip-widget" data-key="${apiKey}"></div>
        </div>
        
        <div class="widget-card">
            <h3 style="color: #06b6d4; margin-bottom: 15px;">👥 CRM Lead</h3>
            <div id="nexus-crm-widget" data-key="${apiKey}" data-form="lead-capture"></div>
        </div>
    </div>

    <!-- Load all widgets -->
    <script src="https://${domain}/embed/sms-widget.js"></script>
    <script src="https://${domain}/embed/voice-widget.js"></script>
    <script src="https://${domain}/embed/whatsapp-widget.js"></script>
    <script src="https://${domain}/embed/voip-widget.js"></script>
    <script src="https://${domain}/embed/crm-widget.js"></script>
</body>
</html>`;

  const ReactEmbedCode = `import { useEffect } from 'react';

export function EmbedWidgets() {
  useEffect(() => {
    // Load widget scripts
    const scripts = [
      'sms-widget.js',
      'voice-widget.js',
      'whatsapp-widget.js',
      'voip-widget.js',
      'crm-widget.js',
    ];
    
    scripts.forEach(script => {
      const el = document.createElement('script');
      el.src = \`https://${domain}/embed/\${script}\`;
      document.body.appendChild(el);
    });
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4 p-8">
      <div id="nexus-sms-widget" data-key="${apiKey}" />
      <div id="nexus-voice-widget" data-key="${apiKey}" />
      <div id="nexus-whatsapp-widget" data-key="${apiKey}" />
      <div id="nexus-voip-widget" data-key="${apiKey}" />
      <div id="nexus-crm-widget" data-key="${apiKey}" data-form="lead-capture" />
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <Globe className="h-10 w-10 text-emerald-500" />
            Embed Widgets Pro v1.0
          </h1>
          <p className="text-muted-foreground text-lg">Incrustar SMS, Voice, WhatsApp, VoIP y CRM en tu sitio web • Plug & Play • Responsive</p>
        </div>
      </div>

      {/* Configuration */}
      <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-blue-500" />Configuración</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input value={apiKey} onChange={e => setApiKey(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Dominio</Label>
              <Input value={domain} onChange={e => setDomain(e.target.value)} className="font-mono" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widgets Library */}
      <Tabs defaultValue="sms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="voip">VoIP</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
        </TabsList>

        {/* SMS Widget */}
        <TabsContent value="sms" className="space-y-4">
          <Card className="border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📱 SMS Widget
                <Badge className="bg-blue-500/20 text-blue-600">v1.0</Badge>
              </CardTitle>
              <CardDescription>Enviar SMS desde tu sitio web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">{smsEmbedCode}</pre>
                <button onClick={() => copyCode(smsEmbedCode, "sms")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "sms" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded text-sm flex gap-2">
                <Zap className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Compatible con Twilio SMS • Manejo automático de números</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Widget */}
        <TabsContent value="voice" className="space-y-4">
          <Card className="border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🎤 Voice Message Widget
                <Badge className="bg-purple-500/20 text-purple-600">v1.0</Badge>
              </CardTitle>
              <CardDescription>Mensajes de voz automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">{voiceEmbedCode}</pre>
                <button onClick={() => copyCode(voiceEmbedCode, "voice")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "voice" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded text-sm flex gap-2">
                <Zap className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <span>Grabación automática • SIP credentials integrados</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Widget */}
        <TabsContent value="whatsapp" className="space-y-4">
          <Card className="border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                💬 WhatsApp Widget
                <Badge className="bg-green-500/20 text-green-600">v1.0</Badge>
              </CardTitle>
              <CardDescription>Mensajes WhatsApp desde tu web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">{whatsappEmbedCode}</pre>
                <button onClick={() => copyCode(whatsappEmbedCode, "whatsapp")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "whatsapp" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded text-sm flex gap-2">
                <Zap className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Meta WhatsApp API • Envío instantáneo de mensajes</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VoIP Widget */}
        <TabsContent value="voip" className="space-y-4">
          <Card className="border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ☎️ VoIP Widget
                <Badge className="bg-orange-500/20 text-orange-600">v1.0</Badge>
              </CardTitle>
              <CardDescription>Llamadas VoIP con Asterisk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">{voipEmbedCode}</pre>
                <button onClick={() => copyCode(voipEmbedCode, "voip")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "voip" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded text-sm flex gap-2">
                <Zap className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>PI Keys • SIP credentials • Grabación automática</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRM Widget */}
        <TabsContent value="crm" className="space-y-4">
          <Card className="border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                👥 CRM Lead Capture
                <Badge className="bg-cyan-500/20 text-cyan-600">v1.0</Badge>
              </CardTitle>
              <CardDescription>Captura automática de leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">{crmEmbedCode}</pre>
                <button onClick={() => copyCode(crmEmbedCode, "crm")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "crm" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded text-sm flex gap-2">
                <Zap className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span>Formularios personalizables • Sincronización en tiempo real</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Complete Solutions */}
      <Tabs defaultValue="html" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="html">HTML Completo</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="space-y-4">
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🎯 Página Completa HTML
                <Badge className="bg-amber-500/20 text-amber-600">Recommended</Badge>
              </CardTitle>
              <CardDescription>5 widgets en una página lista para usar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12 max-h-96">{multiWidgetCode}</pre>
                <button onClick={() => copyCode(multiWidgetCode, "multi")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "multi" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="react" className="space-y-4">
          <Card className="border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ⚛️ React Component
                <Badge className="bg-blue-500/20 text-blue-600">v1.0</Badge>
              </CardTitle>
              <CardDescription>Integración en aplicaciones React</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12 max-h-96">{ReactEmbedCode}</pre>
                <button onClick={() => copyCode(ReactEmbedCode, "react")} className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded">
                  {copiedCode === "react" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-blue-600" />Instrucciones de Instalación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-3 list-decimal list-inside text-sm">
            <li><span className="font-semibold">Copia tu API Key</span> desde la sección API Key Manager</li>
            <li><span className="font-semibold">Actualiza los valores</span> de apiKey y domain en los códigos anteriores</li>
            <li><span className="font-semibold">Pega el código</span> en tu página HTML o React</li>
            <li><span className="font-semibold">Los widgets cargarán</span> automáticamente al iniciar la página</li>
            <li><span className="font-semibold">Personaliza estilos</span> con CSS según tu marca</li>
          </ol>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded mt-4 flex gap-2">
            <AlertCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-emerald-700">✓ Todos los widgets son responsive, HTTPS, y GDPR compliant</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
