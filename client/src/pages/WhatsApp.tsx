import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Send,
  RefreshCw,
  Phone,
  Users,
  Settings,
  BarChart3,
  Zap,
  LayoutList,
  FileJson,
  History
} from "lucide-react";
import { toast } from "sonner";
import MessageComposer from "@/components/whatsapp/MessageComposer";

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState("composer");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              WhatsApp Cloud API v4.0
            </h1>
            <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full border border-green-500/20 font-mono">
              Stable
            </span>
          </div>
          <p className="text-muted-foreground mt-2">
            Consola unificada para envío de mensajes multimedia, templates y gestión de flujos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Status
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20">
            <Zap className="h-4 w-4 mr-2" />
            Quick Blast
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
          <TabsTrigger value="composer" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Send className="h-4 w-4 mr-2" /> Composer
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-slate-800">
            <LayoutList className="h-4 w-4 mr-2" /> Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-slate-800">
            <History className="h-4 w-4 mr-2" /> History
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-slate-800">
            <Settings className="h-4 w-4 mr-2" /> Config
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-800">
            <FileJson className="h-4 w-4 mr-2" /> API Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MessageComposer />
            </div>
            
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-400">
                  <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                    <p><strong>Interactive Lists:</strong> Use para menús de hasta 10 opciones.</p>
                  </div>
                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                    <p><strong>Templates:</strong> Requeridos para iniciar conversaciones fuera de la ventana de 24h.</p>
                  </div>
                  <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
                    <p><strong>Media Limits:</strong> Imágenes max 5MB, Video max 16MB.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">API Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Webhook Queue</span>
                    <span className="text-green-400 text-sm">Empty</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full">
                    <div className="bg-green-500 h-1 rounded-full w-[5%]"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="bg-slate-900/50 border-slate-800 min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <LayoutList className="h-12 w-12 text-slate-600 mx-auto" />
              <h3 className="text-xl font-semibold">Template Manager v4.0</h3>
              <p className="text-muted-foreground">Gestión avanzada de plantillas con editor visual (Coming Soon)</p>
              <Button variant="secondary">Sincronizar desde Meta</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
