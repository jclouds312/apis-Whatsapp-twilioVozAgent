import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code, Globe } from "lucide-react";
import { toast } from "sonner";

export default function EmbedWidgets() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const smsEmbedCode = `<!-- SMS Widget -->
<div id="nexus-sms-widget"></div>
<script src="https://your-app.replit.dev/embed/twilio-sms-widget.js?key=YOUR_API_KEY"></script>`;

  const voiceEmbedCode = `<!-- Voice Widget -->
<div id="nexus-voice-widget"></div>
<script src="https://your-app.replit.dev/embed/voice-widget.js?key=YOUR_API_KEY"></script>`;

  const whatsappEmbedCode = `<!-- WhatsApp Widget -->
<div id="nexus-whatsapp-widget"></div>
<script src="https://your-app.replit.dev/embed/whatsapp-widget.js?key=YOUR_API_KEY"></script>`;

  const multiWidgetCode = `<!DOCTYPE html>
<html>
<head>
    <title>Contact Us</title>
    <style>
        .widgets { display: flex; gap: 20px; flex-wrap: wrap; }
    </style>
</head>
<body>
    <h1>Contáctanos</h1>
    <div class="widgets">
        <div id="nexus-sms-widget"></div>
        <div id="nexus-voice-widget"></div>
        <div id="nexus-whatsapp-widget"></div>
    </div>
    <script src="https://your-app.replit.dev/embed/twilio-sms-widget.js?key=YOUR_API_KEY"></script>
    <script src="https://your-app.replit.dev/embed/voice-widget.js?key=YOUR_API_KEY"></script>
    <script src="https://your-app.replit.dev/embed/whatsapp-widget.js?key=YOUR_API_KEY"></script>
</body>
</html>`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
          <Globe className="h-8 w-8 text-green-600" />
          Embed Widgets
        </h1>
        <p className="text-muted-foreground mt-2">
          Incrustar widgets de SMS, Voice y WhatsApp en tus webs
        </p>
      </div>

      {/* SMS Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📱 SMS Widget
            <Badge className="bg-blue-500/20 text-blue-600">Easy Embed</Badge>
          </CardTitle>
          <CardDescription>Enviar mensajes SMS desde tu sitio web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Agrega este código a tu página HTML:
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">
              <code>{smsEmbedCode}</code>
            </pre>
            <button
              onClick={() => copyCode(smsEmbedCode, "sms")}
              className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded"
            >
              {copiedCode === "sms" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🎤 Voice Message Widget
            <Badge className="bg-purple-500/20 text-purple-600">Auto Record</Badge>
          </CardTitle>
          <CardDescription>Enviar mensajes de voz automáticos desde tu sitio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Agrega este código a tu página HTML:
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">
              <code>{voiceEmbedCode}</code>
            </pre>
            <button
              onClick={() => copyCode(voiceEmbedCode, "voice")}
              className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded"
            >
              {copiedCode === "voice" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            💬 WhatsApp Widget
            <Badge className="bg-green-500/20 text-green-600">Instant Send</Badge>
          </CardTitle>
          <CardDescription>Enviar mensajes de WhatsApp desde tu sitio web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Agrega este código a tu página HTML:
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">
              <code>{whatsappEmbedCode}</code>
            </pre>
            <button
              onClick={() => copyCode(whatsappEmbedCode, "whatsapp")}
              className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded"
            >
              {copiedCode === "whatsapp" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Multi Widget */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🎯 Completo - Todos los Widgets
            <Badge className="bg-amber-500/20 text-amber-600">Recommended</Badge>
          </CardTitle>
          <CardDescription>Página completa con los 3 widgets funcionando</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Aquí está una página completa lista para usar:
          </p>
          <div className="relative">
            <pre className="bg-muted p-4 rounded text-xs overflow-x-auto pr-12">
              <code>{multiWidgetCode}</code>
            </pre>
            <button
              onClick={() => copyCode(multiWidgetCode, "multi")}
              className="absolute top-2 right-2 p-2 hover:bg-muted-foreground/10 rounded"
            >
              {copiedCode === "multi" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            Instrucciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-2 list-decimal list-inside text-sm">
            <li>
              <span className="font-semibold">Genera una API key</span> en la sección "API Key Generator"
            </li>
            <li>
              <span className="font-semibold">Reemplaza</span> <code className="bg-muted px-1 rounded">YOUR_API_KEY</code> con tu clave real
            </li>
            <li>
              <span className="font-semibold">Reemplaza</span> <code className="bg-muted px-1 rounded">your-app.replit.dev</code> con tu dominio
            </li>
            <li>
              <span className="font-semibold">Copia el código</span> a tu página HTML
            </li>
            <li>
              <span className="font-semibold">Los widgets aparecerán</span> automáticamente en tu sitio
            </li>
          </ol>

          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded mt-4">
            <p className="text-sm font-semibold text-green-700">✓ Los widgets son responsive y funcionan en móviles</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
